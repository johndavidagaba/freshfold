# Task 1: Design system

**FreshFold Laundry**, a pickup-and-delivery laundry in Yaba, Lagos. Customers check order status, items collected, balance and monthly plan on a low-cost Android phone, often outdoors. The design system had to make numbers impossible to misread.

## What I built

- **Colour:** Material 3 palette from my brand colour, Laundry Blue #2B4FB4 (the colour of laundry bluing). 6 palettes × 18 tones, 53 colour roles, success and warning added, every role pair measured for contrast (colour-roles.md).
- **Type:** Atkinson Hyperlegible Next, 15 styles, line height = size × 1.4 / 1.5 / 1.6 by role (type-scale.md).
- **Shadows:** soft, medium, hard, tinted with the brand blue (shadows.md).
- **Code:** exported from Figma as JSON, converted by `scripts/tokens-to-css.mjs` into 131 CSS variables in `styles/tokens.css`.
- **Proof:** the same Order Status screen built without and with the system (evidence 09 and 10). Raw colour values: 48 without, 0 with (evidence 07).

## What I decided

- Kept my exact brand blue for buttons (7.29:1 with white, AAA) instead of the plugin's darker #03369C.
- Five deliberate divergences from Material defaults, each with where it fails (divergences.md).
- Display Large letter spacing -0.5px, chosen by measuring: 525px at 0, 513px at -0.5, 501px at -1 (evidence 03, 04).

## What I got wrong

- Without "Color match", my brand blue appeared in no colour role at all; I only noticed by checking the hex values (evidence 01, 02).
- My first token export had 0 of 564 colour tokens and looked fine (token-export.md).
- I edited colour styles but not the matching Figma variables, so they disagreed until fixed.
- I never told the agent which type style belongs to which job, so it used Headline Medium (28px) for the balance instead of Display Large (48px) (evidence 08).
- My CSS roles don't reference the palette, which weakened the step 8 regression and would make theming harder (defects.md, regression.md).

## Tools

Figma (Material Theme Builder, Design Tokens plugin). Antigravity with Claude Sonnet 4.6 planned the script and hit its quota; OpenCode with DeepSeek V4.1 Flash wrote it and built the screens. Every prompt is in prompts.md.

## Files

- docs/: business-brief, colour-roles, type-scale, shadows, divergences, token-export, regression, prompts, defects, interview-answers
- evidence/: 01–12 as listed in the brief, plus extras named by what they show
