# The deliberate regression (Task 1, step 8)

On the branch `break-token-referencing` I changed the "Pay balance" button's background from `var(--color-primary)` to the typed value `#2b4fb4` (screens/order-status.html, line 198). Then I changed the brand colour at the source: `color > material-theme > sys > light > primary` in tokens/tokens.json, from `#2b4fb4ff` to teal `#00696dff`, and rebuilt the CSS with `node scripts/tokens-to-css.mjs`.

Result (`11-broken-referencing.png`, `11c-broken-referencing-button.png`): the FreshFold logo, which still uses `var(--color-primary)`, turned teal. The Pay balance button, the most important element on the screen, stayed the old blue.

## Why this is the whole argument for token referencing

When every element points at a token, one change at the source moves the whole interface together, so a rebrand is one edit instead of a hunt through every file. A single typed value silently opts out: nothing errors, nothing warns, and the screen now shows two brand colours, with the payment button the one left behind. Nobody would spot it in code review, because `#2b4fb4` looks like the right colour on the day it is typed; it only becomes wrong later, which is exactly why raw values must be banned rather than checked by eye.

## An honest note on my setup

The brief describes breaking a colour role inside the token file so it no longer points at the palette. My generated `tokens.css` stores each role as a finished hex value, not as a reference to a palette variable, so that break cannot happen inside it. I made the break in the screen instead, where a component should point at a role. The lesson is the same, but it shows a gap: inside tokens.css, the roles do not reference the palette, so this layer is not protected by referencing.

The branch was deleted without merging; see `12-git-log-branch-unmerged.txt`.
