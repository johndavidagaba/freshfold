# FreshFold Laundry

## 1. What this is

FreshFold is a laundry pickup-and-delivery app for working adults and students in Yaba, Lagos. The one thing it must get right is recording every item collected at pickup, so a customer can always see what was taken.

This is my Ship & Found Founder Track portfolio. It is **one repository with five task folders**, one per task.

## 2. Status

| Part | State |
| --- | --- |
| Task 1: design system (`task-01-design-system/`) | **Finished.** Colours, 15 type styles and 3 shadows from Figma, converted to 131 CSS variables. |
| Task 2: repository and scaffold (`task-02-repository-and-scaffold/`) | **Half done.** Scaffold, server failures, the database form and its evidence are finished. README test, working-tree drawing, branch history and page head are still to do. |
| Tasks 3–5 | **Not started.** |

What runs today:

- **Home page (`/`):** the FreshFold name, one line of description and a "Schedule pickup" button. **The button does nothing yet.**
- **Schedule page (`/schedule`):** a form that saves a pickup request (name, phone, address, date and time, rough item count) to PostgreSQL. **It works.** Two test rows were saved and checked in the database (`task-02-repository-and-scaffold/evidence/12-database-rows.png`).

What does **not** exist yet: recording individual items at pickup (the one thing that must work), order status, customer accounts, staff screens and payments.

## 3. The stack, with reasons

| Choice | Why this rather than the alternative |
| --- | --- |
| **Next.js 15 (App Router)** | I used it rather than React with Vite because pages and server code live in one project, and a Server Action saves the form without a separate API server. |
| **TypeScript** | I used it rather than plain JavaScript because it catches mistakes like a text value going into `itemCount`, which must be a number. |
| **Prisma 6.19.3** | I used it rather than writing raw SQL because migrations are files in git, so the database can be rebuilt from the repository. It is pinned at 6 because Prisma 7 no longer accepts the database URL in `schema.prisma`. |
| **PostgreSQL on Neon (free tier)** | I used it rather than PostgreSQL installed locally because nothing needs installing on Windows, and the same hosted database can serve the deployed app later. |
| **Plain CSS with design tokens** | I used it rather than Tailwind or a UI kit because every colour, text style and shadow must come from my Figma design system (`styles/tokens.css`). A framework would bring its own. |
| **Atkinson Hyperlegible Next (Google Fonts)** | I used it rather than Roboto or Inter because it never confuses 1, l and I, or 0 and O, and balances and item counts must be impossible to misread. |

## 4. Getting started

You need **Node.js 18.18 or newer**, **Git**, and a free **[Neon](https://neon.tech)** account.

1. Clone and install:
   ```
   git clone https://github.com/johndavidagaba/freshfold.git
   cd freshfold
   npm install
   ```
2. Create a database: in Neon, click **New Project**. Then click **Connect**, turn **Connection pooling off**, and copy the connection string that starts with `postgresql://`.
3. Create your `.env` file from the example:
   ```
   copy .env.example .env
   ```
   (On Mac or Linux, use `cp .env.example .env`.) Open `.env` and paste your string between the quotes: `DATABASE_URL="postgresql://..."`.
4. Create the table:
   ```
   npx prisma migrate deploy
   ```
   It should end with "All migrations have been successfully applied".
5. Start the app:
   ```
   npm run dev
   ```
   Open http://localhost:3000, then http://localhost:3000/schedule for the form.
6. Optional: to see saved rows, run `npx prisma studio` and open http://localhost:5555.

**Windows:** if PowerShell says "running scripts is disabled on this system", use `npm.cmd` and `npx.cmd` instead of `npm` and `npx`.

**If the form says "Unable to save pickup request":** check that `.env` exists and contains `DATABASE_URL`, then stop the server (Ctrl+C) and start it again. Fixing `.env` without a restart is not enough (see defect 3).

## 5. Environment variables

| Name | What it is for |
| --- | --- |
| `DATABASE_URL` | Connection string for the PostgreSQL database. Prisma uses it for migrations and for saving pickup requests. Keep it in `.env` only; `.env` is in `.gitignore` and must never be committed. |

`.env.example` lists the name with no value.

## 6. What this deliberately does not do

- **No customer login.** The first job is proving that a request is really saved. Accounts and sessions come in Task 5.
- **No payments.** Taking money before items are reliably recorded would charge people for a service the app cannot yet track.
- **No staff screens or item recording yet.** This is the core of the product, so it gets its own task rather than being rushed into the scaffold.
- **No input validation beyond the browser's own.** Client-side validation is Task 3 and server-side security is Task 4. Doing them properly matters more than doing them early.
- **No CSS framework or UI library.** The design system is the only source of styling (`AGENTS.md`).
- **No notifications (SMS, email).** They cost money per message and depend on the order data that does not exist yet.

## 7. Known defects

1. **A failed save returns HTTP 200.** `app/schedule/actions.ts` (the `try/catch` around `prisma.pickupRequest.create`, line 35 onwards) catches the database error and returns an error message, so the request ends `POST /schedule 200`, the same status as a successful save. Logs and the network tab cannot tell success from failure. Evidence: `task-02-repository-and-scaffold/evidence/13-write-failed-logs.txt`.
2. **A failed save wipes the form.** In `app/schedule/page.tsx`, after a failed submit every field is emptied and the only feedback is one small red line. A customer must retype everything and can easily miss the message. Evidence: `13-write-failed-ui.png`.
3. **A fixed database setting needs a restart.** `lib/prisma.ts` creates one Prisma client and keeps it. After `DATABASE_URL` was restored, the server reloaded `.env` but saves kept failing until a full restart.
4. **The home page button goes nowhere.** `app/page.tsx`: "Schedule pickup" has no link to `/schedule` yet.
5. **`lib/` is a top-level folder that `AGENTS.md` does not list.** The agent created it without asking, against the rules in `AGENTS.md`.
6. **The token script does not check font weights.** `scripts/tokens-to-css.mjs`, line 84 validates sizes and colours but not weights, so a bad weight would pass silently.
7. **Colour roles hold hex values instead of palette references.** In `styles/tokens.css`, `--color-primary` is `#2b4fb4`, not `var(--palette-primary-40)`, which makes dark mode and rebranding harder. See `task-01-design-system/docs/defects.md`.
8. **No automated tests.** Every check so far has been manual, recorded in `evidence/`.
