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

## Hard gating branch (evidence 04)

Not built. I ran out of time before the deadline, so I chose to finish logout, password change and account deletion instead. The plan was a branch where middleware sends unverified users from `/dashboard` to `/account?form=verify`, and then compare the two. I'm recording it as not done rather than faking it.
