# 🗄️ Abdullah Al Maksud — Database Schemas & Data Models

This document defines the complete MongoDB database schemas, data types, Mongoose configurations, pre-save normalization hooks, and JSON transformation rules for all collections.

---

## 📑 Collection Overview

| Collection Name | Mongoose Model        | Primary Key          | Description                                                        |
| :-------------- | :-------------------- | :------------------- | :----------------------------------------------------------------- |
| `user`          | Handled by BetterAuth | `id` (String)        | Authenticated user profiles and access roles.                      |
| `session`       | Handled by BetterAuth | `id` (String)        | Active user login sessions and tokens.                             |
| `account`       | Handled by BetterAuth | `id` (String)        | Linked OAuth provider accounts (Google).                           |
| `verification`  | Handled by BetterAuth | `id` (String)        | Email OTP verification codes and expiration.                       |
| `abouts`        | `AboutModel`          | `key: "main"`        | Single-document configuration for the About screen.                |
| `projects`      | `ProjectModel`        | `_id` / `slug`       | Software development projects and architectures.                   |
| `blogs`         | `BlogModel`           | `_id` / `slug`       | Technical essays, publications, and articles.                      |
| `bookbundles`   | `BookBundleModel`     | `key: "main"`        | Hero featured book, readership statistics, and bookshelf.          |
| `books`         | `BookModel`           | `_id` / `slug`       | Standalone book publications with chapters and quotes.             |
| `casestudies`   | `CaseStudyModel`      | `_id` / `slug`       | In-depth engineering case studies with challenge/solution/metrics. |
| `designs`       | `DesignModel`         | `id` (Custom String) | Visual brand systems, graphic designs, and typography.             |

---

## 1. BetterAuth Collections

### 1.1 `user` Collection

Managed by BetterAuth MongoDB Adapter:

```typescript
interface UserDocument {
  id: string; // Unique string identifier
  name: string; // User display name
  email: string; // Unique email address
  emailVerified: boolean; // Verification status
  image?: string; // Avatar URL
  role: "admin" | "user"; // RBAC authorization role
  createdAt: Date;
  updatedAt: Date;
}
```

### 1.2 `session` Collection

