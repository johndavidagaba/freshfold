# Client-side is not security

## The request I sent

I skipped the browser and sent a request straight to the signup endpoint with `curl.exe` from PowerShell (full transcript in `evidence/16-direct-request-command-and-response.txt`):

```
'{"name":"a","email":"not-an-email","phone":"123","password":"   ","terms":false}' | Out-File -Encoding ascii body.json
curl.exe -s -i -X POST http://localhost:3000/api/signup -H "Content-Type: application/json" --data-binary "@body.json"
```

## What my server did with it

```
HTTP/1.1 201 Created
content-type: application/json

{"received":{"name":"a","email":"not-an-email","phone":"123","password":"   ","terms":false}}
```

**My server accepted it.** `201 Created`, for:
- a one-letter name;
- an email with no `@`;
- a three-digit phone number;
- a password of three spaces;
- terms **not accepted**.

The route reads the body and returns it, with no checks at all.

My first attempt returned **500 Internal Server Error**. PowerShell stripped the escaped quotes, so the body was not valid JSON, and the route has no handling for a body it cannot parse. Instead of answering "400, bad request" it crashed. That is a second defect: the server cannot even reject malformed input politely.

## Which of my rules were enforced on that request

**None.** Every rule I wrote lives in `app/account/page.tsx`, which runs in the browser:

| Rule (in the browser) | Enforced on the direct request? |
| --- | --- |
| Empty fields show an error | No: nothing was checked |
| Name: 2–60 letters, no digits | No: "a" accepted |
| Phone: Nigerian mobile shape | No: "123" accepted |
| Email format | No: "not-an-email" accepted |
| Password: 12+ characters, not only spaces | No: three spaces accepted |
| Terms must be ticked | No: `"terms": false` accepted |
| Submit blocked until valid (`aria-disabled`) | No: there was no button |
| Login says only "Email or password is incorrect" | Not tested: there is no login endpoint yet |

## What this proves

Client-side validation is a **convenience for honest users**: it catches typos early and explains what is wanted. It is **not a control**. Everything in the browser belongs to whoever is using it. Curl, a script or a modified page can send any bytes it likes to my endpoint, and the server is the first place my code gets a say.

Attacking the form itself (`evidence/15-form-attack-results.txt`) showed a second limit. Even when the rules run, they check **shape**, not **truth**: "Test User", `a@b.co`, a made-up 080 number and a 12-letter password of one repeated letter all pass.

The two days I spent on the eight rules were not wasted. They make the form kinder and more accessible. But they protect nothing.

## What I will do in Task 4

- **Repeat every rule on the server** in the `/api/signup` handler before anything is saved: the same name, email, phone, password and terms checks, from one shared validation module so the browser and server cannot drift apart. Invalid input gets `400` with field errors.
- **Handle bad bodies:** an unparseable JSON body returns `400`, not `500`.
- **Trim and normalise on the server** (trim name and email, lower-case email, normalise phone to one format), because the browser's trimming can be skipped.
- **Prove ownership,** because shape rules cannot: email verification by code, and later a phone check, so "Test User" with a fake number never becomes an active account.
- **Hash passwords** with a slow algorithm and never echo them back. The current route returns the password in its response, which must go.
- **Rate-limit** the signup and login endpoints, and keep login and reset messages identical whether or not an account exists.
