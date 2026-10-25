# Prompts

Every prompt I gave the coding agent for Task 1, verbatim, including attempts that did not work and what I changed.

## Prompt 1: JSON to CSS variables (step 6)

Agent: Antigravity, model Claude Sonnet 4.6 (Thinking). Date: 23 Oct 2026.

```
Read tokens/tokens.json. It is the FreshFold Laundry design system, exported from Figma with the Design Tokens plugin. Do not change it.

Write a Node script, scripts/tokens-to-css.mjs, that reads tokens/tokens.json and writes styles/tokens.css. Use only Node built-ins: no packages, no package.json.

What the CSS must contain, all inside :root:

1. Colour ROLES only, as --color-<role>. Read them from color > material-theme > sys > light (for example --color-primary, --color-on-primary, --color-primary-container, --color-surface, --color-on-surface, --color-outline, --color-error).
   Plus four status roles from color > material-theme > extended:
   --color-success = extended/success/light/color-container
   --color-on-success = color/material-theme/white
   --color-warning = extended/warning/light/color-container
   --color-on-warning = color/material-theme/white

2. Do NOT output primitive palette colours (anything under color > material-theme > ref, key-colors or source). The interface must only ever use roles, so the design system stays the single source of truth. If a component needs a colour that has no role, it should fail visibly, not quietly use a raw shade.

3. Do NOT read the top-level "material-theme" group (Figma variables) or the "typography" group. They duplicate data that is already in "color" and "font". Read colours only from "color" and type only from "font", so there is one source for each.

4. Typography from font > material-theme: for each of the 15 styles (display, headline, title, body, label × large, medium, small) output
   --type-<role>-<size>-family, -size, -weight, -line-height, -letter-spacing.
   Sizes, line heights and letter spacing in px. Font family: "Atkinson Hyperlegible Next", sans-serif.

5. Shadows from effect > shadow: --shadow-soft, --shadow-medium, --shadow-hard as box-shadow values (offsetX offsetY radius spread color).

6. Colour values exactly as in the JSON, converted from 8-digit hex (#rrggbbaa) to 6-digit hex when alpha is ff, and kept as 8-digit when it is not.

7. No hand-typed hex values anywhere in the script. Every value must come from tokens.json.

Before writing any code: list the groups you will read, the groups you will skip, and the variable names you will produce, then wait for my approval.

After I approve: write the script, run it with "node scripts/tokens-to-css.mjs", show me the first 30 lines of styles/tokens.css, and tell me how many variables of each kind it produced. List every file you created and every assumption you made.
```

### What happened

1. **Antigravity, Claude Sonnet 4.6 (Thinking), 25 Oct.** It read the file in chunks, then ran `node -e` commands to list the JSON keys. Its plan was correct (131 variables, the right groups read and skipped). One problem: it planned to write the font family into the script as text, `"Atkinson Hyperlegible Next", sans-serif`. That breaks my rule that every value comes from tokens.json, because changing the font in Figma would no longer change the CSS. I replied:

   ```
   Approved, with one change: read the font family from each style's fontFamily value in tokens.json, and only add ", sans-serif" as the fallback. Do not type the family name into the script. Then go ahead.
   ```

   It created the `scripts` and `styles` folders, then stopped with "Individual quota reached" after 36 seconds. I selected GPT-OSS 120B in the model menu, but it showed a red quota warning icon too, so I did not send the prompt to it and moved to OpenCode instead.

2. **OpenCode, DeepSeek V4.1 Flash (Free), variant "high", 25 Oct.** OpenCode does not know what Antigravity did, so I resent the whole prompt with a new first paragraph and the font-family fix built into rule 4:

   ```
   A previous agent may have started this task and stopped halfway. First check whether scripts/tokens-to-css.mjs or styles/tokens.css already exist and tell me what you find.
   ```

   and rule 7 became: "No hand-typed hex values or font names in the script."

   Its plan matched Antigravity's (53 colour roles + 75 typography + 3 shadows = 131), took 50.2s, and I approved with "Approved. Go ahead." It wrote both files and ran the script in 55.9s.

### How I checked it

- Searched the script for hex colour codes (`#` followed by 6 hex digits): 0 matches.
- Ran the script and checked the output against Figma: `--color-primary: #2b4fb4`, `--color-on-primary: #ffffff`, `--color-primary-container: #dce1ff`, `--color-success: #1b6e2a`, `--color-warning: #8a5300`, Display Large 48px / 67px / -0.5px, `--shadow-soft: 0px 1px 3px 0px #2b4fb41f` (1f = 12% opacity).
- Defect found: the script checks that sizes, line heights and colours are valid, but not the font weight. If a weight were missing, the CSS would quietly contain `undefined`, which contradicts the agent's claim that missing values make the script fail.

## Prompt 2: the screen without the design system (step 7)

