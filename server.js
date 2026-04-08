const express = require("express");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Intentionally insecure in-memory data for training use only.
const comments = [];

const SUCCESS_CODES = {
  reflected: "XSS-REFLECTED-7A91",
  stored: "XSS-STORED-3F22",
  dom: "XSS-DOM-9BC0"
};

function pageTemplate(title, body) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: Inter, Arial, sans-serif; margin: 0; background: #f4f7fc; color: #1f2937; }
    header { background: linear-gradient(135deg, #0f172a, #1d4ed8); color: #fff; padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.2); }
    .topbar { max-width: 980px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .brand { display: flex; align-items: center; gap: 10px; }
    .brand-name { font-size: 18px; font-weight: 700; letter-spacing: 0.2px; }
    .brand-sub { font-size: 12px; opacity: 0.85; margin-top: 2px; }
    .badge { font-size: 12px; background: rgba(255,255,255,0.16); border: 1px solid rgba(255,255,255,0.35); padding: 6px 10px; border-radius: 99px; }
    main { max-width: 980px; margin: 24px auto; background: #fff; padding: 22px; border-radius: 12px; box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08); }
    h2 { margin-top: 0; }
    a { color: #1d4ed8; text-decoration: none; }
    a:hover { text-decoration: underline; }
    code { background: #eef2ff; padding: 2px 6px; border-radius: 4px; }
    .card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; margin-bottom: 14px; background: #fff; }
    .grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
    .lab-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; background: #fcfdff; }
    .success { background: #ecfdf3; border: 1px solid #86efac; padding: 10px; border-radius: 8px; margin: 12px 0; }
    .warn { background: #fff7ed; border: 1px solid #fdba74; padding: 10px; border-radius: 8px; margin: 12px 0; }
    input, textarea { width: 100%; padding: 10px; margin-top: 6px; margin-bottom: 10px; border: 1px solid #d1d5db; border-radius: 8px; }
    button { background: #1d4ed8; color: #fff; border: 0; padding: 10px 14px; border-radius: 8px; cursor: pointer; font-weight: 600; }
    button:hover { background: #1e40af; }
    ul { padding-left: 20px; }
    .meta { color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <header>
    <div class="topbar">
      <div class="brand">
        <div>
          <div class="brand-name">Scaler Security Labs</div>
          <div class="brand-sub">Application Security Training Portal</div>
        </div>
      </div>
      <div class="badge">XSS Practice Environment</div>
    </div>
  </header>
  <main>
    ${body}
  </main>
</body>
</html>`;
}

app.get("/", (req, res) => {
  const body = `
  <h2>Welcome to Scaler Security Labs</h2>
  <p class="meta">Hands-on XSS simulations for student training.</p>
  <div class="grid">
    <div class="lab-card">
      <h3>Lab 1: Reflected XSS</h3>
      <p class="meta">A search endpoint reflects unsanitized query input.</p>
      <a href="/lab/reflected">Launch lab</a>
    </div>
    <div class="lab-card">
      <h3>Lab 2: Stored XSS</h3>
      <p class="meta">User comments are persisted and rendered without escaping.</p>
      <a href="/lab/stored">Launch lab</a>
    </div>
    <div class="lab-card">
      <h3>Lab 3: DOM XSS</h3>
      <p class="meta">URL hash is inserted into the DOM using <code>innerHTML</code>.</p>
      <a href="/lab/dom">Launch lab</a>
    </div>
  </div>
  `;
  res.send(pageTemplate("XSS Training", body));
});

app.get("/lab/reflected", (req, res) => {
  const q = req.query.q || "";
  const solved = q.includes("xss-reflected-win");
  const body = `
  <h2>Lab 1: Reflected XSS</h2>
  <p>Search page reflects <code>?q=</code> directly into HTML.</p>
  <form method="get" action="/lab/reflected">
    <label>Search query</label>
    <input name="q" value="${q}" />
    <button type="submit">Search</button>
  </form>
  <div class="card">
    <h3>Search Results</h3>
    <p>No results found for: ${q}</p>
  </div>
  ${solved ? `<div class="success">success_code: <code>${SUCCESS_CODES.reflected}</code></div>` : ""}
  <p>Goal: execute JavaScript by injecting in the <code>q</code> parameter.</p>`;
  res.send(pageTemplate("Lab 1 - Reflected XSS", body));
});

app.get("/lab/stored", (req, res) => {
  const solved = comments.some((comment) => comment.includes("xss-stored-win"));
  const listHtml = comments.map((comment) => `<li>${comment}</li>`).join("");
  const body = `
  <h2>Lab 2: Stored XSS</h2>
  <p>Comments are stored and rendered unsafely.</p>
  <form method="post" action="/lab/stored/comment">
    <label>Add comment</label>
    <textarea name="comment" rows="4" placeholder="Write your comment"></textarea>
    <button type="submit">Post</button>
  </form>
  <form method="post" action="/lab/stored/reset">
    <button type="submit">Reset comments</button>
  </form>
  <div class="card">
    <h3>Public comments</h3>
    <ul>${listHtml || "<li>No comments yet.</li>"}</ul>
  </div>
  ${solved ? `<div class="success">success_code: <code>${SUCCESS_CODES.stored}</code></div>` : ""}
  <p>Goal: store a payload that executes when this page loads.</p>`;
  res.send(pageTemplate("Lab 2 - Stored XSS", body));
});

app.post("/lab/stored/comment", (req, res) => {
  const comment = req.body.comment || "";
  comments.push(comment);
  res.redirect("/lab/stored");
});

app.post("/lab/stored/reset", (_req, res) => {
  comments.length = 0;
  res.redirect("/lab/stored");
});

app.get("/lab/dom", (_req, res) => {
  const body = `
  <h2>Lab 3: DOM XSS</h2>
  <p>This page reads <code>window.location.hash</code> and injects it with <code>innerHTML</code>.</p>
  <div class="card">
    <p id="output">Waiting for hash value...</p>
  </div>
  <p>Try a URL fragment like: <code>#hello</code></p>
  <div id="result"></div>
  <script>
    const value = decodeURIComponent(window.location.hash.slice(1));
    document.getElementById("output").innerHTML = "Preview: " + value;

    if (value.includes("xss-dom-win")) {
      document.getElementById("result").innerHTML =
        '<div class="success">success_code: <code>${SUCCESS_CODES.dom}</code></div>';
    }
  </script>
  <p>Goal: execute JavaScript through the URL hash fragment.</p>`;
  res.send(pageTemplate("Lab 3 - DOM XSS", body));
});

app.listen(port, () => {
  console.log(`XSS training app running on http://localhost:${port}`);
});
