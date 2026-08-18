# 🚀 Abdullah Al Maksud Portfolio Server API Documentation

Comprehensive API documentation and Postman testing guide for the **Abdullah Al Maksud Portfolio Backend Server** built with **Hono**, **TypeScript**, **Better Auth**, **MongoDB/Mongoose**, and **Vercel Blob Storage**.

---

## 🌐 Base URLs

| Environment | Base URL |
| :--- | :--- |
| **Production (Vercel)** | `https://api-abdullahalmaksud.vercel.app` |
| **Local Development** | `http://localhost:4000` |

---

## 📥 Postman / Bruno / Insomnia Setup

### দ্রুত Postman-এ Import করার নিয়ম:
1. Postman ওপেন করুন।
2. বাম পাশের **Import** বাটনে ক্লিক করুন।
3. প্রজেক্টের রুট ডিরেক্টরিতে থাকা [`postman_collection.json`](./postman_collection.json) ফাইলটি সিলেক্ট করুন অথবা ড্র্যাগ অ্যান্ড ড্রপ করুন।
4. কালেকশন ভ্যারিয়েবল `baseUrl` সেট করা আছে: `https://api-abdullahalmaksud.vercel.app`
   *(লোকালহোস্টে টেস্ট করতে চাইলে `baseUrl`-এর ভ্যালু পরিবর্তন করে `http://localhost:4000` দিন)*।

---

## 🔐 Authentication & Session Flow (Better Auth)

- **Authentication Engine**: [Better Auth](https://www.better-auth.com/)
- **Session Mechanism**: HTTP-only Cookies (`auth_session`). Postman স্বয়ংক্রিয়ভাবে কুকি সংরক্ষণ করে রাখে, তাই একবার Sign In করলে পরবর্তী রিকোয়েস্টগুলোতে কুকি স্বয়ংক্রিয়ভাবে চলে যাবে।
- **Admin Access**: যে সমস্ত ইউজারের ইমেইল সার্ভারের `ADMIN_EMAILS` পরিবেশক ভেরিয়েবলে (env) যুক্ত থাকবে, তারা স্বয়ংক্রিয়ভাবে `admin` রোল প্রাপ্ত হবেন এবং প্রোটেক্টেড রুটগুলোতে অ্যাক্সেস করতে পারবেন।

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
    "timestamp": "2026-08-18T01:49:27.999Z"
  }
}
```

---

### 2. Authentication Endpoints (`/api/auth`)

#### 2.1 Sign Up (Email & Password)
- **Method**: `POST`
- **Endpoint**: `/api/auth/sign-up/email`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Abdullah Al Maksud",
  "email": "your-email@domain.com",
  "password": "StrongPassword123!"
}
```
- **Response**: `200 OK`
```json
{
  "user": {
    "id": "66c1b3f9...",
    "email": "your-email@domain.com",
    "name": "Abdullah Al Maksud",
    "role": "admin"
  },
  "token": "..."
}
```

