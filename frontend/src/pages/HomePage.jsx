import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../api";
import ArticleCard from "../components/ArticleCard";
import ShareButton from "../components/ShareButton";
import { useToast } from "../context/ToastContext";
import usePageMeta from "../hooks/usePageMeta";
import createArticlePath from "../utils/articlePath";
import { allSections, createSectionPath } from "../utils/newsSections";
import {
  extractYouTubeVideoId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail
} from "../utils/youtube";

const curatedVideoDesk = [
  {
    title: "BBC News live coverage",
    source: "BBC News",
    youtubeUrl: "https://www.youtube.com/watch?v=gCNeDWCI0vo",
    label: "Global stream"
  },
  {
    title: "DW News global update",
    source: "DW News",
    youtubeUrl: "https://www.youtube.com/watch?v=GE_SfNVNyqk",
    label: "World briefing"
  },
  {
    title: "NBC News NOW daily briefing",
    source: "NBC News",
    youtubeUrl: "https://www.youtube.com/watch?v=Pxo9gyxtjjA",
    label: "Top video"
  }
];

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [headlines, setHeadlines] = useState([]);
  const [activeSection, setActiveSection] = useState("All");
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  usePageMeta({
    title: "SAEED DAILY",
    description:
      "SAEED DAILY is a modern social publication for stories, shareable posts, real-time news discovery, YouTube video viewing, and community feedback."
  });

  useEffect(() => {
    const loadHomepage = async () => {
      try {
        const [articleResponse, headlineResponse] = await Promise.all([
          api.get("/articles", { params: { status: "published" } }),
          api.get("/headlines")
        ]);

        setArticles(articleResponse.data);
        setHeadlines(headlineResponse.data.headlines || []);
      } catch (err) {
        const message =
          err.response?.data?.message || "Unable to load SAEED DAILY right now.";
        setError(message);
        showToast({
          title: "Loading Failed",
          message,
          type: "error",
          duration: 4200
        });
      } finally {
        setLoading(false);
      }
    };

    loadHomepage();
  }, [showToast]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSection =
        activeSection === "All" ? true : article.category === activeSection;
      const matchesSearch = searchTerm
        ? [article.title, article.excerpt, article.description, article.author?.name]
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true;

      return matchesSection && matchesSearch;
    });
  }, [activeSection, articles, searchTerm]);

  const filteredHeadlines = useMemo(() => {
    return headlines.filter((headline) => {
      const matchesSection =
        activeSection === "All" ? true : headline.section === activeSection;
      const matchesSearch = searchTerm
        ? `${headline.title} ${headline.section} ${headline.source}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true;

      return matchesSection && matchesSearch;
    });
  }, [activeSection, headlines, searchTerm]);

  const videoDesk = useMemo(() => {
    const fromArticles = articles
      .filter((article) => article.youtubeUrl && extractYouTubeVideoId(article.youtubeUrl))
      .map((article) => ({
        title: article.title,
        source: article.author?.name || "SAEED DAILY",
        youtubeUrl: article.youtubeUrl,
        label: article.category
      }));

    const seen = new Set();
    return [...fromArticles, ...curatedVideoDesk].filter((item) => {
      const videoId = extractYouTubeVideoId(item.youtubeUrl);
      if (!videoId || seen.has(videoId)) {
        return false;
      }

      seen.add(videoId);
      return true;
    });
  }, [articles]);

  useEffect(() => {
    if (!videoDesk.length) {
      setSelectedVideo(null);
      return;
    }

    setSelectedVideo((previous) => {
      if (previous && videoDesk.some((item) => item.youtubeUrl === previous.youtubeUrl)) {
        return previous;
      }

      return videoDesk[0];
    });
  }, [videoDesk]);

  const leadStory = filteredArticles[0] || articles[0];
  const editorsPicks = (filteredArticles.length > 0 ? filteredArticles : articles).slice(1, 4);
  const latestStories = (filteredArticles.length > 0 ? filteredArticles : articles).slice(1, 7);
  const featuredSections = articles
    .filter(
      (article, index, list) =>
        index === list.findIndex((item) => item.category === article.category)
    )
    .slice(0, 6);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const normalizedQuery = query.trim();
    setSearchTerm(normalizedQuery);
    showToast({
      title: normalizedQuery ? "Search Applied" : "Search Cleared",
      message: normalizedQuery
        ? `Showing stories and live headlines for "${normalizedQuery}".`
        : "You are back to the full SAEED DAILY feed.",
      type: "info"
    });
  };

  const searchSummary = searchTerm
    ? `${filteredArticles.length} posts and ${filteredHeadlines.length} live headlines matched "${searchTerm}".`
    : "Browse creator posts, real headlines, and video picks from one homepage.";

  if (loading) {
    return (
      <div className="daily-card rounded-[1.8rem] border border-[rgba(255,255,255,0.12)] p-12 text-center text-[#5c6775] shadow-[0_18px_45px_rgba(24,33,45,0.08)]">
        Loading SAEED DAILY...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[1.8rem] border border-red-200 bg-red-50 p-12 text-center text-red-700 shadow-[0_18px_45px_rgba(24,33,45,0.08)]">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#06111d] text-white shadow-[0_28px_80px_rgba(3,10,18,0.22)]">
        <div className="grid gap-0 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[radial-gradient(circle_at_top,_rgba(102,224,194,0.16),_transparent_30%),linear-gradient(165deg,#07131f_0%,#0b1d2c_45%,#12324a_100%)] px-5 py-6 sm:px-8 sm:py-9 xl:border-r xl:border-white/10">
            <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.34em] text-[#8fe8d4]">
              SAEED DAILY
            </p>
            <h1 className="headline-balance mt-4 font-display text-[2.8rem] leading-[0.92] sm:text-[4.3rem]">
              A fresh social news website for posts, videos, search, and conversation.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
              Discover creator stories, watch YouTube coverage, search live headlines, publish
              your own posts, and get instant feedback in one polished experience.
            </p>

            <form onSubmit={handleSearchSubmit} className="mt-6 space-y-4">
              <label
                htmlFor="search"
                className="block text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/58"
              >
                Search stories and real headlines
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search posts, videos, topics, or live headlines..."
                  className="w-full rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-white outline-none transition placeholder:text-white/42 focus:border-[#66e0c2] focus:bg-white/12"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-[#66e0c2] px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#041019]"
                >
                  Search
                </button>
              </div>
              <p className="text-sm leading-7 text-white/54">{searchSummary}</p>
            </form>

            <div className="mt-6 flex flex-wrap gap-2">
              {allSections.map((section) =>
                section === "All" ? (
                  <button
                    key={section}
                    type="button"
                    onClick={() => setActiveSection(section)}
                    className={`rounded-full border px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] transition ${
                      activeSection === section
                        ? "border-[#66e0c2] bg-[#66e0c2] text-[#041019]"
                        : "border-white/15 bg-white/5 text-white/76 hover:border-[#66e0c2]/40"
                    }`}
                  >
                    {section}
                  </button>
                ) : (
                  <Link
                    key={section}
                    to={createSectionPath(section)}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-white/76 transition hover:border-[#66e0c2]/40"
                  >
                    {section}
                  </Link>
                )
              )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                <p className="text-3xl font-extrabold text-white">{articles.length}</p>
                <p className="mt-2 text-[0.68rem] uppercase tracking-[0.24em] text-white/58">
                  Creator posts
                </p>
              </div>
              <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                <p className="text-3xl font-extrabold text-white">{headlines.length}</p>
                <p className="mt-2 text-[0.68rem] uppercase tracking-[0.24em] text-white/58">
                  Live headlines
                </p>
              </div>
              <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                <p className="text-3xl font-extrabold text-white">{videoDesk.length}</p>
                <p className="mt-2 text-[0.68rem] uppercase tracking-[0.24em] text-white/58">
                  Video picks
                </p>
              </div>
            </div>
          </div>

          {leadStory ? (
            <Link
              to={createArticlePath(leadStory)}
              className="group relative min-h-[24rem] overflow-hidden sm:min-h-[34rem]"
            >
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#02060a] via-[#02060a]/25 to-transparent" />
              <img
                src={leadStory.featuredImage}
                alt={leadStory.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 z-20 p-5 text-white sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.26em] text-white/78">
                  <span className="rounded-full bg-[#4c8df6] px-3 py-1 text-white">
                    {leadStory.category}
                  </span>
                  <span>Featured creator post</span>
                  <span>{new Date(leadStory.createdAt).toLocaleDateString()}</span>
                </div>
                <h2 className="headline-balance mt-4 max-w-5xl font-display text-[2.4rem] leading-tight sm:text-5xl">
                  {leadStory.title}
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-white/76 sm:text-lg sm:leading-8">
                  {leadStory.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                    Read, react, and share
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="grid min-h-[24rem] place-items-center px-8 text-center text-white/66">
              No posts are available yet.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="daily-card rounded-[1.8rem] border border-[rgba(255,255,255,0.12)] p-5 shadow-[0_18px_45px_rgba(24,33,45,0.08)] sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#4c8df6]">
                Live Discovery
              </p>
              <h2 className="mt-3 font-display text-[2rem] text-slate-950 sm:text-4xl">
                Searchable real headlines from the live web.
              </h2>
            </div>
            <p className="text-sm leading-7 text-[#5c6775]">
              External headline links update from the RSS feed and work beside your own posts.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filteredHeadlines.slice(0, 6).map((headline) => (
              <a
                key={headline.link}
                href={headline.link}
                target="_blank"
                rel="noreferrer"
                className="rounded-[1.35rem] border border-[rgba(5,18,28,0.08)] bg-white/75 p-5 transition hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(24,33,45,0.08)]"
              >
                <p className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[#4c8df6]">
                  {headline.section} | {headline.source}
                </p>
                <h3 className="mt-3 text-xl font-semibold leading-8 text-slate-950">
                  {headline.title}
                </h3>
                <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[#5c6775]">
                  Open source coverage
                </p>
              </a>
            ))}
          </div>
        </div>

        <aside className="daily-card rounded-[1.8rem] border border-[rgba(255,255,255,0.12)] p-5 shadow-[0_18px_45px_rgba(24,33,45,0.08)] sm:p-7">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#4c8df6]">
            Featured Posts
          </p>
          <h2 className="mt-3 font-display text-[2rem] text-slate-950 sm:text-4xl">
            Community-ready stories to read and share.
          </h2>

          <div className="mt-6 space-y-4">
            {editorsPicks.length > 0 ? (
              editorsPicks.map((article) => (
                <Link
                  key={article._id}
                  to={createArticlePath(article)}
                  className="block rounded-[1.35rem] border border-[rgba(5,18,28,0.08)] bg-white/80 p-5 transition hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(24,33,45,0.08)]"
                >
                  <p className="text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#4c8df6]">
                    {article.category}
                  </p>
                  <h3 className="mt-3 font-display text-[1.7rem] leading-snug text-slate-950">
                    {article.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#52606d]">{article.excerpt}</p>
                </Link>
              ))
            ) : (
              <div className="rounded-[1.35rem] border border-dashed border-[rgba(5,18,28,0.12)] p-6 text-center text-[#5c6775]">
                New creator posts will appear here as people publish.
              </div>
            )}
          </div>
        </aside>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#06111d] text-white shadow-[0_28px_70px_rgba(3,10,18,0.2)]">
        <div className="grid gap-0 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="border-b border-white/10 p-5 sm:p-7 xl:border-b-0 xl:border-r">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#8fe8d4]">
                  Video Lounge
                </p>
                <h2 className="mt-3 font-display text-[2rem] text-white sm:text-4xl">
                  Watch one video at a time and switch instantly.
                </h2>
              </div>
              <p className="text-sm leading-7 text-white/58">
                Click another card and the player swaps to the new video immediately.
              </p>
            </div>

            {selectedVideo ? (
              <>
                <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black">
                  <div className="aspect-video">
                    <iframe
                      key={selectedVideo.youtubeUrl}
                      className="h-full w-full"
                      src={getYouTubeEmbedUrl(selectedVideo.youtubeUrl)}
                      title={selectedVideo.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-white/58">
                  <span className="rounded-full bg-[#4c8df6] px-3 py-1 text-white">
                    {selectedVideo.label}
                  </span>
                  <span>{selectedVideo.source}</span>
                </div>
                <h3 className="mt-4 font-display text-3xl text-white">{selectedVideo.title}</h3>
              </>
            ) : null}
          </div>

          <div className="p-5 sm:p-7">
            <div className="grid gap-4">
              {videoDesk.slice(0, 5).map((item) => {
                const isActive = selectedVideo?.youtubeUrl === item.youtubeUrl;

                return (
                  <button
                    key={item.youtubeUrl}
                    type="button"
                    onClick={() => setSelectedVideo(item)}
                    className={`flex items-center gap-4 rounded-[1.4rem] border p-4 text-left transition ${
                      isActive
                        ? "border-[#66e0c2] bg-white/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <img
                      src={getYouTubeThumbnail(item.youtubeUrl)}
                      alt={item.title}
                      className="h-20 w-32 rounded-[1rem] object-cover"
                    />
                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#8fe8d4]">
                        {item.label}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold leading-7 text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/52">
                        {item.source}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="daily-card rounded-[1.8rem] border border-[rgba(255,255,255,0.12)] p-5 shadow-[0_18px_45px_rgba(24,33,45,0.08)] sm:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#4c8df6]">
              Section Picks
            </p>
            <h2 className="mt-3 font-display text-[2rem] text-slate-950 sm:text-4xl">
              Jump into the parts of the platform people use most.
            </h2>
          </div>
          <p className="text-sm leading-7 text-[#5c6775]">
            Every section is built for clean browsing on desktop and mobile.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredSections.map((article) => (
            <Link
              key={article._id}
              to={createArticlePath(article)}
              className="group overflow-hidden rounded-[1.35rem] border border-[rgba(5,18,28,0.08)] bg-white/82 transition hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(24,33,45,0.08)]"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041019] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 rounded-full bg-[#66e0c2] px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#041019]">
                  {article.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display text-[1.7rem] leading-snug text-slate-950">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#52606d]">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#4c8df6]">
            Latest Stories
          </p>
          <h2 className="mt-3 font-display text-[2rem] text-slate-950 sm:text-4xl">
            {activeSection === "All" ? "New on SAEED DAILY" : `${activeSection} updates`}
          </h2>
          <p className="mt-2 text-base text-[#52606d] sm:text-lg">
            A feed of stories, blogs, explainers, and posts designed for reading, sharing, and discussion.
          </p>
        </div>

        <div className="space-y-5">
          {(latestStories.length > 0 ? latestStories : filteredArticles).map((article) => (
            <div key={article._id} className="space-y-3">
              <ArticleCard article={article} />
              <div className="flex justify-end">
                <ShareButton
                  title={article.title}
                  path={createArticlePath(article)}
                  className="rounded-full border border-[rgba(5,18,28,0.1)] px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-[#041019] transition hover:border-[#4c8df6] hover:text-[#4c8df6]"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
