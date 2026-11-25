import type { SupportedLocale } from "./site.model.js";

export interface SiteLocalePayload {
  locale: SupportedLocale;
  meta: {
    siteName: string;
    defaultTitle: string;
    description: string;
    keywords: string;
    cvUrl: string;
  };
  nav: {
    home: string;
    about: string;
    work: string;
    blog: string;
    books: string;
    contact: string;
    downloadCv: string;
    backToHome: string;
    allWritings: string;
  };
  identity: {
    name: string;
    firstNameLine: string;
    lastNameLine: string;
    role: string;
    subRole: string;
    tagline: string;
    portraitUrl: string;
  };
  metrics: Array<{
    value: string;
    label: string;
    icon: string;
  }>;
  marqueeItems: string[];
  sections: {
    caseStudiesCategory: string;
    caseStudiesTitle: string;
    caseStudyModalLabel: string;
    projectsCategory: string;
    projectsTitle: string;
    projectModalLabel: string;
    writingsCategory: string;
    writingsTitle: string;
    writingModalLabel: string;
    bookLabel: string;
    viewBookDetails: string;
    viewAllWritings: string;
  };
  advisory: {
    badge: string;
    availability: string;
    category: string;
    headline: string;
    statement: string;
    pillars: Array<{
      number: string;
      title: string;
      description: string;
    }>;
    ctaEyebrow: string;
    ctaTitle: string;
    primaryCta: string;
    copyEmailCta: string;
    emailCopiedCta: string;
  };
  contact: {
    badge: string;
    headline: string;
    intro: string;
    responseTimeLabel: string;
    responseTimeValue: string;
    availabilityLabel: string;
    availabilityValue: string;
    emailLabel: string;
    email: string;
    copyLabel: string;
    copiedLabel: string;
    cvButtonLabel: string;
    formTitle: string;
    formSubtitle: string;
    modalTitle: string;
    modalSubtitle: string;
    topicLabel: string;
    quickSubjects: string[];
    nameLabel: string;
    namePlaceholder: string;
    emailFieldLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    sendingButton: string;
    poweredBy: string;
    successTitle: string;
    successMessage: string;
    sendAnotherButton: string;
    closeButton: string;
  };
  footer: {
    copyright: string;
    rights: string;
    socials: Array<{
      label: string;
      url: string;
      isExternal: boolean;
    }>;
  };
  ui: {
    blogTitle: string;
    blogSubtitle: string;
    searchPlaceholder: string;
    sortLabel: string;
    sortNewest: string;
    sortOldest: string;
    sortReadTime: string;
    sortTitle: string;
    emptyBlogsTitle: string;
    emptyBlogsSubtitle: string;
    clearSearch: string;
    writtenByLabel: string;
    authorName: string;
    contactAuthor: string;
    bookSpecLabel: string;
    bookAuthorLabel: string;
    bookPublisherLabel: string;
    bookYearLabel: string;
    bookLanguageLabel: string;
    bookPagesLabel: string;
    bookIsbnLabel: string;
    bookSynopsisLabel: string;
    bookThemesLabel: string;
    bookQuotesLabel: string;
    bookChaptersLabel: string;
    bookAuthorNoteLabel: string;
    bookNotFoundTitle: string;
    bookNotFoundSubtitle: string;
    stackLabel: string;
    metricsLabel: string;
    errorTitle: string;
    errorDescription: string;
    retryButton: string;
  };
}

