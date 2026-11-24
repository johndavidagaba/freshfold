# Interview with a laundry business

- **Status:** done, but short.
- **Who:** a registered laundry business in Lagos, reached on its WhatsApp Business account. I promised not to share the name, so it's hidden in the evidence. I don't know whether the owner or a staff member replied.
- **When and how:** Monday 23 November 2026, by WhatsApp text. I sent 8 questions at 18:43, and they replied at 18:46.
- **Evidence:** `evidence/18-owner-interview-whatsapp.png` (business name blacked out).

## Answers

| # | Question | Their answer |
| --- | --- | --- |
| 1 | How do you keep track of your customers: a book, WhatsApp, or memory? | "WhatsApp and memory" |
| 2 | When a customer stops coming, do you keep their number? For how long? | "Yes we do" (no time given) |
| 3 | Has any customer asked you to delete their details or stop contacting them? | "None" |
| 4 | How long do you keep receipts or payment records? | "That we don't know" |
| 5 | Who else can see your customer list (staff, riders, family)? | "Staff" |
| 6 | Have you ever lost a phone or book with customer numbers? What happened? | "Yes" (they didn't say what happened) |
| 7 | Would your customers rather confirm by email, SMS or WhatsApp? | "WhatsApp" |
| 8 | What would make you trust an app with your customers' details? | "Encryption" |

## What I learned

1. **Customer records live in WhatsApp and in people's heads.** There's no system, so FreshFold isn't replacing a database; it's replacing a phone.
2. **Numbers are kept forever, by default.** Nobody decided that. It just happens. This is exactly the gap my retention matrix is meant to close.
3. **No one has ever asked to be deleted.** That doesn't mean customers don't care. They may never have known they could ask.
4. **They don't know how long to keep payment records.** Neither do I: it's item 1 on my `what-i-do-not-know.md`. A real business confirmed it's a real gap, not just mine.
5. **Staff can see the whole customer list.** On a phone, there's no way to give one staff member less access than another.
6. **They have lost a phone or book with customer numbers.** When records live on one phone, losing the phone means losing the records, and anyone who finds it can see every customer.
7. **Customers prefer WhatsApp to email.** FreshFold sends verification codes and receipts by email.
8. **"Encryption" is their word for trust.** They named a technical idea, not a feature.

## What changed in my design because of it

- **Confirmations should move to WhatsApp or SMS.** My email verification works, but it's the channel customers least prefer. The phone number is already collected and required. I've added "verify by WhatsApp or SMS instead of email" as the next change to consider, with the honest cost: WhatsApp's business messaging and SMS both cost money per message, and email is free.
- **Staff access needs roles.** "Staff can see everything" is the default on a phone. In FreshFold, a rider should see only their own pickups' names and phone numbers, not the whole list. This strengthens the case for the role-based access I started in Task 5 (customer and admin today; a rider role next).
- **Keeping records on a server is the point.** A lost phone exposed their whole customer list. With FreshFold, a lost phone means logging that device out (change password ends every other session, which I tested in evidence 11) while the records stay safe.
- **The retention matrix stays as it is.** Their answers to questions 2 and 4 confirm that nobody decides how long data is kept unless the system decides for them. My 30-day deletion and purge script do that.
- **What "encryption" means in FreshFold, honestly:**
  - data travels over HTTPS in production;
  - passwords are hashed with Argon2id, not encrypted, so even I can't read them;
  - session tokens are stored only as SHA-256 hashes.
  - I haven't checked how Neon encrypts the database on disk, so I won't promise that until I have. It's now on my what-i-do-not-know list.

## Limits of this interview

- **Short, typed answers.** Text by WhatsApp, not a conversation, so I couldn't ask follow-ups. Two answers are incomplete: how long they keep numbers (question 2), and what happened when they lost a phone (question 6).
- **One business.** It tells me what one laundry does, not what all of them do.
- **The person who replied may not be the owner.** Business accounts are often answered by staff.
- **I dropped one planned question.** "What does 'log me out everywhere' mean to your customers?" didn't fit a short text, so I didn't ask it.

**Next time:** a 10-minute phone call, so I can ask "why?" after each answer.
