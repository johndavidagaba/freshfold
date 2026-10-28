# Body prompt 1 (Task 2, step 10, information design)

Sent to Antigravity on branch feature/head-and-information-design. The screen is /schedule.
The heading max-width and the clamp() are deliberately left out of this prompt, so the "bad" wrap and the broken large text can be captured first.

```
Read AGENTS.md and task-01-design-system/docs/type-scale.md first.

Task: redesign the /schedule screen (app/schedule/page.tsx and page.module.css) with these changes, and nothing else.

1. Remove the "Rough Item Count" field from the form. FreshFold staff count every item at pickup; asking the customer for a number creates a second count that can disagree with ours. In prisma/schema.prisma make itemCount optional (Int?). Do NOT run the migration yourself: show me the exact command and wait for "approved". Update actions.ts so it no longer reads itemCount.

2. Replace the date-and-time picker with: a date field, plus a choice of three pickup windows shown as three buttons: "Morning (8–12)", "Afternoon (12–4)", "Evening (4–7)". Save pickupDate as the chosen date at the window's start time (8:00, 12:00 or 16:00, Lagos time). Customers should not have to choose an exact minute we cannot promise.

3. Add a simple header at the top of the page: the FreshFold logo (the image app/icon.png, 32px, with alt text "FreshFold home") followed by the word "FreshFold". The whole logo links to "/".

4. Change the page heading to "Book a pickup. We count every item." using the Headline Large style. Do NOT give the heading a max-width yet.

5. Buttons (the three window buttons and "Request pickup"): size them with padding in rem, not fixed width or height. Use padding 0.75rem 1.5rem and corner radius 0.75rem. Every button's text uses the Label Large style from type-scale.md.

6. Every clickable element (logo link, window buttons, Request pickup) gets cursor: pointer and a visible hover state using only design-system colour variables.

Also on the home page (app/page.tsx): make the "Schedule pickup" button a link to /schedule, with the same button rules as point 5 and 6.

Rules:
- Only design-system variables from styles/tokens.css. No hex, rgb or named colours. No new packages, no new folders.
- Do NOT run npm run build or anything that writes to .next.
- Tell me your plan in a short list first and wait for "approved".
- When finished, list every file you changed and every assumption you made.
```
