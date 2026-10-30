# Breached password check

**Where:** registration only (`lib/breach.ts`, called from `app/api/signup/route.ts`).
**Service:** Have I Been Pwned, Pwned Passwords range API.

## How it works, in my own words

1. Take the customer's password and compute its **SHA-1 hash** on my server, written as 40 hexadecimal characters, e.g. `password1234` → `E6B6AFBD…`.
2. Send **only the first 5 characters** of that hash to `https://api.pwnedpasswords.com/range/E6B6A`.
3. The service replies with **every** leaked hash that starts with those 5 characters, usually several hundred, each with how many times it has appeared in breaches. I also send `Add-Padding: true`, so the reply includes fake entries and its size gives nothing away.
4. My server compares **the other 35 characters** against that list **locally**. A match means the password is in the breach corpus, so signup is refused with "This password has appeared in a data breach. Choose a different one."

The service learns only a 5-character prefix shared by hundreds of thousands of possible passwords. It never sees the password or even its full hash, and cannot tell which entry, if any, I was looking for. This is called **k-anonymity**: my query hides among many others that look the same.

SHA-1 here is not password storage. It is only a lookup key the service understands. The stored password is still Argon2id.

## Tested

`password1234` at signup → rejected (evidence 15). It is 12 characters, so it passes my length rule. The breach check is the only rule that stops it.

## Why the naive version is unacceptable

The naive version sends the password itself, or its full hash, to the service: "is `password1234` breached?"
- **The plain password:** I would be handing every new customer's password to a third party over the internet. Anyone in that path (the service, its logs, a compromised network, a man-in-the-middle) receives a fresh list of real passwords tied to the moment someone signed up for FreshFold.
- **The full hash:** no better. An unsalted SHA-1 of a password is effectively the password: anyone can look it up in seconds in precomputed tables.

Either way, a security check would itself become the leak, and I would be breaking the promise in my own privacy terms.

## Choices I made

- **Fail open.** If the API is down or slow, `checkBreach` returns null, logs a warning, and signup continues. A third party's outage should not stop FreshFold signups; the other defences (length, Argon2id, rate limits) still apply.
- **Registration only,** as the brief asks. Checking at login too would let me warn existing customers whose password has since leaked, which I'd add later.
- **Cost:** about 200–300 ms per signup warm, over 1 s cold (from the signup timing log).
