# Interview answers (Task 4)

Two hundred words maximum each.

## 1. Why should you hash passwords?

Because the database will eventually be read by someone who shouldn't read it: a leaked backup, a stolen laptop, an SQL injection, a careless employee, a hosted database with a password that ends up in a screenshot. Mine did, twice, in this project.

If passwords are stored as they are, that one leak hands over every customer's password. Most people reuse passwords, so the damage spreads to their email, bank and WhatsApp. In the brief's scenario, three students lost bank access because of a driving school's database.

Hashing stores a one-way fingerprint instead. At login the server hashes what the user typed and compares fingerprints, so it never needs the real password back. A thief gets fingerprints and has to guess passwords one by one to find matches. The hash must be slow, salted and memory-hard (Argon2id or bcrypt), so each guess is expensive.

It also protects the customer from *me*: nobody at FreshFold can see a customer's password, which is the right promise to make.

## 2. Why bcrypt (or Argon2id) instead of SHA-256 for passwords?

SHA-256 was designed to be **fast**: it hashes files and network traffic, where speed is the point. For passwords, speed is the attacker's friend.

My own laptop numbers:
- **SHA-256:** 1.871 µs per hash, **534,474 guesses per second** on one core;
- **Argon2id:** 21.57 ms per hash, **46 per second**.

That's 11,530 times more guesses for the attacker with SHA-256, and graphics cards widen the gap to billions per second.

Password hashes like bcrypt and Argon2id are **deliberately slow** and **tunable**: you raise the cost as hardware gets faster. Argon2id is also **memory-hard**: each guess needs 19 MiB here, which limits parallel guessing on GPUs. bcrypt isn't memory-hard, but its cost factor still makes it thousands of times slower than SHA-256.

Both also **build the salt in**, so you can't forget it. With SHA-256 you'd have to add salting yourself, and you'd still be fast.

I chose Argon2id: it won the Password Hashing Competition, it is OWASP's first recommendation, and its memory cost is what really hurts GPU attackers.

## 3. What is a salt and why do you need it?

A salt is a random value, different for every password, mixed into the hash and stored next to it. Mine is 16 random bytes that Argon2id generates and keeps inside the hash string: `$argon2id$v=19$m=19456,t=2,p=1$<salt>$<hash>`.

You need it for three reasons:
1. **Same password, different hashes.** I hashed `correct-horse-battery` twice and got two different outputs. Without salts, every customer using `password1234` would have an identical hash; crack one and you've cracked them all, and the attacker can see who shares a password.
2. **No precomputed tables.** Rainbow tables map common passwords to their unsalted hashes in advance. A per-user salt makes every table useless; the attacker must start from scratch for each account.
3. **No batch guessing.** Without salts, one hash per guess can be compared against every row. With salts, every guess must be recomputed for every user.

A salt is not secret. It sits in the database next to the hash. Its job is to be unique, not hidden.

## 4. What work factor should you use? Give a number and defend it.

For Argon2id I use **m = 19 MiB, t = 2, p = 1**: the library's default, which is also the OWASP minimum recommendation.

On my laptop that costs **21.57 ms per hash**. I defend it in both directions:
- **For me:** a customer waits 21.57 ms at login, invisible next to the ~900 ms of network a signup already spends. Even with 100 logins in a minute, the server spends about 2 seconds hashing.
- **For the attacker:** 46 guesses per second per core, and 19 MiB of memory per guess, which caps how many a GPU can run in parallel. A 10-million-word list takes about 60 hours per account instead of 19 seconds with SHA-256.

The real rule is to **tune on the production hardware**, so one hash takes roughly 50–250 ms where it actually runs. My laptop is faster than a small cloud instance, so I'd measure again after deploying, and raise memory or passes if it allows. I'd re-check yearly, because the right number goes up as hardware improves.

The equivalent for bcrypt is a cost of 12 or more: never 10, the old default.

## 5. Plain text, SHA-256, AES-256 or adaptive hashing: which is correct?

**Adaptive hashing (Argon2id, bcrypt, scrypt) is correct:** one-way, salted, deliberately slow and tunable.

- **Plain text** is wrong because one leak reveals every password, immediately, to anyone, and reused passwords spread the damage.
- **SHA-256** is wrong because it is **too fast**. It's one-way, but guessing is cheap: 534,474 guesses per second on my laptop, billions on a GPU. Unsalted, it's also open to precomputed tables.
- **AES-256 encryption** is wrong **for a different reason: it's reversible.** Encryption is designed to be decrypted. Whoever has the key can recover every password, and the key has to live somewhere the app can read it, usually right next to the database: an environment variable, a config file, the same server. One breach that captures both gives every password in plain text. The flaw isn't speed; it's that the server should never be *able* to know the password at all.

