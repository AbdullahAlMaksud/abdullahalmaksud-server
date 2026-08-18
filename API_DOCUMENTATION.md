# 🚀 Abdullah Al Maksud Portfolio Server API Documentation

Comprehensive API documentation and Postman testing guide for the **Abdullah Al Maksud Portfolio Backend Server** built with **Hono**, **TypeScript**, **Better Auth**, **MongoDB / Mongoose**, and **Vercel Blob Storage**.

The server follows a **feature-based modular architecture** (`src/modules/*`), separating schemas, business logic, controllers, and routes into dedicated modules.

---

## 🌐 Base URLs

| Environment | Base URL |
| :--- | :--- |
| **Production (Vercel)** | `https://api-abdullahalmaksud.vercel.app` |
| **Local Development** | `http://localhost:4000` |

---

## 📁 Modular Server Architecture

```text
src/
├── app.ts                          # Hono application setup (CORS, Middlewares, Routes mount)
├── index.ts                        # Server entry point (Local Node.js + MongoDB connect)
├── modules/                        # 🧩 Feature-based modules
│   ├── auth/                       # Authentication (Better Auth & Session)
│   │   ├── auth.controller.ts
│   │   └── auth.routes.ts
│   ├── health/                     # Health check & status
│   │   ├── health.controller.ts
│   │   ├── health.routes.ts
│   │   └── health.service.ts
│   ├── data/                       # Static site & bundle content (JSON)
│   │   ├── data.controller.ts
│   │   └── data.routes.ts
│   ├── blog/                       # 📝 Blog Posts CRUD
│   │   ├── blog.model.ts
│   │   ├── blog.controller.ts
│   │   └── blog.routes.ts
│   ├── book/                       # 📚 Books & Reading List CRUD
│   │   ├── book.model.ts
│   │   ├── book.controller.ts
│   │   └── book.routes.ts
│   ├── project/                    # 🚀 Software Projects CRUD
│   │   ├── project.model.ts
│   │   ├── project.controller.ts
│   │   └── project.routes.ts
│   ├── upload/                     # 📤 Vercel Blob File Upload
│   │   ├── upload.controller.ts
│   │   └── upload.routes.ts
│   ├── dashboard/                  # 📊 Admin Dashboard & Notifications
│   │   ├── dashboard.controller.ts
│   │   └── dashboard.routes.ts
│   └── index.ts                    # Central route registry mounting all modules
├── lib/                            # Shared utilities (DB, Auth instance, Env, Roles)
├── middlewares/                    # Global middlewares (Session, Error, Role check)
└── data/                           # Multi-locale static JSON assets (en/bn)
```

---

## 📥 Postman / Bruno / Insomnia Setup

### দ্রুত Postman-এ Import করার নিয়ম:
1. Postman ওপেন করুন।
2. বাম পাশের **Import** বাটনে ক্লিক করুন।
3. প্রজেক্টের রুট ডিরেক্টরিতে থাকা [`postman_collection.json`](./postman_collection.json) ফাইলটি সিলেক্ট করুন অথবা ড্র্যাগ অ্যান্ড ড্রপ করুন।
4. কালেকশনে প্রি-কনফিগার করা ভ্যারিয়েবল:
   - `baseUrl`: `https://api-abdullahalmaksud.vercel.app` (অথবা লোকালহোস্টে `http://localhost:4000`)
5. কালেকশনটিতে ৭টি ফোল্ডারে ২২টির বেশি রেডিমেড রিকোয়েস্ট ও স্যাম্পল বডি সাজানো রয়েছে।

---

## 🔐 Authentication & Session Flow (Better Auth)

- **Authentication Engine**: [Better Auth](https://www.better-auth.com/)
- **Session Mechanism**: HTTP-only Cookies (`auth_session`). Postman এবং আধুনিক ব্রাউজারগুলো স্বয়ংক্রিয়ভাবে কুকি সংরক্ষণ ও আদান-প্রদান করে।
- **Admin Access**: যে সকল ইউজারের ইমেইল সার্ভারের `ADMIN_EMAILS` পরিবেশক ভেরিয়েবলে (env) যুক্ত থাকবে, তারা স্বয়ংক্রিয়ভাবে `admin` রোল প্রাপ্ত হবেন এবং প্রোটেক্টেড রুটগুলোতে অ্যাক্সেস করতে পারবেন।

---

## 📑 API Endpoints Reference

---

### 1. System & Health Endpoints

#### 1.1 Root Status
- **Method**: `GET`
- **Endpoint**: `/`
- **Description**: API এর স্ট্যাটাস এবং পাথ কনফিগারেশন চেক করে।
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Abdullah Al Maksud API is running",
  "authBasePath": "/api/auth",
  "healthPath": "/health",
  "frontendOrigin": "https://abdullahalmaksud.com"
}
```

#### 1.2 Health Check
- **Method**: `GET`
- **Endpoint**: `/health` (অথবা `/api/health`)
- **Description**: সার্ভারের আপটাইম এবং MongoDB সংযোগের বর্তমান অবস্থা রিটার্ন করে।
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "uptime": 24.5,
    "database": {
      "name": "abdullahalmaksud",
      "state": "connected"
    },
    "timestamp": "2026-08-18T05:50:00.000Z"
  }
}
```

