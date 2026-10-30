# Interview answers (Task 3)

Two hundred words maximum each.

## 1. Why is client-side validation not enough?

Because the browser belongs to the user, not to me. Anyone can skip my form and send whatever they like straight to the server with curl, a script or a modified page, and then none of my browser code runs.

I proved it on FreshFold. My signup form blocks a one-letter name, an email with no `@`, a short phone number, a password of spaces, and unticked terms. One `curl.exe` request to `/api/signup` with exactly those values got **`201 Created`**: every rule skipped.

Client-side validation is still worth having, as a convenience: it catches honest mistakes early, explains what is wanted, and saves a round trip. But it is a UX feature, not a control. Every rule must be repeated on the server, ideally from one shared module so the two cannot drift apart.

## 2. What belongs in the frontend, and what must the server enforce regardless?

**The frontend is for helping honest users:**
- format hints and inline errors;
- not leaking hints, such as no password rules on login;
- disabling actions until a form is complete;
- safe output (letting React escape text instead of injecting HTML);
- not storing secrets in the page.

**The server must enforce everything that matters, regardless of what the browser did:**
- the same validation rules (length, format, required fields, terms accepted);
- authentication and authorisation on every request;
- ownership checks ("is this order yours?");
- rate limiting;
- password hashing;
- uniqueness (one account per email);
- that money amounts and prices come from the server, never from the request.

My rule of thumb from this task: if removing a check would let someone harm the business or another user, it must be on the server. If removing it only makes the form less friendly, it can live in the browser. My `/api/signup` currently enforces nothing, which is the gap Task 4 closes.

## 3. The UI hides the delete button for non-administrators. Is that enough?

No. Hiding the button only removes the easy way to make the request; the request itself still works. Anyone who knows or guesses the endpoint, by reading the page's JavaScript, watching the network tab or copying an admin's request, can send it directly. That is exactly what I did with curl against my signup endpoint, which the form appeared to protect.

The server has to check, on every delete request, who is asking and whether they are allowed: is the session valid, does this user have the admin role, and does the item belong to something they may change? If not, refuse with 403 and log it.

Hiding the button is still good design, because it stops confusing people with actions they can't take. But it is presentation. Authorisation lives on the server or it doesn't exist.

## 4. Validation, encoding and sanitisation

- **Validation** decides whether input is acceptable, and rejects it if not. My phone rule accepts 11 digits starting 070/080/081/090/091 and rejects "123". It doesn't change the data; it says yes or no.
- **Encoding** makes data safe for the place it is *output*, by changing how it is represented, not what it means. HTML-escaping `<script>` to `&lt;script&gt;` when showing a name on a page, URL-encoding a query value, or using parameterised SQL so a name is treated as data, not code. It depends on the destination, which is why it happens on output.
- **Sanitisation** changes the input itself by removing or rewriting dangerous parts, such as stripping tags from rich text a user is allowed to format. It is the riskiest, because it is easy to get wrong and it changes what the user sent.

In practice: validate on the way in (on the server), encode on the way out for each context, and sanitise only when you must accept something like HTML. None of these belong only in the browser.

## 5. Why validate route parameters and query strings, not just the body?

Because they are input too, and attackers can change them just as easily: they are right there in the address bar.

My own app shows it. `/account?form=signup` chooses which form to show. If the code trusted that value blindly, for example using it to build a file path, a redirect or a database query, someone could type anything. My page treats any value it doesn't recognise as "login", which is validation by allow-list.

Bigger risks live in IDs. `/orders/123` must check that order 123 belongs to the logged-in customer. Otherwise changing 123 to 124 shows someone else's laundry list and address; that is called insecure direct object reference. Query strings feed searches, filters and redirects, which can be abused for injection or to send users to malicious sites.

Every part of a request (path, query, headers, cookies and body) is under the client's control, so every part is validated on the server.

## 6. What is a single page application, and how do you make one discoverable?

A single page application loads one page and then changes what is shown with JavaScript, instead of asking the server for a new page on every click. My `/account` page is a small example: signup, login and reset are three forms on one route, chosen by `?form=`. After the first load, switching between them makes **no server requests**. I checked the server log, which showed nothing new after three switches.

**Discoverability problem:** if the content only appears after JavaScript runs, search engine crawlers and link-preview bots may see an empty page.

**Fixes:**
- render the important pages on the server (Next.js does this by default), so the HTML already contains the content;
- give each meaningful view its own real URL;
- add titles, descriptions and Open Graph tags per page;
- provide a sitemap.

