### Scenario

Bob is an editor at **The Daily Write** blog platform. He shares a "search posts" link with Alex (a new intern) to quickly find published articles.

The blog search page appends user input to the URL like this:

`/lab-reflected.html?q=<search_term>`

Bob says, "Type your keyword in search and share the URL if you want me to review results."

Alex clicks a crafted link posted in a public chat. The page loads, and unexpected JavaScript runs in Alex's browser.

Your task is to investigate how this happened and exploit the reflected XSS in this blog search flow.

---

### Lab Description

In this lab, the blog search page reads the `q` query parameter and renders it directly into HTML output without sanitization.

Because untrusted input is reflected into the page, an attacker can craft a malicious search URL that executes JavaScript when a reader opens it.

**Goal:** Trigger the reflected lab success condition and obtain the success code.

---

### Task

Exploit reflected XSS in the blog search page and submit only the `success_code` shown after execution.

---

### Where to Go

- Main site: [https://scaler-cybersecurity1.github.io/xsslab/](https://scaler-cybersecurity1.github.io/xsslab/)
- Reflected lab: [https://scaler-cybersecurity1.github.io/xsslab/lab-reflected.html](https://scaler-cybersecurity1.github.io/xsslab/lab-reflected.html)

---

### Step-by-Step Procedure

1. Open the reflected lab link.
2. Observe that the page uses `q` from the URL query string to render search output.
3. Enter normal input in the search box and submit; verify the same value appears in results.
4. Try an HTML/JS payload through the `q` parameter.
5. Reload/open the crafted URL until the payload executes in the page context.
6. Copy the displayed `success_code` and submit only that code.

---

### Hint

- Focus on the value after `?q=`.
- This is a reflected case: payload is in the URL, not stored in comments.
- If your payload runs correctly, you should see a success code appear on the page.
