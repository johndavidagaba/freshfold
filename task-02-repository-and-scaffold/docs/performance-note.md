# Performance note

## My numbers

| Measure | Result |
| --- | --- |
| Server ready | 10.8 s |
| First compile of the home page | 9.5 s, 696 modules |
| **First load** | **GET / 200 in 10,341 ms** |
| Reload | GET / 200 in 137 ms |

Machine: my Windows laptop, Next.js 15.3.9 in development mode (`npm run dev`), 26 Oct 2026. Evidence: `03-server-start.txt`, `04-first-load.txt`.

## How far from a reasonable target

The target given in class is nearer 10 ms. My first load is 10,341 ms, about 1,000 times slower. My reload, 137 ms, is still about 14 times slower than the target, but close enough that a person would not notice.

## What accounts for the gap

Almost all of the first load is the 9.5 s compile. In development mode, Next.js does not build a page until someone first asks for it: on that first request it compiles the page and everything it imports (696 modules here: React, Next.js itself, my layout and CSS) and only then sends it. The reload took 137 ms because the compiled page was already in memory.

So the 10.3 s is mostly a development-mode cost, not what a customer would wait for. A production build (`npm run build`, then `npm start`) compiles everything in advance, so the first visitor would not pay it. I have not measured the production build yet, so I cannot claim how close to 10 ms it gets.

Other likely contributors, which I have not measured separately:
- My laptop: compiling 696 modules is CPU and disk work, and Windows Defender scans new files in `node_modules` and `.next`.
- The Google Fonts links in `app/layout.tsx`: the browser fetches the font from Google on first load, which depends on my internet connection. On a customer's 3G bundle this would matter more than on my machine.
- The 137 ms reload includes rendering in development mode, which does extra checks that production skips.

## What I would check next

Run `npm run build` and `npm start`, load the page twice, and compare. Then load it with Chrome's network throttling set to "Slow 3G" to see what a FreshFold customer actually waits for.
