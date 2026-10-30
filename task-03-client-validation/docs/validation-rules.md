# Validation rules

Every rule is derived from what FreshFold does with the field. Each one records what goes wrong without it, and who it wrongly blocks, because every rule blocks someone.

These rules run in the browser. They are a convenience for honest users, not a defence. See `client-side-is-not-security.md`.

## Category 1: empty fields

**Rule:** when a user enters a required field and leaves it empty, an inline error appears under that field at once, not on submit. Each message says why FreshFold needs the field:

| Field | Message |
| --- | --- |
| Full name | "Add your name so we can tag your bag." |
| Email | "Add your email; it's how you log in." |
| Phone number | "Add a phone number so the rider can reach you." |
| Password | "Choose a password to protect your account." |

- **Without it:** the user finds out only after pressing the button, then has to hunt for which field is wrong, often below the fold on a small phone.
- **Who it wrongly blocks:** someone who tabs through the form to see all the fields before filling any. They get a row of errors for fields they meant to come back to. I accept this because the errors disappear as soon as they type, but it is noise for a careful reader.

## Category 2: length and structure

### Full name

**Rule:**
- trimmed, at least 2 letters and at most 60 characters;
- only letters (including accented letters such as Ọ, é and ñ), spaces, hyphens, apostrophes and full stops;
- no digits.

**Derived from:** the name is printed on the pickup tag and read out by the rider at the gate. It has to be a name a person can say and recognise, and fit on a tag. Sixty characters fits two lines of a tag.

- **Without it:** bots and form-filling agents put "a", "x1" or "test123" in the field, and the tag becomes useless. That is exactly the "you took 7, returned 6" dispute the business exists to settle.
- **Who it wrongly blocks:**
  - People with names longer than 60 characters, which is common with Nigerian compound names plus titles ("Chief Oluwaseun Adebayo-Ogunleye Babatunde…"). They must shorten their name.
  - Anyone whose legal name contains a digit or a symbol outside the list.
- **What I chose not to do:** I did not require two words, which the class rule did. FreshFold's rider needs a name to call out, and many people are known by one name. A two-word rule would block them to stop bots, and phone verification (Task 4) is a better bot filter for this business. The cost: a bot can still write "Test User". I accept that.

### Phone number

**Rule:** a Nigerian mobile number.
- After removing spaces and dashes: 11 digits starting `070`, `080`, `081`, `090` or `091`.
- Or `+234` followed by 10 digits that don't start with 0.
- Stored as the text the user typed, normalised, **never converted to a number**.

**Derived from:** the rider calls this number from the gate. If it can't ring, the pickup fails.

- **Without it:** typos (10 digits, 12 digits) only show up when a rider is standing outside unable to reach anyone.
- **Who it wrongly blocks:**
  - Visitors and expatriates with foreign numbers.
  - Customers who only have a landline.
  - Any new Nigerian prefix introduced after this list was written; the list has to be maintained.

### Password

**Rule:**
- at least 12 characters and at most 128;
- not made only of spaces;
- no rules about capitals, digits or symbols.
Full reasoning in step 7.

- **Without it:** short passwords are guessed quickly once the database leaks or the login has no rate limit (Task 4).
- **Who it wrongly blocks:** people who reuse a short password everywhere, and people who find long passwords hard to type on a small phone keyboard. The show-password toggle reduces the second cost.

## Category 3: format in real time

### Email (signup): real time

**Rule:** something, then `@`, then a domain with a dot, for example `name@site.com`. No spaces. Trimmed. At most 254 characters. On signup the check runs as the user types, once they have typed an `@` or left the field.

- **Why real time here:** signup is the first time FreshFold collects the address. A mistake here means reset links and receipts go nowhere, forever. Some friction is fair, like a bank checking your form when you open an account.
- **Without it:** typos like `name@gmailcom`, or a missing `@`, become accounts that can never reset a password.
- **Who it wrongly blocks:** valid but unusual addresses, such as a domain with no dot (`user@localhost`, used inside companies) or some quoted forms. Real customers almost never have these.

### Email (login and reset): on submit only

**Rule:** the same format, checked only when the user presses the button.

- **Why not real time:** logging in is something people do every time. A red error appearing while they are halfway through typing their own address is just irritating. They know what they are typing.
- **Who it wrongly blocks:** the same unusual addresses as signup.

### Why we don't check whether an email exists

Checking that a mailbox exists proves nothing: it does not show that this person owns it. The only proof is sending a code they must read back (Task 4). Many mail servers also refuse to answer such checks or say "yes" to everything, so a "real" result would be unreliable even when it was possible.

## Terms acceptance

**Rule:** the box must be ticked to create an account.

- **Without it:** FreshFold would be collecting names, phone numbers and later payments with no record that the person agreed to how they are used.
- **Who it wrongly blocks:** someone who disagrees with the terms, which is the point. It also blocks someone using a screen reader if the checkbox and its message are not announced properly, which is checked in the accessibility audit.

## Step 4: the field where the obvious input type is wrong (phone)

The obvious choice for a phone number is `<input type="number">`. I tested it by changing the phone field to `type="number"` temporarily (evidence 09).
- Typing `08012345678` looked fine.
- One press of the Up arrow turned it into **`8012345679`**: the leading zero disappeared **and** the last digit changed, so it became someone else's number. Spinner arrows appeared on a field where "next number up" means nothing.
- A brushed key or a scroll of the mouse wheel would give the rider a stranger's number.

So the phone field is `<input type="tel" inputMode="numeric">`: the phone shows a number keypad, but the value stays text (evidence 10). Unlike the class's member number, I do **not** convert it with `Number()`, because that would delete the leading zero too. A phone number is an identifier made of digits, not an amount.

**Where `type="number"` is right.** A number input is correct when the value really is a quantity you might nudge up or down and where leading zeros mean nothing: a count of bags, a quantity of shirts, or a tip amount. There the spinner and arrow keys are a feature, not an accident.

## Step 7: password and the button

**Minimum length: 12 characters, no complexity rules.**
- Length adds far more guessing difficulty than forcing a capital or a symbol, and composition rules push people to `Password1!`.
- Twelve is above the common 8-character floor, while still typeable on a small phone keyboard.
- NIST's current guidance (SP 800-63B) asks for 15 when a password is the only factor. I chose 12 knowingly, as a usability compromise, and FreshFold will add email verification (Task 4).
- The hint "At least 12 characters" appears only once the user starts typing in the field.

**A show/hide toggle instead of a confirm field.**
- I chose the toggle: one field to fill instead of two, and the user can *see* their typo instead of being told two hidden fields don't match. On a small phone that is faster and less frustrating.
- A confirm field would be better in a stricter industry, such as banking or health. There the risk is someone looking over the user's shoulder in a public place, and a visibility toggle invites people to show their password on screen. A confirm field catches typos without ever displaying it.

**The button: hidden first, then visible and disabled.**
- Version 1 hid "Create account" completely until the form was valid (evidence 13). It looked tidy.
- Version 2 shows it all the time, faded and disabled until the form is valid (evidence 14).
- The second is better because users expect to see where the form ends and what will happen. A missing button looks like a broken page, and gives no hint that something is still wrong.

**Accessibility fix to the disabled button.** The HTML `disabled` attribute took the button out of the Tab order, so Narrator skipped it entirely (see the accessibility audit). The final version uses `aria-disabled="true"`: it stays focusable, Narrator reads "Create account, button, disabled", and pressing it shows what is missing, including "Tick the box to accept the terms before creating your account."
