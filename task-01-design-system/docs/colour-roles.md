# Colour roles

FreshFold Laundry. Source: Material Theme Builder (Figma plugin) export, seed `#2B4FB4`, Color match on. Light scheme only for the MVP (see the bottom of this file).

## Brand colour

| | Value |
| --- | --- |
| Hex | `#2B4FB4` (Laundry Blue) |
| Where it came from | Laundry bluing: the blue rinse powder Nigerian homes add to the last rinse to make white clothes whiter |
| HCT | Hue 273.6, Chroma 56.9, Tone 37 |

## Palettes

6 tonal palettes (primary, secondary, tertiary, error, neutral, neutral-variant) × 18 tones (0, 5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100) = 108 reference colours from one seed.

## Roles

A role is a job, not a colour. The interface only ever uses these role names. Primitive colours (`primary40`, `#2B4FB4`) never appear in components.

| Role | Points at | Hex | Its job in FreshFold |
| --- | --- | --- | --- |
| primary | brand colour (override) | `#2B4FB4` | Main buttons ("Schedule pickup", "Pay balance"), links, active tab |
| on-primary | primary 100 | `#FFFFFF` | Text and icons on primary |
| primary-container | primary 90 (override) | `#DCE1FF` | Selected order card, highlighted plan banner |
| on-primary-container | primary 10 (override) | `#00164E` | Text on primary-container |
| secondary-container | scheme | `#C5D0FE` | Filter chips (All / In progress / Ready) |
| on-secondary-container | scheme | `#4D5880` | Text on chips |
| surface | neutral 98 | `#FAF8FF` | Page background |
| on-surface | scheme | `#1A1B22` | Main text, balances, item counts |
| on-surface-variant | scheme | `#444653` | Secondary text: dates, labels, helper text |
| surface-container | scheme | `#EEEDF6` | Cards (an order, a plan) |
| outline | scheme | `#747684` | Input field borders, card borders that matter |
| outline-variant | scheme | `#C4C5D5` | Decorative dividers only |
| error | error 40 | `#BA1A1A` | "Transfer failed", "Item missing" |
| on-error | error 100 | `#FFFFFF` | Text on error |
| error-container | error 90 | `#FFDAD6` | Inline error background |
| on-error-container | error 10 | `#93000A` | Inline error text |
| success | extended (added) | `#1B6E2A` | "Payment received", "Delivered" |
| on-success | white | `#FFFFFF` | Text on success |
| warning | extended (added) | `#8A5300` | "Plan expires in 2 days", "Balance unpaid" |
| on-warning | white | `#FFFFFF` | Text on warning |
| inverse-surface | scheme | `#2F3037` | Snackbar ("Order saved") |
| inverse-on-surface | scheme | `#F1F0F9` | Snackbar text |

### Overrides of the plugin's output, and why

| Role | Plugin gave | I use | Why |
| --- | --- | --- | --- |
| primary | `#03369C` | `#2B4FB4` | Buttons must be the brand colour, not an approximation. White on `#2B4FB4` is 7.29:1, already AAA. |
| primary-container | `#2B4FB4` | `#DCE1FF` (primary 90) | Once primary is the brand blue, a container of the same colour would make cards and buttons look identical. |
| on-primary-container | `#BDCAFF` | `#00164E` (primary 10) | Matches the new light container. 13.27:1 instead of 4.53:1. |

Cost: these are manual changes after the generator. Running Update in the plugin again overwrites them, so they must be re-applied and checked after every Update. Logged in defects.md.

## Contrast ratios

Thresholds (WCAG 2.2): normal text AA 4.5:1, AAA 7:1; large text AA 3:1; non-text UI (borders, icons) 3:1. Ratios calculated with the WCAG relative-luminance formula.

| Pair (background / foreground) | Hex | Ratio | Result |
| --- | --- | --- | --- |
| primary / on-primary | `#2B4FB4` / `#FFFFFF` | 7.29:1 | AAA |
| primary-container / on-primary-container | `#DCE1FF` / `#00164E` | 13.27:1 | AAA |
| surface / on-surface | `#FAF8FF` / `#1A1B22` | 16.29:1 | AAA |
| surface / on-surface-variant | `#FAF8FF` / `#444653` | 8.87:1 | AAA |
| surface / primary (link text) | `#FAF8FF` / `#2B4FB4` | 6.92:1 | AA |
| surface-container / on-surface | `#EEEDF6` / `#1A1B22` | 14.77:1 | AAA |
| secondary-container / on-secondary-container | `#C5D0FE` / `#4D5880` | 4.57:1 | AA (just) |
| error / on-error | `#BA1A1A` / `#FFFFFF` | 6.46:1 | AA |
| error-container / on-error-container | `#FFDAD6` / `#93000A` | 7.24:1 | AAA |
| surface / error (text) | `#FAF8FF` / `#BA1A1A` | 6.13:1 | AA |
| success / on-success | `#1B6E2A` / `#FFFFFF` | 6.34:1 | AA |
| surface / success (text) | `#FAF8FF` / `#1B6E2A` | 6.02:1 | AA |
| warning / on-warning | `#8A5300` / `#FFFFFF` | 6.33:1 | AA |
| surface / warning (text) | `#FAF8FF` / `#8A5300` | 6.01:1 | AA |
| inverse-surface / inverse-on-surface | `#2F3037` / `#F1F0F9` | 11.62:1 | AAA |
| surface / outline (non-text) | `#FAF8FF` / `#747684` | 4.27:1 | Passes 3:1 |
| surface / outline-variant (non-text) | `#FAF8FF` / `#C4C5D5` | 1.62:1 | **Fails 3:1** |

### Pairs below the threshold

- **outline-variant on surface, 1.62:1.** Not fixed, documented: used only for decorative dividers between list rows, never as the only border of an input or button. Input fields use `outline` (4.27:1). If a divider is ever the only thing separating two tappable items, switch it to `outline`.
- **Rejected, not used:** the plugin's primary-container / on-primary-container (`#2B4FB4` / `#BDCAFF`, 4.53:1) passes AA but fails AAA for regular text, and is replaced by the override above.
- **Rejected, not used:** a typical amber warning `#B26A00` with white text is 4.24:1 and fails AA, which is why warning is the darker `#8A5300`.

## Dark scheme: generated, not shipped in the MVP

The plugin generated a dark scheme from the same seed (for example, primary `#B5C4FF` / on-primary `#00287C` at 7.72:1, surface `#121319` / on-surface `#E2E1EB` at 14.30:1). The MVP ships light only: most checks happen outdoors in daylight on low-cost phones, and one theme halves the contrast checking. Dark mode is a later decision.
