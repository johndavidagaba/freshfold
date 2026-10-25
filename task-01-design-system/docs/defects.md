# Defects

Real defects in my own Task 1 work, by file and line, and what each would cost in production.

## 1. Font weight is not validated

- **Where:** `scripts/tokens-to-css.mjs`, line 84: `${prefix}-weight: ${style.fontWeight};`
- **What:** The script checks that sizes, line heights, letter spacing and colours are valid and stops with an error if not. It does not check font weight. If a weight were missing from the Figma export, the CSS would contain `--type-…-weight: undefined;` and the script would still report success.
- **Cost:** Browsers ignore an invalid weight, so that style silently falls back to normal weight. A SemiBold status headline would render Regular on every screen, and nothing would flag it. The agent's own summary claimed "invalid values cause the script to fail", which is not true for this field.
- **Fix:** validate `fontWeight` as a number between 100 and 900, the same way `toPx` validates sizes.

## 2. Colour roles do not reference the palette

- **Where:** `scripts/tokens-to-css.mjs`, line 49, which writes each role as a finished hex value; output in `styles/tokens.css`, e.g. line 2 `--color-primary: #2b4fb4;`.
- **What:** The palette (primary 0–100 etc.) is deliberately not output, and roles hold resolved colours instead of `var(--palette-…)` references.
- **Cost:** Within the CSS there is no link between a role and the tone it came from. A developer cannot tell that primary and primary-container belong to the same family, and theming (dark mode, a second brand) means regenerating everything from Figma rather than repointing roles. The deliberate regression in step 8 could not be done inside tokens.css for this reason (regression.md).

## 3. Divider colour fails non-text contrast

- **Where:** `styles/tokens.css`, line 26: `--color-outline-variant: #c4c5d5;`
- **What:** 1.62:1 against the surface #FAF8FF, below the 3:1 required for meaningful UI boundaries.
- **Cost:** Fine for decorative dividers, which is how my screen uses it (between list items). If anyone uses it as the only border of an input or a tappable card, low-vision users will not see where the control is. Nothing in the system stops that use.

## 4. Hand overrides are lost on the next plugin Update

- **Where:** Figma, Material Theme Builder output; the three overrides are primary, primary-container and on-primary-container (colour-roles.md).
- **What:** I changed these by hand after the plugin generated them. Clicking Update in the plugin again regenerates all styles and silently restores the plugin's values. It nearly happened: after adding success and warning, Color match was found switched off and primary showed #4C5C92.
- **Cost:** The next export would change the button colour back to a generated blue, and the CSS would follow it with no warning. Every Update needs a manual re-check of primary.

## 5. Plan card layout (found and fixed)

- **Where:** `screens/order-status.html`, line 377 (before the fix).
- **What:** "12 items left" at 36px and ", expires 31 Oct" at 13px on one line. The expiry date, which the customer needs, was the easiest thing to miss.
- **Fix:** split onto two lines (lines 377–378). Evidence: `10b-before-plan-card-fix.png` and `10b-screen-with-system.png`.
