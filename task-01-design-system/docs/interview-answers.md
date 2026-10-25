# Interview answers (Task 1)

Two hundred words maximum each.

## 1. How would you structure design tokens?

In three layers. Primitives: raw values with no meaning, such as the 18 tones of each palette (primary 0–100). Roles: names that describe a job, not a colour, such as `--color-primary` (main action) or `--color-on-surface` (main text), each pointing at a primitive. Components then use only roles, never primitives. Typography and shadows follow the same idea: FreshFold has 15 named type styles and three named shadows, and components pick a style by job ("Display Large is the balance"), not by size.

The point of the layers is that a change happens in one place. If the brand colour changes, the roles that point at it follow, and every component follows the roles. My own setup only half does this: my CSS roles hold finished hex values instead of references to the palette (defects.md, defect 2), which I would change.

## 2. When is a token change breaking?

When it changes meaning or removes something that code depends on. Renaming or deleting a token breaks every component that uses it: the CSS variable becomes undefined and the browser silently falls back. Changing what a role means breaks things even if nothing errors: if `--color-surface` became dark, every `--color-on-surface` text would become unreadable.

Changing a value can also be breaking if it breaks a promise. Making `--color-primary` lighter is "just a value", but white text on it could drop below 4.5:1 and fail accessibility. That is why I record a contrast ratio for every role pair: a value change that moves a pair below its threshold is breaking.

A non-breaking change keeps every name and every pair's contrast, such as nudging the brand blue within the same lightness.

## 3. How would you support multiple brands and themes?

Keep the role names identical and swap what they point at. Components only ever use roles (`--color-primary`, `--color-on-primary`), so a second brand is a second set of role values, and dark mode is a third. Material Theme Builder already generated light, dark and contrast variants of my scheme from the same seed; the plugin export contains all six.

In CSS that means one `:root` block per theme, switched with a class or `data-theme` attribute, or `prefers-color-scheme` for dark mode. Typography could vary per brand the same way.

The condition is discipline: one typed hex value anywhere breaks it, which my deliberate regression showed (the button stayed blue when the brand turned teal). And each theme needs its own contrast check, because a pair that passes in light can fail in dark.

## 4. Can tokens guarantee accessible contrast?

No. Tokens guarantee consistency, not correctness. If a pair of tokens has good contrast, every place that uses that pair correctly inherits it. But tokens cannot stop someone putting text on the wrong background, and they say nothing about pairs nobody planned.

My own system shows both sides. `--color-on-primary` on `--color-primary` is 7.29:1, and every button that uses that pair passes. But `--color-outline-variant` on the surface is 1.62:1: fine for a decorative divider, failing if anyone uses it as the only border of an input. The token exists either way; nothing stops the misuse.

What tokens can do is make checking possible: a finite list of intended pairs, each with a measured ratio, which I record in colour-roles.md. A linter or test could then flag unapproved pairings.

## 5. How do you ensure colour contrast guidelines are met?

By measuring, not eyeballing, and by deciding the pairs up front. For FreshFold I listed every background/foreground pair the interface uses (17 of them) and calculated each ratio with the WCAG relative-luminance formula, against 4.5:1 for normal text, 3:1 for large text and 3:1 for UI boundaries. All text pairs pass AA, most pass AAA, and the one failure is documented with where it may and may not be used.

