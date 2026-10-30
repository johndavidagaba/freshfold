# Defects (Task 4)

1. **A used verification code keeps working.**
   - Where: `lib/verification.ts` sets `usedAt` but never checks it.
   - Effect: the same code returned 200 twice (evidence 22, row in 19).

2. **The rate limiter crashes signups when the database is unreachable.**
   - Where: `lib/rateLimit.ts:24` (`prisma.rateLimit.findUnique`) throws when Neon is asleep.
   - Effect: signup returns 500. The limiter fails closed by accident, not by decision (evidence 18).

3. **The rate limiter trusts `X-Forwarded-For`.**
   - Where: `lib/rateLimit.ts` takes the client address from a header the client controls.
   - Effect: a forged header got 201 one request after the address was blocked (evidence 14).

4. **The rate limiter is not atomic.** It reads, then updates, without a transaction or lock, so simultaneous requests can exceed the limit. The agent flagged this itself.

5. **Signup creates the user before the email is sent.**
   - In sync mode, a failed send returned 500 after the user and code already existed.
   - In background mode, the customer gets 201 even when no email is ever sent (evidence 16, failure 1).
   - Either way, a retry hits 409, and there is no "resend code".

6. **"An account with that email already exists" (409) enables enumeration.**
   - Where: `app/api/signup/route.ts`.
   - Effect: anyone can test whether an email is a FreshFold customer, undoing the care taken on login and reset in Task 3.

7. **No success screen after signup in the browser.** Clicking Create account once creates the account and shows nothing, so I clicked again and got the 409 (evidence 09).

8. **Validation messages are zod's defaults on the API,** e.g. "Too small: expected string to have >=2 characters" (evidence 12), not FreshFold's wording.

9. **Signup is slow.**
   - Warm signup: ~0.9–1.4 s, against 12.9 ms before, almost all network to London and to HIBP (evidence 11).
   - Cold, after a restart: over 5 s.

10. **Opening `?form=verify` directly has no email,** so the form says "your email" and the server rejects it. The email lives only in client state.

11. **`npm audit` reports 6 vulnerabilities (5 high, 1 critical).** I did not run `npm audit fix --force`, because it forces major upgrades (the same kind of jump that broke Prisma in Task 2). They are not reviewed yet.

12. **Breach check fails open.** When HIBP is unreachable, breached passwords are accepted. This is a deliberate trade-off, recorded so it isn't forgotten.

13. **Secrets were exposed in screenshots.** The database URL with its password appeared in two screenshots in this project. It was never committed (history checked), but it has not been rotated.

14. **The KnowledgeChunk embedding is a plain float array.** There is no pgvector and no vector index, so similarity search would be a full scan.
