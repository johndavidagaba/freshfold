# Interview answers (Task 2)

Two hundred words maximum each.

## 1. Git Flow vs trunk-based development

Git Flow keeps long-lived branches: `main` for releases, `develop` for integration, plus feature, release and hotfix branches. Work can stay apart from `main` for weeks.

In trunk-based development everyone merges small changes into `main` (the trunk) at least daily, often behind feature flags, with short branches that live hours or days.

Many teams moved to trunk-based for three reasons:
- Long branches drift apart, so merges become large and painful.
- Continuous deployment needs `main` to be releasable at any moment.
- Small changes are easier to review and to roll back.

Git Flow still suits software shipped in versions, such as installed apps, where several releases must be maintained at once.

My FreshFold history is close to trunk-based. Two short branches each lived about a day and were merged by pull request (#1 the README, #2 the head and design work), and one experiment was deleted.

## 2. `git push --force` vs `--force-with-lease`

`git push --force` makes the remote branch point at my local commit, whatever is there. If a teammate pushed commits I have not fetched, they are thrown away from the branch without a warning.

`--force-with-lease` adds a check: it only overwrites if the remote branch is still where my last fetch saw it. If someone has pushed since, the push is refused and I can fetch and look first. It protects against overwriting work I never saw.

It is not perfect: a plain `git fetch` updates what my Git thinks the remote looks like, so the lease can pass even though I never actually looked at the new commits. It is safer, not safe. On a shared branch the better rule is not to force-push at all.

## 3. Why rewriting history on a shared branch is dangerous

A commit's ID depends on its content and its parent. Rebase, amend and squash create new commits with new IDs, even when the code looks the same.

On my own unpushed branch that is fine: nobody else has the old commits.

On a shared branch, teammates have built on the old IDs. After a force push their history and the remote's no longer match. Their next pull produces duplicated commits or confusing conflicts, and a careless force push from them can erase my work, or mine theirs. Reviews, links and CI results that pointed at the old commits also break.

There is a security side too. Rewriting does not reliably remove a leaked secret, because other clones and forks still hold it. That is why my brief treats any secret in the history as a fail even if it is later removed: the safe answer is to rotate the secret, not to rewrite.

## 4. `git merge` vs `git rebase`

Both bring the changes of one branch into another.

- **Merge** keeps both histories and joins them with a merge commit. Nothing is rewritten, so it is safe on shared branches, and the graph shows that a branch existed. My `15-git-log-graph.txt` shows this: PR #2 became merge commit `5f21071` with six commits beside it.
- **Rebase** replays my commits on top of the other branch, producing new commits and a straight line, as if I had started later.

When I'd use each:
- I would **rebase** my own local feature branch onto the latest `main` before opening a pull request, so the review is clean and conflicts are solved by the person who wrote the code.
- I would **merge** whenever the branch is shared or already pushed for others, and for bringing a finished pull request into `main`, because the merge commit records when and what was integrated.

## 5. What causes a merge conflict, and what the markers mean

Git merges line by line against the common ancestor of the two branches. A conflict happens when both branches changed the same lines, or one edited a part the other deleted, so Git cannot know which version is right.

Git then writes both versions into the file and stops:

```
<<<<<<< HEAD
background-color: var(--color-primary);
=======
background-color: var(--color-success);
>>>>>>> experiment/green-request-button
```

The part between `<<<<<<<` and `=======` is my current branch. The part between `=======` and `>>>>>>>` is the incoming branch. The file is now literally broken until a person edits it to the intended result (one side, the other, or a mix), deletes the markers, then runs `git add` and finishes the merge.

The markers are not Git being clever. They are Git refusing to guess.

## 6. Working directory, staging area and repository

- **The working directory** is the files on my disk as I edit them. When `notepad .env` saved my database URL, that change existed only here, and `.gitignore` kept it here.
- **The staging area (index)** is the next commit being assembled. `git add` copies chosen changes into it. That is how I committed only `app/icon.png` for the favicon commit while other files were still changing.
- **The repository** is `.git`: every commit, permanently, on my machine. `git commit` turns what is staged into a commit there.

GitHub is a fourth place, a remote copy of the repository, reached with `git push`.

The three local areas explain the commands: `git status` compares them, `git diff` shows working directory against staging, and `git restore` throws away working-directory changes. I used `git restore` to undo the accidental change to `08-port-conflict-resolved.txt`.

## 7. Branch protection

Branch protection is a set of rules on an important branch, usually `main`, enforced by GitHub (or GitLab) on the server, so they apply to everyone, including the owner if configured.

It typically enforces:
- changes only through pull requests, with no direct pushes;
- a minimum number of approving reviews, sometimes from code owners;
- required status checks (tests, build, lint) that must pass before merging;
- the branch must be up to date with `main` before merging;
- no force pushes and no deletion of the branch;
- sometimes signed commits or a linear history.

My AGENTS.md has the same rule written down ("never commit to main directly once pushed; work on a branch"), but a written rule depends on me remembering it. Branch protection makes the server refuse instead. For a team, and for any repository that deploys automatically, I would turn it on.

## 8. A technical project end to end

FreshFold, a laundry pickup app for Yaba, Lagos. The one thing it must get right is that every item collected is counted.

**Design system.** I built it in Figma around Laundry Blue `#2B4FB4`, with Atkinson Hyperlegible Next so 1, l and I are never confused. I measured contrast for every colour pair and exported the tokens to 131 CSS variables with a script.

**Build.** An agent scaffolded Next.js, TypeScript and Prisma from an AGENTS.md I wrote. I connected a Neon PostgreSQL database and built a booking form.

**Proving it works.** I checked rows in Prisma Studio by matching IDs, not by trusting the success message. Then I cut the database off and found a failed save still returned 200.

**Breaking it on purpose.** I caused a port conflict, a 404 and a nested folder, and recovered from each, as well as from a corrupted `.next` that the agent caused by accident.

**Shipping it.** I put it on GitHub with an honest README listing its defects, and merged work through two pull requests. I redesigned the booking screen: the item-count field is gone and pickups use time windows, with every change checked in the browser.

## 9. Something you built broke in production

FreshFold has not been deployed yet, so honestly this did not happen in production. The closest was my running development site during real use.

While I was testing the database failure, the site suddenly showed "Runtime Error: Cannot find module './548.js'". My first thought was that my database change caused it. I checked instead: the error came from `.next\server`, not from Prisma.

The cause was the coding agent. It had run `npm run build` to check its own work while my dev server was running, and both write to the same `.next` folder. I stopped the server, deleted `.next`, restarted, and it worked.

What I changed afterwards matters more:
- every prompt now says "Do not run npm run build";
- when I came back the next day and found old servers still running on 3000, 3001 and 3002, I recognised the same shared-folder risk and stopped them all before continuing.

The lesson: the first explanation that comes to mind is often wrong. Read where the error comes from before fixing anything.

## 10. Learning a new platform or codebase quickly

I start by finding what must not break and writing down the rules. For FreshFold that became AGENTS.md: the stack, the design rules and the folder map, before any code.

Then I run it and read the logs rather than the marketing. The log told me the first load was 10,341 ms with 9.5 s spent compiling 696 modules; no tutorial would have.

I break things deliberately in a safe place: a port conflict, a missing page, a disconnected database. Seeing how a platform fails teaches me more than seeing it work.

I check every claim myself, especially from AI agents:
- `prisma validate` after an agent said everything passed;
- the browser head after it promised a title;
- `Select-String` after it described which classes the buttons used.

And I write down what surprised me the same day, in a build log, because the surprises are exactly what I will need to remember. Example: Next.js streams metadata to browsers but sends it in the head to WhatsApp.

## 11. Correct code vs complete code

Correct code does what it claims for the case it handles. Complete code also handles the cases nobody demonstrates: failure, empty input, slow networks, the second user, the day after.

My booking form is correct. Submit valid details and a row appears in PostgreSQL with the same ID as the reference shown; I proved it twice with timestamps minutes apart.

It is not complete:
- when the database is unreachable, the server still answers 200;
- the customer's input was wiped;
- the error was one small red line;
- after the database came back, saves kept failing until a restart;
- the time zone is fixed in code, and nothing is tested automatically.

A demo only exercises correctness, which is why incomplete code passes demos. Completeness is mostly about the unhappy paths, and you only find them by deliberately walking down them, as the false-success test did.

## 12. Designing for a customer who maintains it after you leave

I assume the next person knows less than I do and has no one to ask.

**Decisions are written down where they'll find them:**
- AGENTS.md states the stack, the design rules and what not to touch;
- the README has exact setup commands, environment variable names without values, scope limits, and the real defects with file references.

**Sources of truth are single and generated:**
- colours and type come from Figma tokens through `scripts/tokens-to-css.mjs`, so a rebrand is one export, not a hunt through files;
- database changes are Prisma migrations in git, so the schema can be rebuilt from the repository.

**Boring, mainstream choices win:** Next.js, PostgreSQL, plain CSS. I pinned versions (Prisma 6.19.3) and wrote down why, because "update available" banners tempt people into breaking upgrades.

**I hand over evidence, not reassurance:** how to check that a booking was really saved (find the row by its ID), and what a failure looks like in the logs. Then the customer can tell a working system from one that only says it works.

## 13. Where did my first page load time go?

My first load was `GET / 200 in 10,341 ms`.

**Measured, from the log:**
- the compile, 9.5 s for 696 modules, because development mode builds a page only when it is first requested;
- the reload, 137 ms, once the compiled page was in memory;
- server ready time, 10.8 s on the first start and 3.9 s on a later one.

**Guessed, not measured separately:** the remaining ~840 ms. It probably includes:
- rendering in development mode, which runs extra checks;
- Windows Defender scanning new files in `.next` and `node_modules`;
- my laptop's disk and CPU.

The Google Fonts request happens in the browser after the HTML arrives, so it is probably not inside the logged 10,341 ms, but it is part of what a person waits for.

The honest gap is production. I have not measured `npm run build` plus `npm start`, so I cannot claim how close a real customer gets to the class target of about 10 ms. The next measurements would be a production build, then Chrome throttled to Slow 3G, because my customers are on small data bundles.

## 14. Success reported while nothing was written

In my build, the user-facing message did not lie: with the database disconnected, the page said "Unable to save pickup request." What reported success was the HTTP layer.

The mechanism: the form posts to a Next.js Server Action. The action wraps `prisma.pickupRequest.create` in `try/catch`. When Prisma failed (`PrismaClientInitializationError: Environment variable not found: DATABASE_URL`), the catch returned an error object as normal data. The function finished without throwing, so Next.js answered `POST /schedule 200`, identical to my two real saves. Anyone judging by status codes, or by the form clearing, would believe it worked.

**The thirty-second check:** after submitting, open the database (Prisma Studio, `localhost:5555`), refresh the table, and look for a new row whose `id` matches the reference shown on screen, with a `createdAt` from the last minute.

In my test there was no "David Test Three" row, and that absence was the proof. A green message or a 200 is a claim; the row is the fact.

## 15. Wrong-answer analysis: "if the dashboard loads, the backend is working"

**What is wrong:** it tests that a page renders, not that anything was stored. A dashboard can load from a session cookie, cached data, a client-side redirect or hard-coded defaults while the signup write failed. My own form showed this: a failed save still returned 200, and a cleared form looks the same as a successful one.

**What it misses:**
- whether the user row exists, with the right fields;
- whether it survives a refresh or a new session;
- whether a second signup with the same email is refused;
- what happens when the database is down;
- whether the server reconnects after it comes back. Mine did not until restarted.

**What I would do instead:**
- After signing up, look in the database for the new row, by ID or email, with a fresh timestamp.
- Log out and log back in, which forces a real read.
- Then break the database deliberately and confirm the user sees an honest failure and nothing is half-saved.
- Finally, turn those checks into an automated test, so they run every time and not just when I remember.
