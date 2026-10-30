# Rate limiting

## What I built

`lib/rateLimit.ts`: a **fixed-window** counter stored in PostgreSQL (the `RateLimit` table).

| Route | Key | Limit | Window |
| --- | --- | --- | --- |
| signup | `signup:<ip>` | 5 | 15 minutes |
| login | `login:<ip>` | 10 | 15 minutes |
| login | `login-email:<email>` | 5 | 15 minutes |
| reset | `reset:<ip>` | 3 | 15 minutes |
| verify | `verify:<ip>` | 10 | 15 minutes |

Over the limit: **429** with `Retry-After` and "Too many attempts. Try again in N minutes."

## Why these numbers

- **Signup, 5 per 15 minutes per address.** A real person creates one account; a family sharing one phone might create two or three. Five leaves room for typos and retries. A bot making hundreds of fake "Test User" accounts is slowed to 20 an hour per address.
- **Login, 10 per address and 5 per email per 15 minutes.** A person who forgot their password tries a few variants, then uses reset. Five tries per *account* is the important one: it caps password guessing against one customer at 480 a day, whatever addresses it comes from. Against Argon2id's cost and a 12-character minimum, that is hopeless for an attacker.
- **Reset, 3 per 15 minutes.** Each reset will send an email. More than three is either impatience or someone using FreshFold to spam an inbox.
- **15 minutes** is short enough that a locked-out real customer can try again after a cup of tea, and long enough to slow a script considerably.

## Triggering it

5 valid signups from localhost, then the 6th: `{"error":"Too many attempts. Try again in 11 minutes."} -> 429` (evidence 13). The form shows the same message under the button with the caution icon.

## Defeating it

Two ways, both from my own laptop (evidence 14):
1. **A different real IP address.** The same request to `http://192.168.1.8:3000` (my laptop's Wi-Fi address) instead of `localhost` got **201**. The server saw a different client, with its own fresh counter. In real life the same trick is a phone hotspot, switching mobile data off and on (a new carrier IP), or a VPN.
2. **A forged header.** After localhost hit 429, the next request with `-H "X-Forwarded-For: 203.0.113.7"` got **201**. My limiter takes the client address from `X-Forwarded-For`, a header **the client writes itself**. Anyone with curl can be a "new visitor" on every request without changing anything real.

## Why IP alone is insufficient

- **Attackers have many addresses**: botnets, cloud servers, residential proxies, mobile data.
- **Honest users share addresses** (below).
- **The address the code reads may not be real.** `X-Forwarded-For` is only trustworthy when set by *my own* proxy (Vercel, Cloudflare) and the app reads the entry that proxy added. On my dev server nothing strips it, so it is fully attacker-controlled.

## What serious applications key on as well

- **The account or email being attacked:** `login-email:<email>` limits guesses against one customer, whatever addresses they come from. I have this one.
- **A device identifier:** a long-lived random cookie or token, or a browser fingerprint. Hardware-level signals (device attestation on mobile, such as Play Integrity / App Attest) are much harder to rotate than an IP.
- **Network reputation:** known data-centre and VPN ranges get stricter limits.
- **Behaviour:** CAPTCHA or proof-of-work only after suspicious patterns, so normal users never see it.
- **Global limits per route,** so a distributed attack still hits a ceiling.

## Where my counters are stored, and the trade-off

**In PostgreSQL on Neon (London), the `RateLimit` table.**
- **Good:** shared by every server instance (in-memory counters would reset on every deploy and differ per instance, so a limit of 5 becomes 5 × the number of servers), and it survives restarts. No extra service to run.
- **Bad:**
  - **Speed:** ~280 ms of every signup is the limiter's round trips to London.
  - **Load:** the busiest writes in the app are counter updates.
  - **Races:** the agent warned the read-then-update is not atomic, so simultaneous requests can slip past.
  - **Availability:** when Neon was asleep, the limiter's query failed and the whole signup returned **500**. My limiter *fails closed* by accident: nobody can sign up when the counter store is down.

  A purpose-built store (Redis/Upstash) with atomic increment would fix the speed and the race; the failure policy needs a deliberate decision either way.

## What my limit does to a shared office or campus connection

Many users behind one router or university network appear to the server as **one IP address**. My signup limit is 5 per 15 minutes *per address*. If the 6th student at UNILAG's hostel Wi-Fi tries to sign up in the same 15 minutes, they are refused with "Too many attempts", having made no attempts at all. Mobile carriers do the same at much larger scale: whole neighbourhoods share addresses through carrier-grade NAT, which is common on Nigerian mobile networks.

So the IP limit is really a limit per building or per mobile cell. That is the strongest argument for keying login on the email as well, and for keeping per-address limits generous.
