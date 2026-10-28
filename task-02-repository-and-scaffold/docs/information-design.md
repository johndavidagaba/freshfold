# Information design

All work was done on branch `feature/head-and-information-design` and merged in pull request #2 (https://github.com/johndavidagaba/freshfold/pull/2).

## The head

| Item | Before | After | How I verified it |
| --- | --- | --- | --- |
| Title that changes with navigation | `FreshFold Laundry` on every route | `/`: "Laundry pickup in Yaba · FreshFold"; `/schedule`: "Schedule a pickup · FreshFold" | Read every title and meta tag in the DevTools Console on both routes (evidence 16, 17) |
| Tagline under ten words | "Laundry pickup and delivery in Yaba, Lagos" | "Every item counted, from pickup to your door." (8 words) | Same Console check |
| SEO tags, marketing page only | None | On `/` only: a search description, `robots: index, follow`, canonical `/`. No keywords tag | `/schedule` checked: no robots, no canonical |
| Favicon I made | None | 512 × 512 Figma frame, Laundry Blue `#2B4FB4`, radius 96, white "F" in Atkinson Hyperlegible Next Bold 360; saved as `app/icon.png` | Shows on both browser tabs (`favicon-in-tabs.png`) |
| Open Graph | None | og:title, description, type, site_name, locale `en_NG`, Twitter card, and a 1200 × 630 image I made in Figma (`app/opengraph-image.png`) | Fetched as WhatsApp and as Chrome (`og-bot-check.txt`) |

### What I read before accepting the SEO tags

The agent explained each tag in one line before writing it.
- `robots` tells search engines they may index the page and follow its links.
- `canonical` names the one true URL, so duplicates are not counted separately.

I refused a `keywords` tag, because Google ignores it. I kept SEO tags off `/schedule`, which is a form, not a page to find in search.

### What checking caught

- **The home title had no brand.** The `%s · FreshFold` template in `app/layout.tsx` only applies to child routes, not to `app/page.tsx` beside it.
- **The schedule page lost three tags.** Giving it its own `openGraph` object replaced the layout's whole object, so `og:site_name`, `og:locale` and `og:type` vanished until the full object was written out.
- **After the preview image was added, `document.head` showed only the icon.** Searching the whole document found every tag in the `<body>`. Next.js 15 streams metadata to browsers, but sends it inside `<head>` to bots. A request as `WhatsApp/2.23` had og:image in the head (True); a request as Chrome did not (False). My first check was wrong, not the page.

## The body: the `/schedule` screen

### 1. Removed: the "Rough Item Count" field

FreshFold's promise is that **we** count every item at pickup. Asking the customer for a number created a second count that could disagree with ours ("you said 7, we counted 6"), which is exactly the dispute the business exists to prevent.

`itemCount` became optional in the database (migration `make_item_count_optional`). The newest row has `itemCount null` (`database-rows-after-redesign.png`).

### 2. Collapsed: an exact date-and-time into a date plus one of three windows

The old picker asked for a time to the minute (19:37), a promise a laundry pickup cannot keep. Now the customer picks a date and **Morning (8–12)**, **Afternoon (12–4)** or **Evening (4–7)**.

**Growth reasoning:** every decision on a booking form is a chance to leave. A minute-level choice is hard to make and easy to get "wrong", while three windows are an easy, honest choice. The same thinking applies one level down: no window is pre-selected, because a default would book a customer into a window they never chose. If they skip it, "Please choose a pickup window." appears, and everything they typed is kept.

The window is saved as the start time in Lagos time. Afternoon on 28 Oct is stored as `2026-10-28T11:00:00.000Z`, which is 12:00 WAT.

### 3. Heading max-width

The first heading, "Book a pickup. We count every item.", wrapped as "Book a pickup. **We** / count every item.", leaving "We" stranded (evidence 18). No max-width could fix it, because line 2 was longer than line 1 could be.

I put the promise first instead: **"We count every item. Book your pickup."**, with `max-width: 21ch`. It breaks exactly after "item." (evidence 19). The promise is the reason to book, so it is read first.

### 4. Buttons sized with rem padding

`padding: 0.75rem 1.5rem; border-radius: 0.75rem;` with no fixed width or height.

- The padding follows the text, so a longer label or a larger system font grows the button instead of clipping it.
- At 16px root size, 0.75rem top and bottom plus the 20px Label Large line gives a 44px tap target. That's comfortable for a thumb on a 360px phone outdoors.
- The 0.75rem radius matches the input fields, so buttons and fields read as one family.

### 5. My label style on every button, checked by asking

I asked DeepSeek directly, with no edits allowed, which type style each button used. It answered that all buttons computed to Label Large, but only the home "Schedule pickup" used the `type-label-large` class; the four schedule buttons copied its five variables instead.

I confirmed this with `Select-String` (`label-style-check.txt`), and found something it missed: the class was on the five **field labels**, not on the buttons.

After the fix, the buttons use the class (page.tsx lines 152 and 173), the copied declarations are gone (−18 lines), and the buttons look identical.

### 6. Pointer cursor and hover, logo links home

- Every clickable element has `cursor: pointer` and a visible hover state: the window buttons go to the surface-container tint with a blue outline, and a **selected** window is clearly stronger (primary-container fill, blue text).
- A header with the F logo and "FreshFold" links to `/`.
- The home "Schedule pickup" button, which led nowhere, now links to `/schedule`.

### 7. Responsive largest text

At 320px the fixed 32px heading broke into three lines, "We count every / item. Book your / pickup." (`responsive-broken-320.png`). The fix:

```css
font-size: clamp(var(--type-headline-small-size), 1.25rem + 1.5vw, var(--type-headline-large-size));
line-height: 1.4;
```

The size never goes below Headline Small (24px) or above Headline Large (32px), and the 1.4 line height follows my type scale's rule for headlines. At 320, 768 and 1280px the heading is two lines, breaking after "item." (evidence 20).

## An idea I tried and rejected

On branch `experiment/green-request-button` I made "Request pickup" green (the success colour), so it would feel like "go".

I deleted the branch unmerged (`691e1e9`).
- In this system, green means *done*. "Pickup scheduled!" is green, so a green button says "done" before anything has happened.
- The agent also set the hover to the same green, leaving no visible hover.
