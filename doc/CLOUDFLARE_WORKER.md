# 🌩️ Cloudflare Worker: Private GitHub Asset CDN Setup Guide

This guide walks you through deploying the Cloudflare Worker that delivers images from your **Private GitHub Repository** via **`https://assets.abdullahalmaksud.com`** with global Cloudflare Edge Caching.

---

## 📋 Architecture Overview

1. **Client / Browser:** Requests `https://assets.abdullahalmaksud.com/images/blog/how-to-code/diagram-k123.webp`.
2. **Cloudflare Edge Cache:** If the image is cached, Cloudflare serves it immediately (0ms origin latency, $0 egress fee).
3. **Cloudflare Worker (on cache miss):**
   - Injects your secret `GITHUB_TOKEN`.
   - Fetches the raw file from `https://raw.githubusercontent.com/<owner>/<repo>/<branch>/images/...`.
   - Caches the file in the Cloudflare Edge Cache for 1 year (`Cache-Control: public, max-age=31536000, immutable`).
   - Returns the image with the appropriate MIME type.

---

## 🛠️ Step 1: Create Worker in Cloudflare Dashboard

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com).
2. In the left navigation, click **Workers & Pages** → **Overview**.
3. Click **Create Application** → **Create Worker**.
4. Give it a name: `assets-worker` (or `aam-assets`).
5. Click **Deploy**.

---

## 💻 Step 2: Paste Worker Script

1. In the Worker details page, click **Edit code** (Quick Edit).
2. Replace all existing code with the following production-ready script:

```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Only allow GET and HEAD requests
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    // Health check endpoint
    if (pathname === "/health" || pathname === "/") {
      return new Response("Assets CDN Online", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // Check Cloudflare Edge Cache first
    const cache = caches.default;
    let response = await cache.match(request);
    if (response) {
      return response;
    }

    // Configuration from environment variables
    const repoOwner = env.REPO_OWNER || "AbdullahAlMaksud";
    const repoName = env.REPO_NAME || "aam-files";
    const branch = env.BRANCH || "main";
    const cleanPath = pathname.replace(/^\/+/, "");

    const githubRawUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${cleanPath}`;

    const headers = {
      "User-Agent": "Cloudflare-Assets-Worker",
    };

    if (env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${env.GITHUB_TOKEN}`;
    }

    const githubResponse = await fetch(githubRawUrl, { headers });

    if (!githubResponse.ok) {
      return new Response(`Asset not found (${githubResponse.status})`, {
        status: githubResponse.status,
      });
    }

    // Determine correct Content-Type from extension
    const extMatch = pathname.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : "";

    const mimeTypes = {
      webp: "image/webp",
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      svg: "image/svg+xml",
      gif: "image/gif",
      avif: "image/avif",
      pdf: "application/pdf",
      md: "text/markdown; charset=utf-8",
    };

    const contentType =
      mimeTypes[ext] || githubResponse.headers.get("content-type") || "application/octet-stream";

    // Cache aggressively: 1 year public cache on Cloudflare edge
    response = new Response(githubResponse.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
        "X-Served-By": "Cloudflare-Edge-Worker",
      },
    });

    // Store in Cloudflare Edge Cache asynchronously
    ctx.waitUntil(cache.put(request, response.clone()));
    return response;
  },
};
```

3. Click **Save and Deploy**.

---

## 🔑 Step 3: Add Secret Token in Cloudflare

1. Back on the Worker page, go to **Settings** → **Variables and Secrets**.
2. Under **Secrets**, click **Add**:
   - **Variable name:** `GITHUB_TOKEN`
   - **Type:** `Secret` (Encrypted)
   - **Value:** Your GitHub Personal Access Token (`github_pat_...` or `ghp_...`)
3. (Optional) Under **Environment Variables**, add:
   - `REPO_OWNER` = `AbdullahAlMaksud`
   - `REPO_NAME` = `aam-files`
   - `BRANCH` = `main` (or `dev`)
4. Click **Deploy**.

---

## 🌐 Step 4: Connect Custom Domain (`assets.abdullahalmaksud.com`)

1. In the Worker page, go to **Settings** → **Domains & Routes**.
2. Click **Add** → **Custom Domain**.
3. Type: `assets.abdullahalmaksud.com`.
4. Click **Add Custom Domain**. Cloudflare will automatically configure the DNS record and provision an SSL certificate within 1-2 minutes.
5. Verify by visiting `https://assets.abdullahalmaksud.com/health` in your browser. You should see:
   ```text
   Assets CDN Online
   ```

---

## 🧹 Cache Purging (When Replacing Images)

If an image is ever replaced with the exact same filename and you want to instantly invalidate Cloudflare's edge cache:

1. In Cloudflare Dashboard, go to your domain **abdullahalmaksud.com** → **Caching** → **Configuration**.
2. Under **Purge Cache**, click **Custom Purge**.
3. Enter the URL: `https://assets.abdullahalmaksud.com/images/...` and click **Purge**.
