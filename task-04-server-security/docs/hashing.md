# Hashing

**Algorithm: Argon2id**, via `@node-rs/argon2` with its defaults:
- memory m = 19,456 KiB (19 MiB);
- passes t = 2;
- parallelism p = 1.

Not SHA-256, SHA-512 or MD5.

## 1. The same password hashed twice

Password: `correct-horse-battery` (evidence 07)

```
$argon2id$v=19$m=19456,t=2,p=1$+b/mbrRsjRbY8EX6o1I5dw$av8qw764xl8lP6TCY5J5dRqFsa0Cot8pfc9tAYwCawc
$argon2id$v=19$m=19456,t=2,p=1$UEFaJwALEWsUXV3pM2Zd/A$WH0nn2heDJLgc7kxirFHjsPp17urwQbLT1b2ia+Kl88
```

**Why they differ, in one line:** each hash uses a new random salt (the part after `p=1$`), and the salt is mixed into the hash, so the same password never produces the same output twice.

## 2. Timing, from my own laptop

`node scripts/hash-timing.mjs`, Fri 30 Oct 2026 (evidence 08):

| Algorithm | Time per hash | Guesses per second (one core) |
| --- | --- | --- |
| **Argon2id** | **21.57 ms** | 1000 / 21.57 = **46.36** |
| **SHA-256** | **1.871 µs** = 0.001871 ms | 1,000,000 / 1.871 = **534,474** |

**Ratio:** 534,474 / 46.36 = **about 11,530 times** more guesses per second against SHA-256.

## 3. What an attacker gets

Suppose they steal the User table and try a list of 10 million common and leaked passwords against one customer, on one core like mine:
- **SHA-256:** 10,000,000 / 534,474 = **about 19 seconds**.
- **Argon2id:** 10,000,000 / 46.36 = 215,700 seconds = **about 60 hours**.

Across all 16 accounts in my test database, SHA-256 is still under 6 minutes; Argon2id is about 40 days.

My SHA-256 number understates the real danger. A graphics card computes billions of SHA-256 hashes per second, because each needs almost no memory. Argon2id needs 19 MiB *per guess*, which limits how many guesses a GPU can run at once. Argon2id is slow on purpose *and* memory-hard, so throwing hardware at it helps far less.

## 4. The inversion

I hash a password **once** each time a customer signs up or logs in. 21.57 ms is invisible next to the ~900 ms of network time a signup already takes. An attacker with a stolen table has to hash **every guess**, millions or billions of them. Making each hash slow costs me nothing anyone can measure, and it costs the attacker everything: days instead of seconds per account. Fast is the right property for most code and exactly the wrong one here.

## Salting

**What it does:** a salt is a random value stored next to each hash and mixed into it. Two customers with the same password get different hashes, and the attacker can't use one precomputed table for everyone. They have to attack each account separately, from scratch.

**Does my algorithm handle it?** Yes. Argon2id generates a 16-byte random salt for every hash and stores it inside the hash string (`$argon2id$v=19$m=…,t=…,p=…$<salt>$<hash>`). `verifyPassword` reads it back from there. I never handle the salt myself.

**If I skipped it:**
- every customer using `password1234` would have the identical hash, so cracking one cracks them all, and the attacker can see which customers share a password;
- precomputed tables (rainbow tables) for unsalted hashes would work on the whole table at once;
- the attacker would hash each guess once and compare it against every row, instead of once per row.
