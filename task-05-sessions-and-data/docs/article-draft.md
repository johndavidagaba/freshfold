# Article

**Published on LinkedIn, Sunday 1 November 2026:** https://www.linkedin.com/pulse/my-logout-button-lied-me-server-log-caught-david-john-p8i0e (evidence 17).
The published version is longer than the draft below: it adds sections on cookies, two users in one browser, deletion and working with the AI agent, with 4 images from the evidence.

## First draft

**Title:** My logout button lied, and the server log caught it

I'm building FreshFold, a laundry pickup app for Yaba, Lagos, as part of the Ship & Found Founder Track. This week was logins: sessions, cookies, logout, deleting accounts.

The bug I learned the most from was the smallest one.

My logout button sent "log me out" to the server and then jumped straight to the login page. It didn't wait for the reply. On screen you were logged out. On the server, maybe not.

I tried to prove it by blocking the request in Chrome. Chrome's tool has changed: it's now called "Request conditions" and wants full web addresses. Even then, it never blocked anything.

So I read the server's own log instead. The page asked for the login screen *before* the logout request arrived. The screen said "you're out" before the server had even heard about it.

On my Wi-Fi the request still got there in time. On a weak mobile connection in Lagos it might not. Then a customer on a shared phone thinks they've logged out when they haven't.

The fix was four lines: wait for the server, show "Logging out…", only move on if the server says OK, and say clearly if it didn't work.

Three things I'm taking from this week:
1. **The screen isn't the truth. The server is.** Anything that decides what someone is allowed to do lives on the server.
2. **When a tool won't show you the bug, the logs will.**
3. **Deleting an account is a promise,** not a button. I now have a 30-day grace period, a clean-up script that's safe to run twice, and a plan for what I'd say if I ever broke that promise.

I used an AI coding agent (DeepSeek through OpenCode) for most of the code, for about $0.30 so far. I checked every claim it made by reading the files and testing. It was wrong several times. It was also honest about what it didn't do.

#ShipAndFound #BuildInPublic #WebDev #Lagos
