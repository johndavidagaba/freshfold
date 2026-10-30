# Email verification design

## Code generation

A **6-digit code** from `crypto.randomInt(0, 1000000)`, zero-padded (so `004213` is possible), in `lib/verification.ts`.

`crypto.randomInt` is Node's **cryptographically secure** generator. `Math.random()` is not: it comes from a fast pseudorandom generator whose internal state can be recovered from a handful of outputs, after which every later "random" value is predictable.

Only the **SHA-256 of the code** is stored (`codeHash`); the code itself exists only in the email. A database leak does not reveal live codes.

## What an attacker could do with predictable codes

If codes came from `Math.random()`, an attacker could:
1. sign up with a few accounts of their own and read their own codes;
2. reconstruct the generator's state from them;
3. predict the next codes the server will issue;
4. sign up using **someone else's email** and enter the predicted code straight away.

My 10-minute expiry and rate limit **would not help**. Expiry limits how long a *guess* is useful, and the rate limit counts *wrong* attempts. A predicted code is right the first time, inside any window, with zero failures. Unpredictable generation is what makes the other two controls meaningful.

With proper random codes the maths is on my side. 1,000,000 possible codes, 5 wrong attempts per code before it locks, 10 verify requests per IP per 15 minutes: the chance of guessing one code is 5 in 1,000,000 (0.0005%).

## Expiry: 10 minutes

**How long users actually need.** A FreshFold customer signs up on a phone, often outdoors. They have to switch to their email app, wait for Gmail to deliver, and possibly look in Spam. In my own tests, delivery alone took 7.6 seconds from my laptop to my inbox, on good Wi-Fi. On a weak 3G connection, with a mail app that only syncs every few minutes, 2 minutes would fail real people; 5 is tight; 10 covers a slow delivery plus a distracted user.

**What the window costs me in attack surface.** A longer window gives a guesser more time, but guessing is capped by **attempts**, not time: 5 wrong tries lock the code whatever the window. So the extra minutes mostly widen the window for someone who can *see* the code (a shoulder-surfer, someone with the phone). For an email-confirmation code, where the account is already created and protected by its password, that is a small risk. For a password-reset or login code I would choose 5 minutes.

## Delivery

Gmail SMTP, `smtp.gmail.com`, port **465** (implicit TLS), via nodemailer. The full failure and fix are in evidence 16–17:
1. **Settings never loaded.** My Notepad edit to `.env` wasn't saved. The app ran in background mode and logged "SMTP environment variables are not configured", while the customer saw `201` and no email ever came.
2. **Google rejected the login:** `535-5.7.8 Username and Password not accepted` (EAUTH). Gmail needs an **App Password**, which needs 2-Step Verification on, which needed a phone number as a second step. I created one, wrote it into `.env` with `Read-Host` so it never appeared on screen, and checked only its length (16).

## Background sending

The email is sent with Next.js `after()`, which runs **after** the response is sent (evidence 18):

| Mode | Customer waits |
| --- | --- |
| Email inside the request | **16.6 s** |
| Email in the background | **5.9 s** (email step: 4 ms) |

The email itself took 7.6 s through Gmail. In background mode the customer has their answer before Gmail even replies.

Cost of background mode: if the send fails, the customer has already been told "success". That happened in failure 1. In production this needs a real job queue with retries and a "resend code" button.

## The flow, tested (evidence 19–22)

| Case | Response |
| --- | --- |
| Wrong code `000000` | `400` "Invalid code." (attempts → 1) |
| Right code | `200` "Email verified. You can log in now." |
| **The same code again** | **`200` again: defect** |
| Expired code (sent 20:45, tried 20:59) | `410` "This code has expired. Request a new one." |

## The reuse defect (documented, not fixed)

`verifyCode` sets `usedAt` when a code succeeds but **never checks `usedAt`**, so a used code keeps working until it expires. The database row proves it (evidence 19): `usedAt = 19:59:31Z`, and the next request still returned 200.

The agent said so itself: *"usedAt is not checked as an invalidating condition because the rules did not request it."* I wrote those rules and didn't ask, so the gap is mine as much as the agent's.

The harm here is small, because the account is already verified. But the same pattern on a password-reset code would let anyone who sees an old email reset the password again.

**The fix:** check `usedAt`, return "This code has already been used", and make the update conditional (`WHERE usedAt IS NULL`) so two simultaneous requests can't both succeed.
