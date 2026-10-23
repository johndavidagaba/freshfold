# Shadows

FreshFold Laundry. Three shadows, all built from the brand colour **#2B4FB4 (Laundry Blue)**, not black. Values in px; opacity is the alpha of #2B4FB4.

| Name | X | Y | Blur | Spread | Colour | Opacity | Used for |
| --- | --- | --- | --- | --- | --- | --- | --- |
| shadow/soft | 0 | 1 | 3 | 0 | #2B4FB4 | 12% | Order cards and plan cards at rest |
| shadow/medium | 0 | 4 | 12 | -2 | #2B4FB4 | 16% | A card that is pressed or selected, the bottom bar |
| shadow/hard | 0 | 8 | 24 | -4 | #2B4FB4 | 24% | Dialogs ("Confirm pickup?"), the payment sheet |

## How the three relate

Each step doubles the Y offset roughly and triples the blur, so the element looks further off the page: soft sits almost on the surface, hard floats above everything. X stays 0 because the light comes from straight above, which is how people hold a phone. Spread goes negative on medium and hard so the bigger blur does not make the shadow spill out wider than the card at the sides; it stays mostly underneath.

Opacity rises (12% → 16% → 24%) so the higher layers stand out more, but stays under 25% because FreshFold's brief says calm and clean. A heavy shadow would look loud.

## Why brand colour, not black

A black shadow on FreshFold's pale blue-white surface (#FAF8FF) reads as grey dirt around the card, which is the opposite of a laundry brand. A shadow tinted with #2B4FB4 reads as the card's own blue depth, so the page stays clean and every raised element quietly carries the brand.

Where it would be wrong: on a dark theme or a photo background, where a blue shadow would barely show and black (or no shadow) would be needed for depth.