So plain text and SHA-256 fail on how easily a thief can get passwords from the data. AES fails on design: it keeps a way back that should not exist.

## 6. Why is client-side validation not enough?

Because the browser belongs to the user. Anyone can skip my form and send whatever they like straight to the server.

I proved it on FreshFold. My signup form blocks a one-letter name, an email without `@`, a 3-digit phone, a password of spaces and unticked terms. In Task 3, one curl request with exactly those values got **`201 Created`**: the server saved it all.

In Task 4 I repeated every rule on the server with a zod schema, and sent the **same request**. It got **`400 Bad Request`**, with all five fields refused.

Client-side validation is still worth having: it gives instant feedback, kinder messages and fewer wasted requests. But it is a convenience for honest users, not protection. The server is the source of truth, because it is the only place the attacker can't edit.

## 7. What belongs in the frontend, and what must the server enforce regardless?

**The frontend** handles user experience:
- inline errors as people type;
- format hints;
- disabling the button until the form looks complete;
- not leaking hints (no password rules on login);
- accessible error messages.

None of it is security.

**The server enforces everything that protects the business or other users, regardless of what the browser did:**
- the same validation rules, from a schema (mine: zod in `lib/validation.ts`);
- trimming and normalising (lowercase email, trimmed password);
- authentication and authorisation on every request;
- rate limiting (mine: signup, login, reset, verify);
- password hashing (Argon2id) and the breach check;
- uniqueness (one account per email);
- ownership of records;
- prices and amounts calculated on the server, never taken from the request.

The test I use: if a curl request could skip it and cause harm, it belongs on the server. If skipping it only makes the form less friendly, it can live in the browser too.

## 8. The UI hides the delete button for non-administrators. Is that enough? If not, what does an attacker do instead?

No. Hiding the button removes the easy way to make the request; the request itself still works.

**What the attacker does instead:**
1. Open the network tab, or read the page's JavaScript, to find the delete endpoint (for example `DELETE /api/orders/123`).
2. Copy the request, or write it with curl, as I did with `/api/signup`.
3. Send it with their own session cookie, changing the ID to any record they like.

If the server only checks "is someone logged in?" and not "is this person an admin, and may they delete *this* record?", the delete goes through. Changing `123` to `124` to reach other people's data is called an insecure direct object reference.

**The fix is on the server:**
- every delete request checks the session;
- the role (admin?);
- and ownership;
- then refuses with 403 and logs the attempt.

Hiding the button stays, as good design. It just isn't the control.

## 9. Validation, encoding and sanitisation

- **Validation** decides whether input is acceptable and rejects it if not. It doesn't change the data. Mine: zod refuses a phone that isn't a Nigerian mobile shape, with `400`.
- **Encoding** makes data safe for the place it is *output*, by changing its representation, not its meaning:
  - HTML-escaping a customer's name before putting it in a page (React does this by default);
  - URL-encoding a query value;
  - parameterised SQL (Prisma does this), so a name like `O'Brien'; DROP TABLE…` stays data.
  
  It depends on the destination, so it happens on the way out.
- **Sanitisation** changes the input itself, removing or rewriting dangerous parts: for example, stripping script tags from rich text a user is allowed to format. It's the riskiest of the three, because it's easy to get wrong and it alters what the user sent.

In practice: **validate on the way in** (on the server), **encode on the way out** for each context, and **sanitise only** when you must accept something like HTML. My trimming and lowercasing is normalisation, a mild form of changing input, done inside the validation schema so it happens exactly once.

## 10. Why replace the request body with the parsed, validated data?

Because the raw body and the validated data are not the same thing, and code that has both will eventually use the wrong one.

My zod schema doesn't just say "valid". It **returns a cleaned object**:
- the email trimmed and lowercased;
- the password trimmed;
- the phone with spaces stripped;
- unknown fields removed. With `.strict()`, a request with an extra field is refused outright.

If the route then reaches back into the raw body, it gets the un-normalised email (`Kemi.Ade@Example.com`, a duplicate account), the password with its trailing space (a different hash, so the login fails), or a smuggled extra field like `"emailVerifiedAt": "2026-01-01"` or `"role": "admin"`, which a careless `prisma.user.create({ data: body })` would happily write.

Replacing the body with the parsed data means there is only one version in scope: the one that passed every rule. In my signup route, everything after `safeParse` uses `parsed.data` only. It's also what makes TypeScript's types true: `z.infer` describes exactly that object.

