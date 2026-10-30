# Validation placement

## Library: zod

I chose zod because:
- it is the most common TypeScript schema library;
- it gives TypeScript types from the same schema (no second definition to drift);
- `.safeParse` returns field-by-field errors instead of throwing;
- it has no dependencies.

The alternatives: yup is older and slower with weaker types; joi is not built for TypeScript; valibot is smaller but less familiar. Zod was installed with my approval, as AGENTS.md requires.

Schemas live in `lib/validation.ts`: `signupSchema`, `loginSchema`, `resetSchema`, plus the verify route's own schema. Each is `.strict()`, so unknown fields are rejected rather than ignored.

## Where it sits in the request lifecycle

For `POST /api/signup`, in order:

1. **Read and parse the JSON body** inside try/catch. Invalid JSON gets `400 {"error":"Invalid JSON"}`. (In Task 3 the same mistake crashed with 500.)
2. **Rate limit** by client address (`signup:<ip>`, 5 per 15 minutes) → `429` with `Retry-After`.
3. **Schema validation** (`signupSchema.safeParse`) → `400 {errors: {field: [...]}}`. From here on, the route uses **only the parsed data**, never the raw body.
4. **Breach check** on the validated password (HIBP range query).
5. **Business checks:** is the email already registered? (`409`)
6. **Hash** the password (Argon2id).
7. **Database write**, then respond `201`. The verification email goes out after the response.

## What runs before validation, and what must never run before it

**Before it:**
- only things that do not trust the content: parsing the bytes as JSON, and the rate limiter, which reads the IP and nothing from the body.
- Rate limiting goes first deliberately: rejecting a flood costs one counter update instead of a full validation, breach call and hash per request.

**Must never run before it:**
- anything that **uses** a field's value:
  - a database query (an unvalidated email in a lookup);
  - hashing (an unbounded password could be megabytes, and Argon2 would grind on it);
  - the breach check (a network call with attacker-chosen input);
  - sending email to an unvalidated address;
  - logging the raw body (it may contain a password).
- Also, nothing **business-meaningful**, like "this email already exists". Answering that before validation tells an attacker things about the system even for malformed requests.

## Why a schema beats hand-written checks in the route

Hand-written `if (!body.name || body.name.length < 2) …` looks simpler for one field, but:
- **It's easy to forget a field, or a path.** Nothing forces every field to be checked; a new field added later is accepted silently. A strict schema rejects anything not declared.
- **It doesn't clean the data.** Hand checks test the raw body and then the code uses the raw body too, so the trimmed, lowercased version you checked may not be the version you save. A schema *returns* the cleaned object, and the route uses only that (interview question 10).
- **It drifts.** Login, signup and reset each repeat the email rule slightly differently. One schema module is the single definition, reusable on the client too.
- **The types lie.** `req.json()` gives `any`, and TypeScript can't help. `z.infer` gives a real type.
- **The errors are inconsistent.** Each `if` invents its own error shape; the schema returns the same structure for every field.

## The measurement

Same signup request, five times each (evidence 11):

| | Warm time per signup |
| --- | --- |
| **Before** (no validation; route echoed the body) | **12.9 ms** (19, 12, 10, 10 ms) |
| **After** (rate limit + zod + breach + Argon2id + DB) | **~1.1 s** (1435, 939, 908 ms) |

That's about **85 times slower**, which is high. But the route's own stage log shows it is **not the validation**:

```
[signup] parse 1ms validate 0ms breach 206ms hash 87ms db 302ms total 879ms
```

- **validate: 0–8 ms.** Zod is not the cost.
- **breach: ~200–300 ms warm** (over 1 s cold): a round trip from Lagos to the Have I Been Pwned API.
- **db: ~300 ms:** checking the email and inserting the user, two round trips to Neon in London.
- **The rest of the total (~280 ms)** is the rate limiter: more round trips to London to read and update its counter.
- **hash: ~80 ms** in the dev server; 21.57 ms in the standalone script, because the dev server shares the CPU with compilation.

So my delay is **three trips out of the country per signup**, not checking the request's shape. What I would try, in order:
1. move the database to a region nearer Lagos;
2. keep rate-limit counters in a fast in-memory store rather than PostgreSQL;
3. run the breach check in parallel with the email lookup.

I have not made these changes.