export const DEFAULT_SITE_LOCALES: Record<SupportedLocale, SiteLocalePayload> = {
  en: {
    locale: "en",
    meta: {
      siteName: "Abdullah Al Maksud",
      defaultTitle: "Abdullah Al Maksud — Frontend Engineer & Writer",
      description:
        "Minimal editorial portfolio of Abdullah Al Maksud covering Frontend Engineering, Design Systems, Essays, and Literary Translation.",
      keywords:
        "Abdullah Al Maksud, Frontend Engineer, Next.js, React, Design Systems, Writing, Translation",
      cvUrl: "/CV-of-Abdullah-Al-Maksud.pdf",
    },
    nav: {
      home: "Home",
      about: "About",
      work: "Work",
      blog: "Writing",
      books: "Books",
      contact: "Contact",
      downloadCv: "Resume (PDF)",
      backToHome: "Back to Home",
      allWritings: "All Writings",
    },
    identity: {
      name: "Abdullah Al Maksud",
      firstNameLine: "Abdullah Al",
      lastNameLine: "Maksud",
      role: "Frontend Engineer",
      subRole: "Analyze · Design · Develop",
      tagline:
        "Crafting fast, reliable web interfaces with React, Next.js, and TypeScript—alongside essays, design systems, and literary translation.",
      portraitUrl: "/images/portrait.png",
    },
    metrics: [
      { value: "5+", label: "Years Experience", icon: "award" },
      { value: "25+", label: "Projects Delivered", icon: "layers" },
      { value: "15+", label: "Essays & Books", icon: "book" },
      { value: "24h", label: "Response Window", icon: "globe" },
    ],
    marqueeItems: [
      "FRONTEND ARCHITECTURE",
      "DESIGN SYSTEMS",
      "NEXT.JS & REACT",
      "TYPESCRIPT",
      "LITERARY TRANSLATION",
      "EDITORIAL UI",
    ],
    sections: {
      caseStudiesCategory: "01 / Case Studies",
      caseStudiesTitle: "Selected Architecture",
      caseStudyModalLabel: "Case Study",
      projectsCategory: "02 / Engineering",
      projectsTitle: "Projects & Systems",
      projectModalLabel: "Engineering Project",
      writingsCategory: "03 / Publications",
      writingsTitle: "Essays & Books",
      writingModalLabel: "Essay & Publication",
      bookLabel: "Published Book",
      viewBookDetails: "Read Book Details",
      viewAllWritings: "View All Writings",
    },
    advisory: {
      badge: "04 / Collaboration",
      availability: "Open for Select Engagements",
      category: "Practice & Focus",
      headline: "Engineering, Design & Literary Dialogue",
      statement:
        "Collaborating on frontend architecture, design systems, open-source initiatives, and English–Bengali translation projects.",
      pillars: [
        {
          number: "01",
          title: "Frontend Architecture",
          description:
            "Deterministic data flows, resilient state management, and reliable Next.js & React applications.",
        },
        {
          number: "02",
          title: "Performance & Speed",
          description:
            "Rendering optimization, edge caching, Core Web Vitals tuning, and low-latency interactions.",
        },
        {
          number: "03",
          title: "Design Systems",
          description:
            "Minimalist editorial grids, balanced typography, and clean token-based UI component libraries.",
        },
        {
          number: "04",
          title: "Writing & Translation",
          description:
            "Thoughtful literary and technical translation between English and Bengali with linguistic precision.",
        },
      ],
      ctaEyebrow: "Direct Inquiry",
      ctaTitle: "Start a Conversation",
      primaryCta: "Get in Touch",
      copyEmailCta: "Copy Email",
      emailCopiedCta: "Email Copied",
    },
    contact: {
      badge: "Direct Inquiry",
      headline: "Initiate Dialogue",
      intro:
        "For frontend engineering, design systems, or literary and technical translation inquiries, send a message directly below.",
      responseTimeLabel: "Response Time",
      responseTimeValue: "Within 24 Hours",
      availabilityLabel: "Availability",
      availabilityValue: "Open for Select Projects",
      emailLabel: "Direct Email",
      email: "contact@abdullahalmaksud.com",
      copyLabel: "Copy",
      copiedLabel: "Copied",
      cvButtonLabel: "Download Resume (PDF)",
      formTitle: "Send a Message",
      formSubtitle: "Share your project scope, timeline, or translation brief.",
      modalTitle: "Send Inquiry",
      modalSubtitle: "Direct message for engineering, design systems, or writing collaborations.",
      topicLabel: "Select Topic",
      quickSubjects: [
        "Frontend Engineering",
        "Design Systems & UI",
        "Literary & Technical Translation",
        "Architecture Advisory",
      ],
      nameLabel: "Full Name",
      namePlaceholder: "Your name",
      emailFieldLabel: "Email Address",
      emailPlaceholder: "you@example.com",
      subjectLabel: "Subject",
      subjectPlaceholder: "Project or inquiry topic",
      messageLabel: "Message",
      messagePlaceholder: "Describe your goals, timeline, and details...",
      submitButton: "Send Message",
      sendingButton: "Sending...",
      poweredBy: "Delivered via Resend",
      successTitle: "Message Sent",
      successMessage: "Thank you for reaching out. Your message has been received.",
      sendAnotherButton: "Send Another Message",
      closeButton: "Close",
    },
    footer: {
      copyright: "© 2026 Abdullah Al Maksud",
      rights: "All rights reserved",
      socials: [
        { label: "GitHub", url: "https://github.com/abdullahalmaksud", isExternal: true },
        { label: "LinkedIn", url: "https://linkedin.com/in/abdullahalmaksud", isExternal: true },
        { label: "X / Twitter", url: "https://x.com/abdullahmaksud", isExternal: true },
        { label: "Email", url: "/contact", isExternal: false },
      ],
    },
    ui: {
      blogTitle: "Writings & Monographs",
      blogSubtitle:
        "Essays on frontend engineering, state architecture, typography, and literary translation.",
      searchPlaceholder: "Search writings...",
      sortLabel: "Sort",
      sortNewest: "Latest First",
      sortOldest: "Oldest First",
      sortReadTime: "Read Time",
      sortTitle: "Title (A–Z)",
      emptyBlogsTitle: "No Writings Found",
      emptyBlogsSubtitle: "No published essays match your current view.",
      clearSearch: "Clear Search",
      writtenByLabel: "Written by",
      authorName: "Abdullah Al Maksud",
      contactAuthor: "Contact Author",
      bookSpecLabel: "Publication Details",
      bookAuthorLabel: "Author",
      bookPublisherLabel: "Publisher",
      bookYearLabel: "Year / Edition",
      bookLanguageLabel: "Language",
      bookPagesLabel: "Pages",
      bookIsbnLabel: "ISBN",
      bookSynopsisLabel: "Synopsis",
      bookThemesLabel: "Key Themes",
      bookQuotesLabel: "Selected Excerpts",
      bookChaptersLabel: "Chapters & Structure",
      bookAuthorNoteLabel: "Author's Note",
      bookNotFoundTitle: "Book Not Found",
      bookNotFoundSubtitle: "The requested publication could not be found on the server.",
      stackLabel: "Tech Stack",
      metricsLabel: "Key Highlights",
      errorTitle: "Unable to Connect to Server",
      errorDescription:
        "Live portfolio data could not be loaded right now. Please check your connection or try again shortly.",
      retryButton: "Try Again",
    },
  },
  bn: {
    locale: "bn",
    meta: {
      siteName: "আব্দুল্লাহ আল মাকসুদ",
      defaultTitle: "আব্দুল্লাহ আল মাকসুদ — ফ্রন্টএন্ড ইঞ্জিনিয়ার ও লেখক",
      description:
        "ফ্রন্টএন্ড ইঞ্জিনিয়ারিং, ডিজাইন সিস্টেম, প্রবন্ধ এবং সাহিত্য অনুবাদ নিয়ে আব্দুল্লাহ আল মাকসুদের মিনিমাল এডিটোরিয়াল পোর্টফোলিও।",
      keywords:
        "আব্দুল্লাহ আল মাকসুদ, ফ্রন্টএন্ড ইঞ্জিনিয়ার, নেক্সটজেএস, রিঅ্যাক্ট, ডিজাইন সিস্টেম, অনুবাদ",
      cvUrl: "/CV-of-Abdullah-Al-Maksud.pdf",
    },
    nav: {
      home: "হোম",
      about: "পরিচিতি",
      work: "কাজ",
      blog: "লেখালেখি",
      books: "বই",
      contact: "যোগাযোগ",
      downloadCv: "সিভি (PDF)",
      backToHome: "হোমে ফিরুন",
      allWritings: "সকল লেখা",
    },
    identity: {
      name: "আব্দুল্লাহ আল মাকসুদ",
      firstNameLine: "আব্দুল্লাহ আল",
      lastNameLine: "মাকসুদ",
      role: "ফ্রন্টএন্ড ইঞ্জিনিয়ার",
      subRole: "বিশ্লেষণ · ডিজাইন · ডেভেলপমেন্ট",
      tagline:
        "React, Next.js ও TypeScript দিয়ে নির্ভরযোগ্য এবং দ্রুতগতির ওয়েব অ্যাপ্লিকেশন তৈরি—পাশাপাশি প্রবন্ধ, ডিজাইন সিস্টেম ও সাহিত্য অনুবাদ।",
      portraitUrl: "/images/portrait.png",
    },
    metrics: [
      { value: "৫+", label: "বছরের অভিজ্ঞতা", icon: "award" },
      { value: "২৫+", label: "সম্পন্ন প্রজেক্ট", icon: "layers" },
      { value: "১৫+", label: "প্রবন্ধ ও বই", icon: "book" },
      { value: "২৪ ঘ.", label: "রেসপন্স সময়", icon: "globe" },
    ],
    marqueeItems: [
      "ফ্রন্টএন্ড আর্কিটেকচার",
      "ডিজাইন সিস্টেম",
      "NEXT.JS ও REACT",
      "TYPESCRIPT",
      "সাহিত্য অনুবাদ",
      "এডিটোরিয়াল UI",
    ],
    sections: {
      caseStudiesCategory: "০১ / কেস স্টাডি",
      caseStudiesTitle: "নির্বাচিত আর্কিটেকচার",
      caseStudyModalLabel: "কেস স্টাডি",
      projectsCategory: "০২ / ইঞ্জিনিয়ারিং",
      projectsTitle: "প্রজেক্ট ও সিস্টেমস",
      projectModalLabel: "ইঞ্জিনিয়ারিং প্রজেক্ট",
      writingsCategory: "০৩ / প্রকাশনা ও লেখা",
      writingsTitle: "প্রবন্ধ ও বই",
      writingModalLabel: "প্রবন্ধ ও প্রকাশনা",
      bookLabel: "প্রকাশিত বই",
      viewBookDetails: "বইয়ের বিস্তারিত দেখুন",
      viewAllWritings: "সব লেখা দেখুন",
    },
    advisory: {
      badge: "০৪ / কোলাবোরেশন",
      availability: "নির্বাচিত প্রজেক্টের জন্য উন্মুক্ত",
      category: "কাজের ক্ষেত্র",
      headline: "ইঞ্জিনিয়ারিং, ডিজাইন ও সাহিত্য সংলাপ",
      statement:
        "ফ্রন্টএন্ড আর্কিটেকচার, ডিজাইন সিস্টেম, ওপেন-সোর্স উদ্যোগ এবং ইংরেজি-বাংলা অনুবাদ প্রজেক্টে যৌথভাবে কাজ করছি।",
      pillars: [
        {
          number: "০১",
          title: "ফ্রন্টএন্ড আর্কিটেকচার",
          description:
            "সুনির্দিষ্ট ডেটা ফ্লো, নির্ভরযোগ্য স্টেট ম্যানেজমেন্ট এবং স্কেলেবল Next.js ও React সিস্টেম।",
        },
        {
          number: "০২",
          title: "পারফরম্যান্স ও গতি",
          description:
            "দ্রুত রেন্ডারিং, এজ ক্যাশিং, Core Web Vitals অপ্টিমাইজেশন এবং স্মুথ ইন্টারঅ্যাকশন।",
        },
        {
          number: "০৩",
          title: "ডিজাইন সিস্টেমস",
          description:
            "মিনিমাল এডিটোরিয়াল গ্রিড, পরিচ্ছন্ন বাংলা-ইংরেজি টাইপোগ্রাফি এবং টোকেন-ভিত্তিক UI লাইব্রেরি।",
        },
        {
          number: "০৪",
          title: "লেখা ও অনুবাদ",
          description:
            "ইংরেজি ও বাংলার মাঝে সাহিত্য, দর্শন এবং প্রযুক্তি বিষয়ক সুচিন্তিত অনুবাদ ও প্রবন্ধ।",
        },
      ],
      ctaEyebrow: "সরাসরি যোগাযোগ",
      ctaTitle: "আলাপ শুরু করুন",
      primaryCta: "বার্তা পাঠান",
      copyEmailCta: "ইমেইল কপি",
      emailCopiedCta: "কপি হয়েছে",
    },
    contact: {
      badge: "সরাসরি যোগাযোগ",
      headline: "যোগাযোগ করুন",
      intro:
        "ফ্রন্টএন্ড ইঞ্জিনিয়ারিং, ডিজাইন সিস্টেম, কিংবা সাহিত্য ও কারিগরি অনুবাদ সংক্রান্ত যেকোনো কাজের জন্য নিচের ফর্মের মাধ্যমে বার্তা পাঠাতে পারেন।",
      responseTimeLabel: "উত্তরের সময়",
      responseTimeValue: "২৪ ঘণ্টার মধ্যে",
      availabilityLabel: "প্রাপ্যতা",
      availabilityValue: "নতুন কাজের জন্য উন্মুক্ত",
      emailLabel: "সরাসরি ইমেইল",
      email: "contact@abdullahalmaksud.com",
      copyLabel: "কপি",
      copiedLabel: "কপি হয়েছে",
      cvButtonLabel: "সিভি ডাউনলোড (PDF)",
      formTitle: "বার্তা পাঠান",
      formSubtitle: "আপনার প্রজেক্ট বা অনুবাদ সংক্রান্ত বিস্তারিত লিখুন।",
      modalTitle: "সরাসরি বার্তা পাঠান",
      modalSubtitle: "ইঞ্জিনিয়ারিং, ডিজাইন সিস্টেম বা অনুবাদ বিষয়ে যোগাযোগ করুন।",
      topicLabel: "বিষয় নির্বাচন করুন",
      quickSubjects: [
        "ফ্রন্টএন্ড ইঞ্জিনিয়ারিং",
        "ডিজাইন সিস্টেম ও UI",
        "সাহিত্য ও প্রযুক্তি অনুবাদ",
        "আর্কিটেকচার পরামর্শ",
      ],
      nameLabel: "আপনার নাম",
      namePlaceholder: "পূর্ণ নাম লিখুন",
      emailFieldLabel: "ইমেইল ঠিকানা",
      emailPlaceholder: "you@example.com",
      subjectLabel: "বিষয়",
      subjectPlaceholder: "প্রজেক্ট বা আলোচনার বিষয়",
      messageLabel: "বার্তা",
      messagePlaceholder: "আপনার প্রজেক্টের লক্ষ্য, সময়সীমা ও বিস্তারিত লিখুন...",
      submitButton: "বার্তা পাঠান",
      sendingButton: "পাঠানো হচ্ছে...",
      poweredBy: "Resend-এর মাধ্যমে প্রেরিত",
      successTitle: "বার্তা পাঠানো হয়েছে",
      successMessage: "যোগাযোগ করার জন্য ধন্যবাদ। আপনার বার্তাটি পৌঁছেছে।",
      sendAnotherButton: "আরেকটি বার্তা পাঠান",
      closeButton: "বন্ধ করুন",
    },
    footer: {
      copyright: "© ২০২৬ আব্দুল্লাহ আল মাকসুদ",
      rights: "সর্বস্বত্ব সংরক্ষিত",
      socials: [
        { label: "GitHub", url: "https://github.com/abdullahalmaksud", isExternal: true },
        { label: "LinkedIn", url: "https://linkedin.com/in/abdullahalmaksud", isExternal: true },
        { label: "X / Twitter", url: "https://x.com/abdullahmaksud", isExternal: true },
        { label: "Email", url: "/contact", isExternal: false },
      ],
    },
    ui: {
      blogTitle: "প্রবন্ধ ও মনোগ্রাফ",
      blogSubtitle:
        "ফ্রন্টএন্ড সিস্টেম, স্টেট আর্কিটেকচার, টাইপোগ্রাফি এবং সাহিত্য অনুবাদ নিয়ে লেখা।",
      searchPlaceholder: "লেখা খুঁজুন...",
      sortLabel: "ক্রম",
      sortNewest: "সর্বশেষ",
      sortOldest: "পুরোনো",
      sortReadTime: "পড়ার সময়",
      sortTitle: "শিরোনাম (A–Z)",
      emptyBlogsTitle: "কোনো লেখা পাওয়া যায়নি",
      emptyBlogsSubtitle: "এই মুহূর্তে কোনো প্রকাশিত লেখা নেই।",
      clearSearch: "সার্চ মুছুন",
      writtenByLabel: "লেখক",
      authorName: "আব্দুল্লাহ আল মাকসুদ",
      contactAuthor: "লেখকের সাথে যোগাযোগ",
      bookSpecLabel: "প্রকাশনা তথ্য",
      bookAuthorLabel: "লেখক",
      bookPublisherLabel: "প্রকাশনী",
      bookYearLabel: "প্রকাশকাল / সংস্করণ",
      bookLanguageLabel: "ভাষা",
      bookPagesLabel: "পৃষ্ঠা",
      bookIsbnLabel: "ISBN",
      bookSynopsisLabel: "গ্রন্থ সংক্ষেপ",
      bookThemesLabel: "মূল থিম ও বিষয়বস্তু",
      bookQuotesLabel: "বইয়ের বিশেষ পংক্তি",
      bookChaptersLabel: "অধ্যায় ও বিষয়সূচি",
      bookAuthorNoteLabel: "লেখকের কথা",
      bookNotFoundTitle: "বইটি পাওয়া যায়নি",
      bookNotFoundSubtitle: "অনুরোধকৃত বইয়ের তথ্য সার্ভারে পাওয়া যায়নি।",
      stackLabel: "প্রযুক্তি ও টুলস",
      metricsLabel: "মূল বৈশিষ্ট্য",
      errorTitle: "সার্ভারের সাথে সংযোগ করা যাচ্ছে না",
      errorDescription:
        "এই মুহূর্তে সার্ভার থেকে তথ্য লোড করা সম্ভব হচ্ছে না। দয়া করে ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।",
      retryButton: "আবার চেষ্টা করুন",
    },
  },
};

