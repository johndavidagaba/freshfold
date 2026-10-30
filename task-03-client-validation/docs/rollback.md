# Rollback

**The regretted change.** I had the agent change the signup heading from "Create your account" to "SIGN UP NOW!!!" and committed it as `037a3d3`. Shouting at a customer who is about to hand over their name and phone number is the opposite of the calm, trustworthy tone in my design brief.

**How I rolled it back.** I did not ask the agent to "undo the last change".
1. I listed the commits with `git log --oneline -6`.
2. I found the exact ID of the regretted commit, `037a3d3`.
3. I ran `git revert --no-edit 037a3d3`.

This created a new commit, `c6a6eed`, that reverses exactly that change and nothing else. I used `revert` rather than `reset` because it rewrites no history: the mistake and its undo are both on record, which is safe even after the branch is pushed.

**Why naming the ID is safer than describing the change in words.** A commit ID points to one exact, unchangeable set of changes, so `git revert 037a3d3` can only undo that commit. An instruction like "undo the last two versions" makes the agent guess what "last" and "version" mean, and it might pick the wrong commits or rewrite files from its own memory. I saw that memory problem in this same task, when the agent claimed the phone input was still `type="number"` after I had already restored it.
