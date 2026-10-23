# Token export (Task 1, step 5)

Exported from Figma with the **Design Tokens** plugin (Lukas Oppermann), 23 Oct 2026.

## The one-line diff

**`05-tokens-incomplete.json` has no `color` group and no Figma-variables (`material-theme`) group, so all 564 colour tokens are missing (507 colour styles + 57 variables); I noticed because searching it for my brand hex `2b4fb4` found only 3 matches, all inside the shadow tokens, not one colour token.**

## The two files

| | 05-tokens-incomplete.json | 06-tokens-complete.json |
| --- | --- | --- |
| Export settings | Colors and Figma Variables unticked | Everything ticked |
| Top-level groups | font, effect, typography | color, font, effect, material-theme, typography |
| Lines | 1,108 | 8,121 |
| Colour tokens | 0 | 564 (507 styles + 57 variables) |
| Matches for `2b4fb4` | 3 (only in shadow colours) | 10 |

The incomplete file looks healthy at a glance: valid JSON, all 15 text styles and all 3 shadows. That is why the mistake is easy to miss. An agent handed this file would build the interface with fonts and shadows from my system and colours from its own defaults.

## A second problem the complete export revealed

The complete file contains my colours twice, and the two copies disagree:

| Token | Colour styles (`color/material-theme/sys/light`) | Figma variables (`material-theme/schemes`) |
| --- | --- | --- |
| primary | `#2b4fb4` (my override) | `#03369c` (plugin original) |
| primary container | `#dce1ff` (my override) | `#2b4fb4` (plugin original) |
| on primary container | `#00164e` (my override) | `#bdcaff` (plugin original) |

I changed the three colour styles by hand but not the matching Figma variables. One design system with two sources of truth that disagree is exactly the failure tokens are meant to prevent: whichever group the CSS script reads decides what colour the buttons are.

Fix: I updated the variables in Figma to match the styles and exported again. On the first try I typed the brand blue into **On Primary** instead of **Primary**, which would have made button text blue on blue; I caught it in the Variables panel and corrected it. The final `06-tokens-complete.json` was then checked automatically: all 49 light-scheme colours that exist in both groups now match, with 0 mismatches.

Lesson: in Figma, a colour style and a variable with the same name are two separate things. Editing one does not edit the other. After any hand change, both must be checked.