---

### 2. Authentication Endpoints (`/api/auth` & `/api/me`)

#### 2.1 Sign Up (Email & Password)
- **Method**: `POST`
- **Endpoint**: `/api/auth/sign-up/email`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Abdullah Al Maksud",
  "email": "admin@example.com",
  "password": "YourStrongPassword123!"
}
```
- **Response**: `200 OK`

#### 2.2 Sign In (Email & Password)
- **Method**: `POST`
- **Endpoint**: `/api/auth/sign-in/email`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "YourStrongPassword123!"
}
```
- **Response**: `200 OK` (Set-Cookie `auth_session` হেডার সহ)

#### 2.3 Get Active Session
- **Method**: `GET`
- **Endpoint**: `/api/auth/get-session`
- **Description**: বর্তমান সক্রিয় Better Auth সেশন রিটার্ন করে।

#### 2.4 Get Current User Profile & Role
- **Method**: `GET`
- **Endpoint**: `/api/me`
- **Description**: বর্তমান লগইনকৃত ইউজারের ডিটেইলস, রোল (`admin` / `user`) এবং সেশন ডাটা রিটার্ন করে।
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "66c1b3f9...",
      "email": "admin@example.com",
      "name": "Abdullah Al Maksud",
      "role": "admin"
    },
    "session": {
      "id": "...",
      "userId": "66c1b3f9...",
      "expiresAt": "2026-08-25T00:00:00.000Z"
    }
  }
}
```

#### 2.5 Sign Out
- **Method**: `POST`
- **Endpoint**: `/api/auth/sign-out`
- **Headers**: `Content-Type: application/json`
- **Request Body**: `{}`
- **Description**: সেশন ইনভ্যালিডেট করে ও কুকি ক্লিয়ার করে।

---

### 3. Portfolio Public Data (`/api/v1`)

#### 3.1 Get Site Data
- **Method**: `GET`
- **Endpoint**: `/api/v1/site?locale=en`
- **Query Params**:
  - `locale`: `en` বা `bn` (ডিফল্ট: `en`)
- **Description**: সাইটের মেটাডাটা, ন্যাভিগেশন এবং সোশ্যাল লিংকস প্রদান করে।

#### 3.2 Get Content Bundle
- **Method**: `GET`
- **Endpoint**: `/api/v1/content?locale=en`
- **Query Params**:
  - `locale`: `en` বা `bn` (ডিফল্ট: `en`)
- **Description**: স্ট্যাটিক বান্ডেল কন্টেন্ট ডাটা প্রদান করে।

---

### 4. Blog Posts (CRUD) (`/api/v1/blogs`)

#### 4.1 Get All Blogs (Public)
- **Method**: `GET`
- **Endpoint**: `/api/v1/blogs`
- **Query Params**:
  - `page`: পেজ নম্বর (ডিফল্ট: `1`)
  - `limit`: প্রতি পেজে আইটেম সংখ্যা (ডিফল্ট: `10`, সর্বোচ্চ: `50`)
  - `published`: শুধুমাত্র প্রকাশিত ব্লগ ফিল্টার করতে `true`
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "67b45f...",
      "title": "কেন আমি Local-first অ্যাপ বানাই",
      "slug": "why-i-build-local-first-apps",
      "content": "# Local-first কেন?\n\nবিস্তারিত কন্টেন্ট...",
      "excerpt": "কেন সার্ভারলেস নয়, কেন Local-first?",
      "coverImage": "/images/blog/local-first.png",
      "author": "Abdullah Al Maksud",
      "tags": ["local-first", "web-development"],
      "category": "Development",
      "isPublished": true,
      "publishedAt": "2026-07-15",
      "createdAt": "2026-08-18T05:50:00.000Z",
      "updatedAt": "2026-08-18T05:50:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1
  }
}
```

#### 4.2 Get Blog by Slug (Public)
- **Method**: `GET`
- **Endpoint**: `/api/v1/blogs/:slug`
- **Example**: `/api/v1/blogs/why-i-build-local-first-apps`
- **Response**: `200 OK` বা `404 Not Found`

