# 🏗️ Abdullah Al Maksud — Server Architecture Blueprint

This document details the engineering principles, architectural patterns, and runtime lifecycles powering the **Abdullah Al Maksud Core API Server**.

---

## 1. High-Level Architectural Diagram

```
                                      ┌─────────────────────────────────────┐
                                      │         Client Ecosystem            │
                                      │  Portfolio Web · Admin UI · cURL    │
                                      └──────────────────┬──────────────────┘
                                                         │
                                                         ▼
                                      ┌─────────────────────────────────────┐
                                      │      Edge Network & Gateway         │
                                      │  Vercel Edge CDN / NGINX / DNS      │
                                      └──────────────────┬──────────────────┘
                                                         │
                                                         ▼
                                      ┌─────────────────────────────────────┐
                                      │          Runtime Adapter            │
                                      │  Vercel Serverless OR Node.js Host  │
                                      └──────────────────┬──────────────────┘
                                                         │
                                                         ▼
                                      ┌─────────────────────────────────────┐
                                      │     CORS & Security Origin Guard    │
                                      │ Apex, Subdomain, Localhost Matcher  │
                                      └──────────────────┬──────────────────┘
                                                         │
                          ┌──────────────────────────────┴──────────────────────────────┐
                          ▼                                                             ▼
            ┌───────────────────────────┐                                 ┌───────────────────────────┐
            │    /api/auth/* Engine     │                                 │     Session Middleware    │
            │  BetterAuth (Body Buffer) │                                 │  Populates Context User   │
            └─────────────┬─────────────┘                                 └─────────────┬─────────────┘
                          │                                                             │
                          │                                                             ▼
                          │                                               ┌───────────────────────────┐
                          │                                               │     RBAC Role Guard       │
                          │                                               │ (requireAdmin / adminOnly)│
                          │                                               └─────────────┬─────────────┘
                          │                                                             │
                          ▼                                                             ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           Hono Controller Layer                                        │
│  [Health] [Projects] [Blogs] [Books] [Case Studies] [Designs] [About] [Contact] [Upload] [Dashboard]   │
└───────────────────────────────────────────────────┬────────────────────────────────────────────────────┘
                                                    │
                                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                         Storage & External Services                                    │
│   • MongoDB Atlas (Mongoose v9 native MongoClient reuse)                                               │
│   • GitHub Private Assets Store & Cloudflare Edge CDN (assets.abdullahalmaksud.com)                    │
│   • Asynchronous Markdown Backup Synchronization (.md with YAML Frontmatter)                           │
│   • Resend Transactional Email API (with Local Dev Simulation)                                         │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Dual Runtime Execution Pattern

The server is architected to operate identically in two distinct environments without code alterations:

### 2.1 Persistent Node.js Runtime (Local Development, Docker & Render)

- **Entrypoint:** `src/index.ts`
- **Mechanism:** Initializes Mongoose connection pool on boot via `connectDatabases()`, then starts the `@hono/node-server` listener on `HOST:PORT`.
- **Benefits:** Fast hot-reloading with `tsx --watch`, long-lived TCP connection pool, minimal latency overhead.

### 2.2 Serverless Function Runtime (Vercel Production)

- **Entrypoint:** `api/index.ts`
- **Mechanism:** Vercel routes all requests to `api/index.ts` via `vercel.json` rewrites. A Node.js `IncomingMessage`/`ServerResponse` listener converts requests into standard Web `Request`/`Response` objects via `getRequestListener(app.fetch)`.
- **Cold-Start Elimination:** Connection promises are cached globally on `globalThis.mongooseCache` to reuse established connections across warm serverless invocations.

---

## 3. MongoDB Atlas Connection Lifecycle & Client Sharing

### 3.1 The Zero-Cold-Start Strategy

Typical serverless apps using both Mongoose (for application ODM) and BetterAuth (for auth persistence) instantiate **two independent database connections**, doubling cold-start latency and exhausting MongoDB connection limits.

To solve this, our architecture shares the native MongoDB client:

1. `connectDatabase()` connects Mongoose to Atlas with optimized serverless settings:
   - `bufferCommands: false` (prevents memory leaks when disconnecting)
   - `serverSelectionTimeoutMS: 5000` (fails fast on network partitions)
   - `maxPoolSize: 5` (strictly bounds serverless pool proliferation)
2. BetterAuth's `mongodbAdapter` is initialized using `getAuthDb()`, which extracts the underlying native driver client directly from `mongoose.connection.client`:
   ```typescript
   // src/lib/database.ts
   export const getAuthMongoClient = () => {
     const client = (mongoose.connection as any).client;
     if (!client) throw new Error("Mongoose not connected — call connectDatabase() first");
     return client;
   };
   export const getAuthDb = () => getAuthMongoClient().db(env.MONGODB_DB_NAME);
   ```
3. BetterAuth uses the exact same underlying TLS socket, reducing cold-start round-trips from 2 to 1.

---

## 4. Body Stream Exhaustion & BetterAuth Isolation

In HTTP frameworks with web-standard streams, reading the request body locks or drains the stream.
In Vercel Serverless:

1. When `@hono/node-server`'s `getRequestListener` transforms an `IncomingMessage` into a Web `Request`, stream consuming logic inside general middlewares can lock the body.
2. If BetterAuth's `auth.handler(webRequest)` tries to read the body subsequently, it hangs indefinitely, resulting in a **`504 Gateway Timeout`**.

### The Solution:

- In `api/index.ts`, requests directed to `/api/auth/*` are intercepted **before reaching Hono**:
  ```typescript
  if (req.url?.startsWith("/api/auth")) {
    return handleAuthRequest(req, res);
  }
  ```
- The raw byte chunks are pre-buffered into a `Buffer` (`readBody(req)`), and a fresh Web `Request` is passed directly to `getAuth().handler(webRequest)`.
- In `src/app.ts`, `sessionMiddleware` explicitly skips execution for `/api/auth/*` to prevent duplicate reading.

---

## 5. Security & CORS Architecture

The application enforces an origin-matching security policy in `src/lib/env.ts`:

### Allowed Origin Categories:

1. **Explicit Whitelist (`CORS_ORIGIN`):** Parsed as comma-separated origins, with automated `www.` and apex variants.
2. **Apex & Subdomains:** Any origin with host matching `abdullahalmaksud.com` or ending in `.abdullahalmaksud.com` (e.g. `chief.abdullahalmaksud.com`, `admin.abdullahalmaksud.com`).
3. **Localhost & Loopback:** Any port on `localhost` or `127.0.0.1` for local development.
4. **Vercel Deployments:** Any domain ending in `.vercel.app` containing `abdullahalmaksud`.

### Cookie Security:

- `useSecureCookies: env.NODE_ENV === "production"`
- `crossSubDomainCookies`: Configured via `COOKIE_DOMAIN` (e.g. `.abdullahalmaksud.com`) so administrative sessions persist seamlessly across frontend apps.

---

## 6. Layered Module Design Pattern

Each module in `src/modules/*` adheres to strict architectural separation of concerns:

```
src/modules/<module-name>/
├── <module>.routes.ts       ← Hono router definitions & middleware attachments
├── <module>.controller.ts   ← HTTP request handling, validation parsing, responses
├── <module>.model.ts        ← Mongoose schema definitions, pre-save hooks, toJSON transforms
└── <module>.validation.ts   ← Zod validation schemas for create/update mutations
```

### Flow of Execution:

1. **Route Layer:** Maps HTTP verb and path, attaching `requireAdmin` or `adminOnly` if private.
2. **Middleware Layer:** `sessionMiddleware` injects session and user into Hono Context.
3. **Controller Layer:** Reads request parameters, verifies Zod validation schemas (`safeParse`), invokes Mongoose models.
4. **Model Layer:** Enforces unique slug indexes, executes pre-save alias normalization, and transforms `_id` to `id` in `toJSON`.
5. **Response Layer:** Returns uniform JSON structure with exact HTTP status codes.

---

## 7. Storage & External Services Pipeline

### 7.1 GitHub Private Asset Store & Cloudflare Edge CDN

- **Storage Target:** Assets are committed to a private GitHub repository (`abdullahalmaksud-assets` or `aam-files`) under `images/{module}/{folderKey}/{filename}-{suffix}.webp`.
- **Immutable `folderKey`:** On creation, an immutable natural language identifier is generated and saved in MongoDB. Subsequent SEO slug changes never break image URLs or file paths.
- **Edge Delivery:** Assets are served globally via Cloudflare Edge CDN through the custom branded domain `https://assets.abdullahalmaksud.com`.
- **Edge Worker:** A Cloudflare Worker transparently authenticates with the private GitHub repository using `GITHUB_TOKEN` and caches responses at Cloudflare's edge for 1 year (`Cache-Control: public, max-age=31536000, immutable`).
- **Markdown Content Sync:** Blog posts, projects, case studies, and book records are asynchronously serialized into clean Markdown (`.md`) with YAML Frontmatter and committed to `content/{module}/{folderKey}.md` in the background for version-controlled backup.
- **Admin Media Manager:** The `GET /api/v1/upload` endpoint queries the GitHub Git Trees API (`recursive=1`), preserving 100% backward compatibility with the Admin Panel's Media Gallery and file browser dialogs.

### 7.2 Resend Transactional Email Engine

- Contact form submissions dispatch transactional emails using the modern Resend REST API.
- **Local Dev Simulation Fallback:** If `RESEND_API_KEY` is not present, email parameters are printed to the console in a highlighted block, returning a valid `{ "success": true, "simulated": true }` response so local testing is never blocked.
