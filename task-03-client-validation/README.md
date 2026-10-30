# Task 3: The form, attacked from both sides

**FreshFold Laundry.** The customer account forms (signup, login, password reset), built to collect correct data, to work with a screen reader, and then attacked through the form and around it.

## What I built

- **One account page.** `/account?form=signup|login|reset` replaced three separate pages: 5 pages became 3 (evidence 01–03). Switching forms makes no server request; I checked the log, which showed nothing new after three switches (evidence 04, `docs/spa-rationale.md`).
- **Fields questioned.** Every signup field was asked: why it's needed, what FreshFold does with it, and what happens if it's wrong. Pickup address was removed (asked per booking instead), confirm-password was replaced by a show/hide toggle, and terms acceptance was added (`docs/field-justification.md`, `docs/terms-note.md`).
- **Four validation categories,** with rules derived from the business, each with the users it wrongly blocks (`docs/validation-rules.md`, evidence 05–08):
  - empty fields, with errors saying why FreshFold needs the field;
  - a name rule sized for the pickup tag;
  - a Nigerian mobile number rule;
  - email checked in real time on signup, but only on submit for login.
- **Phone as a text input.** A number input turned `08012345678` into `8012345679` with one arrow press (evidence 09–10).
- **No hints that leak shape** on login and reset (`docs/enumeration.md`).
- **Accessibility audit with Windows Narrator,** before and after: six problems found, fixed and re-tested (`docs/accessibility-audit.md`).
- **The attack.** Through the form, "Test User", `a@b.co` and a 12-letter password of one repeated letter got through (evidence 15). Around the form, one curl request got **201 Created** with every rule broken (evidence 16, `docs/client-side-is-not-security.md`).
- **Rollback by commit ID** with `git revert 037a3d3` (evidence 17, `docs/rollback.md`).

## What I decided

- **No two-word name rule.** It would block people known by one name; phone verification in Task 4 is the better bot filter for this business.
- **Password: 12 characters minimum, no composition rules,** with a show/hide toggle. I knowingly chose fewer than NIST's 15.
- **Submit button visible and `aria-disabled`, not hidden and not `disabled`.** It stays in the Tab order and explains what is missing.
- **Back-button cost accepted.** I switch forms with `history.replaceState` rather than the Next.js router, so Back no longer steps between forms.

## What I got wrong

- **I trusted the agent's word three times:**
  - "switching does not reload": every click still hit the server;
  - "phone remains type=number": the file said `tel`;
  - its first disabled button: keyboard users could never reach it.
- **My first curl crashed the server with 500** because PowerShell mangled the JSON, which exposed a missing 400 path.
- **I let Chrome autofill put my real email in a screenshot,** and had to crop it before committing to a public repo.
- **Real gaps remain:** the endpoint validates nothing, the terms pages don't exist, and Narrator still never says "required" (`docs/defects.md`).

## Files

- **docs/:**
  - spa-rationale, field-justification, validation-rules, terms-note, enumeration, accessibility-audit, client-side-is-not-security, rollback, defects, interview-answers;
  - the prompts: collapse, terms, validation.
- **evidence/:** 01–10 and 13–17 as named in the brief, plus extras named by what they show. The optional audio and video (11, 12, 18) were not recorded.
