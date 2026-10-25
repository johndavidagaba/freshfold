# Divergences from the Material 3 defaults

Five deliberate divergences. For each: what the default was, what I chose, why, and where my choice would be the wrong one.

## 1. Font family

- **Default:** Roboto.
- **Chosen:** Atkinson Hyperlegible Next.
- **Why:** FreshFold's screens are mostly numbers people act on: a balance in naira, an item count, a date. Atkinson was designed by the Braille Institute so that easily confused characters look different: 1, l and I; 0 and O (its zero is slashed, visible in "₦3,500" and "FF-1042" on my screen). A customer misreading 7 items as 1, or ₦3,500 as ₦8,500, starts a dispute.
- **Where it is wrong:** long-form reading, such as a terms page or a help article. Its wide letters and distinctive shapes are tiring over many paragraphs, and it fits fewer words per line on a 360px screen than Roboto. It also costs an extra font download on small data bundles; Roboto is already on most Android phones.

## 2. Display Large size

- **Default:** 57px, line height 64px.
- **Chosen:** 48px, line height 67px.
- **Why:** On a 360px-wide phone, the first screen must show the order status, the balance and the Pay button without scrolling. At 57px a large balance such as ₦125,000 in a wide font nearly fills the card and pushes the button down.
- **Where it is wrong:** a desktop dashboard or a marketing page, where there is room and the big number is meant to be a headline. 48px would look timid there.

## 3. Display Large letter spacing

- **Default:** -0.25px.
- **Chosen:** -0.5px, measured: the test line "₦12,500 · 7 items · 01/10" was 525px wide at 0, 513px at -0.5px and 501px at -1px.
- **Why:** Atkinson is wide-set. At 48px the gaps between digits made the balance read as separate characters. -0.5px groups it into one amount; -1px started crowding the digits that I chose this font to keep apart.
- **Where it is wrong:** a Display Large heading made of words rather than numbers, such as "Welcome back". Words already hold together; tighter spacing just makes them harder to read.

## 4. Headline weight

- **Default:** 400 (Regular).
- **Chosen:** 600 (SemiBold) for all three headline sizes.
- **Why:** Headlines carry order status ("Ready for delivery"). The customer opens the app to answer one question in five seconds, often outdoors in bright light, so the status must win against everything else on the screen.
- **Where it is wrong:** a screen with several headlines stacked close together, such as a settings page. When every heading is heavy, none stands out, and the page looks shouty.

## 5. Small text sizes

- **Default:** Body Small 12px, Label Small 11px.
- **Chosen:** Body Small 13px, Label Small 12px.
- **Why:** Body Small carries dates and helper text ("Expires 31 Oct"), which matter to the customer. Low-cost phone screens in sunlight make 11–12px hard to read.
- **Where it is wrong:** dense layouts such as a table of past orders or a tab bar with five tabs, where the extra pixel per line forces wrapping or truncation.

## Also diverged (colour, documented in colour-roles.md)

The primary role uses my brand blue #2B4FB4 instead of the plugin's generated #03369C, and shadows are tinted with the brand blue instead of black (shadows.md).