## 11. Why validate route parameters and query strings, not just the body?

Because they are input from the client too, and just as easy to change: they're in the address bar.

Examples from FreshFold:
- `/account?form=signup` chooses a form. My page accepts only `signup`, `login`, `reset` or `verify` and treats anything else as `login`, which is validation by allow-list.
- A future `/api/orders/[id]` must check the ID's format **and** that the order belongs to the logged-in customer. Otherwise changing the number shows someone else's address and laundry list.
- Query strings feed search, filters, sorting and redirects (`?next=`), which are classic routes to injection, to expensive queries (`?limit=1000000`), and to open redirects that send users to a phishing page.

Headers are input too, which my own rate limiter taught me: it trusted `X-Forwarded-For`, and a forged value walked straight past a 429.

The rule: every part of the request (path, query, headers, cookies and body) is attacker-controlled until the server has validated it.

## 12. How do you rate limit unauthenticated requests, and what's wrong with the header you'd reach for first?

With no logged-in user, you key on what you can observe: the **client IP address**, plus whatever the request is *about*, such as the email being logged into. Mine: `signup:<ip>`, `login:<ip>` and `login-email:<email>`.

The header you reach for first is **`X-Forwarded-For`**, because behind a proxy the real client IP lives there. The problem: it's an ordinary request header, **written by the client**. Unless your own trusted proxy sets or overwrites it, and you read only the entry that proxy added, an attacker simply invents a new value on every request.

I proved this on my own app. After `localhost` reached the limit and got **429**, the very next request with `-H "X-Forwarded-For: 203.0.113.7"` got **201**.

