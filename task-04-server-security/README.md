# Task 4: The server is the source of truth

**FreshFold Laundry.** In Task 3 one curl request with a one-letter name, a fake email and terms not accepted got `201 Created`. This task made the server enforce everything, hashed passwords properly, limited abuse, and verified emails.

## What I built

- **Schema:** User, Session, VerificationCode, Payment, a separate **PaymentAttempt** table, KnowledgeChunk and RateLimit, drawn on paper first (`docs/schema.md`, evidence 01).
- **Migrations by hand:**
  - the initial migration;
  - a required column refused on a table with 5 rows, then done in three steps;
  - a deliberate drift error (P2022) and its fix.
  
  The agent was never allowed to migrate (`docs/migrations.md`, evidence 03–06).
- **Argon2id hashing,** timed on my laptop: **21.57 ms** per hash against SHA-256's **1.871 µs**, so an attacker gets about 11,530× fewer guesses (`docs/hashing.md`, evidence 07–08).
- **Normalisation:** email trimmed and lowercased everywhere; password trimmed but never lowercased (evidence 09–10).
- **zod at the boundary** for signup, login, reset and verify. The Task 3 request now gets **400** with all five fields refused (evidence 12). Zod costs 0–8 ms; the ~1 s signup is network to London and to HIBP (`docs/validation-placement.md`, evidence 11).
- **Rate limits** on signup, login, reset and verify. Triggered (429), then **defeated twice**: via my Wi-Fi IP, and via a forged `X-Forwarded-For` (`docs/rate-limiting.md`, evidence 13–14).
- **Breached password check** with the HIBP range API (k-anonymity). `password1234` was refused (`docs/breach-check.md`, evidence 15).
- **Email verification:**
  - a crypto-random 6-digit code, hashed, with a 10-minute expiry;
  - sent through Gmail SMTP after the response;
  - two SMTP failures captured, then success;
  - sync 16.6 s vs background 5.9 s;
  - wrong, expired and reused codes tested (`docs/verification-design.md`, evidence 16–22).
- **An email in the brand blue,** read from the tokens at runtime because email can't use CSS variables (`docs/email-copy.md`, evidence 23).

## What I decided

- Argon2id at the library defaults (19 MiB, t=2), the OWASP minimum, to be re-tuned on production hardware.
- Rate limits of 5/15 min for signup, 10 per IP plus 5 per email for login, and 3 for reset, each justified in `docs/rate-limiting.md`.
- A 10-minute code expiry, because Lagos customers on phones need it; attempts, not time, cap guessing.
- The breach check fails open; the limiter *should* fail open for signup and closed for reset and verify.
- Six controls deliberately not built (`docs/not-implemented.md`).

## What I got wrong

- **The reused-code defect.** A used code still returned 200. It was predicted by the brief and admitted by the agent, but my rules never asked for the check. Documented, not fixed.
- **My rate limiter:**
  - it trusts a client-written header;
  - it isn't atomic;
  - it **crashes signup with 500** when the database is asleep.
- **`.env` mistakes.** I lost a Notepad save of `.env` without noticing, and the app silently sent no email while telling the customer "201".
- **Badly timed test.** My first rate-limit "defeat" check passed only because the window had just expired.
- **Secrets in screenshots.** The database password appeared in screenshots twice. It was never committed, but it should be rotated (`docs/defects.md`).

## Files

- **docs/:**
  - schema, migrations, hashing, validation-placement, rate-limiting, breach-check, verification-design, email-copy, not-implemented, defects, interview-answers;
  - the agent prompts.
- **evidence/:** 01–23 as named in the brief, plus extras named by what they show.
