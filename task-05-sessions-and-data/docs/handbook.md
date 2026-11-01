# FreshFold operations handbook

For whoever runs FreshFold after me, or for me at 2 a.m. when something breaks.

## 1. What FreshFold is

A laundry pickup app for Yaba, Lagos. Customers sign up, and a rider collects the laundry, washes and folds it, and brings it back. The tech:
- Next.js 15 on Node;
- Prisma 6.19.3 talking to Neon Postgres in London;
- Gmail SMTP for email;
- Have I Been Pwned for leaked-password checks.

Code: github.com/johndavidagaba/freshfold.

## 2. Running it

- **Setup:**
  - copy `.env.example` to `.env` and fill in the values;
  - `npm.cmd install`;
  - `npm.cmd run dev`.
- **Windows:** use `npm.cmd` and `npx.cmd`.
- **Never** run `npm run build` while the dev server is running.
- `.env` is never committed. If a secret ends up in a screenshot or a commit, rotate it.

## 3. The database

- **Migrations are run by a person, never by an AI agent:** `npx.cmd prisma migrate dev --name <what changed>`.
- **Stop the dev server first.** Windows locks Prisma's files.
- **Adding a required column to a table with rows fails.** Do it in three steps: add it as optional, fill it, then make it required (see Task 4).
- **P1001 "Can't reach database server"** usually means Neon's free tier is asleep. Wait 10 seconds and retry. If it keeps failing, run `Test-NetConnection <host> -Port 5432`.
- Look at data with `npx.cmd prisma studio`.

## 4. Accounts and sessions

- **Sessions last 7 days.** Only the SHA-256 hash of the token is stored (see [sessions](sessions.md)).
- **Logging out deletes the session row.**
- **Changing the password ends every other session.**
- **Deleting an account** ends every session at once and anonymises the account 30 days later.
- **Admins** have `role = "admin"`. There's no admin signup. Set it by hand in Prisma Studio, and write down who did it and why.

## 5. Scheduled job: purge deleted accounts

- **Run** `node scripts/purge-deleted.mjs`.
- **Running it twice is safe.** The second run should print `anonymised 0`.
- **To test without waiting 30 days,** add `--now=2026-12-15T00:00:00Z`.
- **It is not scheduled yet.** Before launch it must run daily (Vercel Cron or a Windows Task), and someone must notice if it stops. Read [the broken-promise draft](broken-promise-draft.md) for what happens otherwise.

## 6. When things go wrong

| Symptom | Likely cause | Do this |
| --- | --- | --- |
| Signup says "201" but no email arrives | `.env` SMTP values wrong or not saved; background send fails silently | Check the terminal for `[mail]` errors; set `EMAIL_MODE="sync"` to see the error |
| `535 BadCredentials` | Gmail app password wrong | Make a new app password (needs 2-Step Verification) |
| Login or signup gives 500 after a quiet period | Neon asleep, and the rate limiter crashes instead of letting the request through | Retry; the real fix is in the defects list |
| 429 "Too many attempts" in testing | Rate limit window (15 min) | Wait, or clear the `RateLimit` rows in Prisma Studio |
| A user says they logged out but are still logged in | Old logout bug (fixed in Task 5) | Check the `Session` table for their rows and delete them |

## 7. What's not done yet

- Hard email gating before booking and payment ([gating](gating.md)).
- Scheduling the purge job.
- Rate limiter: trusts `X-Forwarded-For`, isn't atomic, crashes when the database is asleep.
- A banned user with the correct password gets 403 instead of 401, which tells an attacker the password was right.
- Payments with Flutterwave.
- A support email address for privacy requests.
