# Defects (Task 2)

Real defects in the code and the process as of the end of Task 2, with file references. Line numbers are approximate where the file has changed since.

## In the code

1. **A failed save answers HTTP 200.**
   - Where: `app/schedule/actions.ts`, the `try/catch` around `prisma.pickupRequest.create` (about line 35).
   - What happens: the error is caught and returned as a message, so the request ends `POST /schedule 200`, the same status as a real save.
   - Effect: logs and the network tab cannot tell success from failure.
   - Evidence: `13-write-failed-logs.txt`.

2. **A failed database save wipes the form.**
   - Where: `app/schedule/page.tsx`.
   - What happens: with the database disconnected, every field was emptied and the only feedback was one small red line.
   - Not retested: this was seen before the redesign. The new "choose a window" check keeps the input, but I have not repeated the database-down test since the redesign.
   - Evidence: `13-write-failed-ui.png`.

3. **A fixed database setting still fails until a restart.**
   - Where: `lib/prisma.ts` keeps one Prisma client in memory.
   - What happens: after `DATABASE_URL` was restored, the server logged "Reload env: .env", but saves kept failing until a full restart.

4. **Canonical and preview URLs point to localhost.**
   - Where: `app/layout.tsx` sets `metadataBase` to `http://localhost:3000`.
   - Effect: a link shared today would preview with a localhost image URL. This must change when the app is deployed.

5. **Field labels use the button text style.**
   - Where: `app/schedule/page.tsx`, lines 84–139, give the five field labels `type-label-large`.
   - Why it's a defect: `type-scale.md` assigns Label Large to button text and names no style for field labels. The styling works, but my type scale does not say what it should be.

6. **The pickup time zone is fixed in code.**
   - Where: `app/schedule/actions.ts` builds the window start as `+01:00`.
   - Why it's acceptable for now: Lagos has no daylight saving.
   - Effect if FreshFold expands: the time would be wrong for any customer outside West Africa Time.

7. **`lib/` is a top-level folder that AGENTS.md does not list.** The agent created it without asking; the folder map was never updated.

8. **No automated tests.** Every check in this task is manual and recorded in `evidence/`.

## In the process (how the code was made)

9. **The agent ran `npm run build` while my dev server was running.**
    - What happened: both write to `.next`, so the running site broke with "Cannot find module './548.js'".
    - Fix: stop the server, delete `.next`, restart.
    - Prevention: every later prompt says "Do not run npm run build".

10. **Leftover servers from the day before.**
    - What happened: yesterday's dev server was still holding port 3000, so `npm run dev` silently moved to 3001, then 3002. Three servers were sharing one `.next` folder.
    - Fix: `Stop-Process -Name node -Force`, then check the port is free.

11. **A leftover terminal variable pointed Prisma at the wrong database.**
    - What happened: a fake `DATABASE_URL` set in the terminal for `prisma validate` overrode `.env`, so Prisma tried `localhost:5432`.
    - Fix: `Remove-Item Env:DATABASE_URL`.

## Fixed during Task 2

- **The home "Schedule pickup" button went nowhere.** It now links to `/schedule` (PR #2).
- **The home title had no brand name, and the schedule page lost three Open Graph tags.** Both were found by checking the browser and fixed (PR #2).
- **Some early evidence logs were saved as UTF-16, so GitHub showed them as binary.** `Tee-Object` in PowerShell wrote `03`, `05`, `06`, `07` and `08` that way. They were re-saved as UTF-8 text; later logs use `Out-File -Encoding utf8`.
