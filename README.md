# Abdullah Al Maksud — Core API Server

High-performance, modular backend API powering the **Abdullah Al Maksud Portfolio** and **Admin Management Portal**. Built on **Hono**, **Node.js**, **TypeScript**, **Mongoose / MongoDB Atlas**, **BetterAuth**, **Resend**, and **Vercel Blob**.

> **Package Manager Notice**: This project exclusively uses **`pnpm`**. Do not use `npm`, `yarn`, or `bun`.

---

## Tech Stack & Architecture

- **Web Framework**: [Hono](https://hono.dev/) v4 (Edge & Node.js runtime)
- **Runtime**: Node.js (>= 20.x) with `@hono/node-server`
- **Language**: TypeScript 5 (Strict ESM)
- **Database & ODM**: MongoDB Atlas with [Mongoose](https://mongoosejs.com/) v9
- **Authentication**: [BetterAuth](https://better-auth.com/) with sessions & Google OAuth
- **Email Delivery**: [Resend](https://resend.com/) API for transactional emails and contact inquiries
- **Object Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) for cover images, monographs, and screenshots
- **Validation**: [Zod](https://zod.dev/) v4
- **Package Manager**: **`pnpm`** (v10)

---

## Quick Start

### 1. Install Dependencies

Ensure you have [pnpm](https://pnpm.io/) installed:

```bash
# Core install
pnpm install
```

### 2. Environment Variables

Create your local `.env` file (refer to `.env.example`):

```bash
cp .env.example .env
```

Key environment variables:

```env
NODE_ENV=development
HOST=0.0.0.0
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/abdullahalmaksud_dev
MONGODB_DB_NAME=abdullahalmaksud_dev
REQUIRE_DATABASE_CONNECTION=false
BETTER_AUTH_SECRET=your-random-32-char-secret-here
BETTER_AUTH_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:3000,http://localhost:4000
ADMIN_EMAILS=your_email@gmail.com
RESEND_API_KEY=re_xxxxxxxxxxxx
```

### 3. Run Development Server

```bash
pnpm dev
```

The server starts on **`http://localhost:5000`**.

### 4. Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Starts local development server with hot-reload via `tsx --watch` |
| `pnpm start` | Runs server in standard mode |
| `pnpm typecheck` | Validates strict TypeScript compilation (`tsc --noEmit`) |
| `pnpm seed` | Seeds default initial data into MongoDB |

---

## RESTful API Endpoints & CRUD Architecture

All endpoints are available under `/api/v1` (with backward-compatible unversioned `/api` aliases).

### 1. Books (`/api/v1/books`)
Full CRUD for book publications, shelf showcases, and monograph metadata.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/books` | Public | Featured book bundle & shelf showcase data |
| `GET` | `/api/v1/books/all` | Public | List of all standalone books |
| `GET` | `/api/v1/books/:slug` | Public | Get single book by slug with publication metadata |
| `GET` | `/api/v1/books/id/:id` | Admin | Get book by MongoDB ObjectId |
| `PUT` | `/api/v1/books/bundle` | Admin | Update featured book bundle |
| `POST` | `/api/v1/books` | Admin | Create new standalone book with chapters & quotes |
| `PUT` | `/api/v1/books/:id` | Admin | Replace book record |
| `PATCH` | `/api/v1/books/:id` | Admin | Partial update book record |
| `DELETE` | `/api/v1/books/:id` | Admin | Delete book record |

### 2. Blogs & Essays (`/api/v1/blogs`)
Full CRUD with support for **Block Editor / JSON** structured arrays and Lexical editor states.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/blogs` | Public | Paginated blogs list (`?page=1&limit=10&featured=true&category=...`) |
| `GET` | `/api/v1/blogs/:slug` | Public | Get single blog post by slug |
| `GET` | `/api/v1/blogs/id/:id` | Admin | Get blog post by MongoDB ObjectId |
| `POST` | `/api/v1/blogs` | Admin | Create blog post (supports structured Block JSON) |
| `PUT` | `/api/v1/blogs/:id` | Admin | Full update blog post |
| `PATCH` | `/api/v1/blogs/:id` | Admin | Partial update blog post |
| `DELETE` | `/api/v1/blogs/:id` | Admin | Delete blog post |

### 3. Case Studies (`/api/v1/case-studies`)
Full CRUD for strategic implementation deep-dives with metrics, tech stack, and solution architecture.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/case-studies` | Public | Paginated case studies list |
| `GET` | `/api/v1/case-studies/:slug` | Public | Get case study by slug |
| `GET` | `/api/v1/case-studies/id/:id` | Admin | Get case study by MongoDB ObjectId |
| `POST` | `/api/v1/case-studies` | Admin | Create case study |
| `PUT` | `/api/v1/case-studies/:id` | Admin | Full update case study |
| `PATCH` | `/api/v1/case-studies/:id` | Admin | Partial update case study |
| `DELETE` | `/api/v1/case-studies/:id` | Admin | Delete case study |

### 4. Projects (`/api/v1/projects`)
Full CRUD for engineering systems, architecture prototypes, and design modules.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/projects` | Public | Get all projects (paginated or list) |
| `GET` | `/api/v1/projects/:slug` | Public | Get project by slug |
| `GET` | `/api/v1/projects/id/:id` | Admin | Get project by MongoDB ObjectId |
| `POST` | `/api/v1/projects` | Admin | Create project (supports `content` Block JSON) |
| `PUT` | `/api/v1/projects/:id` | Admin | Full update project |
| `PATCH` | `/api/v1/projects/:id` | Admin | Partial update project |
| `DELETE` | `/api/v1/projects/:id` | Admin | Delete project |

### 5. Contact & Email Inquiries (`/api/send-email` & `/api/v1/contact`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/send-email` | Public | Send client contact inquiry via Resend |
| `GET` | `/api/v1/contact/messages` | Admin | Retrieve stored inquiries list |

### 6. Uploads & Storage (`/api/v1/upload`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/upload` | Admin | Upload image/document to Vercel Blob storage |

### 7. Auth & System Health

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Server & Database health status |
| `GET` | `/api/me` | Authenticated | Current user profile and role |
| `POST` | `/api/auth/sign-up/email` | Public | Email signup |
| `POST` | `/api/auth/sign-in/email` | Public | Email signin |
| `POST` | `/api/auth/sign-out` | Public | Signout |

---

## Block Editor / JSON Format

The API natively stores and serves structured **Block Editor / JSON** payloads instead of raw markdown strings. Content can be supplied as:

```json
[
  {
    "id": "block-1",
    "type": "heading",
    "data": { "level": 2, "text": "Architectural Foundation" }
  },
  {
    "id": "block-2",
    "type": "paragraph",
    "data": { "text": "This monograph details the distributed system implementation..." }
  },
  {
    "id": "block-3",
    "type": "code",
    "data": { "code": "const api = new Hono();", "language": "typescript" }
  }
]
```

Legacy string content is automatically supported as fallback.

---

## Postman API Collection

A fully configured Postman collection is included in the root directory:

📁 **`postman_collection.json`**

### Collection Variables:
- `baseUrl`: Defaults to `http://localhost:5000`
- `bearerToken`: Set your admin JWT or session token for authenticated endpoints

Includes 13 categorized folders covering every public and admin CRUD operation across all modules.

---

## Deployment

### Render (Blueprint)
The repository includes `render.yaml` configured for `pnpm`:
- Build Command: `npm install -g pnpm && pnpm install --frozen-lockfile`
- Start Command: `pnpm start`
- Health Check: `/health`

### Vercel Serverless
The serverless entry point is located in `api/index.ts` using `@hono/node-server`'s `getRequestListener` for full compatibility with Vercel Node.js runtime.
