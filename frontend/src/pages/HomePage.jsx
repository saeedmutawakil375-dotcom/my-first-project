import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../api";
import ArticleCard from "../components/ArticleCard";
import usePageMeta from "../hooks/usePageMeta";
import createArticlePath from "../utils/articlePath";
import { createSectionPath } from "../utils/newsSections";

const sections = [
  "All",
  "World",
  "Technology",
  "Business",
  "Finance",
  "Sports",
  "Entertainment",
  "Health",
  "Science"
];

const spotlightSections = ["World", "Finance", "Sports", "Entertainment"];
const videoDeskItems = [
  {
    title: "NBC News NOW | March 6",
    source: "NBC News",
    label: "Live desk replay",
    videoId: "enKWyZH6dVI",
    sourceUrl: "https://www.youtube.com/live/enKWyZH6dVI"
  },
  {
    title: "NBC News NOW | March 5",
    source: "NBC News",
    label: "Breaking rundown",
    videoId: "Pxo9gyxtjjA",
    sourceUrl: "https://www.youtube.com/watch?v=Pxo9gyxtjjA"
  },
  {
    title: "NBC News NOW | March 4",
    source: "NBC News",
    label: "Global briefing",
    videoId: "eEqHfqza428",
    sourceUrl: "https://www.youtube.com/watch?v=eEqHfqza428"
  },
  {
    title: "NBC News NOW | March 2",
    source: "NBC News",
    label: "World update",
    videoId: "RrR3Bn60J7I",
    sourceUrl: "https://www.youtube.com/live/RrR3Bn60J7I"
  }
];

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [wireHeadlines, setWireHeadlines] = useState([]);
  const [wireMeta, setWireMeta] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(videoDeskItems[0]);
  const [activeSection, setActiveSection] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  usePageMeta({
    title: "Global News and Trending Stories",
    description:
      "Atlas Wire brings together world news, finance, sports, entertainment, health, science, and live trending coverage from one professional front page."
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get("/articles", {
          params: {
            status: "published",
            search: searchTerm || undefined
          }
        });
        setArticles(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load global coverage right now.");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchArticles();
  }, [searchTerm]);

  useEffect(() => {
    const fetchWireHeadlines = async () => {
      try {
        const response = await api.get("/headlines");
        setWireHeadlines(response.data.headlines || []);
        setWireMeta(response.data);
      } catch (_error) {
        setWireHeadlines([]);
      }
    };

    fetchWireHeadlines();
  }, []);

  const visibleArticles = useMemo(
    () =>
      activeSection === "All"
        ? articles
        : articles.filter((article) => article.category === activeSection),
    [activeSection, articles]
  );

  const leadStory = visibleArticles[0];
  const topStories = visibleArticles.slice(1, 4);
  const latestStories = visibleArticles.slice(1, 7);
  const trendingStories = wireHeadlines.length > 0 ? wireHeadlines.slice(0, 8) : articles.slice(0, 5);
  const wireCards = wireHeadlines.slice(0, 4);

  const spotlightStories = spotlightSections
    .map((section) => articles.find((article) => article.category === section))
    .filter(Boolean);

  return (
    <div className="space-y-8 lg:space-y-10">
      <section className="animate-fade-in overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="bg-[#07111f] px-6 py-8 text-white sm:px-8 sm:py-10">
            <div className="flex flex-wrap items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.34em] text-white/70">
              <span className="rounded-full bg-[#b80018] px-3 py-1 text-white">Live</span>
              <span>Global agenda</span>
              <span>24 hour watch</span>
            </div>
            <h1 className="mt-6 max-w-4xl font-display text-4xl leading-tight sm:text-5xl xl:text-6xl">
              Global news, live trends, and cross-sector coverage built for a modern world desk.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/74 sm:text-xl">
              Follow the stories shaping business, finance, sport, entertainment, science,
              health, and global affairs from one professional front page.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-4xl font-bold text-white">{articles.length}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.24em] text-white/62">
                  Published reports
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-4xl font-bold text-white">{sections.length - 1}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.24em] text-white/62">
                  Coverage desks
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-4xl font-bold text-white">Now</p>
                <p className="mt-2 text-sm uppercase tracking-[0.24em] text-white/62">
                  Rolling updates
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0d3b66] via-[#0d223d] to-[#07111f] px-6 py-8 text-white sm:px-8">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.34em] text-[#d8aa48]">
              Breaking Line
            </p>
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
              <div className="ticker-track text-sm font-semibold uppercase tracking-[0.22em] text-white/82">
                {[...trendingStories, ...trendingStories].map((story, index) => (
                  <span key={`${story.link || story._id}-${index}`}>{story.title}</span>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {trendingStories.slice(0, 3).map((story, index) =>
                story.link ? (
                  <a
                    key={story.link}
                    href={story.link}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                  >
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.32em] text-[#d8aa48]">
                      {story.section || "Wire"} | {story.source}
                    </p>
                    <h2 className="mt-3 font-display text-2xl leading-snug text-white">
                      {story.title}
                    </h2>
                    <p className="mt-3 text-base leading-7 text-white/72">Open original report</p>
                  </a>
                ) : (
                  <Link
                    key={story._id}
                    to={createArticlePath(story)}
                    className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                  >
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.32em] text-[#d8aa48]">
                      Trend {index + 1}
                    </p>
                    <h2 className="mt-3 font-display text-2xl leading-snug text-white">
                      {story.title}
                    </h2>
                    <p className="mt-3 text-base leading-7 text-white/72">{story.excerpt}</p>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="animate-fade-up rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.34em] text-[#b80018]">
              News Navigation
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-950 sm:text-4xl">
              Track the biggest stories by desk or search the archive.
            </h2>
          </div>

          <div className="w-full max-w-xl">
            <label
              htmlFor="search"
              className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-slate-500"
            >
              Search headlines
            </label>
            <input
              id="search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search world affairs, markets, sport, and culture..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-[#b80018] focus:bg-white"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {sections.map((section, index) =>
            section === "All" ? (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={`animate-fade-up rounded-full border px-4 py-2 text-sm font-bold uppercase tracking-[0.22em] transition ${
                  activeSection === section
                    ? "border-[#b80018] bg-[#b80018] text-white shadow-[0_12px_24px_rgba(184,0,24,0.18)]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-[#b80018] hover:text-[#b80018]"
                }`}
                style={{ animationDelay: `${0.03 * index}s` }}
              >
                {section}
              </button>
            ) : (
              <Link
                key={section}
                to={createSectionPath(section)}
                className={`animate-fade-up rounded-full border px-4 py-2 text-sm font-bold uppercase tracking-[0.22em] transition ${
                  activeSection === section
                    ? "border-[#b80018] bg-[#b80018] text-white shadow-[0_12px_24px_rgba(184,0,24,0.18)]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-[#b80018] hover:text-[#b80018]"
                }`}
                style={{ animationDelay: `${0.03 * index}s` }}
              >
                {section}
              </Link>
            )
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="animate-fade-up rounded-[2rem] border border-slate-200 bg-[#07111f] p-6 text-white shadow-[0_20px_55px_rgba(15,23,42,0.18)] sm:p-8">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.34em] text-[#d8aa48]">
            Wire Monitor
          </p>
          <h2 className="headline-balance mt-3 font-display text-3xl leading-tight sm:text-4xl">
            Live breaking headlines from official newswire feeds.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/72">
            The breaking line now pulls directly from live RSS sources instead of placeholder
            content, giving the front page a more current newsroom feel.
          </p>
          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-white/56">
              Source attribution
            </p>
            <p className="mt-3 text-lg leading-8 text-white">
              {wireMeta?.attribution?.source || "Live wire service"}
            </p>
            <p className="mt-3 text-sm leading-7 text-white/68">
              {wireMeta?.attribution?.note ||
                "Showing the latest available headlines from trusted external sources."}
            </p>
            {wireMeta?.updatedAt ? (
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-white/44">
                Updated {new Date(wireMeta.updatedAt).toLocaleString()}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-5">
          {wireCards.length > 0 ? (
            wireCards.map((headline, index) => (
              <a
                key={headline.link}
                href={headline.link}
                target="_blank"
                rel="noreferrer"
                className="animate-slide-in block rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(15,23,42,0.1)]"
                style={{ animationDelay: `${0.08 * (index + 1)}s` }}
              >
                <div className="flex flex-wrap items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    {headline.section}
                  </span>
                  <span>{headline.source}</span>
                </div>
                <h3 className="mt-4 font-display text-2xl leading-snug text-slate-950">
                  {headline.title}
                </h3>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#b80018]">
                  Open original coverage
                </p>
              </a>
            ))
          ) : (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-slate-600 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              Live wire headlines are temporarily unavailable.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="animate-fade-up overflow-hidden rounded-[2rem] border border-slate-200 bg-[#07111f] text-white shadow-[0_20px_55px_rgba(15,23,42,0.18)]">
          <div className="border-b border-white/10 px-6 py-5 sm:px-8">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.34em] text-[#d8aa48]">
              Video Desk
            </p>
            <h2 className="headline-balance mt-3 font-display text-3xl leading-tight sm:text-4xl">
              Click a briefing and the player swaps instantly to that report.
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-white/72">
              Atlas Wire now uses a single embedded YouTube player, so when you choose another
              clip the current one stops and the newly selected one takes over.
            </p>
          </div>

          <div className="aspect-video bg-black">
            <iframe
              key={selectedVideo.videoId}
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={selectedVideo.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <div className="border-t border-white/10 bg-white/[0.04] px-6 py-5 sm:px-8">
            <div className="flex flex-wrap items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-white/62">
              <span className="rounded-full bg-[#b80018] px-3 py-1 text-white">
                {selectedVideo.label}
              </span>
              <span>{selectedVideo.source}</span>
            </div>
            <h3 className="mt-4 font-display text-2xl text-white">{selectedVideo.title}</h3>
            <a
              href={selectedVideo.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[#d8aa48]"
            >
              Open on YouTube
              <span aria-hidden="true">View</span>
            </a>
          </div>
        </div>

        <div className="space-y-4">
          {videoDeskItems.map((item, index) => {
            const isActive = item.videoId === selectedVideo.videoId;

            return (
              <button
                key={item.videoId}
                type="button"
                onClick={() => setSelectedVideo(item)}
                className={`animate-slide-in flex w-full items-center gap-4 rounded-[1.5rem] border p-4 text-left shadow-[0_16px_35px_rgba(15,23,42,0.06)] transition ${
                  isActive
                    ? "border-[#b80018] bg-[#fff5f6] shadow-[0_18px_40px_rgba(184,0,24,0.12)]"
                    : "border-slate-200 bg-white hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                }`}
                style={{ animationDelay: `${0.06 * (index + 1)}s` }}
              >
                <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-[1rem] bg-slate-200">
                  <img
                    src={`https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.24em] text-slate-950">
                    Play
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.28em] text-[#b80018]">
                    {item.label}
                  </p>
                  <h3 className="mt-2 font-display text-2xl leading-snug text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {item.source}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {loading ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          Loading the world desk...
        </div>
      ) : error ? (
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-12 text-center text-red-700 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          {error}
        </div>
      ) : visibleArticles.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          No coverage matched that search or section yet.
        </div>
      ) : (
        <>
          {leadStory && (
            <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <article className="animate-fade-up overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                <div className="relative min-h-[28rem] overflow-hidden">
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#07111f] via-[#07111f]/20 to-transparent" />
                  <img
                    src={leadStory.featuredImage}
                    alt={leadStory.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.32em] text-white/82">
                      <span className="rounded-full bg-[#b80018] px-3 py-1 text-white">
                        Top Story
                      </span>
                      <span>{leadStory.category}</span>
                      <span>{new Date(leadStory.createdAt).toLocaleString()}</span>
                    </div>
                    <h2 className="mt-4 max-w-4xl font-display text-4xl leading-tight text-white sm:text-5xl">
                      {leadStory.title}
                    </h2>
                    <p className="mt-5 max-w-3xl text-lg leading-8 text-white/78">
                      {leadStory.excerpt}
                    </p>
                    <Link
                      to={createArticlePath(leadStory)}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-[#07111f]"
                    >
                      Open full report
                      <span aria-hidden="true">View</span>
                    </Link>
                  </div>
                </div>
              </article>

              <aside className="space-y-5">
                <div className="animate-slide-in rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.34em] text-[#b80018]">
                    Editorial Briefing
                  </p>
                  <h3 className="mt-4 font-display text-3xl leading-snug text-slate-950">
                    The day's most important stories across every major sector.
                  </h3>
                  <p className="mt-4 text-base leading-7 text-slate-600">
                    From geopolitical shifts to market pressure, live sport, entertainment
                    culture, and health science, the front page is built to feel immediate.
                  </p>
                </div>

                {topStories.map((story, index) => (
                  <Link
                    key={story._id}
                    to={createArticlePath(story)}
                    className="animate-slide-in block rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_35px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(15,23,42,0.1)]"
                    style={{ animationDelay: `${0.08 * (index + 1)}s` }}
                  >
                    <div className="flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-slate-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                        {story.category}
                      </span>
                      <span>Update</span>
                    </div>
                    <h3 className="mt-4 font-display text-2xl leading-snug text-slate-950">
                      {story.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-slate-600">{story.excerpt}</p>
                  </Link>
                ))}
              </aside>
            </section>
          )}

          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <div className="animate-fade-up rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.34em] text-[#b80018]">
                  Section Spotlight
                </p>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {spotlightStories.map((article, index) => (
                    <Link
                      key={article._id}
                      to={createArticlePath(article)}
                      className="animate-fade-up overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 transition hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(15,23,42,0.08)]"
                      style={{ animationDelay: `${0.08 * (index + 1)}s` }}
                    >
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="h-44 w-full object-cover"
                      />
                      <div className="p-5">
                        <p className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-[#b80018]">
                          {article.category}
                        </p>
                        <h3 className="mt-3 font-display text-2xl leading-snug text-slate-950">
                          {article.title}
                        </h3>
                        <p className="mt-3 text-base leading-7 text-slate-600">
                          {article.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-5">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.34em] text-[#b80018]">
                    Main Feed
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-slate-950 sm:text-4xl">
                    {activeSection === "All"
                      ? "Today's front page"
                      : `${activeSection} coverage`}
                  </h2>
                  <p className="mt-2 text-lg text-slate-600">
                    In-depth coverage, live reporting, and analysis from the current cycle.
                  </p>
                </div>

                <div className="space-y-5">
                  {(latestStories.length > 0 ? latestStories : visibleArticles).map((article) => (
                    <ArticleCard key={article._id} article={article} />
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="animate-slide-in rounded-[2rem] border border-slate-200 bg-[#07111f] p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.34em] text-[#d8aa48]">
                  Trending Now
                </p>
                <div className="mt-5 space-y-4">
                  {trendingStories.map((article, index) => (
                    article.link ? (
                      <a
                        key={article.link}
                        href={article.link}
                        target="_blank"
                        rel="noreferrer"
                        className="block border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
                      >
                        <p className="text-[0.7rem] font-bold uppercase tracking-[0.28em] text-white/56">
                          {String(index + 1).padStart(2, "0")} | {article.section}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold leading-8 text-white">
                          {article.title}
                        </h3>
                      </a>
                    ) : (
                      <Link
                        key={article._id}
                        to={createArticlePath(article)}
                        className="block border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
                      >
                        <p className="text-[0.7rem] font-bold uppercase tracking-[0.28em] text-white/56">
                          {String(index + 1).padStart(2, "0")} | {article.category}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold leading-8 text-white">
                          {article.title}
                        </h3>
                      </Link>
                    )
                  ))}
                </div>
              </div>

              <div className="animate-slide-in delay-1 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.34em] text-[#b80018]">
                  Coverage Mix
                </p>
                <div className="mt-5 space-y-4">
                  {sections
                    .filter((section) => section !== "All")
                    .slice(0, 6)
                    .map((section) => {
                      const count = articles.filter((article) => article.category === section).length;
                      return (
                        <div
                          key={section}
                          className="flex items-center justify-between border-b border-slate-200 pb-4 last:border-b-0 last:pb-0"
                        >
                          <span className="text-sm font-bold uppercase tracking-[0.24em] text-slate-600">
                            {section}
                          </span>
                          <span className="text-2xl font-bold text-slate-950">{count}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </aside>
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;
