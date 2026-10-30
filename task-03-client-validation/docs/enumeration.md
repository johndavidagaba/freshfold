# Not leaking the shape of sensitive data

## Which field, and why its shape is sensitive

**The login password field, and the login and reset messages.**

On signup, a hint like "At least 12 characters" is helpful: the user is choosing a password and needs the rule.

On **login**, the same hint, or an error such as "Password must be at least 12 characters", tells an attacker the shape of every valid FreshFold password. So I removed every password rule and length hint from the login form. Login now says only "Enter your password." when the field is empty, and otherwise one sentence: **"Email or password is incorrect."**, without saying which half was wrong.

The same reasoning covers the **reset form**. It always answers "If an account uses that email, we've sent a reset link." whether or not the email is registered.

## What an attacker gains from knowing the shape

- **From the password rule:** they never waste a guess on anything shorter than 12 characters, and they can tune a guessing list to exactly what FreshFold accepts. The search space shrinks for free.
- **From a message that names the wrong half** ("No account with that email" vs "Wrong password"), or a reset form that says "We don't recognise that email": they can test a list of emails and learn which people are FreshFold customers.

That is user enumeration. For a laundry service it also reveals who uses a pickup service at which address in Yaba, which is useful to someone planning to target a home. And it gives a confirmed list of accounts to try passwords against.

## The trade-off I accepted

Legitimate users lose two things:
1. **Someone who forgot their password rule** gets no reminder at login. If they type an 8-character old password, they see the same "incorrect" message as any other mistake, not "too short".
2. **Someone who forgot which email they signed up with** cannot use the login or reset form to find out. "If an account uses that email…" is true either way, so they may wait for an email that never comes.

How much harder: for most people, not at all, because password managers and phone keyboards fill these fields. For the second group, the cost is real: possibly a support message instead of a self-service answer.

I think it is worth it. Knowing who has a FreshFold account, and roughly where they live, is worth more to an attacker than the convenience is to a forgetful user. A support channel can confirm an account after checking identity; a public form cannot.

**Honest limit:** this is only the browser. Until the server (Task 4) gives identical responses, and identical response *times*, for "no such account" and "wrong password", an attacker who skips the form can still tell the difference.
