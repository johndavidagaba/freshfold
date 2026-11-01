# Retention matrix

What FreshFold keeps, why, for how long, and what happens when a customer deletes their account.

**How deletion works.** "Delete my account" sets `deletionRequestedAt` and `purgeAfter` (30 days later), ends every session and logs the customer out. Logging in is refused with the normal "Email or password is incorrect." After 30 days, `scripts/purge-deleted.mjs` anonymises the account. The script is safe to run twice.

| Data | Why we keep it | How long | On deletion |
| --- | --- | --- | --- |
| **User:** name | Pickup tag and greeting | While the account exists | Becomes "Deleted user" after 30 days |
| **User:** email | Login, verification, receipts | While the account exists | Becomes `deleted-<id>@invalid` after 30 days |
| **User:** phone | Riders call customers | While the account exists | Set to empty after 30 days (the database column became optional for this) |
| **User:** passwordHash | Login | While the account exists | Wiped after 30 days |
| **User:** termsAcceptedAt, createdAt | Proof of consent and account age | While the account exists | Kept on the anonymised row: no personal data on its own |
| **User:** deletionRequestedAt, purgeAfter | Run the grace period | Until purge, then kept | Kept, so the script knows the row is done |
| **Session** | Keep you logged in | 7 days, or until logout | All deleted immediately |
| **VerificationCode** | Prove the email is yours | 10-minute expiry; rows stay | Deleted at purge |
| **RateLimit** | Slow down guessing | One 15-minute window | Not linked to a user (keyed by IP or email). **Gap:** the email-keyed rows hold an email in the key. |
| **PickupRequest** | The business itself | While needed | **Not handled yet:** not linked to User in the current schema, so the purge doesn't touch them. |
| **Payment, PaymentAttempt** | Accounting and tax records | At least six years, the period I noted in Task 4 for Nigerian tax records (still to confirm with an accountant) | **Kept,** still pointing at the anonymised user. The schema enforces this too: `Payment` restricts deleting its user. Deleting financial records isn't my choice to make. |
| **KnowledgeChunk** | Future help content | Not personal | Unaffected |
| **Server logs** | Debugging | Until the terminal or host rotates them | They contain user ids and short hash prefixes, never passwords or tokens. No rotation policy yet. |
| **Backups** (Neon) | Disaster recovery | Neon's own window | **Deleted data lives on in backups** until they expire. I don't control this yet. |

## Why 30 days

Long enough to change your mind (people delete in anger, or get hacked and the attacker deletes). Short enough that "delete" still means something. Thirty is a common choice, not a law. I picked it, and I can defend changing it.
