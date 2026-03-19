const primarySections = [
  "World",
  "Technology",
  "Business",
  "Finance",
  "Sports",
  "Entertainment",
  "Health",
  "Science"
];

const allSections = ["All", ...primarySections];

const sectionSlugMap = Object.fromEntries(
  primarySections.map((section) => [section.toLowerCase(), section])
);

const createSectionPath = (section) => `/section/${section.toLowerCase()}`;

const getSectionFromSlug = (slug) => sectionSlugMap[slug?.toLowerCase()] || null;

export { allSections, createSectionPath, getSectionFromSlug, primarySections };
