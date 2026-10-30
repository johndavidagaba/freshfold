# Schema

Drawn on paper first (`evidence/01-schema-drawing.jpg`), then written in `prisma/schema.prisma` and applied with migration `20261030145503_task4_core_tables`. PostgreSQL on Neon (London, eu-west-2).

## Tables

### User
The people who use the system: FreshFold customers.

| Column | Type | Empty? | Why |
| --- | --- | --- | --- |
| id | text (cuid) | no | primary key |
| name | text | no | printed on the pickup tag |
| email | text, **unique** | no | login identifier; always stored trimmed and lowercased |
| phone | text | no | the rider calls it; text, not a number, so the leading 0 survives |
| passwordHash | text | no | Argon2id string; includes algorithm, parameters and salt |
| emailVerifiedAt | timestamp | yes | null until the email code is used |
| termsAcceptedAt | timestamp | no | when they ticked the box; proof of consent |
| createdAt / updatedAt | timestamp | no | audit |

### Session
Their sessions (used in Task 5).

| Column | Type | Empty? | Why |
| --- | --- | --- | --- |
| id | text (cuid) | no | primary key |
| userId | text → User | no | whose session; cascade delete with the user |
| tokenHash | text, **unique** | no | hash of the cookie token, so a database leak does not hand out live sessions |
| createdAt | timestamp | no | |
| expiresAt | timestamp | no | hard expiry |
| lastSeenAt | timestamp | no | idle timeout |
| revokedAt | timestamp | yes | logout / "sign out everywhere" |
| userAgent | text | yes | lets a user recognise their own devices |

### VerificationCode
Email codes.

| Column | Type | Empty? | Why |
| --- | --- | --- | --- |
| id | text (cuid) | no | |
| userId | text → User | no | cascade delete |
| codeHash | text | no | SHA-256 of the 6-digit code; the code itself is never stored |
| expiresAt | timestamp | no | createdAt + 10 minutes |
| usedAt | timestamp | yes | set when used (but not yet checked: see defects) |
| attempts | int, default 0 | no | wrong guesses; 5 locks the code |
| createdAt | timestamp | no | |

### Payment
**The money table.** Only payments that actually succeeded.

| Column | Type | Empty? | Why |
| --- | --- | --- | --- |
| id | text (cuid) | no | |
| userId | text → User | no | **Restrict** on delete: a customer with payments cannot be silently deleted |
| amountKobo | int | no | money in the smallest unit (kobo) so there is no floating-point rounding; ₦2,500 = 250000 |
| currency | text, default "NGN" | no | |
| provider | text | no | e.g. "flutterwave" (Task 4 does not integrate one yet) |
| providerRef | text, **unique** | no | the provider's transaction id; unique so a webhook delivered twice cannot record the payment twice |
| status | text | no | e.g. "succeeded", "refunded" |
| paidAt | timestamp | no | when the provider says the money moved |
| createdAt | timestamp | no | when we recorded it |

### PaymentAttempt
**The money-attempts table,** separate from Payment. Every attempt: succeeded, failed, abandoned, or lost on a bad network.

| Column | Type | Empty? | Why |
| --- | --- | --- | --- |
| id | text (cuid) | no | |
| userId | text → User | **yes** | optional, **SetNull** on delete: the financial record outlives the account |
| amountKobo | int | no | |
| currency | text, default "NGN" | no | |
| provider | text | no | |
| providerRef | text | yes | may not exist if the attempt died before the provider answered |
| outcome | text | no | "started", "succeeded", "failed", "abandoned", "timeout" |
| failureReason | text | yes | the provider's reason, e.g. "insufficient funds" |
| createdAt | timestamp | no | |

### KnowledgeChunk
Chunks for a retrieval system (not built yet).

| Column | Type | Empty? | Why |
| --- | --- | --- | --- |
| id | text (cuid) | no | |
| source | text | no | which document it came from, e.g. "pricing.md" |
| content | text | no | the chunk text |
| embedding | float[] | no | the vector. Stored as a plain array for now; real similarity search would need the pgvector extension and a vector index |
| createdAt | timestamp | no | |

