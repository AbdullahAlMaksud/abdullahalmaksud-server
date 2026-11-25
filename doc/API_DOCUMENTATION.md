# 📖 Abdullah Al Maksud — Core Server API Documentation

> **Framework:** Hono v4 · **Runtime:** Node.js (>=20.x) & Vercel Serverless · **Language:** TypeScript 5  
> **Database:** MongoDB Atlas (Mongoose v9) · **Authentication:** BetterAuth (Email OTP & RBAC)  
> **Object Storage:** Vercel Blob · **Email Delivery:** Resend API  
> **Base URL (Local):** `http://localhost:5000`  
> **Base URL (Production):** `https://api.abdullahalmaksud.com`

---

## 📑 Table of Contents

1. [Architectural Overview & Global Standards](#1-architectural-overview--global-standards)
2. [Authentication & Authorization (BetterAuth)](#2-authentication--authorization-betterauth)
3. [System & Health Endpoints](#3-system--health-endpoints)
4. [User Profile Endpoints](#4-user-profile-endpoints)
5. [About Screen Management](#5-about-screen-management)
6. [Software Projects Module](#6-software-projects-module)
7. [Technical Blogs Module](#7-technical-blogs-module)
8. [Books & Shelf Module](#8-books--shelf-module)
9. [Case Studies Module](#9-case-studies-module)
10. [Graphic Design Portfolio Module](#10-graphic-design-portfolio-module)
11. [Contact & Inquiry Module](#11-contact--inquiry-module)
12. [Dashboard & Analytics (Admin Only)](#12-dashboard--analytics-admin-only)
13. [Media & File Upload (Vercel Blob)](#13-media--file-upload-vercel-blob)
14. [Backward Compatibility Aliases](#14-backward-compatibility-aliases)
15. [Global Error Handling & Status Codes](#15-global-error-handling--status-codes)

---

## 1. Architectural Overview & Global Standards

### 1.1 Dual Runtime Architecture

- **Local / Containerized:** Operates as a persistent Node.js HTTP server via `@hono/node-server` (`src/index.ts`).
- **Serverless (Vercel):** Executed as a Node.js Serverless Function via `api/index.ts`. BetterAuth raw body streams are pre-buffered before execution to prevent request body stream exhaustion.

### 1.2 Global Request Headers

| Header                           | Required For     | Description                                                 |
| :------------------------------- | :--------------- | :---------------------------------------------------------- |
| `Content-Type: application/json` | POST, PUT, PATCH | Mandatory for JSON bodies.                                  |
| `Authorization: Bearer <token>`  | Protected Routes | Bearer token received during login.                         |
| `Cookie: auth_session=...`       | Protected Routes | Cookie-based session credential (supports cross-subdomain). |
| `Accept: application/json`       | Public / Root    | Requests JSON payload format instead of HTML.               |

### 1.3 Global Standard Success Response Envelope

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### 1.4 Global Standard Paginated Response Envelope

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

## 2. Authentication & Authorization (BetterAuth)

The server enforces passwordless security via **BetterAuth** with 6-digit Email One-Time Passwords (OTP). Passwords are intentionally disabled.

### 2.1 Role-Based Access Control (RBAC)

- **`user`**: Default role assigned upon registration. Granted read-only access to published public content.
- **`admin`**: Granted full mutation privileges (Create, Update, Delete, Upload, View Dashboard).
- Automatic Admin Elevation: Emails configured in the `ADMIN_EMAILS` environment variable are automatically granted the `admin` role upon creation or session refresh.

### 2.2 Middleware Protection

- **`sessionMiddleware`**: Runs on all `/api/*` routes (except `/api/auth/*`). Attaches `c.get("user")` and `c.get("session")` if a valid cookie or bearer token is present.
- **`requireAdmin` / `adminOnly`**: Verifies that the requester is authenticated and holds `user.role === 'admin'`. Returns `401 Unauthorized` or `403 Forbidden` if validation fails.

---

### 2.3 Authentication Endpoints

#### 1. Request Sign-In OTP

Sends a 6-digit verification code to the target email address via Resend. In local development or when `RESEND_API_KEY` is omitted, the code is printed directly to the server terminal.

- **Method / URL:** `POST /api/auth/email-otp/send-verification-otp`
- **Auth:** Public
- **Request Body:**

```json
{
  "email": "admin@abdullahalmaksud.com",
  "type": "sign-in"
}
```

- **Response (200 OK):**

```json
{
  "success": true
}
```

#### 2. Sign In with Email OTP

Verifies the 6-digit code and creates an authenticated session.

- **Method / URL:** `POST /api/auth/sign-in/email-otp`
- **Auth:** Public
- **Request Body:**

```json
{
  "email": "admin@abdullahalmaksud.com",
  "otp": "123456"
}
```

- **Response (200 OK):**
- **Response Headers:** `Set-Cookie: auth_session=...`, `set-auth-token: <bearer-token>`

```json
{
  "user": {
    "id": "usr_68f0a1b2c3d4",
    "name": "Abdullah Al Maksud",
    "email": "admin@abdullahalmaksud.com",
    "emailVerified": true,
    "role": "admin",
    "image": "https://blob.vercel-storage.com/avatar.jpg",
    "createdAt": "2026-08-01T12:00:00.000Z",
    "updatedAt": "2026-10-31T04:00:00.000Z"
  },
  "session": {
    "id": "ses_79a1b2c3d4e5",
    "userId": "usr_68f0a1b2c3d4",
    "expiresAt": "2026-11-07T04:00:00.000Z",
    "token": "a1b2c3d4e5f6g7h8..."
  },
  "token": "a1b2c3d4e5f6g7h8..."
}
```

#### 3. Verify Email Code (Alternative / Account Verification)

- **Method / URL:** `POST /api/auth/email-otp/verify-email`
- **Auth:** Public
- **Request Body:**

```json
{
  "email": "admin@abdullahalmaksud.com",
  "otp": "123456"
}
```

#### 4. Get Current BetterAuth Session

- **Method / URL:** `GET /api/auth/get-session`
- **Auth:** Public / Session
- **Headers:** `Cookie: auth_session=...` or `Authorization: Bearer <token>`
- **Response (200 OK):**

```json
{
  "user": {
    "id": "usr_68f0a1b2c3d4",
    "name": "Abdullah Al Maksud",
    "email": "admin@abdullahalmaksud.com",
    "role": "admin"
  },
  "session": {
    "id": "ses_79a1b2c3d4e5",
    "userId": "usr_68f0a1b2c3d4",
    "expiresAt": "2026-11-07T04:00:00.000Z"
  }
}
```

#### 5. Google OAuth Social Sign-In

- **Method / URL:** `POST /api/auth/sign-in/social`
- **Auth:** Public
- **Request Body:**

```json
{
  "provider": "google",
  "callbackURL": "https://chief.abdullahalmaksud.com/auth/callback"
}
```

- **Response (200 OK):**

```json
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=..."
}
```

---

## 3. System & Health Endpoints

### 3.1 Root Service Endpoint

Returns an interactive HTML system monitor or structured JSON status.

- **Method / URL:** `GET /`
- **Auth:** Public
- **Query Parameters:** `?format=json` (Optional)
- **Headers:** `Accept: application/json` returns JSON; default browser requests return styled HTML.
- **JSON Response (200 OK):**

```json
{
  "success": true,
  "status": "running",
  "health": "healthy",
  "uptime": 1420.45,
  "uptimeFormatted": "23m 40s",
  "database": "connected",
  "timestamp": "2026-10-31T03:50:00.000Z"
}
```

### 3.2 Health Check Endpoint

- **Method / URL:** `GET /health` or `GET /api/health`
- **Auth:** Public
- **Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "uptime": 1420.45,
    "uptimeFormatted": "23m 40s",
    "database": {
      "state": "connected",
      "host": "cluster0.mongodb.net"
    },
    "timestamp": "2026-10-31T03:50:00.000Z"
  }
}
```

---

## 4. User Profile Endpoints

### 4.1 Get Active Session & Profile

- **Method / URL:** `GET /api/me`
- **Auth:** Requires Session (Bearer token or Cookie)
- **Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_68f0a1b2c3d4",
      "name": "Abdullah Al Maksud",
      "email": "admin@abdullahalmaksud.com",
      "role": "admin",
      "image": "https://blob.vercel-storage.com/avatar.jpg"
    },
    "session": {
      "id": "ses_79a1b2c3d4e5",
      "userId": "usr_68f0a1b2c3d4",
      "expiresAt": "2026-11-07T04:00:00.000Z"
    }
  }
}
```

### 4.2 Update Profile

Updates user metadata (`name`, `image`, or `avatar`).

- **Method / URL:** `PATCH /api/me` or `PUT /api/me`
- **Auth:** Requires Session
- **Request Body:**

```json
{
  "name": "Abdullah Al Maksud",
  "image": "https://blob.vercel-storage.com/new-avatar.jpg"
}
```

- **Response (200 OK):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "usr_68f0a1b2c3d4",
      "name": "Abdullah Al Maksud",
      "email": "admin@abdullahalmaksud.com",
      "role": "admin",
      "image": "https://blob.vercel-storage.com/new-avatar.jpg"
    }
  }
}
```

---

## 5. About Screen Management

Manages the comprehensive biography, professional philosophy, milestones, and education for the portfolio's About view.

### 5.1 Get About Screen Data

- **Method / URL:** `GET /api/v1/about`
- **Auth:** Public
- **Response (200 OK):**

```json
{
  "header": {
    "title": "Engineering with Architectural Discipline",
    "subtitle": "Software Engineer & Distributed Systems Enthusiast",
    "description": "Designing high-throughput, fault-tolerant architectures...",
    "image": "https://blob.vercel-storage.com/profile-portrait.webp"
  },
  "pillars": [
    {
      "icon": "Cpu",
      "title": "Systems Architecture",
      "description": "Constructing scalable microservices and serverless infrastructure."
    }
  ],
  "experience": [
    {
      "company": "Tech Innovations Inc.",
      "role": "Lead Architect",
      "duration": "2023 - Present"
    }
  ],
  "education": [
    {
      "institution": "University of Engineering & Technology",
      "degree": "B.Sc. in Computer Science & Engineering",
      "year": "2019 - 2023"
    }
  ],
  "skillsCategories": [
    {
      "category": "Backend & Cloud",
      "skills": ["Node.js", "TypeScript", "Go", "Docker", "MongoDB", "Kubernetes"]
    }
  ]
}
```

### 5.2 Update About Screen Data

- **Method / URL:** `PUT /api/v1/about`
- **Auth:** 🔒 Admin Only
- **Request Body:** (Any subset of `header`, `pillars`, `experience`, `education`, `skillsCategories`)
- **Response (200 OK):**

```json
{
  "success": true,
  "data": { ... }
}
```

---

## 6. Software Projects Module

### 6.1 Get All Projects

Fetches all projects with filtering, searching, and pagination.

- **Method / URL:** `GET /api/v1/projects` (Alias: `GET /api/projects`)
- **Auth:** Public
- **Query Parameters:**
  - `page`: Page number (default: `1`)
  - `limit`: Items per page (default: `20`, max: `100`)
  - `category`: Category filter (e.g. `Web`, `Systems`, `Mobile`)
  - `featured`: Filter by featured flag (`true` or `false`)
  - `status`: Filter by status (`live`, `case-study`, `prototype`, `archived`, `building`)
  - `search`: Search query matching title, description, tags, or stack
- **Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "6724a1b2c3d4e5f6a7b8c9d0",
      "title": "Quantum Flow",
      "slug": "quantum-flow",
      "description": "High-throughput asynchronous event processing engine.",
      "longDescription": "Detailed overview of the Kafka and Go pipeline...",
      "coverImage": "https://blob.vercel-storage.com/quantum-flow.webp",
      "image": "https://blob.vercel-storage.com/quantum-flow.webp",
      "logo": "https://blob.vercel-storage.com/quantum-logo.svg",
      "imageBg": "#0F131A",
      "barColor": "#E5A93C",
      "screenshots": ["https://blob.vercel-storage.com/screenshot1.webp"],
      "tags": ["Go", "Kafka", "Docker", "PostgreSQL"],
      "stack": ["Go", "Kafka", "Docker", "PostgreSQL"],
      "category": "Distributed Systems",
      "github": "https://github.com/abdullahalmaksud/quantum-flow",
      "gitRepo": "https://github.com/abdullahalmaksud/quantum-flow",
      "liveLink": "https://quantumflow.io",
      "demo": "https://quantumflow.io",
      "year": "2026",
      "status": "live",
      "featured": true,
      "isFeatured": true,
      "sortOrder": 1,
      "coreFeatures": [
        {
          "icon": "Zap",
          "text": "Sub-millisecond Latency",
          "desc": "Processes up to 500,000 events per second."
        }
      ],
      "content": null,
      "contentType": "blocks",
      "createdAt": "2026-10-15T10:00:00.000Z",
      "updatedAt": "2026-10-31T03:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### 6.2 Get Project by Slug

Dual-compatible response returning both root fields and nested `data` envelope.

- **Method / URL:** `GET /api/v1/projects/:slug`
- **Auth:** Public
- **Response (200 OK):** Returns the project JSON document with `{ success: true, data: { ... } }`.

### 6.3 Get Project by ID

- **Method / URL:** `GET /api/v1/projects/id/:id`
- **Auth:** 🔒 Admin Only
- **Response (200 OK):** Project JSON document.

### 6.4 Create Project

- **Method / URL:** `POST /api/v1/projects`
- **Auth:** 🔒 Admin Only
- **Request Body Schema:**

```json
{
  "title": "Quantum Flow",
  "slug": "quantum-flow",
  "description": "High-throughput asynchronous event processing engine.",
  "longDescription": "Detailed narrative of architecture...",
  "coverImage": "https://blob.vercel-storage.com/quantum-flow.webp",
  "logo": "https://blob.vercel-storage.com/logo.svg",
  "imageBg": "#0F131A",
  "barColor": "#E5A93C",
  "screenshots": ["https://blob.vercel-storage.com/shot1.webp"],
  "tags": ["Go", "Kafka"],
  "stack": ["Go", "Kafka"],
  "category": "Systems",
  "github": "https://github.com/user/repo",
  "liveLink": "https://quantumflow.io",
  "year": "2026",
  "status": "live",
  "featured": true,
  "sortOrder": 1,
  "coreFeatures": [
    {
      "icon": "Zap",
      "text": "Ultra Speed",
      "desc": "Ultra low latency execution"
    }
  ],
  "contentType": "blocks"
}
```

- **Response (201 Created):** `{ "success": true, "data": { ... } }`

### 6.5 Update Project

- **Method / URL:** `PUT /api/v1/projects/:id` or `PATCH /api/v1/projects/:id`
- **Auth:** 🔒 Admin Only
- **Request Body:** Partial or complete project object.
- **Response (200 OK):** `{ "success": true, "data": { ... } }`

### 6.6 Delete Project

- **Method / URL:** `DELETE /api/v1/projects/:id`
- **Auth:** 🔒 Admin Only
- **Response (200 OK):** `{ "success": true, "message": "Project deleted successfully" }`

---

## 7. Technical Blogs Module

High-performance publishing system with Lexical rich-editor JSON support, tags, and reading duration calculations.

### 7.1 Get All Blogs

By default, the heavy `content` field is excluded from list queries for extreme performance; pass `?includeContent=true` to retrieve the full article body.

- **Method / URL:** `GET /api/v1/blogs` (Alias: `GET /api/blogs`)
- **Auth:** Public
- **Query Parameters:**
  - `page`: Page index (default: `1`)
  - `limit`: Limit per page (default: `20`)
  - `published`: `true` (published only) or `false` (drafts only)
  - `category`: Category name (e.g. `Engineering`, `Architecture`)
  - `featured`: Filter by featured post (`true`)
  - `search`: Search text matching title, excerpt, or tags
  - `includeContent`: `true` to include article content
- **Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "6724a1b2c3d4e5f6a7b8c9d1",
      "title": "Designing Zero-Cold-Start APIs with Hono and MongoDB",
      "slug": "zero-cold-start-hono-mongodb",
      "excerpt": "A deep architectural guide on sharing Mongoose native clients...",
      "coverImage": "https://blob.vercel-storage.com/blog-cover.webp",
      "cover": "https://blob.vercel-storage.com/blog-cover.webp",
      "author": {
        "name": "Abdullah Al Maksud",
        "avatar": "/images/avatar.jpg",
        "bio": "Developer, designer, writer."
      },
      "tags": ["Hono", "Serverless", "MongoDB", "Architecture"],
      "category": "Engineering",
      "readingTime": "6 min read",
      "featured": true,
      "featuredType": "large",
      "isPublished": true,
      "publishedAt": "2026-10-22",
      "createdAt": "2026-10-22T14:00:00.000Z",
      "updatedAt": "2026-10-22T14:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### 7.2 Get Blog by Slug

- **Method / URL:** `GET /api/v1/blogs/:slug`
- **Auth:** Public
- **Response (200 OK):** Complete blog post document with full `content`.

### 7.3 Get Blog by ID

- **Method / URL:** `GET /api/v1/blogs/id/:id`
- **Auth:** 🔒 Admin Only
- **Response (200 OK):** Complete blog post document.

### 7.4 Create Blog Post

- **Method / URL:** `POST /api/v1/blogs`
- **Auth:** 🔒 Admin Only
- **Request Body:**

```json
{
  "title": "Zero-Cold-Start Serverless Architecture",
  "slug": "zero-cold-start-serverless-architecture",
  "excerpt": "An in-depth look at connection sharing in edge runtimes.",
  "content": { "root": { "children": [] } },
  "contentType": "lexical",
  "coverImage": "https://blob.vercel-storage.com/cover.webp",
  "tags": ["Serverless", "Hono"],
  "category": "Engineering",
  "readingTime": "5 min read",
  "featured": true,
  "featuredType": "large",
  "isPublished": true
}
```

- **Response (201 Created):** `{ "success": true, "data": { ... } }`

### 7.5 Update Blog Post

- **Method / URL:** `PUT /api/v1/blogs/:id` or `PATCH /api/v1/blogs/:id`
- **Auth:** 🔒 Admin Only
- **Response (200 OK):** `{ "success": true, "data": { ... } }`

### 7.6 Delete Blog Post

- **Method / URL:** `DELETE /api/v1/blogs/:id`
- **Auth:** 🔒 Admin Only
- **Response (200 OK):** `{ "success": true, "message": "Blog post deleted successfully" }`

---

## 8. Books & Shelf Module

Supports both the unified **Book Bundle** (Hero Featured Book + Metrics + Shelf items) and individual **Standalone Books** with chapters and quotes.

### 8.1 Get Book Bundle (Public Hero & Shelf)

- **Method / URL:** `GET /api/v1/books` (Alias: `GET /api/books`)
- **Auth:** Public
- **Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "book": {
      "titleBn": "এমন যদি হতো",
      "titleEn": "Emon Jodi Hoto",
      "title": "এমন যদি হতো",
      "author": "আব্দুল্লাহ আল মাকসুদ",
      "publisher": "জ্ঞানকোষ প্রকাশনী",
      "category": "বিজ্ঞান ও প্রযুক্তি",
      "ageGroup": "বয়স ১২-১৭",
      "cover": "/images/books/emon-jodi-hoto.webp",
      "price": 344,
      "rokomariUrl": "https://www.rokomari.com/book/454540/emon-jodi-hoto",
      "year": 2025
    },
    "stats": [
      { "value": "৫+", "label": "প্রকাশিত গ্রন্থ", "icon": "BookOpen" },
      { "value": "২০k+", "label": "কপি বিক্রিত", "icon": "Users" }
    ],
    "books": [
      {
        "id": "book-1",
        "title": "এমন যদি হতো",
        "author": "আব্দুল্লাহ আল মাকসুদ",
        "coverColor": "#1E293B",
        "textColor": "#F8FAFC",
        "accentColor": "#10B981",
        "tag": "Science Fiction",
        "year": 2025
      }
    ]
  }
}
```

### 8.2 Update Book Bundle

- **Method / URL:** `PUT /api/v1/books/bundle`
- **Auth:** 🔒 Admin Only
- **Request Body:** `{ "book": { ... }, "stats": [ ... ], "books": [ ... ] }`
- **Response (200 OK):** `{ "success": true, "data": { ... } }`

### 8.3 Get All Standalone Books

- **Method / URL:** `GET /api/v1/books/all`
- **Auth:** Public
- **Response (200 OK):** List of standalone books sorted by publication year descending.

### 8.4 Get Standalone Book by Slug

- **Method / URL:** `GET /api/v1/books/:slug`
- **Auth:** Public
- **Response (200 OK):** Full standalone book document.

### 8.5 Get Standalone Book by ID

- **Method / URL:** `GET /api/v1/books/id/:id`
- **Auth:** 🔒 Admin Only
- **Response (200 OK):** Book document.

### 8.6 Create Standalone Book

- **Method / URL:** `POST /api/v1/books`
- **Auth:** 🔒 Admin Only
- **Request Body:**

```json
{
  "title": "এমন যদি হতো",
  "titleBn": "এমন যদি হতো",
  "titleEn": "Emon Jodi Hoto",
  "slug": "emon-jodi-hoto",
  "author": "আব্দুল্লাহ আল মাকসুদ",
  "publisher": "জ্ঞানকোষ প্রকাশনী",
  "price": 344,
  "year": 2025,
  "pages": 192,
  "isbn": "978-984-xxx-xxx",
  "rokomariUrl": "https://www.rokomari.com/book/454540/emon-jodi-hoto",
  "chapters": [{ "number": "১", "title": "প্রথম সূচনা", "description": "পটভূমি..." }],
  "quotes": ["কল্পনার শেষ সীমানায় যে বিজ্ঞানের জন্ম..."]
}
```

- **Response (201 Created):** `{ "success": true, "data": { ... } }`

### 8.7 Update Standalone Book

- **Method / URL:** `PUT /api/v1/books/:id` or `PATCH /api/v1/books/:id`
- **Auth:** 🔒 Admin Only
- **Response (200 OK):** `{ "success": true, "data": { ... } }`

### 8.8 Delete Standalone Book

- **Method / URL:** `DELETE /api/v1/books/:id`
- **Auth:** 🔒 Admin Only
- **Response (200 OK):** `{ "success": true, "message": "Book deleted successfully" }`

---

## 9. Case Studies Module

Architectural teardowns detailing engineering challenges, solutions, quantifiable metrics, and tech stacks.

### 9.1 Get All Case Studies

- **Method / URL:** `GET /api/v1/case-studies` (Alias: `GET /api/case-studies`)
- **Auth:** Public
- **Query Parameters:** `page`, `limit`, `published`, `category`, `industry`, `featured`, `projectSlug`, `search`, `includeContent`
- **Response (200 OK):** Paginated case study list.

### 9.2 Get Case Study by Slug

- **Method / URL:** `GET /api/v1/case-studies/:slug`
- **Auth:** Public
- **Response (200 OK):** Complete case study document.

### 9.3 Get Case Study by ID

- **Method / URL:** `GET /api/v1/case-studies/id/:id`
- **Auth:** 🔒 Admin Only
- **Response (200 OK):** Case study document.

### 9.4 Create Case Study

- **Method / URL:** `POST /api/v1/case-studies`
- **Auth:** 🔒 Admin Only
- **Request Body:**

```json
{
  "title": "Scaling Real-Time Telemetry to 1M Events/Sec",
  "slug": "scaling-real-time-telemetry",
  "excerpt": "Architectural migration from monolithic polling to Kafka event-streams.",
  "coverImage": "https://blob.vercel-storage.com/telemetry-arch.webp",
  "projectSlug": "quantum-flow",
  "tags": ["Kafka", "Go", "Kubernetes"],
  "category": "Architecture",
  "industry": "FinTech",
  "client": "Enterprise Global",
  "challenge": "Monolithic relational DB locking under peak loads...",
  "solution": "Constructed partitioned Apache Kafka ingest pipelines...",
  "results": [
    {
      "metric": "Latency Reduction",
      "value": "92%",
      "description": "P99 dropped from 1.2s to 95ms"
    },
    {
      "metric": "Throughput",
      "value": "1.2M req/s",
      "description": "Peak load sustained without throttling"
    }
  ],
  "stack": ["Go", "Kafka", "PostgreSQL", "Redis"],
  "duration": "4 months",
  "readingTime": "10 min read",
  "featured": true,
  "isPublished": true,
  "sortOrder": 1
}
```

- **Response (201 Created):** `{ "success": true, "data": { ... } }`

### 9.5 Update Case Study

- **Method / URL:** `PUT /api/v1/case-studies/:id` or `PATCH /api/v1/case-studies/:id`
- **Auth:** 🔒 Admin Only
- **Response (200 OK):** `{ "success": true, "data": { ... } }`

### 9.6 Delete Case Study

- **Method / URL:** `DELETE /api/v1/case-studies/:id`
- **Auth:** 🔒 Admin Only
- **Response (200 OK):** `{ "success": true, "message": "Case study deleted successfully" }`

---

## 10. Graphic Design Portfolio Module

Showcases visual brand identities, digital design systems, and typography.

### 10.1 Get All Designs

- **Method / URL:** `GET /api/v1/designs`
- **Auth:** Public
- **Query Parameters:** `category`, `featured`
- **Response (200 OK):** Array of design objects.

### 10.2 Get Design by ID

- **Method / URL:** `GET /api/v1/designs/:id`
- **Auth:** Public
- **Response (200 OK):** Design document.

### 10.3 Create Design

- **Method / URL:** `POST /api/v1/designs`
- **Auth:** 🔒 Admin Only
- **Request Body:**

```json
{
  "id": "quantum-visual-identity",
  "title": "Quantum Design System",
  "subtitle": "Brand Identity & Modern Typography",
  "coverImage": "https://blob.vercel-storage.com/design-thumb.webp",
  "description": "Geometric identity designed for high-tech computing.",
  "category": "Visual Identity",
  "bg": "#0A0D14",
  "tools": ["Figma", "Illustrator"],
  "link": "https://www.behance.net/gallery/...",
  "featured": true,
  "year": "2026"
}
```

- **Response (201 Created):** `{ "success": true, "data": { ... } }`

### 10.4 Update Design

- **Method / URL:** `PUT /api/v1/designs/:id`
- **Auth:** 🔒 Admin Only
- **Response (200 OK):** `{ "success": true, "data": { ... } }`

### 10.5 Delete Design

- **Method / URL:** `DELETE /api/v1/designs/:id`
- **Auth:** 🔒 Admin Only
- **Response (200 OK):** `{ "success": true, "message": "Design deleted successfully" }`

---

## 11. Contact & Inquiry Module

Handles direct client and visitor inquiries. Emails are dispatched via the **Resend API**. If `RESEND_API_KEY` is not supplied, the inquiry is processed in **Simulation Mode** (logged to terminal) without error.

### 11.1 Send Contact Inquiry

- **Method / URL:**
  - `POST /api/v1/contact`
  - `POST /api/v1/contact/send`
  - `POST /api/v1/send-email`
  - `POST /api/send-email` (unversioned alias)
- **Auth:** Public
- **Request Body:**

```json
{
  "name": "Alex Mercer",
  "email": "alex.mercer@enterprise.com",
  "subject": "Architecture Consultation Inquiry",
  "message": "We are seeking consulting on event-driven microservices architecture."
}
```

- **Response (200 OK):**

```json
{
  "success": true,
  "message": "Email sent successfully!",
  "data": { "id": "res_8f0a1b2c3d4e" },
  "simulated": false
}
```

---

## 12. Dashboard & Analytics (Admin Only)

Aggregates real-time counters and metrics across all database collections.

### 12.1 Get Dashboard Statistics

- **Method / URL:** `GET /api/v1/dashboard`
- **Auth:** 🔒 Admin Only
- **Response (200 OK):**

```json
{
  "success": true,
  "metrics": {
    "totalProjects": 12,
    "totalBlogs": 24,
    "totalBooks": 5,
    "totalCaseStudies": 8,
    "totalDesigns": 15
  },
  "stats": [
    { "label": "Projects", "value": 12 },
    { "label": "Blog Posts", "value": 24 },
    { "label": "Books", "value": 5 },
    { "label": "Case Studies", "value": 8 },
    { "label": "Designs", "value": 15 }
  ],
  "messages": [],
  "notifications": []
}
```

### 12.2 Get Messages

- **Method / URL:** `GET /api/v1/messages`
- **Auth:** 🔒 Admin Only
- **Response (200 OK):** `[]`

### 12.3 Get Notifications

- **Method / URL:** `GET /api/v1/notifications`
- **Auth:** 🔒 Admin Only
- **Response (200 OK):** `[]`

---

## 13. Media & File Upload (GitHub Private Asset Store & Cloudflare Edge CDN)

Integrated with a **Private GitHub Repository** and served via **Cloudflare Edge CDN** on the branded custom domain `https://assets.abdullahalmaksud.com`. Images are organized with immutable natural language identifiers (`folderKey`) ensuring image links never break upon SEO slug changes.

### 13.1 Upload File

- **Method / URL:** `POST /api/v1/upload`
- **Auth:** 🔒 Admin Only
- **Content-Type:** `multipart/form-data`
- **Payload Fields:**
  - `file` (or `image` or `media`): Binary file (required)
  - `module`: Target module name (`blog` | `project` | `case-study` | `book` | `design` | `general`, default: `"general"`)
  - `folderKey`: Natural language immutable identifier (e.g. `how-to-code`, default: `"misc"`)
- **Max File Size:** `10 MB`
- **Storage Target:** `images/${module}/${folderKey}/${filename}-${suffix}.webp`
- **Response (200 OK):**

```json
{
  "success": true,
  "url": "https://assets.abdullahalmaksud.com/images/blog/how-to-code/diagram-k123.webp",
  "downloadUrl": "https://assets.abdullahalmaksud.com/images/blog/how-to-code/diagram-k123.webp",
  "pathname": "images/blog/how-to-code/diagram-k123.webp",
  "contentType": "image/webp",
  "module": "blog",
  "folderKey": "how-to-code"
}
```

### 13.2 List Uploaded Files

- **Method / URL:** `GET /api/v1/upload`
- **Auth:** 🔒 Admin Only
- **Query Parameters:** `prefix` (optional filter, e.g. `images/blog`)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "blobs": [
        {
          "url": "https://assets.abdullahalmaksud.com/images/blog/how-to-code/cover-a1.webp",
          "downloadUrl": "https://assets.abdullahalmaksud.com/images/blog/how-to-code/cover-a1.webp",
          "pathname": "images/blog/how-to-code/cover-a1.webp",
          "size": 142850,
          "uploadedAt": "2026-10-31T16:00:00.000Z"
        }
      ],
      "hasMore": false
    }
  }
  ```

### 13.3 Get File Metadata (Head)

- **Method / URL:** `GET /api/v1/upload/info?url=<asset_url>` (or `?path=<pathname>`)
- **Auth:** 🔒 Admin Only
- **Response (200 OK):** `{ "success": true, "data": { "url": "...", "downloadUrl": "...", "pathname": "..." } }`

### 13.4 Delete File

- **Method / URL:** `DELETE /api/v1/upload?url=<asset_url>` (or `{ "url": "..." }` / `{ "path": "..." }` in body)
- **Auth:** 🔒 Admin Only
- **Response (200 OK):** `{ "success": true, "message": "File deleted successfully from repository" }`

---

## 14. Backward Compatibility Aliases

The server guarantees seamless interoperability with legacy client versions:

| Canonical v1 Route         | Unversioned Legacy Route |
| :------------------------- | :----------------------- |
| `GET /api/v1/projects`     | `GET /api/projects`      |
| `GET /api/v1/blogs`        | `GET /api/blogs`         |
| `GET /api/v1/books`        | `GET /api/books`         |
| `GET /api/v1/case-studies` | `GET /api/case-studies`  |
| `POST /api/v1/contact`     | `POST /api/send-email`   |

### Legacy Field Aliases (Automatic Pre-save & JSON Serialization):

- `Project`: `image` ⇄ `coverImage`, `gitRepo`/`repo` ⇄ `github`, `link`/`demo` ⇄ `liveLink`, `isFeatured` ⇄ `featured`.
- `Blog`: `cover` ⇄ `coverImage`.
- `Book`: `rokomariUrl` ⇄ `purchaseLink`.

---

## 15. Global Error Handling & Status Codes

All errors are returned in a uniform JSON format:

| Status Code        | Meaning                   | Example Payload                                                                                               |
| :----------------- | :------------------------ | :------------------------------------------------------------------------------------------------------------ |
| `400 Bad Request`  | Validation failure (Zod)  | `{ "success": false, "message": "Validation failed", "errors": { ... } }`                                     |
| `401 Unauthorized` | Missing or invalid auth   | `{ "success": false, "message": "Unauthorized" }`                                                             |
| `403 Forbidden`    | Non-admin user access     | `{ "success": false, "message": "Forbidden" }`                                                                |
| `404 Not Found`    | Route or resource absent  | `{ "success": false, "message": "Resource not found" }`                                                       |
| `500 Server Error` | Uncaught server exception | `{ "success": false, "message": "Internal server error" }`                                                    |
| `503 Unavailable`  | MongoDB offline / down    | `{ "success": false, "message": "Authentication is unavailable until MongoDB is connected.", "hint": "..." }` |
