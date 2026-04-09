const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname)));

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
    body { font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif; margin: 0; background: #f8f6f2; color: #1f2937; line-height: 1.5; }
    header { background: #fffdf9; color: #1f2937; padding: 16px 24px; border-bottom: 1px solid #e7dfd1; position: sticky; top: 0; z-index: 10; }
    .topbar { max-width: 980px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .brand-name { font-size: 26px; font-family: Georgia, "Times New Roman", serif; font-weight: 700; letter-spacing: 0.2px; }
    .brand-sub { font-size: 12px; color: #6b7280; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.08em; }
    .badge { font-size: 12px; color: #6b4f2a; background: #fff7ed; border: 1px solid #f5d5a5; padding: 6px 10px; border-radius: 99px; }
    main { max-width: 980px; margin: 24px auto; background: #fffdf9; padding: 22px; border-radius: 12px; box-shadow: 0 8px 24px rgba(42, 32, 16, 0.08); border: 1px solid #ece3d6; }
    h2, h3, h4 { margin-top: 0; font-family: Georgia, "Times New Roman", serif; }
    a { color: #0f4c81; text-decoration: none; }
    a:hover { text-decoration: underline; }
    code { background: #f3f4f6; border: 1px solid #e5e7eb; padding: 2px 6px; border-radius: 4px; }
    .card { border: 1px solid #ece3d6; border-radius: 10px; padding: 14px; margin-bottom: 14px; background: #fffefb; }
    .grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
    .lab-card { border: 1px solid #ece3d6; border-radius: 10px; padding: 14px; background: #fff; }
    .success { background: #ecfdf3; border: 1px solid #86efac; padding: 10px; border-radius: 8px; margin: 12px 0; }
    .warn { background: #fff7ed; border: 1px solid #fdba74; padding: 10px; border-radius: 8px; margin: 12px 0; }
    input, textarea { width: 100%; padding: 10px; margin-top: 6px; margin-bottom: 10px; border: 1px solid #d6c8b4; border-radius: 8px; background: #fffdfa; }
    button { background: #7c3f00; color: #fff; border: 0; padding: 10px 14px; border-radius: 8px; cursor: pointer; font-weight: 600; }
    button:hover { background: #5b2d00; }
    ul { padding-left: 20px; color: #4b5563; }
    .meta { color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <header>
    <div class="topbar">
      <div>
        <div class="brand-name">The Daily Write</div>
        <div class="brand-sub">Stories, opinions, and product notes</div>
      </div>
      <div class="badge">Blog Training Sandbox</div>
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
  <h2>Featured Stories</h2>
  <p class="meta">A realistic blogging front-end used for security training scenarios.</p>
  <div class="grid">
    <div class="lab-card">
      <h3>Article Search Experience</h3>
      <p class="meta">Search terms are reflected directly into rendered page output.</p>
      <a href="/lab/reflected">Read article</a>
    </div>
    <div class="lab-card">
      <h3>Public Comment Threads</h3>
      <p class="meta">Reader comments are stored and shown to all visitors.</p>
      <a href="/lab/stored">Read article</a>
    </div>
    <div class="lab-card">
      <h3>Live Author Bio Preview</h3>
      <p class="meta">Profile preview content is injected from URL hash using <code>innerHTML</code>.</p>
      <a href="/lab/dom">Read article</a>
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
  <script>
    const STORED_HITS_KEY = "xsslab_stored_alert_hits";
    function loadHits() {
      try {
        const parsed = JSON.parse(localStorage.getItem(STORED_HITS_KEY) || "[]");
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    function saveHits(hits) {
      localStorage.setItem(STORED_HITS_KEY, JSON.stringify(hits));
    }
    function logAlertHit(args) {
      const hits = loadHits();
      hits.push({
        at: new Date().toISOString(),
        message: args.map((v) => String(v)).join(" ")
      });
      saveHits(hits);
    }
    const nativeAlert = window.alert.bind(window);
    window.alert = (...args) => {
      logAlertHit(args);
      nativeAlert(...args);
    };
  </script>
  <div class="card">
    <h3>Public comments</h3>
    <ul>${listHtml || "<li>No comments yet.</li>"}</ul>
  </div>
  <div id="storedStatus"></div>
  <script>
    const hits = JSON.parse(localStorage.getItem("xsslab_stored_alert_hits") || "[]");
    const latest = hits.length ? hits[hits.length - 1] : null;
    document.getElementById("storedStatus").innerHTML = hits.length
      ? '<div class="success">success_code: <code>${SUCCESS_CODES.stored}</code><br><span>Executed payloads: '
        + hits.length
        + (latest ? " (last alert: <code>" + String(latest.message).replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</code>)" : "")
        + "</span></div>"
      : "";
  </script>
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
  res.send(`<!doctype html><html><body><script>
    localStorage.removeItem("xsslab_stored_alert_hits");
    window.location.replace("/lab/stored");
  </script></body></html>`);
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
