# What I don't know

Things I'm not sure about after Task 5. I'd rather list them than pretend.

1. **How long Nigerian law makes me keep payment records.** I wrote "at least six years" in Task 4. I haven't confirmed it with an accountant or with the text of the law.
2. **Whether the Nigeria Data Protection Act 2023 requires me to register** with the Data Protection Commission, or appoint a data protection officer, at FreshFold's size. My privacy notice is a draft no lawyer has read.
3. **Whether 30 days is the right grace period.** I picked it because it's common. I haven't asked a single customer whether they'd want longer or shorter.
4. **What Neon does with my backups.** "Deleted" data lives on in backups for some period I haven't looked up. My deletion promise has a hole I can't see the size of.
5. **Why Chrome's Request conditions rule said "0 affected"** while the logout request clearly went through. My best guess is that the request was cancelled by the page navigation before the rule applied. I'm not sure.
6. **Why Kemi got two sessions five seconds apart.** A double-click is my best guess. I didn't reproduce it on purpose.
7. **How the app behaves with hundreds of users at once.** My rate limiter isn't atomic. I know races exist in theory, but I've never seen one or measured one.
8. **Whether SameSite=Lax is enough** once payments arrive, or whether I'll need CSRF tokens on payment routes too.
9. **How a laundry owner actually keeps customer records today:** paper, WhatsApp or memory. My data design assumes a lot about a business I haven't watched for a full day.
10. **What happens to sessions when a user is banned.** The ban blocks login, but I haven't tested whether existing sessions keep working until they expire.