export interface DefaultAboutPayload {
  key: string;
  locale: SupportedLocale;
  header: {
    badge: string;
    name: string;
    role: string;
    headline: string;
    intro: string;
    bioSecondary: string;
    signature: string;
    experienceYears: string;
    cvUrl: string;
  };
  pillars: Array<{
    id: string;
    tag: string;
    title: string;
    subtitle: string;
    icon: string;
    description: string;
    skills: string[];
  }>;
  principles: Array<{
    number: string;
    title: string;
    description: string;
  }>;
  experience: Array<{
    period: string;
    role: string;
    company: string;
    desc: string;
  }>;
  education: Array<{
    period: string;
    degree: string;
    institution: string;
  }>;
  skillsCategories: Array<{
    category: string;
    skills: string[];
  }>;
}

export const DEFAULT_ABOUT_DATA: Record<SupportedLocale, DefaultAboutPayload> = {
  en: {
    key: "main",
    locale: "en",
    header: {
      badge: "Biography & Curriculum Vitae",
      name: "Abdullah Al Maksud",
      role: "Frontend Engineer · Writing · Translation · Design",
      headline: "Clarity, precision, and quiet craft.",
      intro:
        "I am a frontend engineer focused on building robust, high-performance web systems with React, Next.js, and TypeScript. Alongside engineering, I actively pursue literary translation, essay writing, and interface design.",
      bioSecondary:
        "Whether architecting complex frontend state, translating books between English and Bengali, or designing clean typography, I value clarity, restraint, and simplicity.",
      signature: "Maksud",
      experienceYears: "5+ Years Experience",
      cvUrl: "/CV-of-Abdullah-Al-Maksud.pdf",
    },
    pillars: [
      {
        id: "frontend",
        tag: "01 / Frontend Engineering",
        title: "Web Systems & Architecture",
        subtitle: "React · Next.js · TypeScript",
        icon: "code",
        description:
          "Developing fast, deterministic user interfaces and resilient client-side architecture using modern web toolchains.",
        skills: ["React", "Next.js", "TypeScript", "State Machines"],
      },
      {
        id: "translation",
        tag: "02 / Writing & Translation",
        title: "Literary & Technical Translation",
        subtitle: "English ↔ Bengali",
        icon: "book",
        description:
          "Translating philosophy, literature, and technical monographs between English and Bengali, preserving nuances and tone.",
        skills: ["Literary Translation", "Essays", "Editorial Writing"],
      },
      {
        id: "design",
        tag: "03 / Interface & Typography",
        title: "Editorial Design Systems",
        subtitle: "Typography · Design Tokens",
        icon: "layers",
        description:
          "Designing minimalist layouts, balanced typography, and structured design token hierarchies inspired by classic print monographs.",
        skills: ["Design Systems", "Typography", "UI Engineering"],
      },
    ],
    principles: [
      {
        number: "01",
        title: "Deterministic Code",
        description:
          "Emphasizing unidirectional data flow, predictable states, and clear boundaries across UI components.",
      },
      {
        number: "02",
        title: "Editorial Restraint",
        description:
          "Prioritizing clarity, typography, and purposeful whitespace over superficial ornament.",
      },
      {
        number: "03",
        title: "Performance & Craft",
        description:
          "Crafting smooth, responsive experiences with minimal runtime overhead and fast load times.",
      },
      {
        number: "04",
        title: "Linguistic Care",
        description:
          "Treating language and translation with rigor, honoring the rhythm and structure of every sentence.",
      },
    ],
    experience: [],
    education: [],
    skillsCategories: [],
  },
  bn: {
    key: "main_bn",
    locale: "bn",
    header: {
      badge: "জীবনবৃত্তান্ত ও পরিচিতি",
      name: "আব্দুল্লাহ আল মাকসুদ",
      role: "ফ্রন্টএন্ড ইঞ্জিনিয়ার · লেখালেখি · অনুবাদ · ডিজাইন",
      headline: "স্পষ্টতা, নিখুঁত কাঠামো এবং পরিমিত নান্দনিকতা।",
      intro:
        "আমি একজন ফ্রন্টএন্ড ইঞ্জিনিয়ার—React, Next.js ও TypeScript ব্যবহার করে দ্রুতগতির এবং নির্ভরযোগ্য ওয়েব অ্যাপ্লিকেশন তৈরি করি। ইঞ্জিনিয়ারিংয়ের পাশাপাশি সাহিত্য অনুবাদ, প্রবন্ধ রচনা ও ইন্টারফেস ডিজাইনে নিয়মিত কাজ করি।",
      bioSecondary:
        "জটিল ফ্রন্টএন্ড স্টেট আর্কিটেকচার তৈরি হোক কিংবা ইংরেজি ও বাংলার মধ্যে সাহিত্য অনুবাদ অথবা পরিচ্ছন্ন টাইপোগ্রাফি ডিজাইন—প্রতিটি কাজেই আমি স্পষ্টতা ও সরলতাকে প্রাধান্য দিই।",
      signature: "মাকসুদ",
      experienceYears: "৫+ বছরের অভিজ্ঞতা",
      cvUrl: "/CV-of-Abdullah-Al-Maksud.pdf",
    },
    pillars: [
      {
        id: "frontend",
        tag: "০১ / ফ্রন্টএন্ড ইঞ্জিনিয়ারিং",
        title: "ওয়েব সিস্টেম ও আর্কিটেকচার",
        subtitle: "React · Next.js · TypeScript",
        icon: "code",
        description:
          "আধুনিক ওয়েব টেকনোলজি ব্যবহার করে দ্রুতগতির, পূর্বানুমেয় ইউজার ইন্টারফেস এবং শক্তিশালী ক্লায়েন্ট-সাইড আর্কিটেকচার নির্মাণ।",
        skills: ["React", "Next.js", "TypeScript"],
      },
      {
        id: "translation",
        tag: "০২ / লেখা ও অনুবাদ",
        title: "সাহিত্য ও কারিগরি অনুবাদ",
        subtitle: "ইংরেজি ↔ বাংলা",
        icon: "book",
        description:
          "মূল ভাষার ভাব, সুর ও সূক্ষ্মতা অক্ষুণ্ণ রেখে ইংরেজি ও বাংলার মাঝে দর্শন, সাহিত্য ও প্রযুক্তিগত রচনা অনুবাদ।",
        skills: ["সাহিত্য অনুবাদ", "প্রবন্ধ", "সম্পাদনা"],
      },
      {
        id: "design",
        tag: "০৩ / ইন্টারফেস ও টাইপোগ্রাফি",
        title: "এডিটোরিয়াল ডিজাইন সিস্টেম",
        subtitle: "টাইপোগ্রাফি · ডিজাইন টোকেন",
        icon: "layers",
        description:
          "ক্লাসিক মুদ্রণ মনোগ্রাফ থেকে অনুপ্রাণিত হয়ে মিনিমাল লেআউট, ভারসাম্যপূর্ণ টাইপোগ্রাফি এবং সুশৃঙ্খল ডিজাইন সিস্টেম তৈরি।",
        skills: ["ডিজাইন সিস্টেম", "টাইপোগ্রাফি", "UI ইঞ্জিনিয়ারিং"],
      },
    ],
    principles: [
      {
        number: "০১",
        title: "সুনির্দিষ্ট কোড কাঠামো",
        description:
          "একমুখী ডেটা প্রবাহ, পূর্বানুমেয় স্টেট এবং UI কম্পোনেন্টের স্পষ্ট সীমানাকে গুরুত্ব দেওয়া।",
      },
      {
        number: "০২",
        title: "পরিমিত এডিটোরিয়াল রুচি",
        description:
          "অতিরিক্ত অলংকরণের চেয়ে পঠনযোগ্যতা, টাইপোগ্রাফি এবং অর্থবহ হোয়াইটস্পেসকে প্রাধান্য দেওয়া।",
      },
      {
        number: "০৩",
        title: "গতি ও পারফরম্যান্স",
        description:
          "ন্যূনতম রানটাইম ওভারহেডে দ্রুত লোডিং এবং মসৃণ ব্যবহারকারীর অভিজ্ঞতা নিশ্চিত করা।",
      },
      {
        number: "০৪",
        title: "ভাষার প্রতি যত্ন",
        description:
          "প্রতিটি বাক্যের ছন্দ ও কাঠামোকে সম্মান জানিয়ে গভীর মনোযোগের সাথে ভাষা ও অনুবাদ চর্চা।",
      },
    ],
    experience: [],
    education: [],
    skillsCategories: [],
  },
};

export const getDefaultSiteLocale = (locale: SupportedLocale): SiteLocalePayload =>
  structuredClone(DEFAULT_SITE_LOCALES[locale]);

export const getDefaultAboutData = (locale: SupportedLocale): DefaultAboutPayload =>
  structuredClone(DEFAULT_ABOUT_DATA[locale]);