On FreshFold I saw this from the other side. Next.js 15 sends metadata in the `<head>` to bots like WhatsApp, but streams it into the body for normal browsers. Discoverability depends on what the crawler receives, not what the user sees.

## 7. SPA vs multi-page: advantages and disadvantages

**SPA advantages:**
- instant transitions after the first load (my form switch made zero server requests);
- less data per click, which matters on Nigerian mobile bundles;
- state can be kept between views, like an email typed on one form;
- it feels like an app.

**SPA disadvantages:**
- a heavier first load;
- more JavaScript to break;
- SEO and link previews need server rendering;
- the browser's Back button and history need deliberate work. Mine doesn't step back between forms, because I used `replaceState`.
- Accessibility needs care: focus and announcements don't reset as they do on a new page.
- Security still depends on the server.

**Multi-page advantages:** simple and robust, each page has its own URL, caching and security rules, it works without JavaScript, and Back always works.

**Multi-page disadvantage:** a full round trip on every navigation.

I'd keep password reset with a token as its own page: it has stricter security needs than the forms around it. Small sibling views that users switch between in one sitting suit a single page.

## 8. The four WCAG principles, with examples

WCAG's four principles are **POUR**:

1. **Perceivable**: information must reach every sense the user has. My errors were red text only; I added a caution icon, so colour-blind users get a second signal. Before my fixes, Narrator never read the errors at all; now `role="alert"` and `aria-describedby` make them heard.
2. **Operable**: everything works with a keyboard. My disabled "Create account" button left the Tab order, so keyboard users couldn't reach it, and the "tick the box" message only fired on a mouse click. Now the button uses `aria-disabled`, stays focusable, and Enter shows what's missing.
3. **Understandable**: language and behaviour are predictable. My errors say why the field matters ("so the rider can reach you"), and login only checks on submit instead of shouting while you type.
4. **Robust**: works with assistive technology through standard markup. A real `<label>` on the terms checkbox, `aria-pressed` on the password toggle (Narrator now says "Show password, toggle button, off") and `aria-invalid` on fields with errors.

## 9. Semantic HTML and accessibility

Semantic HTML means using the element that describes what something is. Screen readers, keyboards and browsers then get the right behaviour for free.

Examples from my form:
- **A real `<label for="phone">`** is why Narrator announced "Phone number" when focus reached the input.
- **A real `<label>` around the terms text** lets users click the words, not just a tiny box, and makes Narrator read the whole sentence with "checkbox, unchecked".
- **A real `<button>`** is focusable and responds to Enter and Space. A `<div>` styled as a button does none of that without extra code.
- **The `<h1>`** let Narrator say "heading level 1, Create your account", so users can jump between headings.

ARIA fills gaps semantic HTML can't express, such as `aria-pressed` for a toggle or `aria-describedby` linking an error. But ARIA can't fix wrong elements, and bad ARIA is worse than none. My clearest lesson: the semantically correct `disabled` attribute *hid* my button from keyboard users. `aria-disabled` kept the meaning without removing it from the Tab order.

## 10. A time you disagreed with what a customer wanted to build

In this project my "customer" was the coding agent's default design and, at times, my own first instinct. One real case: the agent's signup form asked for a pickup address. It looked reasonable: a laundry service needs addresses.

I pushed back by asking three questions of every field: why it is needed, what the business does with it, and what happens if it's wrong.
- The address failed "why now". FreshFold already asks for it on every booking, and customers use different addresses: home at the weekend, office in the week.
- At signup it would become a stale default that silently sends a rider to the wrong place.

So I removed it.

I also removed the "rough item count" from the booking form, against the obvious "more data is better" view. FreshFold's promise is that *we* count every item. A customer's guess would be a second number to argue with.

How I handled it: I didn't just say no. I wrote down the reason in business terms (disputes, wrong addresses), so the decision could be challenged on its merits.

## 11. Explaining to an executive why their AI implementation isn't performing

I'd start from what they care about, not the technology: "It looks like it works, but it isn't doing the job you're paying for, and here's the evidence."

I'd show the gap between appearance and reality with their own data. On FreshFold, the AI agent reported things that weren't true:
- "zero assumptions", when I found five;
- "the page title will include the brand", and it didn't;
- "the phone field is still a number input", when the file said otherwise.

Each report sounded confident. Only checking the actual result caught it.

