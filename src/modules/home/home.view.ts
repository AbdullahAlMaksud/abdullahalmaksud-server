export interface HomeViewData {
  status: string;
  health: string;
  uptime: number;
  uptimeFormatted: string;
  database: string;
  timestamp: string;
}

export const renderRootHtml = (data: HomeViewData) => {
  const isHealthy = data.health === "healthy" || data.health === "ok";
  const statusColor = isHealthy ? "#10b981" : "#f59e0b";
  const statusGlow = isHealthy ? "rgba(16, 185, 129, 0.25)" : "rgba(245, 158, 11, 0.25)";
  const statusBadgeBg = isHealthy ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)";
  const statusBadgeBorder = isHealthy ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)";
  const statusText = isHealthy ? "#34d399" : "#fbbf24";

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Server Status — Abdullah Al Maksud API</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #080c14;
      --card-bg: rgba(15, 23, 42, 0.72);
      --card-border: rgba(255, 255, 255, 0.08);
      --card-hover-border: rgba(56, 189, 248, 0.3);
      --primary: #38bdf8;
      --accent: ${statusColor};
      --accent-glow: ${statusGlow};
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --text-subtle: #64748b;
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
      padding: 1.5rem;
      position: relative;
      overflow-x: hidden;
    }

    /* Ambient background glows */
    .ambient-glow {
      position: fixed;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      filter: blur(140px);
      opacity: 0.16;
    }
    .glow-1 {
      top: -150px;
      left: 15%;
      background: radial-gradient(circle, #38bdf8, #6366f1);
    }
    .glow-2 {
      bottom: -150px;
      right: 15%;
      background: radial-gradient(circle, ${statusColor}, #06b6d4);
    }

    .container {
      width: 100%;
      max-width: 680px;
      position: relative;
      z-index: 1;
    }

    /* Main Container Card */
    .status-panel {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 24px;
      padding: 2.5rem 2rem;
      backdrop-filter: blur(20px);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
      position: relative;
      overflow: hidden;
    }

    .status-panel::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
    }

    /* Header */
    .header {
      text-align: center;
      margin-bottom: 2.25rem;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: ${statusBadgeBg};
      border: 1px solid ${statusBadgeBorder};
      color: ${statusText};
      font-size: 0.82rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      padding: 0.35rem 0.95rem;
      border-radius: 9999px;
      margin-bottom: 1.25rem;
      box-shadow: 0 0 24px var(--accent-glow);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
      position: relative;
    }

    .status-dot::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: var(--accent);
      opacity: 0.6;
      animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    @keyframes ping {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(2.4); opacity: 0; }
    }

    h1 {
      font-size: clamp(1.75rem, 4vw, 2.25rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #ffffff 40%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.35rem;
    }

    .subtitle {
      color: var(--text-muted);
      font-size: 0.95rem;
      font-weight: 500;
    }

    /* 3 Focused Metric Cards */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .metric-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.25rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: all 0.25s ease;
      position: relative;
    }

    .metric-card:hover {
      border-color: var(--card-hover-border);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px -6px rgba(0, 0, 0, 0.5);
    }

    .metric-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.68rem;
      font-weight: 600;
      color: var(--text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.65rem;
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .metric-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.35rem;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: -0.02em;
    }

    .metric-value.status-running {
      color: #34d399;
    }

    .metric-value.health-ok {
      color: #38bdf8;
    }

    .metric-value.health-degraded {
      color: #fbbf24;
    }

    .metric-sub {
      font-size: 0.78rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Footer / Actions */
    .panel-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--card-border);
    }

    .timestamp-box {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: var(--text-subtle);
    }

    .timestamp-box span {
      color: var(--text-muted);
    }

    .json-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.78rem;
      font-weight: 500;
      color: var(--primary);
      background: rgba(56, 189, 248, 0.08);
      border: 1px solid rgba(56, 189, 248, 0.2);
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .json-btn:hover {
      background: rgba(56, 189, 248, 0.16);
      border-color: rgba(56, 189, 248, 0.4);
      transform: translateY(-1px);
    }

    @media (max-width: 600px) {
      .status-panel {
        padding: 1.75rem 1.25rem;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }

      .panel-footer {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="ambient-glow glow-1"></div>
  <div class="ambient-glow glow-2"></div>

  <div class="container">
    <div class="status-panel">
      <header class="header">
        <div class="status-badge" id="live-badge">
          <span class="status-dot"></span>
          <span>Server is Running</span>
        </div>
        <h1>Abdullah Al Maksud</h1>
        <p class="subtitle">API Server Status</p>
      </header>

      <div class="metrics-grid">
        <!-- 1. Server Status -->
        <div class="metric-card">
          <span class="metric-tag">
            <span>●</span> Status
          </span>
          <div class="metric-value status-running">Running</div>
          <span class="metric-sub">HTTP Server Active</span>
        </div>

        <!-- 2. System Health -->
        <div class="metric-card">
          <span class="metric-tag">
            <span>💚</span> Health
          </span>
          <div class="metric-value ${isHealthy ? 'health-ok' : 'health-degraded'}">
            ${isHealthy ? 'Healthy' : 'Degraded'}
          </div>
          <span class="metric-sub">Database: ${data.database}</span>
        </div>

        <!-- 3. Uptime -->
        <div class="metric-card">
          <span class="metric-tag">
            <span>⏱️</span> Uptime
          </span>
          <div class="metric-value" id="uptime-display">${data.uptimeFormatted}</div>
          <span class="metric-sub">Continuous Runtime</span>
        </div>
      </div>

      <footer class="panel-footer">
        <div class="timestamp-box">
          System Time: <span id="time-display">${data.timestamp}</span>
        </div>
        <a href="/?format=json" class="json-btn">
          <span>JSON Response</span> &rarr;
        </a>
      </footer>
    </div>
  </div>

  <script>
    // Live ticking uptime counter
    let totalSeconds = ${Math.floor(data.uptime)};
    const pageLoad = Date.now();
    const uptimeEl = document.getElementById('uptime-display');

    function updateLiveUptime() {
      if (!uptimeEl) return;
      const elapsed = Math.floor((Date.now() - pageLoad) / 1000);
      const current = totalSeconds + elapsed;

      const d = Math.floor(current / 86400);
      const h = Math.floor((current % 86400) / 3600);
      const m = Math.floor((current % 3600) / 60);
      const s = Math.floor(current % 60);

      const parts = [];
      if (d > 0) parts.push(d + 'd');
      if (h > 0 || d > 0) parts.push(h + 'h');
      if (m > 0 || h > 0 || d > 0) parts.push(m + 'm');
      parts.push(s + 's');

      uptimeEl.textContent = parts.join(' ');
    }

    setInterval(updateLiveUptime, 1000);
  </script>
</body>
</html>`;
};
