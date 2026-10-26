# Scaffold prompt

## First draft (mine, written before any tightening)

I answered seven questions in my own words, as if briefing a new worker on their first day. This is exactly what I wrote, in order:

```
read my design files in task 1 folder
I MUST APPROVE ANYTHING BEFORE THE ANGENT CONTINUE
THEY WIIL STOP AND ASK ME WHICH ONE IS RIGT
THEY SHOULD ASK ME FIRST SINCE I WAS THE ONE BUILDING THE APP
THY SHOULD USE THE COLOURS FOM MY tokens.css file
one simple home screen first
i will tell him to list every file you created and every assumption you made
the worker should  go back through my rules and check each one
```

(The fourth line was my first answer about styling. I changed my mind after realising the colours were already decided in Task 1, so the fifth line replaced it.)

## Final version (tightened with Claude's help)

```
You are setting up the FreshFold Laundry project. Do not write any code yet.

1. Read first. Read every one of these before anything else:
   - AGENTS.md
   - task-01-design-system/docs/business-brief.md
   - task-01-design-system/docs/colour-roles.md
   - task-01-design-system/docs/type-scale.md
   - task-01-design-system/docs/shadows.md
   - styles/tokens.css
   Do not change any of them.

2. Summarise, then wait. Tell me in your own words: what FreshFold is, the stack, the design rules, and exactly what you plan to create. Then stop and wait for my approval. Do not create or change any file until I say "approved".

3. These files are the only source of truth. Do not bring in anything they do not mention: no other libraries, no CSS framework, no UI kit, no colours or fonts of your own.

4. If two files disagree, or something you need is missing, stop and ask me. Do not pick one and do not guess.

5. Styling: use only the design-system variables in styles/tokens.css. Every colour is var(--color-...), every text uses one of the 15 --type- styles (type-scale.md says which style is for which job), shadows only from --shadow-soft/medium/hard. No hex, rgb, hsl or named colours anywhere.

6. Scope: build ONLY the project setup and one minimal home screen. That means Next.js with TypeScript in the repository root (not in a new subfolder), Prisma initialised but no database models and no migrations, a .env.example with variable names only, and a home page with the FreshFold name, a one-line description and one button that goes nowhere yet. Do not build orders, login, payments, staff screens or anything else from the product.

7. When finished, list every file you created and every assumption you made. If you made no assumptions, say why you are sure.

8. Before handing back, audit your response against points 1 to 7 above, one by one, and tell me honestly which you met and any you did not.
```

## What changed between the drafts, and why

My draft had the right instincts but would not have worked as a prompt. "My design files in task 1 folder" is vague, so the final version names every file the agent must read, including AGENTS.md, which my draft forgot entirely. "One simple home screen first" said what to build but not what not to build, which is the part the brief warns people drop: without a list of things to leave out, an agent will start on orders and login in the same pass. I added what "setup" means in practice (Next.js in the repository root, Prisma with no migrations, no secrets) because the nested-folder problem and unwanted migrations are real risks. My draft also missed one of the eight required instructions: that the files are the only source of truth. My fourth line, "they should ask me first", came from the wrong idea that styling was still undecided; the final version says to use what Task 1 already decided. The approval, disagreement, file list and self-audit rules stayed almost as I wrote them.
