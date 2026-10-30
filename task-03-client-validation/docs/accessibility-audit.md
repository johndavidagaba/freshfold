# Accessibility audit (signup form)

Form audited: `/account?form=signup`, after validation version 2 (commit `3da1f0f`): visible but disabled submit button, caution icons on errors.

Screen reader: **Windows Narrator** (Ctrl + Windows + Enter), Chrome, moving with Tab.

## Before fixes: what Narrator said

Exactly as I wrote it down while tabbing through, Fri 30 Oct 2026. My spelling of what I heard is kept; "scan" and "scan off" are Narrator switching its scan mode.

> Capsi. T. Account. Full name. Sign up fresh fold, scan, email, edit, youaddexample.com, scan off. Sign up fresh fold, scan, phone number. Password. Password, scan off, show, button, scan, I agree to fresh fold S terms of service and privacy policy. Check, sign up fresh fold, E, A, account. New line selected. Heading level 1, create your account. Full name. Email. Autofill list. Sign up fresh fold, scan, phone number. Password, selected. Hide, button, show, hide, button. I agree to fresh fold S terms of service and privacy policy. Check, sign up fresh fold, create account.

Field by field:

| Stop | What Narrator said | What it did not say |
| --- | --- | --- |
| Full name | "Full name" | That it is required. When I left it empty, the error "Add your name so we can tag your bag." was **not read**. |
| Email | "Email, edit, you@example.com" | Required. Errors are not read. |
| Phone number | "Phone number" | Required. Errors are not read. |
| Password | "Password" | The hint "At least 12 characters" was **never read**. |
| Show button | "Show, button" / "Hide, button" | **Show what?** Not that it reveals the password, and not whether the password is currently shown. |
| Terms checkbox | "I agree to FreshFold's terms of service and privacy policy, check" | That it is **required**. |
| Create account | On the first pass Tab went from the checkbox **straight back to the page title** ("Sign up fresh fold"). The button was skipped. It was only read at the end of the second pass in reading mode as "create account", with nothing saying why it can't be used. | That the button exists and why it is unavailable. |

## Audit against the five criteria

| Field | Colour independence | Keyboard reachability | Focus visibility | Screen reader announcement | Error association |
| --- | --- | --- | --- | --- | --- |
| Full name | Pass: icon and text, not only red | Pass | Pass: blue focus ring | Partial: label read, "required" not read | **Fail**: error not linked or announced |
| Email | Pass | Pass | Pass | Partial | **Fail** |
| Phone | Pass | Pass | Pass | Partial | **Fail** |
| Password | Pass | Pass | Pass | **Fail**: hint not read | **Fail** |
| Show/Hide | n/a | Pass | Pass | **Fail**: no purpose, no state | n/a |
| Terms | n/a | Pass, and the label is clickable as well as the box | Pass | **Fail**: not read as required | **Fail**: terms message not linked |
| Create account | Partial: disabled only shown by a faded colour | **Fail**: disabled button leaves the Tab order | n/a | **Fail**: skipped, no explanation | **Fail**: the terms message relies on a mouse click on a hidden layer over the button |

## The real problems found

1. **The disabled Create account button leaves the Tab order, with no explanation.** A keyboard or screen reader user tabs past the checkbox and the form simply ends. This is the Hauwa failure from the brief.
2. **The "tick the box" message only works with a mouse.** It is triggered by a click-catcher layer over the disabled button (the agent used `pointer-events: none` on the button and an invisible wrapper). A keyboard user can never trigger it.
3. **Inline errors are not linked to their fields and are not announced.** There is no `aria-describedby`, no `aria-invalid` and no live region, so the field's error is silent.
4. **The password hint is not linked to the password field** (no `aria-describedby`), so it is never read.
5. **Required fields and the terms checkbox are not announced as required** (no `required` or `aria-required`; the form uses `noValidate`).
6. **The Show/Hide button has no accessible name for its purpose or state.** "Show, button" does not say it shows the password, or whether it is on.

## The fixes

1. **Create account** uses `aria-disabled="true"` instead of `disabled`. It stays focusable and in the Tab order, looks faded, and if activated while invalid it does not submit; it shows every error and the terms message instead. The invisible click-catcher and the `pointer-events` trick were removed, which also fixes problem 2: the message now works from the keyboard.
2. Every signup input has `aria-invalid` and `aria-describedby` pointing to its error.
3. The password field's `aria-describedby` includes the hint's id.
4. Signup errors and the terms message have `role="alert"`, so they are announced when they appear.
5. Required inputs and the terms checkbox have `aria-required="true"`.
6. The Show/Hide button is a toggle with `aria-label` "Show password" / "Hide password" and `aria-pressed`.

## After fixes: what Narrator said

Same method, Fri 30 Oct 2026. I left every field empty, tabbed to Create account and pressed Enter. As I wrote it down:

> Full name. Item has no primary action. Add your name so we can tag your bag. Capek. Email. Item has no primary action. Add your email. It's how you log in. Dear. Phone number. Item has no primary action. Add a phone number so the writer can reach you. Dear. Password. Item has no primary action. Choose a password to protect your account. E. Show password. Toggle button. Off. Show password. I agree to Freshfold S terms of service and privacy policy. Checkbox unchecked. Unchecked. Create account. Button. Disabled. Tick the box to accept the terms before creating your account.

| Stop | Before | After |
| --- | --- | --- |
| Full name | "Full name" | "Full name … **Add your name so we can tag your bag.**" |
| Email | "Email, edit, you@example.com" | "Email … **Add your email. It's how you log in.**" |
| Phone | "Phone number" | "Phone number … **Add a phone number so the rider can reach you.**" ("writer" is how I heard "rider") |
| Password | "Password" | "Password … **Choose a password to protect your account.**" |
| Show/Hide | "Show, button" | "**Show password, toggle button, off**" |
| Terms | "…terms of service and privacy policy, check" | "…terms of service and privacy policy, **checkbox, unchecked**" |
| Create account | Skipped by Tab | "**Create account, button, disabled**", then on Enter: "**Tick the box to accept the terms before creating your account.**" |

## What is still not right

- **Narrator never said "required"** for any field, even with `aria-required="true"`. Its default verbosity may not read it, or Chrome may not pass it on. I have not confirmed which, so a user still learns a field is required only from its error.
- **I did not test the password hint after the fix**, because I did not type in the password field in the second pass. It is linked in the code, but unverified with the screen reader.
- The odd words in my notes ("Capek", "Dear", "E") are Narrator announcing other things, or my mishearing. I kept them rather than guess.