#### 4.3 Create Blog Post (Admin Only 🔒)
- **Method**: `POST`
- **Endpoint**: `/api/v1/blogs`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "title": "নতুন ব্লগ পোস্ট",
  "slug": "new-blog-post",
  "content": "# ব্লগ পোস্টের শিরোনাম\n\nবিস্তারিত বডি Markdown ফরম্যাটে লিখুন।",
  "excerpt": "সংক্ষিপ্ত বিবরণ।",
  "coverImage": "/images/blog/new-post.png",
  "author": "Abdullah Al Maksud",
  "tags": ["javascript", "tutorial"],
  "category": "Tutorial",
  "isPublished": true
}
```
- **Response**: `201 Created`

#### 4.4 Update Blog Post (Admin Only 🔒)
- **Method**: `PUT`
- **Endpoint**: `/api/v1/blogs/:id`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "title": "আপডেটেড ব্লগ টাইটেল",
  "content": "# আপডেটেড কন্টেন্ট\n\nনতুন পরিমার্জিত লেখা।",
  "isPublished": true
}
```
- **Response**: `200 OK`

#### 4.5 Delete Blog Post (Admin Only 🔒)
- **Method**: `DELETE`
- **Endpoint**: `/api/v1/blogs/:id`
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Blog post deleted successfully"
}
```

---

### 5. Books / Reading List (CRUD) (`/api/v1/books`)

#### 5.1 Get All Books (Public)
- **Method**: `GET`
- **Endpoint**: `/api/v1/books`
- **Query Params**:
  - `page`: পেজ নম্বর (ডিফল্ট: `1`)
  - `limit`: প্রতি পেজে আইটেম সংখ্যা (ডিফল্ট: `10`, সর্বোচ্চ: `50`)
  - `recommended`: শুধুমাত্র রেকমেন্ডেড বই ফিল্টার করতে `true`
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "67b46a...",
      "title": "Clean Code",
      "slug": "clean-code",
      "author": "Robert C. Martin",
      "coverImage": "/images/books/clean-code.png",
      "description": "A Handbook of Agile Software Craftsmanship.",
      "genre": "Software Engineering",
      "rating": 5,
      "readDate": "2024-03-15",
      "reviewText": "প্রতিটি ডেভেলপারের অবশ্যপাঠ্য।",
      "tags": ["programming", "best-practices"],
      "isRecommended": true,
      "purchaseLink": "https://www.amazon.com/dp/0132350882",
      "createdAt": "2026-08-18T05:50:00.000Z",
      "updatedAt": "2026-08-18T05:50:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1
  }
}
```

#### 5.2 Get Book by Slug (Public)
- **Method**: `GET`
- **Endpoint**: `/api/v1/books/:slug`
- **Example**: `/api/v1/books/clean-code`
- **Response**: `200 OK` বা `404 Not Found`

#### 5.3 Create Book (Admin Only 🔒)
- **Method**: `POST`
- **Endpoint**: `/api/v1/books`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "title": "Atomic Habits",
  "slug": "atomic-habits",
  "author": "James Clear",
  "coverImage": "/images/books/atomic-habits.png",
  "description": "An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
  "genre": "Self-help",
  "rating": 5,
  "readDate": "2026-01-15",
  "reviewText": "ক্ষুদ্র অভ্যাসের শক্তি দিয়ে জীবন পরিবর্তনের চমৎকার গাইড।",
  "tags": ["self-help", "habits", "productivity"],
  "isRecommended": true,
  "purchaseLink": "https://www.amazon.com/dp/0735211299"
}
```
- **Response**: `201 Created`

#### 5.4 Update Book (Admin Only 🔒)
- **Method**: `PUT`
- **Endpoint**: `/api/v1/books/:id`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "rating": 5,
  "reviewText": "আপডেটেড রিভিউ টেক্সট...",
  "isRecommended": true
}
```
- **Response**: `200 OK`

