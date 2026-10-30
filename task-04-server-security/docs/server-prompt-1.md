# Server prompt 1 (Task 4, steps 4-9)

```
Read AGENTS.md and task-03-client-validation/docs/validation-rules.md first. The packages zod, @node-rs/argon2 and nodemailer are installed and approved. Do NOT add any other package. Do NOT run any prisma migrate or db command. Do NOT run npm run build.

Create these files (lib/ already exists):

1. lib/validation.ts: zod schemas that repeat EVERY Task 3 rule on the server:
   - signupSchema: name (trim, 2-60 chars, at least 2 letters, only letters incl. accented, spaces, hyphen, apostrophe, full stop, no digits); email (trim, lowercase, max 254, something@domain.tld, no spaces); phone (strip spaces and dashes; 11 digits starting 070/080/081/090/091, or +234 + 10 digits not starting 0); password (trim leading/trailing whitespace ONLY, never lowercase; 12-128 chars; not empty after trimming); terms must be literally true.
   - loginSchema: email (trim, lowercase, format), password (trim, non-empty).
   - resetSchema: email (trim, lowercase, format).
   Use z.object(...).strict() so unknown fields are rejected.

2. lib/password.ts: hashPassword and verifyPassword using Argon2id from @node-rs/argon2 with its defaults (it generates a random salt itself).

3. lib/rateLimit.ts: fixed-window limiter stored in the RateLimit table via Prisma (key, count, windowStart). Function limit(key, max, windowMs) returns { allowed, retryAfterSeconds }. Client IP: first value of the x-forwarded-for header, else "unknown".

4. lib/breach.ts: Have I Been Pwned range check (k-anonymity). SHA-1 the password with node:crypto, uppercase hex, send only the first 5 characters to https://api.pwnedpasswords.com/range/{prefix} with header "Add-Padding: true", compare the remaining 35 characters locally, return the breach count. If the API fails, return null (fail open) and console.warn.

5. app/api/signup/route.ts (replace the current echo route):
   - parse JSON in try/catch: invalid JSON -> 400 {error:"Invalid JSON"}
   - rate limit "signup:"+ip, 5 per 15 minutes -> 429 with Retry-After header and {error:"Too many attempts. Try again in N minutes."}
   - signupSchema.safeParse -> 400 {errors: fieldErrors}; afterwards use ONLY the parsed data, never the raw body
   - breach check: if found -> 400 {errors:{password:["This password has appeared in a data breach. Choose a different one."]}}
   - email already registered -> 409 {error:"An account with that email already exists."} (I will discuss enumeration in my docs)
   - create the User with passwordHash and termsAcceptedAt = now, return 201 {id, email}. Never return the password or hash.
   - console.log timing for each stage: "[signup] parse Xms validate Xms breach Xms hash Xms db Xms total Xms"

6. app/api/login/route.ts: rate limit "login:"+ip, 10 per 15 minutes AND "login-email:"+email, 5 per 15 minutes -> 429. loginSchema. Look up user by lowercased email; ALWAYS run verifyPassword (against a fixed dummy Argon2 hash if the user does not exist) so timing is similar. Wrong email or password -> 401 {error:"Email or password is incorrect."}. Success -> 200 {ok:true, verified: boolean}. No sessions yet (Task 5).

7. app/api/reset/route.ts: rate limit "reset:"+ip, 3 per 15 minutes. resetSchema. Always 200 {message:"If an account uses that email, we've sent a reset link."}. Do not send email yet.

8. app/account/page.tsx: make signup, login and reset POST to these routes, trim and lowercase email and trim password before sending, and show the server's error messages under the right fields (including 429 and 409 and breach messages). Keep all existing client validation and accessibility.

9. scripts/hash-timing.mjs (plain Node, run with: node scripts/hash-timing.mjs): 
   - hash "correct-horse-battery" twice with Argon2id and print both hashes
   - time 10 Argon2id hashes, print the average ms per hash
   - time 100000 SHA-256 hashes of the same password with node:crypto, print the average microseconds per hash
   - print guesses per second for each = 1000 / avg_ms, and the ratio

List every file created or changed and every assumption.
```
