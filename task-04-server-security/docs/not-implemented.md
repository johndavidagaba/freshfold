# Security controls I chose not to implement (yet)

## 1. Two-factor authentication for customers

**What it is:** a second proof at login (a code from an authenticator app, or an SMS) as well as the password.

**Why not now:** FreshFold accounts hold a name, phone number, pickup history and, later, payments made through a provider that does its own authentication. The cost of a stolen account is real but limited, while every extra login step loses customers on cheap phones with patchy data. Long passwords, Argon2id, breach checks and per-account rate limits cover the common attacks.

**What would change it:** storing payment methods or a wallet balance in FreshFold itself, staff and admin accounts (which I would give 2FA from day one), or evidence of account takeovers.

## 2. CAPTCHA on signup and login

**What it is:** a challenge (pick the pictures, or an invisible score like Cloudflare Turnstile) to prove a human is present.

**Why not now:** it adds friction and data use, it can fail for screen-reader users (against my Task 3 accessibility work), and the third-party scripts slow the page on 3G. My rate limits already slow bots, and verification stops fake accounts becoming active.

**What would change it:** a flood of fake signups that rate limits don't stop, especially from many IPs. I would then add it only after suspicious behaviour, not for everyone.

## 3. A shared, atomic rate-limit store (Redis/Upstash)

**What it is:** keeping counters in a fast in-memory store with atomic increments, instead of PostgreSQL.

**Why not now:** it's one more paid service to run, and FreshFold has one server and a handful of users. PostgreSQL works and is already there.

**What would change it:** more than one server instance, real traffic, or the measured costs becoming a problem: the ~280 ms the limiter adds to every signup, the read-then-write race the agent warned about, and the 500s when Neon is asleep.

## 4. Device fingerprinting and IP reputation

**What it is:** keying limits on a device identifier or a fingerprint, and on known VPN or data-centre IP ranges, so changing IP or forging `X-Forwarded-For` doesn't reset the limit.

**Why not now:** fingerprinting raises privacy questions I'd have to put in the privacy policy and justify under the Nigeria Data Protection Act. Reputation lists cost money. And the per-email login limit already protects individual accounts.

**What would change it:** a credential-stuffing attack across many accounts, or deploying behind a proxy where I can at least trust the real client IP (which I would do first).

## 5. Encrypting personal data at the field level

**What it is:** encrypting phone numbers and addresses in the database with a key held outside it, so a stolen table shows ciphertext.

**Why not now:** Neon already encrypts the disk, and field encryption makes searching, indexing and support harder. Key management done badly is worse than none.

**What would change it:** a larger customer base, a regulator or partner requirement, or storing anything more sensitive than an address, such as ID documents for staff.

## 6. Pinning, rotating and auditing secrets

**What it is:**
- moving the database URL and the SMTP app password out of a `.env` file into a secrets manager;
- rotating them on a schedule;
- auditing who can read them.

**Why not now:** it's one developer, one laptop, and a free database with test data.

**What would change it:** a second developer, a deployment, or a real leak. My database password has already appeared in screenshots twice during this project, which is itself an argument to rotate it now and to move secrets somewhere screenshots can't reach.
