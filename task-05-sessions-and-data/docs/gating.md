# Gating: what an unverified customer can do

When someone signs up, they get a 6-digit code by email (Task 4). The question is what they can do before typing it in.

## What I built: soft gating (evidence 03)

An unverified customer can log in and see the dashboard. A brown banner says "Please verify your email". Nothing is blocked yet.

## Why soft, for FreshFold

- **Email is slow and unreliable for my customers.** Gmail took 5–16 seconds in my tests, sometimes longer, and some customers will check email hours later. Hard gating at signup means the customer hits a wall exactly when they're most interested.
- **Nothing on the dashboard is dangerous yet.** It shows their own name and email. There are no bookings or payments behind it yet.
- **The phone number is what matters most to the business.** Riders call customers. A verified email doesn't make a pickup happen.

## Where the gate *will* go hard

Soft gating is a decision for today, not forever. When these exist, they must check `emailVerifiedAt` on the **server** and refuse with 403 if it's empty:

1. **Booking a pickup.** A rider's trip costs money. A fake account shouldn't be able to send riders around Yaba.
2. **Paying** (Flutterwave, later). Receipts and refunds go to the email, so it has to be real.
3. **Changing the email address.**

The gate goes in the route handler, not the page. Hiding a button is decoration. Task 3 showed that anyone can call the API directly with curl.

## Hard gating, tried on a branch (evidence 04)

**Branch:** `feature/hard-gating`. Pushed, **not merged** on purpose. Prompt: `hard-gating-prompt.md`.

**What it does:**
- The dashboard checks `emailVerifiedAt` on the server and sends unverified users to `/verify-email` before anything renders.
- The verify page has one code box, a Verify button, errors in an alert and a Log out button.
- The change-password API refuses unverified users with 403. The check is in the route, not only the page.

**What happened when I tried it as Kemi (unverified):**
- **Logging in** landed on "Verify your email": "We sent a 6-digit code to kemi.ade@example.com." (evidence 04)
- **Typing `/dashboard`** sent her straight back to the verify page (evidence 04b).

**The problem it exposed: a dead end.**
- Kemi's code was sent days ago, and codes expire after 10 minutes.
- The page says "We sent a code", but there's **no "send a new code" button**.
- So the hard-gated Kemi is **locked out of her own account**. She can only log out.
- Soft gating never had this problem: she could still use the dashboard while the email sorted itself out.

## Soft vs hard, side by side

| | Soft (main) | Hard (branch) |
| --- | --- | --- |
| Unverified customer after login | Dashboard plus a banner | Verify page only |
| If the email is slow or lost | Still usable | Stuck until a new code arrives |
| Needs a "resend code" feature | Nice to have | **Required**, or it's a trap |
| Fake accounts | Can reach the dashboard (nothing to abuse yet) | Blocked at the door |
| Where the check lives | Server (banner reads the database) | Server (redirect plus a 403 on the API) |

**Decision.** Keep soft gating on `main` for now. Hard gating comes back for booking and payment, and only together with a working "resend code" button and a clear message about expiry. A hard gate without a way through is worse than no gate.
