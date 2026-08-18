import { env } from "../../lib/env.js";

export const renderRootHtml = (currentOrigin: string) => {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Abdullah Al Maksud — Portfolio API Hub</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(15, 23, 42, 0.75);
      --card-border: rgba(255, 255, 255, 0.08);
      --primary: #38bdf8;
      --primary-glow: rgba(56, 189, 248, 0.25);
      --accent: #10b981;
      --accent-glow: rgba(16, 185, 129, 0.25);
      --text: #f1f5f9;
      --text-muted: #94a3b8;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      position: relative;
      overflow-x: hidden;
    }

    /* Ambient background glow */
    .ambient-glow {
      position: fixed;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      filter: blur(140px);
      opacity: 0.18;
    }
    .glow-1 {
      top: -200px;
      left: 10%;
      background: radial-gradient(circle, #38bdf8, #6366f1);
    }
    .glow-2 {
      bottom: -200px;
      right: 10%;
      background: radial-gradient(circle, #10b981, #06b6d4);
    }

    .container {
      width: 100%;
      max-width: 900px;
      position: relative;
      z-index: 1;
    }

    /* Header Section */
    .header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.35rem 0.9rem;
      border-radius: 9999px;
      margin-bottom: 1.25rem;
      box-shadow: 0 0 20px var(--accent-glow);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      position: relative;
    }
    .status-dot::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: #10b981;
      opacity: 0.6;
      animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    @keyframes ping {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(2.2); opacity: 0; }
    }

    h1 {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #ffffff 30%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.75rem;
    }

    .subtitle {
      color: var(--text-muted);
      font-size: 1.05rem;
      max-width: 580px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* Stack Badges */
    .stack-pills {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1.25rem;
    }
    .pill {
      font-size: 0.78rem;
      font-family: 'JetBrains Mono', monospace;
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--card-border);
      color: #cbd5e1;
    }

    /* Main Grid */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.5rem;
      backdrop-filter: blur(12px);
      transition: all 0.25s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-decoration: none;
      color: inherit;
      position: relative;
      overflow: hidden;
    }

    .card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 16px;
      padding: 1px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    .card:hover {
      transform: translateY(-4px);
      border-color: rgba(56, 189, 248, 0.4);
      box-shadow: 0 12px 30px -10px var(--primary-glow);
    }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.85rem;
    }

    .method-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }
    .method-get {
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }
    .method-crud {
      background: rgba(168, 85, 247, 0.15);
      color: #c084fc;
      border: 1px solid rgba(168, 85, 247, 0.3);
    }

    .card-icon {
      font-size: 1.35rem;
    }

    .card-title {
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 0.35rem;
      color: #f8fafc;
    }

    .card-path {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82rem;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.08);
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 0.65rem;
      word-break: break-all;
    }

    .card-desc {
      color: var(--text-muted);
      font-size: 0.88rem;
      line-height: 1.5;
    }

    /* Footer & Actions */
    .footer {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.25rem 1.75rem;
      backdrop-filter: blur(12px);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .footer-links {
      display: flex;
      gap: 1.25rem;
      flex-wrap: wrap;
    }

    .footer-link {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
      transition: color 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .footer-link:hover {
      color: #38bdf8;
    }

    .json-link {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #64748b;
    }

    @media (max-width: 640px) {
      .footer {
        flex-direction: column;
        text-align: center;
      }
      .footer-links {
        justify-content: center;
      }
    }
  </style>
</head>
<body>
  <div class="ambient-glow glow-1"></div>
  <div class="ambient-glow glow-2"></div>

  <div class="container">
    <header class="header">
      <div class="status-badge">
        <span class="status-dot"></span>
        All Systems Operational
      </div>
      <h1>Abdullah Al Maksud</h1>
      <p class="subtitle">
        High-performance modular REST API server powering portfolio, software projects, blog articles, and reading list.
      </p>
      <div class="stack-pills">
        <span class="pill">⚡ Hono v4</span>
        <span class="pill">🔷 TypeScript</span>
        <span class="pill">🍃 MongoDB Atlas</span>
        <span class="pill">🔒 Better Auth</span>
        <span class="pill">▲ Vercel Edge/Serverless</span>
      </div>
    </header>

    <div class="grid">
      <!-- Health Check -->
      <a href="/health" class="card" target="_blank" rel="noopener">
        <div>
          <div class="card-top">
            <span class="method-badge method-get">GET</span>
            <span class="card-icon">💚</span>
          </div>
          <div class="card-title">System Health</div>
          <div class="card-path">/health</div>
          <p class="card-desc">Check database connection status, server uptime, and environment diagnostics.</p>
        </div>
      </a>

      <!-- Software Projects -->
      <a href="/api/v1/projects" class="card" target="_blank" rel="noopener">
        <div>
          <div class="card-top">
            <span class="method-badge method-crud">CRUD</span>
            <span class="card-icon">🚀</span>
          </div>
          <div class="card-title">Software Projects</div>
          <div class="card-path">/api/v1/projects</div>
          <p class="card-desc">Dynamic project showcase, tech stack list, core features, and live demo links.</p>
        </div>
      </a>

      <!-- Blog Posts -->
      <a href="/api/v1/blogs" class="card" target="_blank" rel="noopener">
        <div>
          <div class="card-top">
            <span class="method-badge method-crud">CRUD</span>
            <span class="card-icon">📝</span>
          </div>
          <div class="card-title">Blog Articles</div>
          <div class="card-path">/api/v1/blogs</div>
          <p class="card-desc">Markdown-powered tech articles, tutorial guides, pagination, and publish filters.</p>
        </div>
      </a>

      <!-- Books -->
      <a href="/api/v1/books" class="card" target="_blank" rel="noopener">
        <div>
          <div class="card-top">
            <span class="method-badge method-crud">CRUD</span>
            <span class="card-icon">📚</span>
          </div>
          <div class="card-title">Reading List</div>
          <div class="card-path">/api/v1/books</div>
          <p class="card-desc">Curated books collection, reviews, star ratings, and recommendation tags.</p>
        </div>
      </a>

      <!-- Site Meta -->
      <a href="/api/v1/site?locale=en" class="card" target="_blank" rel="noopener">
        <div>
          <div class="card-top">
            <span class="method-badge method-get">GET</span>
            <span class="card-icon">🌐</span>
          </div>
          <div class="card-title">Site Metadata</div>
          <div class="card-path">/api/v1/site</div>
          <p class="card-desc">Multi-locale navigation schema, social connections, and profile information.</p>
        </div>
      </a>

      <!-- Authentication -->
      <a href="/api/me" class="card" target="_blank" rel="noopener">
        <div>
          <div class="card-top">
            <span class="method-badge method-get">AUTH</span>
            <span class="card-icon">🔐</span>
          </div>
          <div class="card-title">User Session</div>
          <div class="card-path">/api/me</div>
          <p class="card-desc">Better Auth user session inspector, cookie verification, and role permissions.</p>
        </div>
      </a>
    </div>

    <footer class="footer">
      <div class="footer-links">
        <a href="${env.CORS_ORIGIN || 'https://abdullahalmaksud.com'}" class="footer-link" target="_blank" rel="noopener">
          <span>🌐</span> Portfolio Website
        </a>
        <a href="https://github.com/AbdullahAlMaksud/abdullahalmaksud-server" class="footer-link" target="_blank" rel="noopener">
          <span>🐙</span> GitHub Repository
        </a>
      </div>
      <a href="/?format=json" class="json-link">JSON Response &rarr;</a>
    </footer>
  </div>
</body>
</html>`;
};
