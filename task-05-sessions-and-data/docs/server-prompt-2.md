# Task 5 build 2 prompt: password change kills other sessions, account deletion

```
Read AGENTS.md and lib/session.ts first. Do NOT add any package. Do NOT run any prisma migrate/db command (the schema already has deletionRequestedAt and purgeAfter on User). Do NOT run npm run build.

1. app/api/account/password/route.ts (POST, logged-in only via getCurrentUser, else 401):
   - body {currentPassword, newPassword}; validate with zod .strict(): newPassword same rules as signup (trim, 12-128 chars); run the existing HIBP breach check.
   - verify currentPassword with verifyPassword; wrong -> 400 {errors:{currentPassword:["Your current password is incorrect."]}}.
   - hash newPassword, update the user, then delete EVERY session of this user except the current one. Return 200 {ok:true, otherSessionsEnded: <number deleted>}.
   - console.log "[password] changed for <userId>, ended N other sessions".

2. app/api/account/delete/route.ts (POST, logged-in only):
   - set deletionRequestedAt = now, purgeAfter = now + 30 days, delete ALL this user's sessions, clear the ff_session cookie. Return 200 {ok:true, purgeAfter}.
   - login must refuse a user whose deletionRequestedAt is set, with the SAME 401 "Email or password is incorrect." (no different status).

3. scripts/purge-deleted.mjs (plain Node with @prisma/client, run: node scripts/purge-deleted.mjs):
   - find users with purgeAfter <= now and email not already anonymised.
   - anonymise: name "Deleted user", email "deleted-<id>@invalid", phone null, passwordHash "" ; delete their VerificationCode rows. Keep Payment rows (we must keep payment records for accounting).
   - print "[purge] anonymised N users" and the ids. Running it twice must be safe: the second run prints 0.
   - accept an optional --now=ISO-date argument so I can test without waiting 30 days.

4. app/dashboard: add two small sections under the Log out button, each a client component:
   - "Change password": current password, new password, submit; show server errors under fields; on success show "Password changed. You've been logged out everywhere else." in role="status".
   - "Delete my account": a button that first shows a confirm step ("This deletes your account after 30 days. Continue?" with Confirm/Cancel buttons, no window.confirm). On success go to /account?form=login with window.location.assign.
   Use only design-system CSS variables, label every input, keep keyboard access.

List every file created or changed and every assumption.
```
