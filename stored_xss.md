### Scenario

Bob is a community editor at **The Daily Write**. Alex is a new moderator reviewing reader comments on a popular blog post.

Readers can post comments, and everyone who opens the post sees the stored messages.

One day, Alex opens the comments thread and unexpected JavaScript runs automatically, even without clicking anything.

Your task is to investigate how this happened and exploit the stored XSS in this blog comments flow.

---

### Lab Description

In this lab, user comments are saved and later rendered into HTML without sanitization.

Because the payload is stored first and executed later when the page is viewed, this is a Stored XSS vulnerability.

**Goal:** Trigger real execution from stored content and obtain the stored success code.

---

### Task

Exploit stored XSS in the blog comment thread and submit only the `success_code` shown after successful execution.

---

### Where to Go

- Main site: [https://scaler-cybersecurity1.github.io/xsslab/](https://scaler-cybersecurity1.github.io/xsslab/)
- Stored lab: [https://scaler-cybersecurity1.github.io/xsslab/lab-stored.html](https://scaler-cybersecurity1.github.io/xsslab/lab-stored.html)

---

### Step-by-Step Procedure

1. Open the stored lab link.
2. Inspect the comment box and understand that posted data is saved and displayed back.
3. Post a harmless comment first to confirm persistence and rendering behavior.
4. Post a payload in the comment input that executes when rendered from stored content.
5. Refresh/reopen the page to confirm payload execution from saved data.
6. Copy the displayed `success_code` and submit only that code.

---

### Hint

- Focus on the comment input box where data gets persisted.
- In this lab, success appears when JavaScript actually executes (`alert(...)` is instrumented), not by matching one fixed payload string.
- If your payload runs correctly, you should see a success code appear on the page.