Then explain simply: these systems predict plausible output; they don't know when they're wrong. Performance problems usually come from:
- unclear instructions;
- missing context (they don't know your business rules);
- no checking step;
- being measured on demos rather than real cases.

Then a plan:
1. define what "working" means as a measurable test;
2. check outputs against reality on a sample every week;
3. give the system the rules and context it lacks;
4. keep a human approval step where mistakes are costly.

Finish with cost and risk in business terms, not model names.

## 12. A rule that wrongly blocks legitimate users

**My full-name rule: 2 to 60 characters, letters only, no digits.**

The 60-character limit wrongly blocks customers with long names, which is common in Nigeria when people give a full compound name with titles, such as "Chief Oluwaseun Adebayo-Ogunleye Babatunde…". The no-digits rule blocks the rare person whose legal name includes a numeral.

**I defend it, knowingly.** The name is printed on a pickup tag and read out by a rider at the gate; 60 characters is two lines of the tag. A name the rider can say matters more than a name that matches a passport. Long names can be shortened to what the person is called.

What I deliberately did *not* do is require two words, as the class rule did. That would block people known by one name, to stop bots typing "test". For FreshFold, phone verification is a better bot filter than punishing mononyms. The cost of my choice: "Test User" passes, which I proved in my form attack.

Where I may be wrong: I haven't tested the rule with real customers' names. If many hit the limit, 60 should rise.

## 13. You sent a request directly to your endpoint. What happened?

**First attempt:** `500 Internal Server Error`. PowerShell stripped the escaped quotes, so the body wasn't valid JSON, and my route crashed instead of answering 400. That's a defect: it can't even reject bad input politely.

**Second attempt,** with the JSON from a file: `201 Created`, with the body echoed back:
- name `"a"`;
- email `"not-an-email"`;
- phone `"123"`;
- password of three spaces;
- `"terms": false`.

The server enforced **none** of my rules. It even returned the password in the response.

**What it tells me about the eight rules:** they are real and useful, but they live entirely in the browser. They make the form clearer, faster and accessible for honest users. Against anyone who skips the form, they do nothing.

It also showed a second limit. Even through the form, "Test User", `a@b.co` and a 12-letter password of one repeated letter got through, because shape rules can't tell real from fake.

The two days weren't wasted. But the security work starts in Task 4: the same rules on the server, `400` for bad input, verification of email and phone, hashed passwords, and rate limits.

## 14. Wrong-answer analysis: "strong client-side validation… covers the main injection and bad-data risks"

**Useless as security:**
- regex on every field, *as protection*;
- disabling the submit button.

Both run only in the browser. Anyone sending a request directly skips them completely: my `curl` got `201 Created` with every rule broken. A disabled button doesn't even stop a keyboard user from pressing Enter, depending on the markup.

**Actively misleading:** "sanitise all inputs in the browser before sending". It creates false confidence: the team believes data arriving at the server is clean, so the server stops checking. It also mixes up stages, because injection is prevented at the point of *use*:
- parameterised queries for SQL;
- escaping on output for HTML;
- the right encoding per context.
Browser sanitisation can be bypassed and can corrupt legitimate data (a name like O'Brien).

**What the candidate has confused:**
- **usability with security:** client validation is a convenience;
- **validation with sanitisation and encoding:** different jobs at different points;
- **the browser with the trust boundary:** the server is the boundary.

**What they should say:** validate in the browser for the user's benefit, then validate again on the server, encode on output, use parameterised queries, and test by bypassing the form.

## Bonus: what is user enumeration, and how do error messages contribute?

User enumeration is finding out which accounts exist on a system, usually by trying a list of emails or phone numbers and watching how the system responds differently.

Error messages are the most common leak:
- **Login:** "No account with that email" versus "Wrong password" tells an attacker which emails are registered.
- **Reset:** "We don't recognise that email" does the same.
- **Signup:** "That email is already taken" reveals an account too.
- **Response time:** even identical messages leak if "no account" answers faster than "wrong password", because no password hash was checked.

For FreshFold, a confirmed customer list is a ready target for password guessing and phishing, and can reveal who lives where.

What I did:
- login says only "Email or password is incorrect.";
- the reset form always says "If an account uses that email, we've sent a reset link.";
- login shows no password rules.

The honest limit: that is only the browser. The server must give the same response, with the same status and similar timing, in every case. Signup duplicates need care too, for example by sending an email to the existing address instead of saying "taken".
