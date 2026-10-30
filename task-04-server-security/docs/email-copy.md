# Email copy

## The email

Subject: "Your FreshFold verification code". Body (evidence 23):

> **FreshFold**
> Hi Ada Obi, your FreshFold code is:
> **835026**
> It expires in 10 minutes.
> If you didn't ask for this, you can ignore this email.

## Does it look like the product?

Yes. The "FreshFold" heading and the code box are Laundry Blue, the button colour from Task 1, with white text.

Email clients don't support CSS variables (`var(--color-primary)`), so I could not simply reuse `tokens.css`. I told the agent to **read the colour values from `styles/tokens.css` at runtime** and inline them, and not to type any hex values. `lib/emailTemplate.ts` throws if a token is missing.

The result: the email uses the same source of truth as the app. A rebrand changes the tokens, and both follow.

It did not come out wrong. There was no purple, the class's failure, because the colours could only come from the tokens file. The font is the one gap: Gmail doesn't load web fonts in most clients, so it falls back to Arial instead of Atkinson Hyperlegible Next.

## Who wrote the copy

The agent wrote this copy, from the outline in my prompt. In a real business a developer or marketer writes it, because **the copy is the marketing**: this is often the first thing a new customer receives from FreshFold, and it sets the tone.

## What I would change before real customers saw it

- **Say what happened, not just the code:** "Thanks for signing up to FreshFold. Enter this code to confirm your email."
- **Use the first name only:** "Hi Ada", not "Hi Ada Obi". It's friendlier, and Nigerian customers often prefer it.
- **Make the code easy to copy on a phone:** bigger spacing, and a "copy" hint. Better still, a one-tap link that verifies, alongside the code.
- **State the expiry as a time as well as a duration** ("valid until 9:07 PM"), because people open emails late.
- **Add a reason to trust it:** "FreshFold will never ask for this code by phone or WhatsApp." Phone and WhatsApp scams that ask for codes are common in Nigeria.
- **Send from a FreshFold address,** not a personal Gmail. A personal Gmail sender looks like phishing and may land in Spam.
- **Write a plain-text version** for clients that block HTML.
- **Add a footer** with FreshFold's address and contact, which also helps deliverability.
