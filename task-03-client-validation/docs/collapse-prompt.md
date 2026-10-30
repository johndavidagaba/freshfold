# Collapse prompt (Task 3, step 1)

```
Read AGENTS.md first.

Collapse the three account pages into ONE page using conditional rendering:

1. Create app/account/page.tsx (with its page.module.css). It shows one of three forms, chosen by the URL query parameter "form":
   - /account?form=signup  -> the signup form
   - /account?form=login   -> the login form
   - /account?form=reset   -> the reset-password form
   - no parameter or an unknown value -> the login form
2. Move the three existing forms into it unchanged (same fields, text and styling).
3. Switching between forms must not reload the page: the links between forms update the query parameter on the client (Next.js Link or router.replace), and the form changes instantly.
4. Delete app/signup, app/login and app/reset-password completely.
5. Remove the canonical URL tags from the account page: SEO tags belong on the home page only (decided in Task 2). Keep a page title that names the active form if you can do it without a new package.
6. Do not run npm run build. No new packages.

When finished, list every file created, changed and deleted, and every assumption.
```