**The fix:**
- read the client address only from the hop your infrastructure controls (for example the platform's own header, or the right-most trusted entry);
- ignore the header entirely when not behind a known proxy;
- don't rely on IP alone. Add per-account keys, and device or behaviour signals.

## 13. Which rate limiting algorithm for production, and what is the boundary burst problem?

I built a **fixed window**: a counter per key that resets every 15 minutes. It's simple and cheap, but it has the **boundary burst problem**. With 5 per 15 minutes, a client can send 5 at 14:59 (end of one window) and 5 more at 15:00 (start of the next): 10 requests in about a minute, double the intended rate. I saw the window effect myself when a test passed simply because my window had just reset.

**For production** I'd choose a **sliding window** (a sliding-window counter that weights the previous window, or a sliding log), or a **token bucket**:
- **Sliding window** removes the boundary burst, because the limit always applies to "the last 15 minutes" from now.
- **Token bucket** allows a small, controlled burst (a real user retrying quickly) while enforcing a steady average rate. It's cheap to store (tokens plus a timestamp) and widely supported by API gateways and Redis libraries.

For login and signup, a sliding window per account plus a token bucket per IP is a good combination. Whatever the algorithm, the increment must be **atomic** in a shared store. My read-then-update in PostgreSQL isn't, which the agent flagged.

## 14. Why a shared store for counters rather than in-memory counters?

Because production rarely runs one server process, and in-memory counters live inside a single process.

With in-memory counters:
- **Each instance counts separately.** Behind a load balancer with 4 instances, a "5 per 15 minutes" limit becomes up to 20, depending on which instance each request reaches.
- **Restarts and deploys reset everything.** Every deploy, crash or serverless cold start gives attackers a fresh allowance. On Vercel, functions are short-lived, so memory barely persists between requests at all.
- **No coordination** across regions.

A shared store gives every instance the same count. Mine is PostgreSQL, the `RateLimit` table on Neon, and the counts survived my dev-server restarts.

But I measured the costs:
- ~280 ms of every signup is the limiter's round trips to London;
- the read-then-write isn't atomic;
- when Neon was asleep the limiter crashed the request with 500.

That's why the usual choice is a **fast** shared store built for counters, such as Redis or Upstash, with atomic increment-and-expire in one operation.

## 15. What status code should a rate limiter return, and why is 403 wrong?

**429 Too Many Requests**, with a **`Retry-After`** header saying when to try again. Mine returns `429` and "Too many attempts. Try again in 11 minutes."

**403 Forbidden** is wrong because it means something different: "you are not allowed to do this, and asking again won't help." It's about **permission**, not **rate**.

That difference matters to software and people:
- Clients, SDKs and browsers treat 429 as **temporary** and back off and retry; 403 tells them to give up, or makes them show "access denied".
- Monitoring can't tell a throttled user from an authorisation failure if both are 403, which hides attacks and bugs.
- A real customer on a shared campus connection who sees "Forbidden" thinks they're banned. "Too many attempts, try in 11 minutes" tells them exactly what happened and what to do.

**401** is also wrong, since nothing is wrong with authentication.

## 16. Rate limit store unavailable: fail open or fail closed? For your application.

My app currently **fails closed by accident**. When Neon was asleep, `prisma.rateLimit.findUnique` threw and **signup returned 500**. Nobody could sign up, and there was no deliberate decision behind it.

**My decision, per route:**
- **Signup: fail open.** Allow the request and log loudly. Signup has other defences: validation, breach check, Argon2id, email verification before the account is active. Refusing every new customer because a counter is unavailable costs FreshFold real business.
- **Login: fail open for the per-IP limit, but fail closed for the per-account limit** if the store holding it is down. Guessing one customer's password is the attack the per-account limit exists for, and Argon2id slows it but doesn't stop it. Blocking logins briefly is the safer harm.
- **Reset and verify: fail closed.** These send emails or check codes. Unlimited requests mean spam, or brute-forcing 6-digit codes.

In practice I'd wrap the limiter in try/catch, apply that per-route policy, and alert on store failures, so it's a choice rather than a crash. At FreshFold's size, a brief outage is more likely than an attack.

## 17. Your two hashing timing numbers: what they mean for an attacker with your user table

On my laptop:
- **Argon2id:** 21.57 ms per hash, **46 guesses per second** per core;
- **SHA-256:** 1.871 µs per hash, **534,474 per second**.

The ratio is **11,530×**.

Suppose they steal my User table and run a 10-million-password list against one customer:
- **SHA-256:** 10,000,000 / 534,474 is **about 19 seconds**;
- **Argon2id:** 10,000,000 / 46.36 is **about 60 hours**.

For all 16 accounts in my test table, that's under 6 minutes against about 40 days.

**And my numbers flatter SHA-256.** An attacker uses graphics cards that compute **billions** of SHA-256 hashes per second, because each needs almost no memory. Argon2id needs **19 MiB per guess**, which limits how many a GPU can run at once, so the real gap is far bigger than 11,530.

Two things the numbers don't change:
- A customer whose password is `password1234` falls quickly either way. That's why the breach check and the 12-character minimum matter.
- The salt forces the attacker to pay that cost **separately for every account**.

Meanwhile each FreshFold customer pays 21.57 ms once per login, which nobody can notice.

## 18. How does a breached password check avoid sending the password? What does the naive version leak?

**The mechanism (k-anonymity), as I built it:**
1. My server computes the **SHA-1** of the password: 40 hex characters.
2. It sends **only the first 5** to `api.pwnedpasswords.com/range/XXXXX`.
3. The service returns **every** leaked hash starting with those 5 characters (hundreds of them) with breach counts, padded with fake entries so the reply size reveals nothing.
4. My server compares the **remaining 35 characters locally**. A match means it's breached, and I refuse it. `password1234` was refused at signup.

The service sees a prefix shared by hundreds of thousands of passwords, never the password or even its full hash. It can't tell which entry I wanted, or whether any matched.

**The naive version** sends the password, or its full hash, and asks "is this breached?":
- **The password itself:** every new customer's real password goes to a third party over the network, landing in their logs and anything in between.
- **The full hash:** no better. An unsalted SHA-1 of a password can be reversed in seconds with precomputed tables.

Either way the safety check itself becomes the leak, and FreshFold would be sending passwords somewhere its customers never agreed to.

## 19. Wrong-answer analysis: "SHA-256 plus a random salt… rate limit login by IP, so brute force is not possible."

In order of severity:

1. **"SHA-256 plus a salt" is the wrong tool.** The salt is good (no shared hashes, no rainbow tables), but SHA-256 is **fast**: 534,474 guesses per second on my laptop, billions on a GPU. Salting makes the attacker crack each account separately; it doesn't make each crack slow. Common passwords still fall in seconds. It needs Argon2id or bcrypt.
2. **"Cannot be reversed, because hashing is one-way" confuses reversing with guessing.** Nobody reverses a hash. They **guess** passwords, hash them, and compare. One-way gives no protection against guessing; only slowness and long, unbreached passwords do. This is the biggest misunderstanding.
3. **The IP rate limit protects the wrong place.** Once the database is stolen, the attacker guesses **offline** on their own machines, and the login endpoint and its limit are never touched.
4. **And even online, IP limits are bypassable:** botnets, or a forged `X-Forwarded-For`, which got me past my own 429.

**The threat model they've missed:** the realistic attack is a stolen table cracked offline, plus reused leaked passwords. The answer is slow hashing, breach checks and per-account limits, not one-way hashing plus IP limits.
