# Type scale

FreshFold Laundry. Font family: **Atkinson Hyperlegible Next** (Google Fonts, free), for every style.

## Why this font

FreshFold's brief says balances, item counts and dates must be impossible to misread on a low-cost phone, often outdoors in bright light. Atkinson Hyperlegible was designed by the Braille Institute for low-vision readers: every character is built to be told apart, so 1, l and I differ, and 0 and O differ. "₦12,500 · 7 items · 01/10" is the kind of line this app shows all day.

## Line-height rule

Line height = font size × a multiplier, rounded to the nearest whole pixel.

| Role | Multiplier | Why this one |
| --- | --- | --- |
| Display | 1.4 | One or two lines of big text (a balance). Tight enough to stay one block. |
| Headline | 1.4 | Short screen headings; same reasoning as Display. |
| Title | 1.5 | Card titles may wrap to two lines ("Wash & fold · 7 items"); needs a little more air. |
| Body | 1.6 | Paragraphs and order notes are read, not scanned; the most space helps tired eyes on small screens. |
| Label | 1.4 | Buttons and chips are one line; extra height would only make buttons taller. |

## The 15 styles

Sizes, line heights and letter spacing in px.

| Style | Weight | Size | Line height | Letter spacing | Used in FreshFold for |
| --- | --- | --- | --- | --- | --- |
| Display Large | 400 Regular | 48 | 67 (48 × 1.4 = 67.2) | -0.5 | The balance on the home screen ("₦12,500") |
| Display Medium | 400 Regular | 42 | 59 (42 × 1.4 = 58.8) | -0.25 | Item count on an order ("7 items") |
| Display Small | 400 Regular | 36 | 50 (36 × 1.4 = 50.4) | 0 | Plan items left ("12 left") |
| Headline Large | 600 SemiBold | 32 | 45 (32 × 1.4 = 44.8) | 0 | Screen titles ("Your orders") |
| Headline Medium | 600 SemiBold | 28 | 39 (28 × 1.4 = 39.2) | 0 | Order status ("Ready for delivery") |
| Headline Small | 600 SemiBold | 24 | 34 (24 × 1.4 = 33.6) | 0 | Section headings |
| Title Large | 500 Medium | 22 | 33 (22 × 1.5) | 0 | Card titles |
| Title Medium | 500 Medium | 16 | 24 (16 × 1.5) | 0.15 | List item titles |
| Title Small | 500 Medium | 14 | 21 (14 × 1.5) | 0.1 | Small card titles, table headers |
| Body Large | 400 Regular | 16 | 26 (16 × 1.6 = 25.6) | 0 | Main paragraph text |
| Body Medium | 400 Regular | 14 | 22 (14 × 1.6 = 22.4) | 0 | Order notes, item lists |
| Body Small | 400 Regular | 13 | 21 (13 × 1.6 = 20.8) | 0.2 | Dates, helper text |
| Label Large | 500 Medium | 14 | 20 (14 × 1.4 = 19.6) | 0.1 | Button text ("Schedule pickup") |
| Label Medium | 500 Medium | 13 | 18 (13 × 1.4 = 18.2) | 0.3 | Chips ("In progress") |
| Label Small | 500 Medium | 12 | 17 (12 × 1.4 = 16.8) | 0.4 | Tab bar labels, badges |

## Letter spacing

Judged visually on Display Large, not copied. Test line: "₦12,500 · 7 items · 01/10".

| Spacing | Width of the test line | Evidence |
| --- | --- | --- |
| 0 (the font's default) | 525px | `03-spacing-default.png` |
| -0.5px (chosen) | 513px | `04-spacing-chosen.png` |
| -1px (tested, rejected) | 501px | `spacing-minus-1-tested.png` |

Atkinson Hyperlegible Next is built wide-set for legibility. At 48px the gaps between the digits of the balance are large, so "₦12,500" reads as separate characters rather than one amount. Tightening by 0.5px makes the line 12px narrower (24 gaps × 0.5px) and groups the number into one figure. I also tested -1px (501px); I stopped at -0.5 because it is the smallest change that groups the number, and tightening further eats into the spacing that makes this font legible, which is the reason I chose it. Display Medium gets half the change (-0.25px) and Display Small none, because the smaller the text, the less loose the gaps look.

Where -0.5 would be wrong: in a long Display Large heading made of words rather than numbers, where the font's normal spacing reads better.

Atkinson Hyperlegible Next is already a wide-set font, so it also gets less positive spacing than Material's Roboto values elsewhere (Body Large is 0 here, not +0.5).

## Divergences from the Material 3 default

Full reasoning, including where each choice fails, goes in `divergences.md`.

| # | Material default | FreshFold | Short reason |
| --- | --- | --- | --- |
| 1 | Roboto | Atkinson Hyperlegible Next | Numbers must never be misread |
| 2 | Display Large 57px | 48px | Balance, order status and the main button must all fit on the first screen of a small phone |
| 3 | Body Small 12px, Label Small 11px | 13px, 12px | Small text on low-resolution screens in sunlight |
| 4 | Headline weight 400 | 600 | Status headings must be scannable at a glance |
