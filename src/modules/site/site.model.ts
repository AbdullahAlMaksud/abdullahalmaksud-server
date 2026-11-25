import mongoose, { Schema, type Model } from "mongoose";

export type SupportedLocale = "en" | "bn";

const SocialLinkSchema = new Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true },
    isExternal: { type: Boolean, default: true },
  },
  { _id: false },
);

const AdvisoryPillarSchema = new Schema(
  {
    number: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const SiteMetricSchema = new Schema(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
    icon: { type: String, default: "sparkles" },
  },
  { _id: false },
);

const SiteLocaleSchema = new Schema(
  {
    locale: {
      type: String,
      enum: ["en", "bn"],
      required: true,
      unique: true,
    },
    meta: {
      siteName: { type: String, required: true },
      defaultTitle: { type: String, required: true },
      description: { type: String, required: true },
      keywords: { type: String, default: "" },
      cvUrl: { type: String, default: "/CV-of-Abdullah-Al-Maksud.pdf" },
    },
    nav: {
      home: { type: String, required: true },
      about: { type: String, required: true },
      work: { type: String, required: true },
      blog: { type: String, required: true },
      books: { type: String, required: true },
      contact: { type: String, required: true },
      downloadCv: { type: String, required: true },
      backToHome: { type: String, required: true },
      allWritings: { type: String, required: true },
    },
    identity: {
      name: { type: String, required: true },
      firstNameLine: { type: String, required: true },
      lastNameLine: { type: String, required: true },
      role: { type: String, required: true },
      subRole: { type: String, required: true },
      tagline: { type: String, required: true },
      portraitUrl: { type: String, default: "/images/portrait.png" },
    },
    metrics: [SiteMetricSchema],
    marqueeItems: [{ type: String }],
    sections: {
      caseStudiesCategory: { type: String, required: true },
      caseStudiesTitle: { type: String, required: true },
      caseStudyModalLabel: { type: String, required: true },
      projectsCategory: { type: String, required: true },
      projectsTitle: { type: String, required: true },
      projectModalLabel: { type: String, required: true },
      writingsCategory: { type: String, required: true },
      writingsTitle: { type: String, required: true },
      writingModalLabel: { type: String, required: true },
      bookLabel: { type: String, required: true },
      viewBookDetails: { type: String, required: true },
      viewAllWritings: { type: String, required: true },
    },
    advisory: {
      badge: { type: String, required: true },
      availability: { type: String, required: true },
      category: { type: String, required: true },
      headline: { type: String, required: true },
      statement: { type: String, required: true },
      pillars: [AdvisoryPillarSchema],
      ctaEyebrow: { type: String, required: true },
      ctaTitle: { type: String, required: true },
      primaryCta: { type: String, required: true },
      copyEmailCta: { type: String, required: true },
      emailCopiedCta: { type: String, required: true },
    },
    contact: {
      badge: { type: String, required: true },
      headline: { type: String, required: true },
      intro: { type: String, required: true },
      responseTimeLabel: { type: String, required: true },
      responseTimeValue: { type: String, required: true },
      availabilityLabel: { type: String, required: true },
      availabilityValue: { type: String, required: true },
      emailLabel: { type: String, required: true },
      email: { type: String, required: true },
      copyLabel: { type: String, required: true },
      copiedLabel: { type: String, required: true },
      cvButtonLabel: { type: String, required: true },
      formTitle: { type: String, required: true },
      formSubtitle: { type: String, required: true },
      modalTitle: { type: String, required: true },
      modalSubtitle: { type: String, required: true },
      topicLabel: { type: String, required: true },
      quickSubjects: [{ type: String }],
      nameLabel: { type: String, required: true },
      namePlaceholder: { type: String, required: true },
      emailFieldLabel: { type: String, required: true },
      emailPlaceholder: { type: String, required: true },
      subjectLabel: { type: String, required: true },
      subjectPlaceholder: { type: String, required: true },
      messageLabel: { type: String, required: true },
      messagePlaceholder: { type: String, required: true },
      submitButton: { type: String, required: true },
      sendingButton: { type: String, required: true },
      poweredBy: { type: String, required: true },
      successTitle: { type: String, required: true },
      successMessage: { type: String, required: true },
      sendAnotherButton: { type: String, required: true },
      closeButton: { type: String, required: true },
    },
    footer: {
      copyright: { type: String, required: true },
      rights: { type: String, required: true },
      socials: [SocialLinkSchema],
    },
    ui: {
      blogTitle: { type: String, required: true },
      blogSubtitle: { type: String, required: true },
      searchPlaceholder: { type: String, required: true },
      sortLabel: { type: String, required: true },
      sortNewest: { type: String, required: true },
      sortOldest: { type: String, required: true },
      sortReadTime: { type: String, required: true },
      sortTitle: { type: String, required: true },
      emptyBlogsTitle: { type: String, required: true },
      emptyBlogsSubtitle: { type: String, required: true },
      clearSearch: { type: String, required: true },
      writtenByLabel: { type: String, required: true },
      authorName: { type: String, required: true },
      contactAuthor: { type: String, required: true },
      bookSpecLabel: { type: String, required: true },
      bookAuthorLabel: { type: String, required: true },
      bookPublisherLabel: { type: String, required: true },
      bookYearLabel: { type: String, required: true },
      bookLanguageLabel: { type: String, required: true },
      bookPagesLabel: { type: String, required: true },
      bookIsbnLabel: { type: String, required: true },
      bookSynopsisLabel: { type: String, required: true },
      bookThemesLabel: { type: String, required: true },
      bookQuotesLabel: { type: String, required: true },
      bookChaptersLabel: { type: String, required: true },
      bookAuthorNoteLabel: { type: String, required: true },
      bookNotFoundTitle: { type: String, required: true },
      bookNotFoundSubtitle: { type: String, required: true },
      stackLabel: { type: String, required: true },
      metricsLabel: { type: String, required: true },
      errorTitle: { type: String, required: true },
      errorDescription: { type: String, required: true },
      retryButton: { type: String, required: true },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id ? ret._id.toString() : "";
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const SiteLocaleModel: Model<any> =
  mongoose.models.SiteLocale || mongoose.model("SiteLocale", SiteLocaleSchema);
