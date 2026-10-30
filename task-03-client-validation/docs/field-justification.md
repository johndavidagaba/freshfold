# Field justification (signup)

For every field the agent put on the signup form, three questions:
1. Why is it needed?
2. What does FreshFold do with it?
3. What happens if the user gets it wrong?

A field that fails all three comes out.

| Field | Why it is needed | What FreshFold does with it | If it is wrong | Decision |
| --- | --- | --- | --- | --- |
| Full name | Every bag collected is recorded against a person. A rider has to know who they are collecting from, and a customer has to recognise their own order. | Printed on the pickup tag and the item list; used by the rider at the door and by staff when a customer calls about a missing item. | Items get tagged to the wrong name, and "you took 7 and returned 6" becomes impossible to settle. | **Keep** |
| Email | The account needs one identifier and a way to prove ownership. | Login identifier; where the password reset link and receipts go. | The customer cannot log in or reset their password, and receipts go to a stranger. | **Keep** |
| Phone number | Lagos addresses are hard to find and riders call from the gate. | The rider calls on arrival; order updates by phone. | A missed pickup: the rider waits, then leaves. | **Keep** |
| Pickup address | Needed for a pickup, but not to create an account. | Already asked on every booking at `/schedule`, because customers use different addresses (home on Saturday, office on Tuesday). | At signup, a stale default that silently sends a rider to the wrong place on a later booking. | **Remove** from signup: it fails "why now", and the business already collects it at the right moment. |
| Password | Protects the order history, balance and personal details. | Checked at login. | The customer is locked out, or picks something weak. | **Keep** (rules in step 7) |
| Confirm password | Catches a typo in a hidden password. | Nothing after signup. | A typo means a forgotten password on day one. | **Replace** with a show/hide toggle (reasoning in step 7) |

## Added

**Terms and privacy acceptance (required).** FreshFold collects names, phone numbers and addresses and will take payment. The wording source is recorded in `terms-note.md`.

## Removed decoration

- **The subtitles promise features that do not exist.** "One account for pickups, balances and your monthly plan" and "Log in to see your orders and how much of your monthly plan is left": there are no balances, plans or order history yet. That is the wording equivalent of the class's logo that did nothing when clicked: it looks like information, but nothing behind it works. I removed both. The reset form keeps its one instruction line, because it tells the user what to type.
- **The divider line above the links between forms.** It separates nothing that the spacing does not already separate.
