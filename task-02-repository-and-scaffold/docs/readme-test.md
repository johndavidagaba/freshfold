# README test with a real person

- **Who:** Ricoh, a friend. He doesn't build software, which is the point.
- **When:** Sunday 1 November 2026. He replied at 21:50.
- **How:** I sent the repository link on WhatsApp with four questions and didn't help while he read. His full replies are in `evidence/readme-test-01-ricoh-answers.png` and `evidence/readme-test-02-ricoh-stuck.png`.

## What I asked

1. What is FreshFold, and who is it for?
2. How would you run it on a computer?
3. Where did you get confused or stuck?
4. Any question you still have?

## What he understood (correctly)

- **What it is:** "a laundry pickup-and-delivery app designed for working adults and students in Yaba, Lagos". Customers schedule a pickup, and every item collected is recorded. That matches the README exactly.
- **How to run it:** he listed all 9 steps in the right order:
  1. install Node.js and Git;
  2. clone;
  3. `npm install`;
  4. create a Neon database;
  5. put the connection string in `.env`;
  6. `npx prisma migrate deploy`;
  7. `npm run dev`;
  8. open localhost:3000;
  9. try `/schedule`.

So the Getting started section works, even for someone non-technical.

## Where he got stuck

> "The README is quite detailed, but a few things were confusing to me as someone who isn't very technical. I wasn't completely sure what Node.js, Git and Prisma do or why I need all three."

**He could follow the steps without knowing why they exist.** The README names the tools but never says in one line what each does.

## His question

> "When will customers be able to see the individual clothes collected and track their laundry?"

**A fair question the README raises and doesn't answer.** The README promises item-by-item records, but the Status section doesn't say when customers will see them.

## What I'll change

1. **Add one plain line per tool** under "Getting started":
   - **Node.js** runs the app on your computer;
   - **Git** downloads the code and keeps its history;
   - **Prisma** creates the database tables and talks to the database for the app.
2. **Add to the Status section** that the customer item list and laundry tracking aren't built yet, and are planned after payments.

## What this taught me

I'd assumed the hard part for a newcomer would be the commands. It wasn't: he got every command right. The gap was the **why**. People follow steps more confidently when they know what each tool is for, and a README that promises a feature should say whether it exists yet.
