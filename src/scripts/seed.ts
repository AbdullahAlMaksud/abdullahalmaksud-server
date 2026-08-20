import dns from "node:dns";
import mongoose from "mongoose";

try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  // Ignore if dns setting is restricted
}
import { env } from "../lib/env.js";
import { ProjectModel } from "../modules/project/project.model.js";
import { BlogModel } from "../modules/blog/blog.model.js";
import { BookBundleModel, BookModel } from "../modules/book/book.model.js";
import { DesignModel } from "../modules/design/design.model.js";
import { HomeModel } from "../modules/home/home.model.js";
import { AboutModel } from "../modules/about/about.model.js";

import homeData from "../data/home.json" with { type: "json" };
import aboutData from "../data/about.json" with { type: "json" };
import projectsData from "../data/projects.json" with { type: "json" };
import blogsData from "../data/blogs.json" with { type: "json" };
import blogDetailsData from "../data/blog-details.json" with { type: "json" };
import bookData from "../data/book.json" with { type: "json" };
import designsData from "../data/designs.json" with { type: "json" };

async function seedDatabase() {
  console.log("Connecting to MongoDB for seeding...");
  console.log(`Database: ${env.MONGODB_DB_NAME}`);
  
  await mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_DB_NAME,
  });

  console.log("MongoDB connected successfully. Starting migration & seeding...");

  // 1. Projects
  console.log("Seeding Projects...");
  await ProjectModel.deleteMany({});
  await ProjectModel.create(projectsData.projects);
  console.log(`✓ Seeded ${projectsData.projects.length} projects.`);

  // 2. Blogs & Blog Details
  console.log("Seeding Blogs & Blog Details...");
  await BlogModel.deleteMany({});

  const detailsMap = new Map((blogDetailsData.blogDetails as any[]).map((d) => [d.slug, d]));
  const mergedBlogs = blogsData.blogs.map((b) => {
    const detail = detailsMap.get(b.slug);
    return {
      id: b.id,
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      category: b.category,
      publishedAt: b.publishedAt,
      readingTime: b.readingTime,
      featured: b.featured,
      featuredType: b.featuredType,
      cover: b.cover,
      coverImage: b.cover,
      author: detail?.author || {
        name: "Abdullah Al Maksud",
        avatar: "/images/avatar.jpg",
        bio: "Developer, designer, writer.",
      },
      tags: detail?.tags || [b.category],
      content: detail?.content || b.excerpt,
      isPublished: true,
    };
  });

  for (const d of blogDetailsData.blogDetails as any[]) {
    if (!mergedBlogs.some((b) => b.slug === d.slug)) {
      mergedBlogs.push({
        id: d.slug,
        slug: d.slug,
        title: d.title,
        excerpt: d.excerpt,
        category: d.category,
        publishedAt: d.publishedAt,
        readingTime: d.readingTime,
        featured: false,
        featuredType: "",
        cover: d.cover,
        coverImage: d.cover,
        author: d.author,
        tags: d.tags,
        content: d.content,
        isPublished: true,
      });
    }
  }

  await BlogModel.create(mergedBlogs);
  console.log(`✓ Seeded ${mergedBlogs.length} blog posts with rich content blocks.`);

  // 3. Book Bundle
  console.log("Seeding Books & Publications...");
  await BookBundleModel.deleteMany({});
  await BookBundleModel.create({
    key: "main",
    book: bookData.book,
    stats: bookData.stats,
    books: bookData.books,
  });

  // Seed standalone books as well
  await BookModel.deleteMany({});
  const standaloneBooks = [
    {
      title: bookData.book.titleBn,
      titleBn: bookData.book.titleBn,
      titleEn: bookData.book.titleEn,
      slug: "emon-jodi-hoto",
      author: bookData.book.author,
      publisher: bookData.book.publisher,
      category: bookData.book.category,
      coverImage: bookData.book.cover,
      cover: bookData.book.cover,
      price: bookData.book.price,
      rokomariUrl: bookData.book.rokomariUrl,
      description: bookData.book.descriptionBn,
      descriptionBn: bookData.book.descriptionBn,
      descriptionEn: bookData.book.descriptionEn,
      year: bookData.book.year,
      rating: 5,
      isRecommended: true,
    },
    ...bookData.books.map((b) => ({
      title: b.title,
      slug: b.id,
      author: b.author,
      coverColor: b.coverColor,
      textColor: b.textColor,
      accentColor: b.accentColor,
      tag: b.tag,
      tags: [b.tag],
      year: b.year,
      rating: 5,
      isRecommended: true,
    })),
  ];
  await BookModel.create(standaloneBooks);
  console.log(`✓ Seeded Book Bundle and ${standaloneBooks.length} book records.`);

  // 4. Graphic Designs
  console.log("Seeding Graphic Designs...");
  await DesignModel.deleteMany({});
  await DesignModel.create(designsData.designs);
  console.log(`✓ Seeded ${designsData.designs.length} graphic design portfolio items.`);

  // 5. Home Configuration
  console.log("Seeding Home page data...");
  await HomeModel.deleteMany({});
  await HomeModel.create({
    key: "main",
    ...homeData,
  });
  console.log("✓ Seeded Home configuration.");

  // 6. About Configuration
  console.log("Seeding About page data...");
  await AboutModel.deleteMany({});
  await AboutModel.create({
    key: "main",
    ...aboutData,
  });
  console.log("✓ Seeded About configuration.");

  console.log("\n All portfolio data successfully synchronized and seeded to MongoDB!");
  await mongoose.disconnect();
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error("Seeding failed with error:", err);
  process.exit(1);
});
