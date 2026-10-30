# Validation prompt (Task 3, steps 3, 4 and 7, first version)

```
Read AGENTS.md and task-03-client-validation/docs/validation-rules.md first. Implement exactly the rules in validation-rules.md, in app/account/page.tsx and page.module.css only. No new packages, no validation library.

Signup form:
1. Empty fields: when a required field is left empty after the user has entered it (on blur), show the inline message from validation-rules.md under that field. Remove the message as soon as the field becomes valid.
2. Full name, phone and password rules exactly as written. Trim name and email before checking.
3. Phone: a text input (type="tel", inputMode="numeric", autoComplete="tel"), NOT type="number". Keep the value as a string.
4. Email on signup: check format in real time, as the user types, once the value contains "@" or after blur.
5. Remove the Confirm Password field. Add a "Show" / "Hide" toggle button next to the password field that switches type between password and text.
6. Password hint "At least 12 characters" appears only once the user starts typing in the password field, not before.
7. Submit button, FIRST VERSION: hide the Create account button completely until every field is valid and the terms box is ticked.

Login form:
8. Email format and empty password are checked ONLY when the Log in button is pressed, never while typing.

Reset form:
9. Email format checked on submit.

Errors: red text under the field using var(--color-error). Do not add icons or ARIA yet; that is a later step.
Submitting a valid form does nothing yet except console.log("valid").

Design-system variables only. Do not run npm run build. List every change and assumption.
```
