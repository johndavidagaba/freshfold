# Broken promise: draft email

*Our privacy notice promises that deleted accounts are wiped after 30 days. This drafts what I would send if we broke that promise. It's an exercise, not something that has happened.*

**The scenario.**
- The purge job is meant to run every day.
- I ran it by hand in testing, and in production nobody scheduled it.
- For 3 months, 42 customers who deleted their accounts still had their name, email and phone in our database.
- Nobody outside FreshFold saw the data, but our promise was broken.

---

**Subject:** We kept your details longer than we promised

Hello,

You deleted your FreshFold account. We promised to remove your name, email address and phone number within 30 days.

We didn't. A clean-up job that should have run every day was never switched on, and your details stayed in our database for up to 3 months longer than we said.

**What happened to your data:**
- It stayed in our own database, which only our team can reach.
- We have no sign that anyone else accessed it.
- It was not sold, shared or used to contact you.

**What we've done:**
- We removed your details on [date]. You can't log in, and we can't contact you after this email.
- The clean-up job now runs every day, and we get an alert if it doesn't run.
- We've added a monthly check that counts accounts past their deletion date. It must be zero.

This was our mistake. We're sorry.

If you have questions, reply to this email. We'll answer within 2 working days.

David Agaba John
FreshFold Laundry, Yaba

---

**Why it's written this way:**
- The first line says what went wrong.
- It says what happened to the data before it says sorry.
- It promises one specific fix rather than "we take privacy seriously".

**One problem with the scenario:** to send this email, I need the email address I promised to delete. I would send it before the final wipe, and say so in the email.
