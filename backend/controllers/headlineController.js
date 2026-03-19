const FEED_SOURCES = [
  {
    source: "BBC News",
    section: "World",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml"
  },
  {
    source: "BBC News",
    section: "Business",
    url: "https://feeds.bbci.co.uk/news/business/rss.xml"
  },
  {
    source: "BBC News",
    section: "Technology",
    url: "https://feeds.bbci.co.uk/news/technology/rss.xml"
  },
  {
    source: "BBC News",
    section: "Entertainment",
    url: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml"
  },
  {
    source: "BBC News",
    section: "Science",
    url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml"
  }
];

const CACHE_TTL_MS = 1000 * 60 * 10;
let cachedHeadlines = [];
let cacheExpiry = 0;

const decodeEntities = (value = "") =>
  value
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");

const stripTags = (value = "") => value.replace(/<[^>]+>/g, "").trim();

const getTagValue = (content, tagName) => {
  const match = content.match(new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? stripTags(decodeEntities(match[1])) : "";
};

const parseFeedItems = (xml = "", sourceMeta) => {
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/gi) || [];

  return itemMatches
    .map((item) => {
      const title = getTagValue(item, "title");
      const link = getTagValue(item, "link");
      const publishedAt = getTagValue(item, "pubDate");

      if (!title || !link) {
        return null;
      }

      return {
        title,
        link,
        source: sourceMeta.source,
        section: sourceMeta.section,
        publishedAt: publishedAt || null
      };
    })
    .filter(Boolean);
};

const fetchFeed = async (feedSource) => {
  const response = await fetch(feedSource.url, {
    headers: {
      "User-Agent": "Atlas Wire Newsroom"
    }
  });

  if (!response.ok) {
    throw new Error(`Feed request failed for ${feedSource.section}`);
  }

  const xml = await response.text();
  return parseFeedItems(xml, feedSource);
};

const refreshHeadlines = async () => {
  const results = await Promise.allSettled(FEED_SOURCES.map((feedSource) => fetchFeed(feedSource)));

  const headlines = results
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value)
    .filter(
      (headline, index, items) =>
        items.findIndex((item) => item.title === headline.title && item.link === headline.link) ===
        index
    )
    .sort((left, right) => {
      const leftTime = left.publishedAt ? new Date(left.publishedAt).getTime() : 0;
      const rightTime = right.publishedAt ? new Date(right.publishedAt).getTime() : 0;
      return rightTime - leftTime;
    })
    .slice(0, 18);

  if (headlines.length > 0) {
    cachedHeadlines = headlines;
    cacheExpiry = Date.now() + CACHE_TTL_MS;
  }

  return cachedHeadlines;
};

const getBreakingHeadlines = async (_req, res) => {
  try {
    const headlines =
      Date.now() < cacheExpiry && cachedHeadlines.length > 0
        ? cachedHeadlines
        : await refreshHeadlines();

    return res.status(200).json({
      headlines,
      attribution: {
        source: "BBC News RSS",
        note: "Headlines are sourced from official BBC News RSS feeds and link directly to the original reports."
      },
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    if (cachedHeadlines.length > 0) {
      return res.status(200).json({
        headlines: cachedHeadlines,
        attribution: {
          source: "BBC News RSS",
          note: "Showing the most recent cached wire headlines while the live refresh is unavailable."
        },
        updatedAt: new Date(cacheExpiry - CACHE_TTL_MS).toISOString()
      });
    }

    return res.status(502).json({ message: "Unable to load live wire headlines right now." });
  }
};

export { getBreakingHeadlines };
