# 📚 Abdullah Al Maksud — Server Documentation Hub

Welcome to the central documentation hub for **Abdullah Al Maksud API Server**. This documentation suite provides complete architectural insights, API specifications, database schemas, deployment instructions, and testing guides for developers, frontend engineers, and DevOps.

> **System Core:** [Hono v4](https://hono.dev/) · **Runtime:** Node.js (>=20.x) & Vercel Serverless · **Language:** TypeScript 5 (Strict ESM)  
> **Database:** MongoDB Atlas (Mongoose v9) · **Auth:** BetterAuth (Passwordless Email OTP & RBAC)  
> **Package Manager:** **`pnpm` (v10)**

---

## 📑 Documentation Index

| Document                                                   | Language        | Description                                                                                                                                          |
| :--------------------------------------------------------- | :-------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**`API_DOCUMENTATION.md`**](./API_DOCUMENTATION.md)       | English         | Comprehensive RESTful API Reference guide covering all 11 modules, authentication flows, request/response payloads, and error codes.                 |
| [**`API_DOCUMENTATION_BN.md`**](./API_DOCUMENTATION_BN.md) | বাংলা (Bengali) | সম্পূর্ণ ও বিস্তারিত বাংলা এপিআই নির্দেশিকা (ভার্সন ৭.০), ডাটা স্কিমা, ফিল্ড এলিয়াস এবং ব্যবহারের নিয়মাবলী।                                         |
| [**`ARCHITECTURE.md`**](./ARCHITECTURE.md)                 | English         | Deep-dive architectural blueprint: dual-runtime model, MongoDB Atlas client sharing, stream buffering guards, CORS origin engine, and RBAC pipeline. |
| [**`DATABASE_SCHEMA.md`**](./DATABASE_SCHEMA.md)           | English         | Complete MongoDB Atlas schema specifications, TypeScript data models, Mongoose transforms, pre-save hooks, and indexing strategy.                    |
| [**`DEPLOYMENT_GUIDE.md`**](./DEPLOYMENT_GUIDE.md)         | English         | Production deployment manual for Vercel Serverless, Render, Docker, custom domains, environment variables, and Atlas network security.               |
| [**`POSTMAN_GUIDE.md`**](./POSTMAN_GUIDE.md)               | English         | Step-by-step user guide for importing and executing the automated Postman v2.1.0 test suite with dynamic token capture.                              |
| [**`postman_collection.json`**](./postman_collection.json) | JSON            | Ready-to-import Postman Collection v2.1.0 containing 60+ pre-configured API requests covering all endpoints.                                         |

---

## 🏛️ System Architecture At A Glance

```
                                  ┌────────────────────────┐
                                  │   Client Applications  │
                                  │  Web, Admin, cURL, CLI │
                                  └───────────┬────────────┘
                                              │
                                              ▼
                                  ┌────────────────────────┐
                                  │   CORS & Origin Guard  │
                                  │ (Apex, Subdomains, Dev)│
                                  └───────────┬────────────┘
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    ▼                                                   ▼
        ┌───────────────────────┐                           ┌───────────────────────┐
        │   /api/auth/* Routes  │                           │   Session Middleware  │
        │  (BetterAuth Engine)  │                           │  (Populates c.user)   │
        └───────────┬───────────┘                           └───────────┬───────────┘
                    │                                                   │
                    │                                                   ▼
                    │                                       ┌───────────────────────┐
                    │                                       │   Admin & RBAC Guard  │
                    │                                       │ (adminOnly, requireAdmin)│
                    │                                       └───────────┬───────────┘
                    │                                                   │
                    ▼                                                   ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           Hono Controller Layer                                        │
│  [Health] [Projects] [Blogs] [Books] [Case Studies] [Designs] [About] [Contact] [Upload] [Dashboard]   │
└───────────────────────────────────────────────────┬────────────────────────────────────────────────────┘
                                                    │
                                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                         Storage & External Services                                    │
│   • MongoDB Atlas (Mongoose v9 native MongoClient sharing)                                             │
│   • Vercel Blob Object Storage (@vercel/blob)                                                          │
│   • Resend Transactional Email API (with Local Dev Simulation)                                         │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start for Developers

### 1. Prerequisites

- **Node.js**: `v20.x` or higher
- **pnpm**: `v10.x` (`npm install -g pnpm`)
- **MongoDB**: MongoDB Atlas URI or local instance (`mongodb://localhost:27017`)

### 2. Setup & Installation

```bash
# Clone the repository and navigate to server directory
cd AbdullahAlMaksudServer

# Install dependencies using pnpm
pnpm install

# Setup environment variables
cp .env.example .env
```

### 3. Start Development Server

```bash
# Starts hot-reloading development server on http://localhost:5000
pnpm dev
```

### 4. Verify Server Health

Open your browser or run:

```bash
curl http://localhost:5000/health
```

Expected Response:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "uptime": 12.34,
    "uptimeFormatted": "12s",
    "database": {
      "state": "connected",
      "host": "cluster0.mongodb.net"
    },
    "timestamp": "2026-10-31T03:45:00.000Z"
  }
}
```

---

## 📦 Core Modules Summary

| Module              | Route Prefix            | Permissions      | Primary Responsibility                                                                 |
| :------------------ | :---------------------- | :--------------- | :------------------------------------------------------------------------------------- |
| **System & Health** | `/` & `/health`         | Public           | System uptime, MongoDB connectivity status, interactive HTML status dashboard.         |
| **Authentication**  | `/api/auth` & `/api/me` | Public / Session | Passwordless Email OTP authentication, session management, profile updates.            |
| **Projects**        | `/api/v1/projects`      | Public / Admin   | Software engineering portfolio with tech stacks, links, and rich block content.        |
| **Blogs**           | `/api/v1/blogs`         | Public / Admin   | Technical articles, essays, Lexical editor blocks, tags, and reading estimates.        |
| **Books & Shelf**   | `/api/v1/books`         | Public / Admin   | Featured book showcases, reader stats, shelf collections, and standalone books.        |
| **Case Studies**    | `/api/v1/case-studies`  | Public / Admin   | Architectural deep dives with metrics, challenge/solution breakdowns, and tech stacks. |
| **Graphic Design**  | `/api/v1/designs`       | Public / Admin   | Visual identity, typography, brand system showcases with toolsets and links.           |
| **About**           | `/api/v1/about`         | Public / Admin   | Centralized biography, pillars, career experience, education, and skill categories.    |
| **Contact**         | `/api/v1/contact`       | Public           | Visitor consultation requests and transactional email dispatch via Resend.             |
| **Dashboard**       | `/api/v1/dashboard`     | 🔒 Admin         | Real-time content counters, entity metrics, and administrative notifications.          |
| **File Upload**     | `/api/v1/upload`        | 🔒 Admin         | High-performance media uploads to Vercel Blob with automated filename sanitization.    |

---

## 🤝 Contributing & Code Quality

The server adheres to strict automated code quality standards enforced via **Husky** and **Commitlint**:

- **Linting & Formatting**: `pnpm lint:fix` and `pnpm format`
- **Type Checking**: `pnpm typecheck`
- **Conventional Commits**: Every commit message must follow the Conventional Commits specification (e.g. `feat: implement book chapters`, `fix: resolve cors origin regex`).
