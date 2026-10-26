# FreshFold Laundry

## What this is

FreshFold is a laundry pickup-and-delivery service in Yaba, Lagos. Customers use the app to see their order status, the items collected, what they owe, and how much of their monthly plan is left. Full description: `task-01-design-system/docs/business-brief.md`.

The one thing that must work: every item collected at pickup is recorded against the customer, and the customer can see that list.

## Who uses it

- **Customer:** working adults and students in mainland Lagos, on low-cost Android phones (about 360px wide) with small data bundles, often outdoors.
- **Staff:** FreshFold workers who record pickups and update order status. Staff screens come in a later task.

## Stack

- Next.js (App Router) with TypeScript
- Prisma as the only way to touch the database
- PostgreSQL
- Plain CSS using the design-system variables. No CSS framework, no UI component library.

Do not add any other library, service or package without asking first.

## Design system: the only source of styling

- `styles/tokens.css` is generated from Figma by `scripts/tokens-to-css.mjs`. Never edit it by hand. Never edit `tokens/tokens.json`.
- Every colour is a `var(--color-…)` role. No hex, rgb, hsl or named colours anywhere, not even white or black.
- Every piece of text uses one of the 15 type styles through its `--type-<role>-<size>-…` variables. Which style is for which job is in the "Used in FreshFold for" column of `task-01-design-system/docs/type-scale.md`.
- Shadows only from `--shadow-soft`, `--shadow-medium`, `--shadow-hard`.
- Font: Atkinson Hyperlegible Next (Google Fonts, weights 400, 500, 600).
- Calm and clean: no gradients, no decorative shapes.
- The design-system docs are in `task-01-design-system/docs/`: business-brief, colour-roles, type-scale, shadows.

## Folder map

```
freshfold/
  AGENTS.md                 this file
  app/                      Next.js pages and routes
  prisma/                   schema and migrations
  scripts/                  tokens-to-css.mjs
  styles/                   tokens.css (generated)
  tokens/                   tokens.json (Figma export)
  screens/                  Task 1 static test screens (do not change)
  task-01-design-system/    Task 1 submission (do not change)
  task-02-repository-and-scaffold/   Task 2 submission
```

Do not create a new top-level folder without asking. Never create a project folder inside this one: everything goes in the repository root.

## Rules for working here

- Build one thing at a time. Show it, then wait.
- When two files disagree, stop and ask. Do not pick one.
- Never run database migrations, resets or seeds without asking first.
- Secrets live only in `.env`, which is never committed. `.env.example` lists the names with no values.
- Never commit to `main` directly once the repository is pushed; work on a branch.
- End every response with: the files you created or changed, and the assumptions you made.
