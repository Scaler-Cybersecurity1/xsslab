### Scenario

Bob is an editor testing the author profile experience on **The Daily Write**. Alex is a QA intern validating shared preview links.

The profile page reads part of the URL after `#` and shows it in the bio preview section.

Alex opens a shared preview link from chat, and unexpected JavaScript executes immediately in the browser.

Your task is to investigate how this happened and exploit the DOM XSS in this author-bio preview flow.

---

### Lab Description

In this lab, the application reads data from `window.location.hash` and injects it into the page using `innerHTML`.

Because untrusted client-side data is written directly into the DOM, this creates a DOM-based XSS vulnerability.

**Goal:** Trigger the DOM lab success condition and obtain the success code.

---

### Task

Exploit DOM XSS in the author profile preview and submit only the `success_code` shown after successful execution.

---

### Where to Go

- Main site: [https://scaler-cybersecurity1.github.io/xsslab/](https://scaler-cybersecurity1.github.io/xsslab/)
- DOM lab: [https://scaler-cybersecurity1.github.io/xsslab/lab-dom.html](https://scaler-cybersecurity1.github.io/xsslab/lab-dom.html)

---

### Step-by-Step Procedure

1. Open the DOM lab link.
2. Observe that the page behavior changes based on the URL fragment (`#...`).
3. Try a normal fragment (for example, `#writer bio`) and confirm it is shown in preview.
4. Replace the fragment with a payload that executes when inserted via `innerHTML`.
5. Reopen/refresh the crafted URL to verify JavaScript execution from the fragment.
6. Copy the displayed `success_code` and submit only that code.

---

### Hint

- Focus on input coming from `window.location.hash`.
- The payload should be passed after `#` in the URL.
- If your payload runs correctly, you should see a success code appear on the page.
