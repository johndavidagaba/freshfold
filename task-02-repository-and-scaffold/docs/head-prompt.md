# Head prompt (Task 2, step 10)

Sent to Antigravity on branch feature/head-and-information-design.

```
Read AGENTS.md first and follow it.

Task: improve the page head (metadata) only. Do not change how any page looks.

1. Title that changes with navigation. In app/layout.tsx use Next.js metadata with a title template "%s · FreshFold" and default "FreshFold · Laundry pickup in Yaba". Give the home page the title "Laundry pickup in Yaba" and the schedule page "Schedule a pickup".

2. Tagline under ten words, used as the site description: "Every item counted, from pickup to your door." Use it in the root layout metadata.

3. SEO tags on the home page (app/page.tsx) ONLY, nowhere else:
   - a description written for search: "FreshFold collects your laundry in Yaba, Lagos, records every item, and brings it back clean."
   - robots: index, follow
   - canonical URL "/"
   Do not add a keywords tag. Before you write them, explain in one line each what every tag you add does.

4. Open Graph tags so a shared link shows a preview: og:title, og:description, og:type "website", og:site_name "FreshFold", og:locale "en_NG", and twitter card "summary_large_image". Set metadataBase to http://localhost:3000 for now. I will add the preview image myself later as app/opengraph-image.png, so do not create any image.

5. Favicon: I will make it myself and save it as app/icon.png. Do not create an icon.

Rules:
- No new packages. Do not create new folders.
- Do NOT run npm run build or anything that writes to .next; my dev server is running.
- Before changing anything, tell me your plan in a short list and wait for "approved".
- When finished, list every file you changed and every assumption you made.
```