Agent: OpenCode, DeepSeek V4.1 Flash Free (high), 25 Oct 2026. Took about 1 minute.

```
Build one static screen for FreshFold Laundry, a laundry pickup-and-delivery service in Yaba, Lagos: the customer's Order Status screen, designed for a 360px-wide Android phone.

Content:
- Header: "FreshFold" and the order number "Order FF-1042"
- Status: "Ready for delivery", with "Delivery today, 4–6pm"
- Balance due: "₦3,500"
- Items collected (7): 2 shirts, 2 trousers, 1 bedsheet, 1 native attire (agbada), 1 towel
- Plan: "Monthly plan: 12 items left, expires 31 Oct"
- One main button: "Pay balance"

Create it as screens/order-status-plain.html with the CSS inside the file.

For this version, do NOT open or use styles/tokens.css, the tokens folder, or anything in task-01-design-system. Style it however you think looks best, using your own choices. I need this as a "before" version to compare against later.

Tell me which file you created when done.
```

What happened: it invented a green theme with gradients and a decorative circle. 48 lines of raw colour values (evidence/07-raw-value-search.txt).

## Prompt 3: the same screen with the design system (step 7)

Agent: OpenCode, DeepSeek V4.1 Flash Free (high). Took 5 min 43 s.

```
Now build the same Order Status screen again, with the same content, as screens/order-status.html. This time it must use the FreshFold design system and nothing else for styling.

Rules:
1. Link ../styles/tokens.css. Load the font "Atkinson Hyperlegible Next" from Google Fonts (weights 400, 500, 600).
2. Every colour must be var(--color-...) from tokens.css. No hex, rgb, hsl or named colours anywhere in the file, not even white or black.
3. Every piece of text must use one of the 15 type styles: font-family, font-size, font-weight, line-height and letter-spacing all from the matching --type-<role>-<size>-... variables. No raw font sizes.
4. Shadows only from --shadow-soft, --shadow-medium or --shadow-hard.
5. No gradients and no decorative shapes: the brief says calm, clean, quick to scan.
6. The "Pay balance" button uses --color-primary with --color-on-primary text. The "Ready for delivery" status uses --color-success and --color-on-success.
7. Spacing and corner radius can use px for now, because the design system has no spacing tokens yet.

When done, tell me the file you created. Do not change tokens.css or the plain version.
```

What happened: it ran its own checks (21 text elements on type styles, 4 shadows from tokens). My own search found 0 raw colour values. But the balance looked too small.

## Prompt 4: asking which type style it used (step 7.2)

```
Which typography style did you use for the balance amount "₦3,500" in screens/order-status.html? Quote the exact CSS lines for that element, including every --type- variable it uses, and tell me the font size it renders at.
```

What happened: it admitted Headline Medium (28px). My type-scale.md assigns Display Large (48px) to the balance (evidence/08-agent-typography-answer.txt).

## Prompt 5: fixing the style mapping

```
That is the wrong style. In task-01-design-system/docs/type-scale.md the "Used in FreshFold for" column says the home-screen balance uses Display Large. Read that file and fix screens/order-status.html so every text element uses the style that type-scale.md assigns to that job. List each element, the style it had, and the style it has now. Change nothing else.
```

What happened: 3 min 26 s. Item names moved to Title Medium, "Monthly plan" to Title Small, "12 items left" to Display Small, the balance to Display Large. This created a new problem: "12 items left" (36px) and ", expires 31 Oct" (13px) shared one line.

## Prompt 6: fixing the plan card

```
In screens/order-status.html, the plan card puts "12 items left" (Display Small, 36px) and ", expires 31 Oct" (Body Small, 13px) on the same line. The size jump looks awkward and the expiry date is easy to miss.

Fix: put "12 items left" on its own line, and put "Expires 31 Oct" on the line below it (capital E, no comma), using Body Medium. Keep using only design-system variables. Change nothing else, and tell me exactly which lines you changed.
```

What happened: 1 min 41 s. Changed only line 377 into two lines.

## Prompt 7: the deliberate regression (step 8)

Run on the branch break-token-referencing.

```
This is a deliberate experiment on a throwaway branch. Do exactly these two things and nothing else:

1. In screens/order-status.html, change ONLY the "Pay balance" button's background so it uses the raw hex value #2b4fb4 instead of var(--color-primary). Leave every other use of var(--color-primary) (including the FreshFold logo text) unchanged.

2. In tokens/tokens.json, change the value of color > material-theme > sys > light > primary from "#2b4fb4ff" to "#00696dff" (simulating a brand colour change made in Figma). Then run: node scripts/tokens-to-css.mjs

Do not commit. Tell me the exact lines you changed in both files.
```

What happened: 1 min 16 s. Changed line 198 of the screen and line 33 of tokens.json only. The logo turned teal; the button stayed blue (docs/regression.md).
