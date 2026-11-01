# Task 5 defects

| # | Defect | How found | Status |
| --- | --- | --- | --- |
| 1 | **Logout didn't wait for the server.** The page went to login before `POST /api/logout` finished (server log order). | Test 09: server log 09e | **Fixed** (10): awaits the response, shows an error on failure |
| 2 | **A banned user with the correct password gets 403,** a wrong password gets 401. The status code tells an attacker the password was right. | Agent's own note, build 1 | Open |
| 3 | **The admin "403" page returns HTTP 200.** The page says 403 but the response code doesn't. Monitoring and crawlers see success. | Agent's own note, build 1; test 16 | Open |
| 4 | **Orphan session rows.** Two logins five seconds apart left two valid rows for Kemi in one browser (probably a double-click). | Test 06a, Prisma Studio | Open: needs a cleanup job and a disabled button during login |
| 5 | **Rate limiter crashes login with 500 when Neon is asleep** (P1001 in `lib/rateLimit.ts`), from Task 4, seen again. | Server log 10c | Open |
| 6 | **The agent changed the database schema** (phone became optional) in a task I'd told it not to migrate. It reported this honestly and didn't migrate, but it changed a product rule at database level without asking. | Build 2 report | Accepted: needed for anonymising; signup still requires a phone |
| 7 | **Chrome's Request conditions** wouldn't block the logout fetch, so the "bad network" test couldn't be run as planned. | Tests 09b–09d | Worked around: proved the bug from the server log instead |
| 8 | **Purge job isn't scheduled.** Deletion only works if someone runs the script. | Design review | Open: must be scheduled before launch |
| 9 | **Hard gating not built** (evidence 04 missing). | — | Not done: out of time |
| 10 | **PickupRequest isn't linked to User,** so account deletion can't find a customer's pickups. | Retention matrix | Open |
