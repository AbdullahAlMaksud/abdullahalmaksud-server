# 📖 আব্দুল্লাহ আল মাকসুদ — কোর ব্যাকএন্ড এপিআই ও আর্কিটেকচার নির্দেশিকা

> **সংস্করণ:** ৭.০ (Comprehensive Enterprise Architecture Edition)  
> **ফ্রেমওয়ার্ক:** [Hono v4](https://hono.dev/) · **রানটাইম:** Node.js (>=20.x) ও Vercel Serverless Function  
> **ডাটাবেজ:** MongoDB Atlas ([Mongoose v9](https://mongoosejs.com/)) · **অথেন্টিকেশন:** BetterAuth (Email OTP ও RBAC)  
> **অবজেক্ট স্টোরেজ:** Vercel Blob · **ইমেইল ট্রান্সপোর্ট:** Resend REST API  
> **প্যাকেজ ম্যানেজার:** **`pnpm` (v10)**  
> **বেস URL (লোকাল):** `http://localhost:5000`  
> **বেস URL (প্রোডাকশন):** `https://api.abdullahalmaksud.com`

---

## 📑 সূচিপত্র (Table of Contents)

1. [আর্কিটেকচার ও মূল বৈশিষ্ট্য](#১-আর্কিটেকচার-ও-মূল-বৈশিষ্ট্য)
2. [এনভায়রনমেন্ট ভ্যারিয়েবল কনফিগারেশন](#২-এনভায়রনমেন্ট-ভ্যারিয়েবল-কনফিগারেশন)
3. [অথেন্টিকেশন ও সিকিউরিটি মেকানিজম](#৩-অথেন্টিকেশন-ও-সিকিউরিটি-মেকানিজম)
4. [ডাটা স্ট্রাকচার ও মডেল বিবরণ (Mongoose Models)](#৪-ডাটা-স্ট্রাকচার-ও-মডেল-বিবরণ)
   - [৪.১ ব্যবহারকারী ও সেশন (BetterAuth)](#৪১-ব্যবহারকারী-ও-সেশন-betterauth)
   - [৪.২ সফটওয়্যার প্রজেক্ট (Software Projects)](#৪২-সফটওয়্যার-প্রজেক্ট-software-projects)
   - [৪.৩ টেকনিক্যাল ব্লগ ও প্রবন্ধ (Blogs)](#৪৩-টেকনিক্যাল-ব্লগ-ও-প্রবন্ধ-blogs)
   - [৪.৪ বই ও প্রকাশনা সমাহার (Books & Shelf)](#৪৪-বই-ও-প্রকাশনা-সমাহার-books--shelf)
   - [৪.৫ আর্কিটেকচারাল কেস স্টাডি (Case Studies)](#৪৫-আর্কিটেকচারাল-কেস-স্টাডি-case-studies)
   - [৪.৬ গ্রাফিক ডিজাইন পোর্টফোলিও (Designs)](#৪৬-গ্রাফিক-ডিজাইন-পোর্টফোলিও-designs)
   - [৪.৭ অ্যাবাউট স্ক্রিন কনফিগারেশন (About)](#৪৭-অ্যাবাউট-স্ক্রিন-কনফিগারেশন-about)
   - [৪.৮ যোগাযোগ ও ইনকোয়ারি (Contact & Email)](#৪৮-যোগাযোগ-ও-ইনকোয়ারি-contact--email)
   - [৪.৯ ফাইল আপলোড ও মিডিয়া স্টোরেজ (Vercel Blob)](#৪৯-ফাইল-আপলোড-ও-মিডিয়া-স্টোরেজ-vercel-blob)
   - [৪.১০ ড্যাশবোর্ড ও কাউন্টার মেট্রিক্স (Dashboard)](#৪১০-ড্যাশবোর্ড-ও-কাউন্টার-মেট্রিক্স-dashboard)
5. [পূর্ণাঙ্গ এপিআই এন্ডপয়েন্ট রেফারেন্স](#৫-পূর্ণাঙ্গ-এপিআই-এন্ডপয়েন্ট-রেফারেন্স)
6. [ব্যাকওয়ার্ড কম্প্যাটিবিলিটি ও ফিল্ড এলিয়াস](#৬-ব্যাকওয়ার্ড-কম্প্যাটিবিলিটি-ও-ফিল্ড-এলিয়াস)
7. [এরর হ্যান্ডলিং ও স্ট্যান্ডার্ড রেসপন্স ফরম্যাট](#৭-এরর-হ্যান্ডলিং-ও-স্ট্যান্ডার্ড-রেসপন্স-ফরম্যাট)
8. [Postman কালেকশন ও অটোমেশন গাইড](#৮-postman-কালেকশন-ও-অটোমেশন-গাইড)
9. [লোকাল রান ও ডেভেলপমেন্ট কমান্ড](#৯-লোকাল-রান-ও-ডেভেলপমেন্ট-কমান্ড)

---

## ১. আর্কিটেকচার ও মূল বৈশিষ্ট্য

সার্ভারটি উচ্চ পারফরম্যান্স সম্পন্ন **Hono v4** ফ্রেমওয়ার্কের উপর ভিত্তি করে তৈরি। এটি একই সাথে স্ট্যান্ডার্ড Node.js সার্ভার এবং Vercel Serverless Function রানটাইম সমর্থন করে।

```
                                  ┌────────────────────────┐
                                  │   Client Applications  │
                                  │ (Web / Admin / Mobile) │
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
│   • Vercel Blob Storage (@vercel/blob)                                                                 │
│   • Resend Transactional Email API                                                                     │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### প্রধান আর্কিটেকচারাল সুবিধাসমূহ:

- **Zero-Cold-Start কানেকশন শেয়ারিং**: সার্ভারলেস রানটাইমে প্রতি রিকোয়েস্টে নতুন ডাটাবেজ কানেকশন তৈরির বিলম্ব রোধ করতে Mongoose-এর কানেক্টেড `MongoClient` ইনস্ট্যান্সটি সরাসরি BetterAuth অ্যাডাপ্টারে শেয়ার করা হয়েছে।
- **Body Stream Exhaustion Guard**: Vercel Serverless হ্যান্ডলারে (`api/index.ts`) অথেন্টিকেশন রিকোয়েস্টের বডি আগে বাফার করে নেওয়া হয় যাতে Hono-এর `getRequestListener` বডি কনজিউম করার কারণে BetterAuth রিকোয়েস্ট আটকে (504 Gateway Timeout) না যায়।
- **ডায়নামিক ও প্রি-ফ্লাইট CORS**: `abdullahalmaksud.com` এপেক্স ডোমেইন, এর সকল সাবডোমেইন (`*.abdullahalmaksud.com`), লোকালহোস্ট এবং ভেরসেল প্রিভিউ লিংক স্বয়ংক্রিয়ভাবে অনুমোদিত।

---

## ২. এনভায়রনমেন্ট ভ্যারিয়েবল কনফিগারেশন

সার্ভার চালুর পূর্বে `.env` ফাইলে নিচের ভ্যারিয়েবলগুলো সঠিকভাবে সংজ্ঞায়িত করতে হবে:

| Variable Name                 | Type      | ডিফল্ট মান                                         | বাধ্যতামূলক? | বিবরণ                                                            |
| :---------------------------- | :-------- | :------------------------------------------------- | :----------- | :--------------------------------------------------------------- |
| `NODE_ENV`                    | `string`  | `development`                                      | না           | `development`, `production`, বা `test`                           |
| `HOST`                        | `string`  | `0.0.0.0`                                          | না           | নেটওয়ার্ক ইন্টারফেস বাইন্ডিং হোস্ট                              |
| `PORT`                        | `number`  | `5000`                                             | না           | সার্ভার লিসেন পোর্ট                                              |
| `MONGODB_URI`                 | `string`  | —                                                  | **হ্যাঁ**    | MongoDB Atlas কানেকশন স্ট্রিং (SRV)                              |
| `MONGODB_DB_NAME`             | `string`  | `abdullahalmaksud`                                 | না           | টার্গেট ডাটাবেজের নাম                                            |
| `REQUIRE_DATABASE_CONNECTION` | `boolean` | `false`                                            | না           | ডাটাবেজ অফলাইন থাকলে সার্ভার ক্র্যাশ করবে কিনা                   |
| `BETTER_AUTH_SECRET`          | `string`  | —                                                  | **হ্যাঁ**    | BetterAuth এর ক্রিপ্টোগ্রাফিক সিক্রেট (মিনিমাম ৩২ অক্ষর)         |
| `BETTER_AUTH_URL`             | `string`  | `http://localhost:5000`                            | না           | অথেন্টিকেশন ইঞ্জিনের বেস URL                                     |
| `CORS_ORIGIN`                 | `string`  | `http://localhost:3000`                            | না           | কমা-সেপারেটেড অনুমোদিত অরিজিনসমূহের তালিকা                       |
| `ADMIN_EMAILS`                | `string`  | `""`                                               | না           | অ্যাডমিন রোল প্রাপক ইমেইলের কমা-সেপারেটেড তালিকা                 |
| `COOKIE_DOMAIN`               | `string`  | `""`                                               | না           | সাবডোমেইন সেশনের জন্য কুকি ডোমেইন (যেমন `.abdullahalmaksud.com`) |
| `GOOGLE_CLIENT_ID`            | `string`  | —                                                  | না           | Google Cloud OAuth2 Client ID                                    |
| `GOOGLE_CLIENT_SECRET`        | `string`  | —                                                  | না           | Google Cloud OAuth2 Client Secret                                |
| `GOOGLE_REDIRECT_URI`         | `string`  | —                                                  | না           | Google OAuth রিডাইরেক্ট কলব্যাক URL                              |
| `RESEND_API_KEY`              | `string`  | —                                                  | না           | Resend API কি (না থাকলে লোকাল কনসোলে লগ হবে)                     |
| `EMAIL_FROM`                  | `string`  | `Abdullah Al Maksud Admin <onboarding@resend.dev>` | না           | প্রেরক ইমেইল হেডার                                               |
| `CONTACT_RECIPIENT_EMAIL`     | `string`  | `contact@abdullahalmaksud.com`                     | না           | কন্ট্যাক্ট ইনকোয়ারি রিসিভ করার ইমেইল অ্যাড্রেস                  |
| `BLOB_READ_WRITE_TOKEN`       | `string`  | —                                                  | না           | Vercel Blob অবজেক্ট স্টোরেজের রিড/রাইট টোকেন                     |

---

## ৩. অথেন্টিকেশন ও সিকিউরিটি মেকানিজম

পাসওয়ার্ডহীন সর্বোচ্চ নিরাপত্তা নিশ্চিত করতে সিস্টেমে পাসওয়ার্ড অথেন্টিকেশন সম্পূর্ণ বন্ধ রাখা হয়েছে এবং **BetterAuth**-এর ৬ ডিজিটের Email OTP ব্যবহার করা হয়েছে।

### ৩.১ রোল-বেসড অ্যাক্সেস কন্ট্রোল (RBAC)

1. **`user` (সাধারণ ব্যবহারকারী):** পাবলিক কন্টেন্ট (প্রজেক্ট, ব্লগ, বই, কেস স্টাডি, ডিজাইন) পড়তে পারবে।
2. **`admin` (প্রশাসক):** সকল প্রকার ডাটা সংযোজন, পরিবর্তন, ডিলিট, ড্যাশবোর্ড ও ফাইল আপলোডের পূর্ণ অধিকার।
3. **স্বয়ংক্রিয় রোল নির্ধারণ:** ব্যবহারকারী প্রথমবার লগইন করলে বা প্রোফাইল রিফ্রেশ হলে `ADMIN_EMAILS` তালিকায় তার ইমেইল থাকলে স্বয়ংক্রিয়ভাবে `admin` রোল প্রদান করা হয়।

### ৩.২ মিডলওয়্যার কার্যপদ্ধতি

- **`sessionMiddleware`**: `/api/auth/*` ব্যতীত সকল রুটে সেশন হেডার ও কুকি যাচাই করে `c.get("user")` এবং `c.get("session")` সেট করে।
- **`requireAdmin` / `adminOnly`**: ইউজার লগইন করা আছে কিনা এবং তার রোল `admin` কিনা তা কঠোরভাবে যাচাই করে। ব্যর্থ হলে `401 Unauthorized` বা `403 Forbidden` রিটার্ন করে।

---

## ৪. ডাটা স্ট্রাকচার ও মডেল বিবরণ

### ৪.১ ব্যবহারকারী ও সেশন (BetterAuth)

BetterAuth ইঞ্জিন দ্বারা পরিচালিত দুটি প্রধান MongoDB কালেকশন:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
}

interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
}
```

---

### ৪.২ সফটওয়্যার প্রজেক্ট (Software Projects)

`ProjectModel` (`projects` কালেকশন):

```typescript
interface Project {
  id: string;
  title: string;
  slug: string; // ইউনিক স্লাগ
  description: string; // সংক্ষিপ্ত সারসংক্ষেপ
  longDescription: string; // বিস্তারিত বর্ণনা
  coverImage: string; // কভার ছবির URL (image এলিয়াস)
  logo: string; // ব্র্যান্ড লোগো URL
  imageBg: string; // ডিফল্ট: "#0F131A"
  barColor: string; // ডিফল্ট: "#E5A93C"
  screenshots: string[]; // স্ক্রিনশটের URL তালিকা
  tags: string[]; // ট্যাগসমূহ (stack এর সাথে সিঙ্কড)
  stack: string[]; // টেকনোলজি স্ট্যাকসমূহ
  category: string; // প্রজেক্ট ক্যাটাগরি
  github: string; // রিপোজিটরি লিংক (gitRepo, repo এলিয়াস)
  liveLink: string; // প্রোডাকশন লিংক (link, demo এলিয়াস)
  year: string; // সমাপ্তির বছর
  status: "live" | "case-study" | "prototype" | "archived" | "building";
  featured: boolean; // ফিচার্ড প্রজেক্ট কিনা (isFeatured এলিয়াস)
  sortOrder: number; // সাজানোর ক্রম (index এলিয়াস)
  coreFeatures: Array<{
    icon: string;
    text: string;
    desc: string;
  }>;
  content: any; // Lexical/Block কন্টেন্ট
  contentType: "blocks" | "lexical" | "json" | "markdown" | "html";
  metaTitle: string;
  metaDescription: string;
}
```

---

### ৪.৩ টেকনিক্যাল ব্লগ ও প্রবন্ধ (Blogs)

`BlogModel` (`blogs` কালেকশন):

```typescript
interface Blog {
  id: string;
  title: string;
  slug: string; // ইউনিক স্লাগ
  excerpt: string; // ভূমিকা বা সারসংক্ষেপ
  content: any; // Lexical Editor স্টেট বা ব্লক অ্যারে
  contentType: "lexical" | "markdown" | "html";
  coverImage: string; // কভার ছবি (cover এর সাথে স্বয়ংক্রিয় সিঙ্ক)
  author: {
    name: string; // ডিফল্ট: "Abdullah Al Maksud"
    avatar: string; // ডিফল্ট: "/images/avatar.jpg"
    bio: string; // ডিফল্ট: "Developer, designer, writer."
  };
  tags: string[]; // ট্যাগসমূহ
  category: string; // যেমন: "Engineering", "Architecture"
  readingTime: string; // পড়ার আনুমানিক সময় (যেমন: "5 min read")
  featured: boolean; // ফিচার্ড কিনা
  featuredType: "large" | "small" | "standard" | "";
  isPublished: boolean; // প্রকাশিত কিনা
  publishedAt: string; // প্রকাশের তারিখ (যেমন: "2026-10-31")
  metaTitle: string;
  metaDescription: string;
}
```

---

### ৪.৪ বই ও প্রকাশনা সমাহার (Books & Shelf)

বই ব্যবস্থাপনায় দুটি মডেল রয়েছে:

1. **`BookBundleModel` (`bookbundles` কালেকশন, `key: "main"`):**
   - `book`: প্রধান হাইলাইটেড বই (`titleBn`, `titleEn`, `author`, `publisher`, `price`, `rokomariUrl`, ইত্যাদি)।
   - `stats`: রিডার পরিসংখ্যান অ্যারে (`[{ value: "৫+", label: "প্রকাশিত গ্রন্থ", icon: "BookOpen" }]`)।
   - `books`: ভার্চুয়াল বুকশেলফে সাজানো বইয়ের তালিকা (`title`, `author`, `coverColor`, `textColor`, `tag`)।

2. **`BookModel` (`books` কালেকশন — Standalone Book):**
   - প্রতিটি বইয়ের বিস্তারিত রেকর্ড: `chapters` (অধ্যায় তালিকা), `quotes` (উদ্ধৃতি), `rating` (০-৫), `pages` (পৃষ্ঠা সংখ্যা), `isbn`, `publisher`, `rokomariUrl`/`purchaseLink`।

---

### ৪.৫ আর্কিটেকচারাল কেস স্টাডি (Case Studies)

`CaseStudyModel` (`casestudies` কালেকশন):

```typescript
interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  contentType: "lexical" | "markdown" | "html";
  coverImage: string;
  screenshots: string[];
  projectSlug: string; // সম্পর্কিত প্রজেক্টের স্লাগ
  tags: string[];
  category: string;
  industry: string;
  client: string;
  challenge: string; // মূল স্থাপত্য চ্যালেঞ্জ
  solution: string; // উদ্ভাবিত সমাধান
  results: Array<{
    metric: string; // যেমন: "Latency Reduction"
    value: string; // যেমন: "92%"
    description: string;
  }>;
  stack: string[];
  duration: string;
  readingTime: string;
  featured: boolean;
  isPublished: boolean;
  publishedAt: string;
  sortOrder: number;
}
```

---

### ৪.৬ গ্রাফিক ডিজাইন পোর্টফোলিও (Designs)

`DesignModel` (`designs` কালেকশন):

```typescript
interface GraphicDesign {
  id: string; // ইউনিক আইডি স্ট্রিং
  title: string;
  subtitle: string;
  coverImage: string;
  description: string;
  category: string; // যেমন: Visual Identity, Typography
  bg: string; // ব্যাকগ্রাউন্ড কালার হেক্স
  tools: string[]; // যেমন: ["Figma", "Illustrator"]
  link: string; // বেহান্স বা ফিগমা লিংক
  featured: boolean;
  year: string;
}
```

---

### ৪.৭ অ্যাবাউট স্ক্রিন কনফিগারেশন (About)

`AboutModel` (`abouts` কালেকশন, `key: "main"`):

- `header`: টাইটেল, সাবটাইটেল, মূল পরিচিতি এবং প্রোফাইল পোর্ট্রেট।
- `pillars`: কোর ইঞ্জিনিয়ারিং ও ডিজাইন ফিলোসফি স্তম্ভ।
- `experience`: কর্মজীবনের অভিজ্ঞতার তালিকা (`company`, `role`, `duration`)।
- `education`: শিক্ষাগত ডিগ্রি ও প্রতিষ্ঠান (`institution`, `degree`, `year`)।
- `skillsCategories`: ক্যাটাগরিভিত্তিক প্রযুক্তিগত দক্ষতার তালিকা।

---

### ৪.৮ যোগাযোগ ও ইনকোয়ারি (Contact & Email)

- কোনো ডাটাবেজ টেবিল দখল করে না; সরাসরি Resend API-এর মাধ্যমে `CONTACT_RECIPIENT_EMAIL`-এ সুন্দর HTML টেমপ্লেটে প্রেরকের নাম, ইমেইল, বিষয় ও বার্তা পৌঁছে দেয়।
- লোকাল ডেভেলপমেন্টে `RESEND_API_KEY` না থাকলে এটি সিমুলেশন মোডে কনসোলে ইমেইল প্রিন্ট করে `simulated: true` রেসপন্স প্রদান করে।

---

### ৪.৯ ফাইল আপলোড ও মিডিয়া স্টোরেজ (Vercel Blob)

- **প্রোটোকল:** `multipart/form-data` (ফিল্ড কী: `file` বা `image` বা `media`)।
- **সর্বোচ্চ ফাইল সাইজ:** ১০ মেগাবাইট (10MB)।
- **নিরাপত্তা:** ক্ষতিকর স্পেশাল ক্যারেক্টার অপসারণে ফাইলনেম স্যানিটাইজ করা হয় এবং কোলিশন এড়াতে স্বয়ংক্রিয় র্যান্ডম সাফিক্স যোগ করা হয়।

---

### ৪.১০ ড্যাশবোর্ড ও কাউন্টার মেট্রিক্স (Dashboard)

- ডাটাবেজের কালেকশনগুলো থেকে লাইভ কাউন্টার গণনা করে: `totalProjects`, `totalBlogs`, `totalBooks`, `totalCaseStudies`, `totalDesigns`।

---

## ৫. পূর্ণাঙ্গ এপিআই এন্ডপয়েন্ট রেফারেন্স

### ৫.১ সিস্টেম ও হেলথ (System & Health)

| মেথড  | এন্ডপয়েন্ট   | পারমিশন | বিবরণ ও প্যারামিটার                                                                                                       |
| :---- | :------------ | :------ | :------------------------------------------------------------------------------------------------------------------------ |
| `GET` | `/`           | পাবলিক  | রুট এপিআই। `?format=json` অথবা `Accept: application/json` দিলে JSON স্ট্যাটাস দেয়, নতুবা HTML স্ট্যাটাস পেজ রেন্ডার করে। |
| `GET` | `/health`     | পাবলিক  | ডাটাবেজ কানেকশন স্টেট, আপটাইম ও টাইমস্ট্যাম্প রিটার্ন করে।                                                                |
| `GET` | `/api/health` | পাবলিক  | `/api` প্রিফিক্স যুক্ত হেলথ চেক রুট।                                                                                      |

---

### ৫.২ অথেন্টিকেশন ও প্রোফাইল (Auth & Profile)

| মেথড    | এন্ডপয়েন্ট                                 | পারমিশন       | রিকোয়েস্ট বডি / বিবরণ                                                             |
| :------ | :------------------------------------------ | :------------ | :--------------------------------------------------------------------------------- |
| `POST`  | `/api/auth/email-otp/send-verification-otp` | পাবলিক        | `{ "email": "admin@example.com", "type": "sign-in" }` — ৬ ডিজিট কোড পাঠায়         |
| `POST`  | `/api/auth/sign-in/email-otp`               | পাবলিক        | `{ "email": "admin@example.com", "otp": "123456" }` — ওটিপি যাচাই ও সেশন লগইন      |
| `POST`  | `/api/auth/email-otp/verify-email`          | পাবলিক        | `{ "email": "admin@example.com", "otp": "123456" }` — অল্টারনেটিভ ইমেইল ভেরিফিকেশন |
| `GET`   | `/api/auth/get-session`                     | পাবলিক/সেশন   | BetterAuth নেটিভ সেশন ভ্যালিডেশন                                                   |
| `POST`  | `/api/auth/sign-in/social`                  | পাবলিক        | `{ "provider": "google", "callbackURL": "..." }` — গুগল ওঅথ কলব্যাক                |
| `GET`   | `/api/me`                                   | 🔒 লগইন ইউজার | বর্তমান ইউজারের প্রোফাইল ও সেশন তথ্য                                               |
| `PATCH` | `/api/me`                                   | 🔒 লগইন ইউজার | `{ "name": "...", "image": "..." }` — প্রোফাইল ফিল্ড আপডেট                         |
| `PUT`   | `/api/me`                                   | 🔒 লগইন ইউজার | প্রোফাইল সম্পূর্ণ আপডেট                                                            |

---

### ৫.৩ অ্যাবাউট স্ক্রিন (About)

| মেথড  | এন্ডপয়েন্ট     | পারমিশন     | বিবরণ                                                      |
| :---- | :-------------- | :---------- | :--------------------------------------------------------- |
| `GET` | `/api/v1/about` | পাবলিক      | About পেজের সম্পূর্ণ কনফিগারেশন JSON প্রদান করে            |
| `PUT` | `/api/v1/about` | 🔒 অ্যাডমিন | About পেজের তথ্য আপডেট (header, pillars, experience, etc.) |

---

### ৫.৪ সফটওয়্যার প্রজেক্টস (Projects)

| মেথড     | এন্ডপয়েন্ট               | পারমিশন     | বিবরণ ও কুয়েরি প্যারামিটার                                                           |
| :------- | :------------------------ | :---------- | :----------------------------------------------------------------------------------- |
| `GET`    | `/api/v1/projects`        | পাবলিক      | প্রজেক্ট লিস্ট। ফিল্টার: `page`, `limit`, `category`, `featured`, `status`, `search` |
| `GET`    | `/api/v1/projects/:slug`  | পাবলিক      | স্লাগ ভিত্তিক নির্দিষ্ট প্রজেক্ট                                                     |
| `GET`    | `/api/v1/projects/id/:id` | 🔒 অ্যাডমিন | মঙ্গোডিবি `_id` দিয়ে প্রজেক্ট রিটার্ন করে                                            |
| `POST`   | `/api/v1/projects`        | 🔒 অ্যাডমিন | নতুন প্রজেক্ট তৈরি (Zod ভ্যালিডেশন প্রযোজ্য)                                         |
| `PUT`    | `/api/v1/projects/:id`    | 🔒 অ্যাডমিন | প্রজেক্টের সম্পূর্ণ আপডেট                                                            |
| `PATCH`  | `/api/v1/projects/:id`    | 🔒 অ্যাডমিন | প্রজেক্টের আংশিক আপডেট                                                               |
| `DELETE` | `/api/v1/projects/:id`    | 🔒 অ্যাডমিন | প্রজেক্ট স্থায়ীভাবে ডিলিট                                                            |

---

### ৫.৫ টেকনিক্যাল ব্লগস (Blogs)

| মেথড     | এন্ডপয়েন্ট            | পারমিশন     | বিবরণ ও কুয়েরি প্যারামিটার                                                                            |
| :------- | :--------------------- | :---------- | :---------------------------------------------------------------------------------------------------- |
| `GET`    | `/api/v1/blogs`        | পাবলিক      | ব্লগ লিস্ট। ফিল্টার: `page`, `limit`, `published`, `category`, `featured`, `search`, `includeContent` |
| `GET`    | `/api/v1/blogs/:slug`  | পাবলিক      | স্লাগ ভিত্তিক পূর্ণাঙ্গ ব্লগ ও Lexical কন্টেন্ট                                                       |
| `GET`    | `/api/v1/blogs/id/:id` | 🔒 অ্যাডমিন | আইডি দিয়ে ব্লগ তথ্য রিটার্ন করে                                                                       |
| `POST`   | `/api/v1/blogs`        | 🔒 অ্যাডমিন | নতুন ব্লগ তৈরি                                                                                        |
| `PUT`    | `/api/v1/blogs/:id`    | 🔒 অ্যাডমিন | ব্লগ সম্পূর্ণ আপডেট                                                                                   |
| `PATCH`  | `/api/v1/blogs/:id`    | 🔒 অ্যাডমিন | ব্লগ আংশিক আপডেট                                                                                      |
| `DELETE` | `/api/v1/blogs/:id`    | 🔒 অ্যাডমিন | ব্লগ পোস্ট ডিলিট                                                                                      |

---

### ৫.৬ বই ও বুকশেলফ (Books)

| মেথড     | এন্ডপয়েন্ট            | পারমিশন     | বিবরণ                                                         |
| :------- | :--------------------- | :---------- | :------------------------------------------------------------ |
| `GET`    | `/api/v1/books`        | পাবলিক      | প্রধান হাইলাইটেড বই, পাঠক পরিসংখ্যান ও ভার্চুয়াল শেলফ বাণ্ডিল |
| `PUT`    | `/api/v1/books/bundle` | 🔒 অ্যাডমিন | বইয়ের বাণ্ডিল আপডেট (Hero book + stats + shelf)               |
| `GET`    | `/api/v1/books/all`    | পাবলিক      | সকল স্ট্যান্ডঅ্যালোন বইয়ের বিস্তারিত তালিকা                   |
| `GET`    | `/api/v1/books/:slug`  | পাবলিক      | স্লাগ দিয়ে একক বইয়ের পূর্ণাঙ্গ অধ্যায় ও উদ্ধৃতি               |
| `GET`    | `/api/v1/books/id/:id` | 🔒 অ্যাডমিন | আইডি দিয়ে বইয়ের ডাটা                                          |
| `POST`   | `/api/v1/books`        | 🔒 অ্যাডমিন | নতুন একক বই যুক্ত করা                                         |
| `PUT`    | `/api/v1/books/:id`    | 🔒 অ্যাডমিন | বইয়ের তথ্য সম্পূর্ণ আপডেট                                     |
| `PATCH`  | `/api/v1/books/:id`    | 🔒 অ্যাডমিন | বইয়ের তথ্য আংশিক আপডেট                                        |
| `DELETE` | `/api/v1/books/:id`    | 🔒 অ্যাডমিন | বইয়ের রেকর্ড ডিলিট                                            |

---

### ৫.৭ কেস স্টাডিজ (Case Studies)

| মেথড     | এন্ডপয়েন্ট                   | পারমিশন     | বিবরণ                                                                                     |
| :------- | :---------------------------- | :---------- | :---------------------------------------------------------------------------------------- |
| `GET`    | `/api/v1/case-studies`        | পাবলিক      | কেস স্টাডি তালিকা। ফিল্টার: `page`, `limit`, `category`, `industry`, `featured`, `search` |
| `GET`    | `/api/v1/case-studies/:slug`  | পাবলিক      | স্লাগ ভিত্তিক একক আর্কিটেকচার কেস স্টাডি                                                  |
| `GET`    | `/api/v1/case-studies/id/:id` | 🔒 অ্যাডমিন | আইডি দিয়ে কেস স্টাডি খোঁজা                                                                |
| `POST`   | `/api/v1/case-studies`        | 🔒 অ্যাডমিন | নতুন কেস স্টাডি তৈরি                                                                      |
| `PUT`    | `/api/v1/case-studies/:id`    | 🔒 অ্যাডমিন | কেস স্টাডি সম্পূর্ণ আপডেট                                                                 |
| `PATCH`  | `/api/v1/case-studies/:id`    | 🔒 অ্যাডমিন | কেস স্টাডি আংশিক আপডেট                                                                    |
| `DELETE` | `/api/v1/case-studies/:id`    | 🔒 অ্যাডমিন | কেস স্টাডি ডিলিট                                                                          |

---

### ৫.৮ গ্রাফিক ডিজাইন (Designs)

| মেথড     | এন্ডপয়েন্ট           | পারমিশন     | বিবরণ                                                   |
| :------- | :-------------------- | :---------- | :------------------------------------------------------ |
| `GET`    | `/api/v1/designs`     | পাবলিক      | ডিজাইন গ্যালারি তালিকা। ফিল্টার: `category`, `featured` |
| `GET`    | `/api/v1/designs/:id` | পাবলিক      | আইডি ভিত্তিক ডিজাইন রেকর্ড                              |
| `POST`   | `/api/v1/designs`     | 🔒 অ্যাডমিন | নতুন ডিজাইন এন্ট্রি যুক্ত করা                           |
| `PUT`    | `/api/v1/designs/:id` | 🔒 অ্যাডমিন | ডিজাইন রেকর্ড আপডেট করা                                 |
| `DELETE` | `/api/v1/designs/:id` | 🔒 অ্যাডমিন | ডিজাইন রেকর্ড ডিলিট করা                                 |

---

### ৫.৯ যোগাযোগ ও বার্তা (Contact)

| মেথড   | এন্ডপয়েন্ট            | পারমিশন | বিবরণ ও বডি                                                                            |
| :----- | :--------------------- | :------ | :------------------------------------------------------------------------------------- |
| `POST` | `/api/v1/contact`      | পাবলিক  | `{ "name": "...", "email": "...", "subject": "...", "message": "..." }` — ইমেইল পাঠানো |
| `POST` | `/api/v1/contact/send` | পাবলিক  | কন্ট্যাক্ট ইনকোয়ারির সমার্থক রাউট                                                     |
| `POST` | `/api/v1/send-email`   | পাবলিক  | সরাসরি ইমেইল ট্রান্সমিশন রাউট                                                          |
| `POST` | `/api/send-email`      | পাবলিক  | আনভার্সনড লিগ্যাসি এলিয়াস                                                             |

---

### ৫.১০ ড্যাশবোর্ড পরিসংখ্যান (Dashboard)

| মেথড  | এন্ডপয়েন্ট             | পারমিশন     | বিবরণ                                        |
| :---- | :---------------------- | :---------- | :------------------------------------------- |
| `GET` | `/api/v1/dashboard`     | 🔒 অ্যাডমিন | সকল মডিউলের লাইভ কাউন্ট মেট্রিক্স প্রদান করে |
| `GET` | `/api/v1/messages`      | 🔒 অ্যাডমিন | অ্যাডমিন বার্তা তালিকা                       |
| `GET` | `/api/v1/notifications` | 🔒 অ্যাডমিন | সিস্টেম নোটিফিকেশন তালিকা                    |

---

### ৫.১১ ফাইল আপলোড (Vercel Blob)

| মেথড     | এন্ডপয়েন্ট           | পারমিশন     | বিবরণ                                                                      |
| :------- | :-------------------- | :---------- | :------------------------------------------------------------------------- |
| `POST`   | `/api/v1/upload`      | 🔒 অ্যাডমিন | মিডিয়া আপলোড (`multipart/form-data`, ফিল্ড: `file`, সর্বোচ্চ ১০ মেগাবাইট) |
| `GET`    | `/api/v1/upload`      | 🔒 অ্যাডমিন | আপলোডকৃত ব্লবের তালিকা (`limit`, `cursor`, `prefix`)                       |
| `GET`    | `/api/v1/upload/info` | 🔒 অ্যাডমিন | নির্দিষ্ট ফাইলের মেটাডাটা হেড (`?url=...`)                                 |
| `DELETE` | `/api/v1/upload`      | 🔒 অ্যাডমিন | ফাইল রিমুভ করা (`?url=...`)                                                |

---

## ৬. ব্যাকওয়ার্ড কম্প্যাটিবিলিটি ও ফিল্ড এলিয়াস

পূর্ববর্তী ফ্রন্টএন্ড কোডের স্থিতিশীলতা রক্ষার্থে সার্ভারে স্বয়ংক্রিয় এলিয়াস মেকানিজম সক্রিয় রয়েছে:

| মূল v1 রুট                 | আনভার্সনড রুট (Legacy)  |
| :------------------------- | :---------------------- |
| `GET /api/v1/projects`     | `GET /api/projects`     |
| `GET /api/v1/blogs`        | `GET /api/blogs`        |
| `GET /api/v1/books`        | `GET /api/books`        |
| `GET /api/v1/case-studies` | `GET /api/case-studies` |
| `POST /api/v1/contact`     | `POST /api/send-email`  |

### স্বয়ংক্রিয় ফিল্ড এলিয়াস (Mongoose `pre-save` ও `toJSON`):

- `Project`: `image` ⇄ `coverImage`, `gitRepo`/`repo` ⇄ `github`, `link`/`demo` ⇄ `liveLink`, `isFeatured` ⇄ `featured`।
- `Blog`: `cover` ⇄ `coverImage`।
- `Book`: `rokomariUrl` ⇄ `purchaseLink`।

---

## ৭. এরর হ্যান্ডলিং ও স্ট্যান্ডার্ড রেসপন্স ফরম্যাট

সার্ভারের প্রতিটি এরর সুনির্দিষ্ট এইচটিটিপি স্ট্যাটাস কোড ও ইউনিফাইড JSON ফরম্যাটে প্রদান করা হয়:

```json
// ভ্যালিডেশন এরর (400 Bad Request)
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "title": { "_errors": ["Title is required"] }
  }
}

// অথেন্টিকেশন এরর (401 Unauthorized)
{
  "success": false,
  "message": "Unauthorized"
}

// পারমিশন এরর (403 Forbidden)
{
  "success": false,
  "message": "Forbidden"
}

// ডাটাবেজ অফলাইন সতর্কতা (503 Service Unavailable)
{
  "success": false,
  "message": "Authentication is unavailable until MongoDB is connected.",
  "hint": "Please verify MONGODB_URI and IP access list in MongoDB Atlas."
}
```

---

## ৮. Postman কালেকশন ও অটোমেশন গাইড

`doc/postman_collection.json` ফাইলে Postman v2.1.0 স্ট্যান্ডার্ড মেনে তৈরি ৬০+ রিকোয়েস্ট সাজানো রয়েছে।

### স্বয়ংক্রিয় লগইন টোকেন সেটআপ:

1. কালেকশনের **Variables** ট্যাবে `baseUrl` এর মান লোকাল হোস্ট `http://localhost:5000` অথবা প্রোডাকশন ডোমেইন দিন।
2. `2. Authentication (BetterAuth)` ফোল্ডারের **`Email OTP — Verify Code`** বা **`Sign In with Email OTP`** রিকোয়েস্টে পোস্ট-রেসপন্স টেস্ট স্ক্রিপ্ট যুক্ত করা আছে।
3. যখনই আপনি সঠিক ৬-ডিজিট কোড দিয়ে রিকোয়েস্ট পাঠাবেন, রেসপন্স থেকে টোকেনটি স্বয়ংক্রিয়ভাবে কালেকশন ভ্যারিয়েবল `bearerToken`-এ সেভ হয়ে যাবে।
4. এর ফলে পরবর্তীতে প্রজেক্ট তৈরি, ফাইল আপলোড বা ড্যাশবোর্ড দেখার রিকোয়েস্টে আর ম্যানুয়ালি টোকেন কপি করতে হবে না।

---

## ৯. লোকাল রান ও ডেভেলপমেন্ট কমান্ড

```bash
# ডিপেন্ডেন্সি ইনস্টল (শুধুমাত্র pnpm ব্যবহার করুন)
pnpm install

# লোকাল ডেভেলপমেন্ট সার্ভার চালনা (Hot-Reload)
pnpm dev

# টাইপস্ক্রিপ্ট টাইপ চেক
pnpm typecheck

# কোড লিন্টিং ও ফরম্যাটিং
pnpm lint:fix
pnpm format
```

---

_ডকুমেন্টেশন সংস্করণ: ৭.০ (Enterprise Reference Edition)_  
_প্রস্তুতকারক: Google DeepMind Antigravity AI Pair Programmer_
