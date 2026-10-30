# Migrations

Every migration in Task 4 was run **by hand** from my terminal. The agent was told in every prompt: "Do NOT run any prisma migrate or db command." It never did. It edited `schema.prisma` and stopped; I ran `prisma migrate dev`.

| Migration | What it did | Evidence |
| --- | --- | --- |
| `20261030145503_task4_core_tables` | User, Session, VerificationCode, Payment, PaymentAttempt, KnowledgeChunk, RateLimit | 03 |
| (refused) `add_pickup_status` | required `status` on a table with 5 rows | 04 |
| `20261030145938_add_pickup_status_optional` | step 1: add `status` as optional | 05 |
| (SQL, not a migration) `UPDATE "PickupRequest" SET "status"='requested' WHERE "status" IS NULL` | step 2: fill existing rows | 05 |
| `20261030150248_make_pickup_status_required` | step 3: make it required, default "requested" | 05 |
| `20261030152049_add_pickup_notes` | fixed the drift I caused on purpose | 06 |

## The drift error

I added `notes String?` to the schema and ran only `prisma generate`, then submitted a booking. Result: `P2022: The column PickupRequest.notes does not exist in the current database.`

Two things had gone out of step:
- **The Prisma client:** the generated TypeScript code in `node_modules/@prisma/client`, rebuilt by `generate` from the schema file. It now believed `notes` exists and included it in every query.
- **The real database on Neon:** it was never changed, because only a *migration* alters tables.

`generate` updates the code's idea of the database; `migrate` updates the database itself. Running one without the other makes them disagree, and the error only appears at runtime, on the first query that touches the missing column. The page itself showed only "Unable to save pickup request. Please try again."

## Why forward-only

Each migration is a step from one known database state to the next, and the `_prisma_migrations` table records which steps have run. Going back means writing a *new* migration that undoes the change, so the history always matches what actually happened to every database (mine, a teammate's, production). Dropping a column you added yesterday is a new forward step, not an edit to yesterday's.

## Why never edit a migration that has already run

The database has already applied the old version. Editing the file doesn't change the database: it only makes the file lie about what happened. Prisma checksums applied migrations and will complain, or, worse, a fresh database built from the files would end up different from production. Any change to a run migration must be a new migration.

## Why by hand rather than letting an agent run them

A migration changes real data, and some changes destroy it: a dropped column, or a reset that wipes the database. The agent cannot see what the database holds or what each row means to the business. Running it myself means I read the plan, see the warning (like the "5 rows" refusal), and decide. It is the same propose-and-stop rule as in AGENTS.md: the agent proposes the schema change, I apply it.

## The honest cost

It's slower: every schema change needs me at the keyboard, and today I ran six migration commands across several restarts. And **people forget**. I demonstrated that myself with the drift error: a schema change without the matching migration breaks the app with an error the user can't understand. In a team, someone will merge a schema change and forget the migration. The fix for that is not to let an agent run migrations freely. It is to make the check automatic: a CI step that fails if `prisma migrate diff` shows the schema and migrations disagree, and migrations applied by the deploy pipeline (`prisma migrate deploy`), not by anyone's memory.