#### 2.2 Sign In (Email & Password)
- **Method**: `POST`
- **Endpoint**: `/api/auth/sign-in/email`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "your-email@domain.com",
  "password": "StrongPassword123!"
}
```
- **Response**: `200 OK` (Set-Cookie হেডার সহ)

#### 2.3 Get Active Session
- **Method**: `GET`
- **Endpoint**: `/api/auth/get-session`
- **Description**: বর্তমান সক্রিয় Better Auth সেশন রিটার্ন করে।

#### 2.4 Get Current User Profile
- **Method**: `GET`
- **Endpoint**: `/api/me`
- **Description**: বর্তমান লগইনকৃত ইউজারের রোল এবং ডিটেইলস রিটার্ন করে।
- **Response**: `200 OK`
```json
{
  "user": {
    "id": "66c1b3f9...",
    "email": "your-email@domain.com",
    "name": "Abdullah Al Maksud",
    "role": "admin"
  },
  "session": {
    "id": "...",
    "userId": "...",
    "expiresAt": "2026-08-25T00:00:00.000Z"
  }
}
```

#### 2.5 Sign Out
- **Method**: `POST`
- **Endpoint**: `/api/auth/sign-out`
- **Headers**: `Content-Type: application/json`
- **Body**: `{}`
- **Description**: সেশন কুকি ইনভ্যালিডেট ও ক্লিয়ার করে।

---

### 3. Portfolio Public Endpoints (`/api/v1`)

#### 3.1 Get Site Data
- **Method**: `GET`
- **Endpoint**: `/api/v1/site?locale=en`
- **Query Params**:
  - `locale`: `en` বা `bn` (ডিফল্ট: `en`)
- **Description**: সাইটের মূল মেটাডাটা, ন্যাভিগেশন এবং সোশ্যাল লিংকস প্রদান করে।

#### 3.2 Get Content Bundle
- **Method**: `GET`
- **Endpoint**: `/api/v1/content?locale=en`
- **Query Params**: `locale=en` বা `locale=bn`
- **Description**: প্রজেক্ট, ব্লগ পোস্ট এবং বইয়ের তালিকা প্রদান করে।

#### 3.3 Get All Projects (MongoDB)
- **Method**: `GET`
- **Endpoint**: `/api/v1/projects`
- **Description**: MongoDB-তে সংরক্ষিত সকল প্রজেক্টের তালিকা রিটার্ন করে (তারিখ অনুযায়ী সাজানো)।
- **Response**: `200 OK`
```json
[
  {
    "id": "66c1b4...",
    "title": "বন্টন",
    "slug": "bonton",
    "description": "Split any shared cost, then settle with fewer payments.",
    "coverImage": "/images/project/bonton.png",
    "logo": "/images/project/logo/bonton.png",
    "stack": ["React", "TypeScript", "Zustand", "Tailwind CSS", "Vite"],
    "gitRepo": "https://github.com/abdullahmaksud/bonton",
    "liveLink": "https://bonton.abdullahalmaksud.com",
    "status": "live",
    "isFeatured": true,
    "createdAt": "2025-11-01",
    "lastUpdate": "2026-05-20"
  }
]
```

#### 3.4 Get Project by Slug
- **Method**: `GET`
- **Endpoint**: `/api/v1/projects/:slug`
- **Example**: `/api/v1/projects/bonton`
- **Response**: `200 OK` বা `404 Not Found`

#### 3.5 Get Blog Posts
- **Method**: `GET`
- **Endpoint**: `/api/v1/blog-posts?locale=en`

#### 3.6 Get Blog Post by Slug
- **Method**: `GET`
- **Endpoint**: `/api/v1/blog-posts/:slug?locale=en`

#### 3.7 Get Books List
- **Method**: `GET`
- **Endpoint**: `/api/v1/books?locale=en`

#### 3.8 Get Book by ID
- **Method**: `GET`
- **Endpoint**: `/api/v1/books/:id?locale=en`

---

### 4. Admin Protected Endpoints (`/api/v1`)
> 🔒 **নোট**: এই রুটগুলো কল করার জন্য পূর্বে Sign In করে Admin সেশন থাকা বাধ্যতামূলক। অন্যথায় `401 Unauthorized` বা `403 Forbidden` রিটার্ন করবে।

#### 4.1 Create New Project
- **Method**: `POST`
- **Endpoint**: `/api/v1/projects`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "title": "New Web Application",
  "slug": "new-web-app",
  "description": "Modern full-stack web application.",
  "coverImage": "/images/project/app.png",
  "logo": "/images/project/logo/app.png",
  "stack": ["React", "TypeScript", "Tailwind CSS", "Hono"],
  "coreFeatures": [
    {
      "icon": "zap",
      "text": "Fast Performance",
      "desc": "Ultra fast response time"
    }
  ],
  "gitRepo": "https://github.com/abdullahmaksud/new-web-app",
  "liveLink": "https://new-web-app.abdullahalmaksud.com",
  "categories": ["web", "saas"],
  "tag": "SaaS Platform",
  "status": "live",
  "isFeatured": true
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "66c1b7...",
    "title": "New Web Application",
    "slug": "new-web-app",
    "status": "live"
  }
}
```

#### 4.2 Update Project
- **Method**: `PUT`
- **Endpoint**: `/api/v1/projects/:id`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "title": "Updated Title",
  "description": "Updated project description.",
  "isFeatured": true,
  "status": "live"
}
```

#### 4.3 Delete Project
- **Method**: `DELETE`
- **Endpoint**: `/api/v1/projects/:id`
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

#### 4.4 Upload File (Vercel Blob)
- **Method**: `POST`
- **Endpoint**: `/api/v1/upload`
- **Body**: `form-data`
  - Key: `file` (Type: `File`)
- **Response**: `200 OK`
```json
{
  "success": true,
  "url": "https://...public.blob.vercel-storage.com/image.png"
}
```

#### 4.5 Get Admin Dashboard Data
- **Method**: `GET`
- **Endpoint**: `/api/v1/dashboard?locale=en`

#### 4.6 Get Contact Messages
- **Method**: `GET`
- **Endpoint**: `/api/v1/messages?locale=en`

#### 4.7 Get Notifications
- **Method**: `GET`
- **Endpoint**: `/api/v1/notifications?locale=en`

---

## ⚡ HTTP Status Codes

| Status Code | Description |
| :--- | :--- |
| **`200 OK`** | রিকোয়েস্ট সফল হয়েছে। |
| **`204 No Content`** | সফল কিন্তু কোনো বডি নেই (যেমন favicon fallback)। |
| **`400 Bad Request`** | ভুল প্যারামিটার বা ডুপ্লিকেট slug। |
| **`401 Unauthorized`** | লগইন সেশন অনুপস্থিত বা মেয়াদ উত্তীর্ণ। |
| **`403 Forbidden`** | ইউজার লগইন করলেও তার কাছে `admin` পারমিশন নেই। |
| **`404 Not Found`** | রিসোর্স বা রুট খুঁজে পাওয়া যায়নি। |
| **`500 Server Error`** | ইন্টারনাল সার্ভার বা ডাটাবেজ এরর। |
