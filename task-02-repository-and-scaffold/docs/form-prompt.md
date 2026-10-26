# Form prompt (Task 2, step 6)

Sent to Antigravity (Gemini 3.8 Flash). Error handling is deliberately not mentioned, so the test in step 6 shows what the agent does by default when the database fails.

```
Read AGENTS.md first and follow it.

Task: make the "Schedule a pickup" page (app/schedule/page.tsx) a real form that saves a pickup request to the database.

1. Prisma model. Add one model, PickupRequest, to prisma/schema.prisma with:
   - id (cuid, primary key)
   - customerName (text)
   - phone (text)
   - address (text, the pickup address in Yaba)
   - pickupDate (date and time the customer wants)
   - itemCount (whole number, how many items roughly)
   - createdAt (set automatically when saved)
   No other models.

2. Migration. The database is a Neon PostgreSQL database; its URL is already in .env. Do NOT run any migration yourself. Show me the exact command you want to run and wait for me to say "approved".

3. Form. Replace the "Coming soon" text on /schedule with a form for those fields and a "Request pickup" button. When submitted, save the row with Prisma. Keep the page heading "Schedule a pickup".

4. Styling: only the design-system variables from styles/tokens.css (var(--color-...), the --type- styles, --shadow-...). No hex, rgb or named colours. No new libraries or packages.

5. Do not touch the home page, tokens.css, tokens.json or anything in task-01-design-system.

Before you change anything, tell me your plan in a short list and wait for "approved".
When finished, list every file you created or changed and every assumption you made.
```