### RateLimit
Counters for rate limiting.

| Column | Type | Empty? | Why |
| --- | --- | --- | --- |
| key | text, **primary key** | no | e.g. "signup:::1", "login-email:ada@example.com" |
| count | int | no | requests in the current window |
| windowStart | timestamp | no | start of the fixed window |

### PickupRequest
From Task 2. Not linked to User yet (bookings are made without an account). Gained `status` (required, default "requested", added in three steps) and `notes` (optional, added after the drift error).

## Relationships

- User → Session: **one to many**
- User → VerificationCode: **one to many**
- User → Payment: **one to many**
- User → PaymentAttempt: **one to many** (optional side: an attempt can exist with no user)
- KnowledgeChunk, RateLimit, PickupRequest: standalone

No many-to-many relationships yet. One will appear when orders have items and items can belong to several orders over time (for example, a laundry plan covering many pickups).

## Indexes

| Index | Why that column | Cost on writes |
| --- | --- | --- |
| User.email (unique) | every login and signup looks up by email; uniqueness also stops duplicate accounts | one index entry per signup, which is rare; negligible |
| Session.tokenHash (unique) | every authenticated request finds the session by its token | one entry per login |
| Session.userId | "list my devices" / "sign out everywhere" | one entry per login |
| VerificationCode (userId, createdAt) | verifyCode fetches the user's **newest** code: filter by userId, sort by createdAt. Composite in that order serves both | one entry per code sent |
| Payment.providerRef (unique) | webhook lookups by the provider's id, and protection against double recording | one entry per payment |
| Payment.userId | "my payments" | one per payment |
| PaymentAttempt (userId, createdAt) | "this customer's recent attempts", and drop-off reports by date | one per attempt, which could be several per payment; acceptable at FreshFold's size |
| RateLimit.key (primary key) | every limited request reads and updates its key | the limiter writes on almost every request, so this table is the busiest writer in the app |

I did not index `PaymentAttempt.outcome` or `KnowledgeChunk.source`. Nothing filters on them yet, and every index slows every insert.

## The same fact stored twice

1. **Payment and PaymentAttempt both hold the amount and provider of a successful payment.** A success appears as a `PaymentAttempt` with outcome "succeeded" and as a `Payment`. I accepted that: Payment is the clean ledger the business reads, PaymentAttempt is the raw history of what happened. They have different jobs and different retention.
2. **emailVerifiedAt on User and usedAt on VerificationCode** both record the moment of verification. User holds the answer ("is this account verified?"); the code row holds the evidence ("which code, when"). If they ever disagreed, the code row is the more trustworthy record.

## Why the money-attempts table exists

Two reasons.

**First, drop-off.** If 40 customers start paying and 25 finish, the 15 that didn't are invisible in Payment. Attempts show where the business loses people: card declined, bank timeout, closed the page on a weak 3G connection.

**Second, and more important, the record.** Payment logs are the source of truth for disputes, government inquiries and annual tax filing. A customer who says "I paid and you never collected my laundry", or a bank chargeback, needs the full trail, not only the payments that succeeded.

**If the tax authority (FIRS) asked me to account for a specific transaction from fourteen months ago:**
1. I would search `PaymentAttempt` and `Payment` by the provider reference or by the customer and date.
2. I would show every attempt with its timestamp, amount in kobo, outcome and failure reason, and the matching `Payment` row if it succeeded.
3. I would match that against the provider's own dashboard export (Flutterwave) and the bank statement.

That only works if these rows were never deleted, which is why `PaymentAttempt.userId` is `SetNull` rather than `Cascade`, and `Payment` restricts deletion of its user. Deleting a customer's account must not delete the money trail. The retention policy for that (Task 5) has to keep financial rows for at least six years, the period Nigerian tax law expects records to be kept, while removing what is not financial.
