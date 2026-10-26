# False success

## What I did

The schedule form saves a pickup request to a Neon PostgreSQL database through a Next.js Server Action (`app/schedule/actions.ts`). I submitted it twice with the database working, then broke the connection by renaming `DATABASE_URL` to `DATABASE_URL_OFF` in `.env`, restarted the server, and submitted a third request ("David Test Three", 5 items).

## What the user saw

A short red line above the form: "Unable to save pickup request. Please try again." Every field was emptied. Nothing else changed: same heading, same blue button, no reference ID.

## What actually happened

Prisma could not start: `PrismaClientInitializationError: Environment variable not found: DATABASE_URL`. Nothing was saved. Prisma Studio still showed 2 rows. The server log then ended with `POST /schedule 200 in 797ms`, the same status as the two real saves (`200 in 1763ms`, `200 in 1564ms`). There was no 201 in any of the three: a Server Action answers 200 whenever its function returns, and this one catches the error and returns an error message, so the request "succeeds" even when the save fails.

## How a reviewer in a demo would be fooled

The interface itself did not lie this time; it said the save failed. But a reviewer could still be fooled in three ways:

1. **By the status code.** Anyone checking the network tab or the logs sees 200 for a saved request and 200 for a lost one. "The request returned 200" proves nothing here.
2. **By the cleared form.** After a failed submit, the form empties, which is exactly what a successful form often does. The red line is small, one line, at the top, and easy to miss on a phone or a projected screen. A presenter clicking quickly would see "the form cleared" and move on.
3. **By the green screen.** In a working demo, "Pickup scheduled!" looks the same whether the presenter checked the database or not. The only real proof was opening Prisma Studio and finding the row with the same ID as the reference on screen, and a demo rarely does that.

For a real customer the cost is concrete: they typed name, phone, address, date and item count, and lost all of it with a vague "try again". If they miss the red line, they think FreshFold is coming to collect their laundry, and nobody comes.

## Recovery

Putting `DATABASE_URL` back in `.env` was not enough. The server logged "Reload env: .env", but the next submit failed the same way: the Prisma client is created once and kept in memory, so it kept its broken start. Only a full restart of the dev server fixed it. Then "David Test Four" saved normally (reference cmvpmzvn50000v8yk0cibfbje). In production that means a fixed setting can look fixed while every save keeps failing until someone restarts the app.

## What I would change

- Keep the customer's input when saving fails, and show the failure as a clear block in the error colour (the success state already uses a full block).
- Return a real failure to the caller (or log it as one), so a failed save cannot look like a 200.
- Treat "the row exists in the database with the shown ID" as the only proof of a save, in demos and in tests.