#### 5.5 Delete Book (Admin Only 🔒)
- **Method**: `DELETE`
- **Endpoint**: `/api/v1/books/:id`
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Book deleted successfully"
}
```

---

### 6. Software Projects (CRUD) (`/api/v1/projects`)

#### 6.1 Get All Projects (Public)
- **Method**: `GET`
- **Endpoint**: `/api/v1/projects`
- **Description**: MongoDB-তে সংরক্ষিত প্রজেক্টের তালিকা রিটার্ন করে (তারিখ অনুযায়ী সাজানো)।
- **Response**: `200 OK`
```json
[
  {
    "id": "67b45e...",
    "title": "বন্টন",
    "slug": "bonton",
    "description": "Split any shared cost, then settle with fewer payments.",
    "coverImage": "/images/project/bonton.png",
    "logo": "/images/project/logo/bonton.png",
    "stack": ["React", "TypeScript", "Zustand", "Tailwind CSS", "Vite"],
    "coreFeatures": [
      {
        "icon": "receipt",
        "text": "Add Expense",
        "desc": "Track total cost with multiple initial payers"
      }
    ],
    "gitRepo": "https://github.com/abdullahmaksud/bonton",
    "liveLink": "https://bonton.abdullahalmaksud.com",
    "categories": ["saas", "finance", "tool"],
    "tag": "Local-first settlement system",
    "status": "live",
    "isFeatured": true,
    "createdAt": "2025-11-01",
    "lastUpdate": "2026-05-20"
  }
]
```

#### 6.2 Get Project by Slug (Public)
- **Method**: `GET`
- **Endpoint**: `/api/v1/projects/:slug`
- **Example**: `/api/v1/projects/bonton`
- **Response**: `200 OK` বা `404 Not Found`

#### 6.3 Create Project (Admin Only 🔒)
- **Method**: `POST`
- **Endpoint**: `/api/v1/projects`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "title": "New Portfolio Project",
  "slug": "new-portfolio-project",
  "description": "A modern web application built with TypeScript and React.",
  "coverImage": "/images/project/new-project.png",
  "logo": "/images/project/logo/new-project.png",
  "stack": ["React", "TypeScript", "Tailwind CSS", "Hono"],
  "coreFeatures": [
    {
      "icon": "zap",
      "text": "Fast Performance",
      "desc": "Optimized for speed and efficiency"
    },
    {
      "icon": "shield",
      "text": "Secure Authentication",
      "desc": "Role-based access control"
    }
  ],
  "gitRepo": "https://github.com/abdullahmaksud/new-project",
  "liveLink": "https://new-project.abdullahalmaksud.com",
  "categories": ["web", "saas", "tool"],
  "tag": "Full-stack Application",
  "status": "live",
  "isFeatured": true
}
```
- **Response**: `201 Created`

#### 6.4 Update Project (Admin Only 🔒)
- **Method**: `PUT`
- **Endpoint**: `/api/v1/projects/:id`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "title": "Updated Project Title",
  "description": "Updated description of the project.",
  "isFeatured": true,
  "status": "live"
}
```
- **Response**: `200 OK`

#### 6.5 Delete Project (Admin Only 🔒)
- **Method**: `DELETE`
- **Endpoint**: `/api/v1/projects/:id`
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

### 7. File Upload & Admin Utilities (`/api/v1`)

#### 7.1 Upload File (Vercel Blob) (Admin Only 🔒)
- **Method**: `POST`
- **Endpoint**: `/api/v1/upload`
- **Body**: `multipart/form-data`
  - Key: `file` (Type: `File`)
- **Response**: `200 OK`
```json
{
  "success": true,
  "url": "https://...public.blob.vercel-storage.com/uploaded-image.png"
}
```

#### 7.2 Get Admin Dashboard Data (Admin Only 🔒)
- **Method**: `GET`
- **Endpoint**: `/api/v1/dashboard?locale=en`
- **Description**: ড্যাশবোর্ড পরিসংখ্যান ও মেট্রিক্স রিটার্ন করে।

#### 7.3 Get Contact Messages (Admin Only 🔒)
- **Method**: `GET`
- **Endpoint**: `/api/v1/messages?locale=en`
- **Description**: কন্টাক্ট ফর্মের ইনকোয়ারি ও মেসেজ তালিকা প্রদান করে।

#### 7.4 Get Admin Notifications (Admin Only 🔒)
- **Method**: `GET`
- **Endpoint**: `/api/v1/notifications?locale=en`
- **Description**: সিস্টেম নোটিফিকেশন তালিকা প্রদান করে।

---

## ⚡ HTTP Status Codes

| Status Code | Description |
| :--- | :--- |
| **`200 OK`** | রিকোয়েস্ট সফল হয়েছে। |
| **`201 Created`** | নতুন রিসোর্স সফলভাবে তৈরি হয়েছে। |
| **`204 No Content`** | সফল কিন্তু কোনো রেসপন্স বডি নেই (যেমন favicon fallback)। |
| **`400 Bad Request`** | ভুল রিকোয়েস্ট বডি বা ডুপ্লিকেট slug। |
| **`401 Unauthorized`** | লগইন সেশন অনুপস্থিত বা মেয়াদ উত্তীর্ণ। |
| **`403 Forbidden`** | ইউজার লগইন করলেও তার কাছে `admin` পারমিশন নেই। |
| **`404 Not Found`** | রিসোর্স বা রুট খুঁজে পাওয়া যায়নি। |
| **`500 Server Error`** | ইন্টারনাল সার্ভার বা ডাটাবেজ এরর। |
| **`503 Service Unavailable`** | ডাটাবেজ ডিসকানেক্টেড থাকলে। |
