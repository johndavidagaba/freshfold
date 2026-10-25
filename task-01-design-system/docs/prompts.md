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
