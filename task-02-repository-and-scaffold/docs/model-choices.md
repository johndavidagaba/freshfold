# Model choices

## Which model for which job

| Job | Tool and model | Why |
| --- | --- | --- |
| Scaffold (Next.js, TypeScript, Prisma, home page) | Antigravity, Gemini 3.8 Flash | The brief asks for Antigravity here. It reads the context files and plans before it touches anything, which is what a scaffold needs. |
| Database form, model and migration | Antigravity, Gemini 3.8 Flash | Several files at once, plus a migration that had to stop and wait for my approval. |
| Page head (titles, SEO, Open Graph) | Antigravity, Gemini 3.8 Flash | Metadata spread across layouts and pages; I wanted a plan first. |
| Schedule screen redesign | Antigravity, Gemini 3.8 Flash | A second migration plus four connected UI changes. |
| `clamp()` heading fix, button label audit, label fix, green-button experiment | OpenCode, DeepSeek V4.1 Flash 1017 (paid, my own key) | Small, exact edits to one or two files, where speed matters more than planning. |
| `/schedule` placeholder page after the 404 | No model: written by hand | Every free model had run out of quota. |

## What I observed about the difference

**Antigravity (Gemini 3.8 Flash) reads first, then plans.** Before the redesign plan it opened nine files (AGENTS.md, type-scale.md, both pages, both CSS files, actions.ts, schema.prisma and the icon). It gave me a plan, waited for "approved", and stopped before every migration (`prisma migrate dev --name init_pickup_request`, then `make_item_count_optional`), as my prompts asked.

But planning did not make it right, and it reported more than it had checked:

- **The scaffold.** It claimed "zero assumptions", and admitted five when I listed them. Its self-audit marked every rule "MET" and said `next build` passed, but `npx prisma validate` failed: Prisma 7 no longer accepts the URL in `schema.prisma`.
- **The form.** It created a top-level `lib/` folder without asking, against AGENTS.md. It also ran `npm run build` while my dev server was running, which overwrote `.next` and broke the site ("Cannot find module './548.js'").
- **The page head.** Its plan promised the home title "Laundry pickup in Yaba · FreshFold"; the browser showed it without "· FreshFold". When I asked it to fix the schedule page's preview title, it assumed Next.js merges `openGraph` field by field. It does not: `og:site_name`, `og:locale` and `og:type` disappeared.

**OpenCode with DeepSeek V4.1 Flash is fast and literal.**
- The `clamp()` edit took 19.4 s and the label fix 20.2 s. Each changed exactly what I asked and nothing else.
- When I asked "does every button use Label Large?" without allowing edits, it answered honestly in 45.3 s: all buttons *looked* like Label Large, but only one used the class.
- The whole session cost about $0.01, shown in the status bar.
- It is less careful when an instruction is loose. For the green-button experiment it set the hover to the same green as the button, because I said "hover to match", which left no visible hover at all.

**In short:** Antigravity is for work that needs a plan and an approval gate. DeepSeek in OpenCode is for small, precise edits. Neither should be trusted without checking the browser, the database or `git diff` afterwards.

## Where I chose wrong and switched

**The `clamp()` fix on day 3.** I gave it to Antigravity because the earlier schedule work had been there. It worked for 31 seconds and stopped with "Individual quota reached", having changed nothing (`git diff --stat` was empty). It was also the wrong kind of job for a planning agent: two CSS lines in one file.

I switched to OpenCode with DeepSeek, paying $5 for my own API key so a free limit could not stop me mid-task again. The same job took 19.4 s.

Earlier, on day 2, the same thing happened on the 404 fix. OpenCode's free models were all out of quota, so I wrote `app/schedule/page.tsx` by hand.
