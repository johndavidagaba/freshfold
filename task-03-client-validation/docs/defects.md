# Defects (Task 3)

1. **The signup endpoint accepts anything.**
   - Where: `app/api/signup/route.ts` returns `201 Created` with no validation.
   - What got through: a one-letter name, an email with no `@`, a 3-digit phone, a password of spaces, and `terms: false`.
   - Evidence 16.

2. **The signup endpoint echoes the password back** in its JSON response. A response should never contain a password.

3. **Malformed JSON crashes the endpoint with 500.**
   - Where: `app/api/signup/route.ts` does not catch a JSON parse error.
   - Effect: it crashes instead of answering 400 (evidence 16, attempt 1).

4. **Shape rules let well-formed fakes through.**
   - What passed: "Test User", `a@b.co`, `0801 234 5678` and `aaaaaaaaaaaa`.
   - Why: nothing proves the email or phone belongs to the person (evidence 15).

5. **The terms and privacy links go to pages that don't exist.**
   - Where: `/terms` and `/privacy`.
   - Effect: a customer can tick "I agree" without being able to read what they agree to (`terms-note.md`).

6. **Narrator never announces "required"**, even with `aria-required="true"` on every required field (`accessibility-audit.md`).

7. **The password hint has not been verified with the screen reader after the fix.** It is linked with `aria-describedby` in `app/account/page.tsx`, but untested.

8. **The browser Back button does not switch forms.**
   - Where: `app/account/page.tsx` uses `history.replaceState`.
   - Effect: Back leaves the account page instead of returning to the previous form.

9. **Switching forms clears what was typed.** The agent's implementation unmounts the previous form, so an email typed into login is lost when moving to reset.

10. **Login and reset errors are not announced.** `role="alert"` was added to signup errors only.

11. **The password minimum (12) is below NIST's 15** for password-only accounts. This was a deliberate trade-off (`validation-rules.md`), recorded here so it is not forgotten.

12. **The agent described its memory, not the file.** It reported the phone input "remains type=number" after I had restored it; the file said `type="tel"`. This is a process defect: agent summaries of file state must be checked.