When a colour failed, I changed it rather than accepting it: a typical amber warning (#B26A00) gives 4.24:1 with white text, so I chose a darker #8A5300 (6.33:1).

Then I check the built screen, not just the tokens: search the code for raw colour values (0 found on my design-system screen), so nothing bypasses the measured pairs. And colour is never the only signal: statuses also carry words and icons.

## 6. Differences between WCAG levels A, AA and AAA

They are three conformance levels, each including the one before. A is the minimum: without it some people cannot use the page at all, for example images with no text alternative or controls unreachable by keyboard. AA is the level most laws and organisations require; for contrast it means 4.5:1 for normal text, 3:1 for large text. AAA is the strictest, 7:1 for normal text, and is not expected for whole sites because some content cannot meet every AAA rule.

In my system, white on my brand blue is 7.29:1, so buttons reach AAA. My success and warning colours reach AA (6.34:1, 6.33:1) but not AAA. I accepted that because they are status labels backed by words, and making them darker would make green and amber hard to tell apart from each other and from the blue.

## 7. Semantic HTML and accessibility

Semantic HTML means using the element that describes what something is: `<button>` for an action, `<h1>`–`<h3>` for headings, `<ul>` for lists, `<main>` for the main content. Screen readers and keyboards rely on this. A real `<button>` is focusable, works with Enter and Space, and is announced as "button" for free. A `<div>` styled to look like a button does none of that unless you rebuild it by hand.

On my Order Status screen, "Pay balance" should be a `<button>`, the item list a `<ul>` so a screen reader says "list, 5 items", and the balance should not be a heading just because it is large. That last point matters for design systems: Display Large is a visual style, not a heading level. Separating "how it looks" from "what it is" is the same separation tokens make for colour.

## 8. Design handoff to developers using Figma

Hand off the system, not the pictures. If developers only receive screens, they copy pixel values and the codebase drifts from the design. I export the styles as tokens (JSON, via the Design Tokens plugin), convert them to CSS variables with a script, and developers use only those variables.

Three lessons from doing it. First, check the export: my first one had 0 of 564 colour tokens and looked fine. Second, Figma can hold the same colour twice: my colour styles and variables disagreed after a hand edit until I fixed and re-checked them (0 mismatches across 49). Third, document intent, not just values: type-scale.md says which style is for which job, because when I didn't give the agent that mapping, it chose the wrong style for the balance.

Also useful: Dev Mode for measurements, and naming layers by role.

## 9. Why do AI-generated interfaces look generic, and what do you hand an agent to stop it?

Because without constraints the model produces the most likely interface for the request: the average of everything it has seen. Asked for a laundry app, my agent invented a green theme with gradients and a decorative circle. Polished, and indistinguishable from a thousand others; 48 lines of colour values it made up.

What stopped it was handing it the system and forbidding everything else: a tokens.css file with my roles, type styles and shadows; a rule that every colour must be a variable (my search then found 0 raw values); and a ban on gradients and decoration, because my brief says calm.

That was not enough. It still picked Headline Medium (28px) for the balance instead of Display Large (48px). Tokens limit the vocabulary; they don't say which word goes where. The fix was the mapping: type-scale.md's "used for" column, which it then followed.

## 10. Why 67px for Display Large line height, and not a step either side?

67 is 48 × 1.4 = 67.2, rounded. I use 1.4 for display and headline styles because they are one or two lines of big text.

One step tighter, 1.3, gives 62px. A single-line balance would look fine, but if it ever wraps (₦125,000 on a narrow phone, or a larger system font setting), the two lines start to collide: commas and the naira sign's strokes come close to the line above. I would lose safety on wrap to gain 5px.

One step looser, 1.5, gives 72px. It would never collide, but it adds 5px to the balance card on a screen where every pixel decides whether the Pay button is visible without scrolling. On one line it also makes the number float away from its "Balance due" label, weakening the grouping.

67 keeps the label and number together and survives a wrap.

## 11. One place in my token structure I would build differently

My CSS roles hold finished hex values (`--color-primary: #2b4fb4`) instead of pointing at palette tokens (`--color-primary: var(--palette-primary-40)`). I skipped the palette on purpose, so nobody could use raw shades, but that cut the link between a role and where it comes from.

The cost showed up in my deliberate regression: the brief asks you to break a role so it stops referencing the palette, and in my CSS there was nothing to break. Theming is also harder, because dark mode means regenerating every value instead of repointing roles.

Instead I would output the 18-tone palettes as a primitives layer and make every role a reference. The cost: 108 more variables, and the temptation that developers use `--palette-primary-40` directly. I would pay it with a lint rule that fails the build if a component file uses a `--palette-` variable.

## 12. Wrong-answer analysis

"I exported the hex values from Figma into a CSS file, so every colour comes from one place."

What is missing: the exported values are only a copy. Figma is still the real source, and nothing connects them, so the "one place" is two places that agree for now. Also missing are roles: a file of hex values named after colours tells nobody which colour is for which job, so developers pick by eye. And nothing stops anyone typing a hex value in a component.

Month four: the designer adjusts the brand blue in Figma; nobody re-exports, or someone exports and the file is missing the colours (my first export had 0 of 564 colour tokens and looked fine). Meanwhile developers have hard-coded a few colours for speed. A rebrand or dark mode then means hunting through every file, and the screen ends up with two brand colours — exactly what my regression produced when the logo turned teal and the button stayed blue.
