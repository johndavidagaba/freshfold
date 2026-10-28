# Task 2: Repository and scaffold

**FreshFold Laundry**: laundry pickup and delivery in Yaba, Lagos. In this task the design system from Task 1 became a running Next.js app, with a form that writes to a real PostgreSQL database, on GitHub with branches and pull requests.

## What I built

- **Scaffold.** Next.js 15.3.9 with the App Router, TypeScript and Prisma 6.19.3. An agent built it from my AGENTS.md and a tightened scaffold prompt; its plan was captured before I approved it (`docs/scaffold-prompt.md`).
- **Three deliberate breaks, each recovered** (evidence 05–10):
  - a nested project folder;
  - a port conflict (PID found with `netstat`);
  - a 404, diagnosed by hand before asking an agent.
- **A booking form that writes to Neon PostgreSQL.** Proved twice: each row matches the on-screen reference by ID, and the two rows were created 6 min 18 s apart (evidence 11–12). Then I broke the database on purpose (evidence 13, `docs/false-success.md`).
- **Public repository.** A main README with seven sections, two merged pull requests and one deliberately deleted branch. History: 21 commits over 5 days (evidence 15).
- **Page head and information design**, all on a branch (`docs/information-design.md`, evidence 16–20):
  - titles per route, a tagline, home-only SEO, and a favicon and preview image I made in Figma;
  - a redesigned booking screen with `clamp()` sizing.

## What I decided

- **Removed the item-count field.** FreshFold counts at pickup, and a customer's guess would be a second count to argue with.
- **Replaced exact-minute times with Morning, Afternoon and Evening windows,** with none pre-selected.
- **Put the promise first in the heading,** "We count every item. Book your pickup.", so a `21ch` max-width wraps it after "item."
- **Pinned Prisma 6** and ignored an "update to 8.0.0-rc" banner.
- **Used Antigravity for planned, multi-file work and DeepSeek in OpenCode for small exact edits** (`docs/model-choices.md`).

## What I got wrong

- **I trusted agent summaries at first.**
  - "Zero assumptions" turned out to be five.
  - The scaffold "passed", but `prisma validate` failed.
  - Agent claims about titles and Open Graph merging were also wrong; I found every one only by checking the browser, the database or `git diff`.
- **I let an agent run `npm run build` beside my dev server,** which broke the site. I also left old servers running overnight and got ports 3001 and 3002.
- **I left a fake `DATABASE_URL` in my terminal,** so Prisma connected to localhost instead of Neon.
- **I first checked only `document.head` for meta tags** and wrongly thought they had disappeared: Next.js 15 streams them to browsers in the body.
- **Real defects remain,** most importantly a failed save that still answers 200 (`docs/defects.md`).

## Pull requests

- #1 Main README: https://github.com/johndavidagaba/freshfold/pull/1
- #2 Page head and information design: https://github.com/johndavidagaba/freshfold/pull/2

## Files

- **docs/:**
  - scaffold-prompt, model-choices, performance-note, false-success, readme-test, working-tree, information-design, defects, interview-answers;
  - the agent prompts: form-prompt, head-prompt, body-prompt-1.
- **evidence/:** 02–20 as named in the brief, plus extras named by what they show.