```typescript
interface SessionDocument {
  id: string; // Session identifier
  userId: string; // Reference to user.id
  token: string; // Secret session token
  expiresAt: Date; // Session expiration timestamp
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 2. About Module (`abouts` Collection)

Configured as a singleton document queried by `{ key: "main" }`.

### Mongoose Schema Definition:

```typescript
const AboutSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true },
    header: {
      title: String,
      subtitle: String,
      description: String,
      image: String,
    },
    pillars: [
      {
        icon: String,
        title: String,
        description: String,
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        duration: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        year: String,
      },
    ],
    skillsCategories: [
      {
        category: String,
        skills: [String],
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);
```

---

## 3. Projects Module (`projects` Collection)

### Mongoose Schema Definition:

```typescript
const CoreFeatureSchema = new Schema(
  {
    icon: { type: String, default: "" },
    text: { type: String, required: true },
    desc: { type: String, required: true },
  },
  { _id: false },
);

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    folderKey: { type: String, index: true },
    description: { type: String, default: "" },
    longDescription: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    logo: { type: String, default: "" },
    imageBg: { type: String, default: "#0F131A" },
    barColor: { type: String, default: "#E5A93C" },
    screenshots: [{ type: String }],
    tags: [{ type: String }],
    stack: [{ type: String }],
    category: { type: String, default: "" },
    github: { type: String, default: "" },
    liveLink: { type: String, default: "" },
    year: {
      type: String,
      default: () => new Date().getFullYear().toString(),
    },
    status: {
      type: String,
      enum: ["live", "case-study", "prototype", "archived", "building"],
      default: "live",
    },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    coreFeatures: [CoreFeatureSchema],
    content: { type: Schema.Types.Mixed, default: null },
    contentType: {
      type: String,
      enum: ["blocks", "lexical", "json", "markdown", "html"],
      default: "blocks",
    },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    createdAtDate: { type: String },
    lastUpdate: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : "";
        // Backward-compatibility aliases
        ret.image = ret.coverImage || "";
        ret.gitRepo = ret.github || "";
        ret.repo = ret.github || "";
        ret.link = ret.liveLink || "";
        ret.demo = ret.liveLink || "";
        ret.isFeatured = ret.featured || false;
        ret.isArchived = ret.status === "archived";
        ret.categories = ret.category ? [ret.category] : [];
        ret.index = ret.sortOrder !== undefined ? String(ret.sortOrder) : "0";
        ret.fullContent = ret.content || ret.longDescription || "";
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);
```

### Pre-Save Normalization Logic:

```typescript
ProjectSchema.pre("save", function () {
  if (this.image && !this.coverImage) this.coverImage = this.image;
  if (this.gitRepo && !this.github) this.github = this.gitRepo;
  if (this.repo && !this.github) this.github = this.repo;
  if (this.link && !this.liveLink) this.liveLink = this.link;
  if (this.demo && !this.liveLink) this.liveLink = this.demo;
  if (this.isFeatured !== undefined && this.featured === undefined) this.featured = this.isFeatured;
  if (this.categories?.length > 0 && !this.category) this.category = this.categories[0];
  if (this.tags?.length > 0 && (!this.stack || this.stack.length === 0)) this.stack = this.tags;
  if (this.stack?.length > 0 && (!this.tags || this.tags.length === 0)) this.tags = this.stack;

  const todayStr = new Date().toISOString().split("T")[0];
  if (!this.createdAtDate) this.createdAtDate = todayStr;
  this.lastUpdate = todayStr;
});
```

---

## 4. Blogs Module (`blogs` Collection)

### Mongoose Schema Definition:

```typescript
const AuthorSchema = new Schema(
  {
    name: { type: String, default: "Abdullah Al Maksud" },
    avatar: { type: String, default: "/images/avatar.jpg" },
    bio: { type: String, default: "Developer, designer, writer." },
  },
  { _id: false },
);

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    folderKey: { type: String, index: true },
    excerpt: { type: String, default: "" },
    content: { type: Schema.Types.Mixed, default: null }, // Lexical Block State
    contentType: {
      type: String,
      enum: ["lexical", "markdown", "html"],
      default: "lexical",
    },
    cover: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    author: { type: AuthorSchema, default: () => ({}) },
    tags: [{ type: String }],
    category: { type: String, default: "Engineering" },
    readingTime: { type: String, default: "5 min read" },
    featured: { type: Boolean, default: false },
    featuredType: {
      type: String,
      enum: ["large", "small", "standard", ""],
      default: "",
    },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: String, default: "" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : ret.id || "";
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

BlogSchema.pre("save", function () {
  if (this.cover && !this.coverImage) this.coverImage = this.cover;
  if (this.coverImage && !this.cover) this.cover = this.coverImage;
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date().toISOString().split("T")[0];
  }
});
```

---

## 5. Books Module

### 5.1 Book Bundle Schema (`bookbundles` Collection)

```typescript
const FeaturedBookSchema = new Schema(
  {
    titleBn: { type: String, default: "এমন যদি হতো" },
    titleEn: { type: String, default: "Emon Jodi Hoto" },
    title: { type: String, default: "এমন যদি হতো" },
    author: { type: String, default: "আব্দুল্লাহ আল মাকসুদ" },
    publisher: { type: String, default: "জ্ঞানকোষ প্রকাশনী" },
    category: { type: String, default: "বিজ্ঞান ও প্রযুক্তি" },
    ageGroup: { type: String, default: "বয়স ১২-১৭" },
    cover: { type: String, default: "/images/books/emon-jodi-hoto.webp" },
    coverImage: { type: String, default: "/images/books/emon-jodi-hoto.webp" },
    price: { type: Number, default: 344 },
    rokomariUrl: { type: String, default: "https://www.rokomari.com/book/454540/emon-jodi-hoto" },
    purchaseLink: { type: String, default: "https://www.rokomari.com/book/454540/emon-jodi-hoto" },
    descriptionBn: { type: String, default: "" },
    descriptionEn: { type: String, default: "" },
    description: { type: String, default: "" },
    year: { type: Number, default: 2025 },
  },
  { _id: false },
);

const BookBundleSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true },
    book: { type: FeaturedBookSchema, required: true },
    stats: [{ value: String, label: String, icon: String }],
    books: [
      {
        id: String,
        slug: String,
        title: String,
        author: String,
        coverColor: String,
        textColor: String,
        accentColor: String,
        coverImage: String,
        tag: String,
        genre: String,
        year: Number,
      },
    ],
  },
  { timestamps: true },
);
```

### 5.2 Standalone Book Schema (`books` Collection)

```typescript
const StandaloneBookSchema = new Schema(
  {
    title: { type: String, required: true },
    titleBn: String,
    titleEn: String,
    subtitle: { type: String, default: "" },
    slug: { type: String, required: true, unique: true },
    folderKey: { type: String, index: true },
    author: { type: String, required: true },
    coverImage: { type: String, default: "" },
    cover: { type: String, default: "" },
    coverColor: { type: String, default: "#F5F3EF" },
    textColor: { type: String, default: "#2B2824" },
    accentColor: { type: String, default: "#D97706" },
    description: { type: String, default: "" },
    descriptionBn: { type: String, default: "" },
    descriptionEn: { type: String, default: "" },
    genre: { type: String, default: "" },
    category: { type: String, default: "" },
    rating: { type: Number, min: 0, max: 5, default: 5 },
    year: { type: Number, default: 2025 },
    publicationYear: { type: String, default: "" },
    edition: { type: String, default: "" },
    pages: { type: Number, default: 0 },
    isbn: { type: String, default: "" },
    publisher: { type: String, default: "" },
    price: { type: Number, default: 0 },
    rokomariUrl: { type: String, default: "" },
    purchaseLink: { type: String, default: "" },
    purchaseLinks: [
      {
        label: String,
        url: String,
        isPrimary: Boolean,
      },
    ],
    synopsis: Schema.Types.Mixed,
    content: Schema.Types.Mixed,
    contentType: {
      type: String,
      enum: ["blocks", "lexical", "json", "markdown", "html"],
      default: "blocks",
    },
    themes: [String],
    chapters: [
      {
        number: String,
        title: String,
        description: String,
      },
    ],
    quotes: [String],
    authorNote: { type: String, default: "" },
    tag: { type: String, default: "" },
    tags: [String],
    isRecommended: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : "";
        if (!ret.coverImage && ret.cover) ret.coverImage = ret.cover;
        if (!ret.purchaseLink && ret.rokomariUrl) ret.purchaseLink = ret.rokomariUrl;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);
```

---

## 6. Case Studies Module (`casestudies` Collection)

### Mongoose Schema Definition:

```typescript
const CaseStudyResultSchema = new Schema(
  {
    metric: { type: String, required: true },
    value: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { _id: false },
);

const CaseStudySchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    folderKey: { type: String, index: true },
    excerpt: { type: String, default: "" },
    content: { type: Schema.Types.Mixed, default: null },
    contentType: {
      type: String,
      enum: ["lexical", "markdown", "html"],
      default: "lexical",
    },
    coverImage: { type: String, default: "" },
    screenshots: [{ type: String }],
    projectSlug: { type: String, default: "" },
    tags: [{ type: String }],
    category: { type: String, default: "Architecture" },
    industry: { type: String, default: "" },
    client: { type: String, default: "" },
    challenge: { type: String, default: "" },
    solution: { type: String, default: "" },
    results: [CaseStudyResultSchema],
    stack: [{ type: String }],
    duration: { type: String, default: "" },
    readingTime: { type: String, default: "8 min read" },
    featured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : "";
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);
```

---

## 7. Graphic Design Module (`designs` Collection)

### Mongoose Schema Definition:

```typescript
const DesignSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    coverImage: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "Visual Identity" },
    bg: { type: String, default: "#0A0D14" },
    tools: [{ type: String }],
    link: { type: String, default: "#" },
    featured: { type: Boolean, default: false },
    year: { type: String, default: "2025" },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret.id || (ret._id ? ret._id.toString() : "");
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);
```

---

## 8. Indexing Strategy

To guarantee rapid query response times under high concurrency:

- **`slug: 1` (Unique):** Indexed on `projects`, `blogs`, `books`, and `casestudies`.
- **`folderKey: 1`:** Indexed on `projects`, `blogs`, `books`, and `casestudies` for stable asset and markdown resolution.
- **`createdAt: -1`:** Compounded with category/published filters on `projects`, `blogs`, `casestudies`, and `designs`.
- **`key: 1` (Unique):** Indexed on `abouts` and `bookbundles`.
- **Text / Regex search indexes:** Compound indexes on `title`, `tags`, and `stack` to accelerate search filters.
