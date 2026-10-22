export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // টাইপ অবশ্যই lowercase হতে হবে
    "type-enum": [
      2,
      "always",
      [
        "feat", // নতুন ফিচার
        "fix", // বাগ ফিক্স
        "docs", // ডকুমেন্টেশন পরিবর্তন
        "style", // কোড ফরম্যাটিং (ফাংশনালিটি পরিবর্তন নয়)
        "refactor", // রিফ্যাক্টর (ফিচার/ফিক্স নয়)
        "perf", // পারফরম্যান্স উন্নতি
        "test", // টেস্ট যোগ/আপডেট
        "build", // বিল্ড সিস্টেম পরিবর্তন
        "ci", // CI কনফিগ পরিবর্তন
        "chore", // রুটিন কাজ
        "revert", // আগের কমিট রিভার্ট
        "wip", // কাজ চলছে (Work in Progress)
      ],
    ],
    "type-case": [2, "always", "lower-case"],
    "subject-empty": [2, "never"],
    "subject-max-length": [2, "always", 100],
    "header-max-length": [2, "always", 120],
  },
};
