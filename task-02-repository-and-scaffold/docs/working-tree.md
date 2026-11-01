# The working tree

My drawing is `evidence/14-working-tree-drawing.jpg`: hand-drawn and dated.

## The pipeline as I drew it

1. **My computer.** The files I edit in `C:\Project\freshfold`, plus `.env`, which never leaves this box.
2. **The local Git store.** The `.git` folder. `git add` then `git commit` put a snapshot here. It is still only on my laptop.
3. **GitHub.** `git push` copies commits to `github.com/johndavidagaba/freshfold`. The repository is public, so from here anyone can read it.
4. **Production.** Not built yet. Next it will be a host (for example Vercel) that deploys `main` automatically for customers.

The branches in the drawing:
- **`main`** runs along the top.
- **Feature branch 1:** `docs/main-readme`, merged by pull request #1.
- **Feature branch 2:** `feature/head-and-information-design`, merged by pull request #2.
- **A deleted stub:** `experiment/green-request-button`, never merged.

Two marked points:
- **Where code becomes visible to users:** the merge into `main`, once production deploys `main`. Today the closest equivalent is the push to the public GitHub repository, where it becomes visible to anyone who reads it.
- **Past which a mistake can no longer be undone quietly:** the push. Before it, a bad commit can be amended, reset or deleted on my laptop and nobody knows. After it, other people and machines may have copied it. A leaked secret especially cannot be pulled back; it must be rotated. That is why I searched the whole history for my database password before my first push, and again before pushing the feature branch.

## What breaks when a tree has one branch

With only `main`, every commit is also the release:
- **Half-finished work is mixed in.** The page head could not have been done in pieces. Between the agent's first and third attempt, the home title had no brand and the schedule page had lost three Open Graph tags. On a single branch those broken states *are* the product.
- **There is no unit of review.** A pull request groups related commits (PR #2: six commits, 11 files) so someone can look at the change as a whole before it lands. On one branch, review happens after the fact, if at all.
- **There is no cheap way to try an idea.** My green-button experiment lived on its own branch. I looked at it, rejected it, and deleted it with `git branch -D`, and `main` never saw it. On one branch I would have to commit it, then revert it, leaving both in the history forever.
- **Undoing is harder.** To roll back a feature I can revert one merge commit. If its six commits are interleaved with everything else on `main`, I have to find and revert each one.

## Why it matters more after the first deployment

Before deployment, a broken `main` costs me a few minutes: I notice, fix, and commit again.

After deployment, `main` is what customers use. If it deploys automatically, every commit on a one-branch tree goes straight to people booking pickups. The half-finished head work would have shipped. The day my database broke, the form answered 200 while saving nothing; with one branch, that state would have been live, and real customers would have believed FreshFold was coming to collect their laundry.

Branches put a gate between "I committed" and "customers see it". A gate is only worth having once something is on the other side.
