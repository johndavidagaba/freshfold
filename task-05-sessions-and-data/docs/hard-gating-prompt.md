# Hard gating prompt (Task 5, evidence 04), branch feature/hard-gating

```
Read AGENTS.md first. We are on branch feature/hard-gating to try HARD email gating and compare it with the soft gating on main. Do NOT add packages. Do NOT run any prisma command. Do NOT run npm run build.

1. Find the existing email verification API route from Task 4 (the one that checks the 6-digit code) and tell me its path and body.
2. app/dashboard/page.tsx (server side): after getCurrentUser, if the user's emailVerifiedAt is null, redirect('/verify-email'). Remove nothing else.
3. Create app/verify-email/page.tsx (+ a small client form component and page.module.css using only design-system variables):
   - server side: if not logged in -> redirect('/account?form=login'); if already verified -> redirect('/dashboard').
   - heading "Verify your email", text "We sent a 6-digit code to <email>. Enter it to use FreshFold.", one labelled input (inputMode="numeric", maxLength 6, autoComplete="one-time-code"), a "Verify" button, the server's error shown in role="alert", and a "Log out" button reusing the existing LogoutButton.
   - on success window.location.assign('/dashboard').
4. Server-side guard on an API too: in app/api/account/password/route.ts, if the user is unverified return 403 {error:"Verify your email first."}.
Keep keyboard and screen reader access. List every file created or changed and every assumption.
```
