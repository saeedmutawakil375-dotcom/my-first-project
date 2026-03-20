import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import api from "../api";
import ArticleCard from "../components/ArticleCard";
import { useToast } from "../context/ToastContext";
import usePageMeta from "../hooks/usePageMeta";
import createArticlePath from "../utils/articlePath";
import { createSectionPath } from "../utils/newsSections";

const sections = [
  "All",
  "World",
  "Business",
  "Technology",
  "Finance",
  "Health",
  "Science",
  "Sports",
  "Entertainment"
];

const featuredDesks = ["World", "Business", "Technology", "Finance", "Health", "Science"];

const estimateReadMinutes = (text = "") => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 180));
};

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [activeSection, setActiveSection] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchStatus, setSearchStatus] = useState("Showing the full publication");
  const { showToast, dismissToast } = useToast();
  const searchToastId = useRef(null);

  usePageMeta({
    title: "Ghana News, Features, and Analysis",
    description:
      "Atlas Wire brings together Ghana-focused reporting, features, and commentary across world affairs, business, technology, finance, health, science, sport, and culture."
  });

  useEffect(() => {
    const fetchArticles = async () => {
      if (searchTerm.trim()) {
        setSearchStatus(`Searching stories for "${searchTerm}"`);
        searchToastId.current = showToast({
          title: "Searching Stories",
          message: `Scanning the publication for "${searchTerm}".`,
          type: "loading",
          duration: 1800
        });
      } else {
        setSearchStatus("Showing the full publication");
      }

      try {
        const response = await api.get("/articles", {
          params: {
            status: "published",
            search: searchTerm || undefined
          }
        });
        setArticles(response.data);

        if (searchTerm.trim()) {
          showToast({
            title: "Search Updated",
            message: `Found ${response.data.length} article${response.data.length === 1 ? "" : "s"} matching your search.`,
            type: "info"
          });
        }
      } catch (err) {
        const message = err.response?.data?.message || "Unable to load the publication right now.";
        setError(message);
        showToast({
          title: "Loading Failed",
          message,
          type: "error",
          duration: 4200
        });
      } finally {
        if (searchToastId.current) {
          dismissToast(searchToastId.current);
          searchToastId.current = null;
        }
        setLoading(false);
      }
    };

    setLoading(true);
    fetchArticles();
  }, [dismissToast, searchTerm, showToast]);

  const visibleArticles = useMemo(
    () =>
      activeSection === "All"
        ? articles
        : articles.filter((article) => article.category === activeSection),
    [activeSection, articles]
  );

  const leadStory = visibleArticles[0];
  const editorsPicks = visibleArticles.slice(1, 4);
  const latestStories = visibleArticles.slice(1, 7);
  const deskHighlights = featuredDesks
    .map((section) => articles.find((article) => article.category === section))
    .filter(Boolean);

  if (loading) {
    return (
      <div className="paper-panel rounded-[1.6rem] border border-[#d9cfba] p-12 text-center text-[#6f6758] shadow-[0_18px_45px_rgba(24,33,45,0.08)]">
        Loading the publication...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[1.6rem] border border-red-200 bg-red-50 p-12 text-center text-red-700 shadow-[0_18px_45px_rgba(24,33,45,0.08)]">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="paper-panel overflow-hidden rounded-[1.6rem] border border-[#d9cfba] shadow-[0_22px_60px_rgba(24,33,45,0.08)] sm:rounded-[2rem]">
        <div className="grid gap-0 xl:grid-cols-[0.88fr_1.12fr]">
          <div className="border-b border-[#d9cfba] bg-[#1f2a36] px-5 py-6 text-white sm:px-8 sm:py-8 xl:border-b-0 xl:border-r">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-[#d8bf8b]">
              Atlas Wire Journal
            </p>
            <h1 className="headline-balance mt-4 font-display text-[2.7rem] leading-[0.95] sm:text-[3.7rem]">
              A professional Ghana-focused home for features, posts, essays, and reporting.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
              Read grounded stories from Ghana across business, technology, finance, health,
              science, sport, and world affairs with a cleaner magazine-style front page.
            </p>

            <div className="mt-6">
              <label
                htmlFor="search"
                className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/60"
              >
                Search the publication
              </label>
              <input
                id="search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search stories, essays, and commentary..."
                className="w-full rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-white outline-none transition placeholder:text-white/42 focus:border-[#d8bf8b] focus:bg-white/12"
              />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/48">
                {loading ? "Refreshing publication..." : searchStatus}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {sections.map((section) =>
                section === "All" ? (
                  <button
                    key={section}
                    type="button"
                    onClick={() => setActiveSection(section)}
                    className={`rounded-full border px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] transition ${
                      activeSection === section
                        ? "border-[#d8bf8b] bg-[#d8bf8b] text-[#18212d]"
                        : "border-white/15 bg-white/5 text-white/76 hover:border-white/30"
                    }`}
                  >
                    {section}
                  </button>
                ) : (
                  <Link
                    key={section}
                    to={createSectionPath(section)}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-white/76 transition hover:border-white/30"
                  >
                    {section}
                  </Link>
                )
              )}
            </div>
          </div>

          {leadStory ? (
            <Link to={createArticlePath(leadStory)} className="group relative min-h-[24rem] overflow-hidden sm:min-h-[32rem]">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#18212d] via-[#18212d]/26 to-transparent" />
              <img
                src={leadStory.featuredImage}
                alt={leadStory.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 z-20 p-5 text-white sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.26em] text-white/78">
                  <span className="rounded-full bg-[#a12c2f] px-3 py-1 text-white">
                    {leadStory.category}
                  </span>
                  <span>{estimateReadMinutes(leadStory.description)} min read</span>
                  <span>{new Date(leadStory.createdAt).toLocaleDateString()}</span>
                </div>
                <h2 className="headline-balance mt-4 max-w-5xl font-display text-[2.4rem] leading-tight sm:text-5xl">
                  {leadStory.title}
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-white/76 sm:text-lg sm:leading-8">
                  {leadStory.excerpt}
                </p>
              </div>
            </Link>
          ) : (
            <div className="grid min-h-[24rem] place-items-center px-8 text-center text-[#6f6758]">
              No articles are available for this view yet.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="paper-panel rounded-[1.6rem] border border-[#d9cfba] p-5 shadow-[0_18px_45px_rgba(24,33,45,0.08)] sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#a12c2f]">
                Editors&apos; Picks
              </p>
              <h2 className="mt-3 font-display text-[2rem] text-slate-950 sm:text-4xl">
                Reads that set the tone for the day.
              </h2>
            </div>
            <p className="text-sm leading-7 text-[#6f6758]">
              Hand-picked features, analysis, and posts from the current cycle.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {editorsPicks.length > 0 ? (
              editorsPicks.map((article) => (
                <Link
                  key={article._id}
                  to={createArticlePath(article)}
                  className="overflow-hidden rounded-[1.35rem] border border-[#d9cfba] bg-[#f7efe0] transition hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(24,33,45,0.08)]"
                >
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="h-44 w-full object-cover"
                  />
                  <div className="p-4">
                    <p className="text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#a12c2f]">
                      {article.category}
                    </p>
                    <h3 className="mt-3 font-display text-[1.7rem] leading-snug text-slate-950">
                      {article.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#544f45]">{article.excerpt}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="md:col-span-3 rounded-[1.35rem] border border-dashed border-[#d9cfba] p-5 text-[#6f6758]">
                More editor picks will appear as stories are added.
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[1.6rem] border border-[#d9cfba] bg-[#18212d] p-5 text-white shadow-[0_18px_45px_rgba(24,33,45,0.16)] sm:p-6">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#d8bf8b]">
              Reader Interaction
            </p>
            <h3 className="mt-4 font-display text-[2rem] leading-snug text-white">
              The site works best when stories invite follow-up, comment, and response.
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/72 sm:text-base">
              Sign in to post your own article, leave informed commentary, recommend useful
              replies, and shape the conversation across the desks.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/newsroom"
                className="rounded-full bg-[#d8bf8b] px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#18212d]"
              >
                Open Newsroom
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white/84"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="paper-panel rounded-[1.6rem] border border-[#d9cfba] p-5 shadow-[0_18px_45px_rgba(24,33,45,0.08)] sm:p-6">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#a12c2f]">
              Publication Notes
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[#544f45]">
              <li>Search updates now show pop-up feedback while results load.</li>
              <li>Story pages support hero images, rich article bodies, and YouTube embeds.</li>
              <li>Every desk can carry long-form posts, quick reports, or blog-style commentary.</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="paper-panel rounded-[1.6rem] border border-[#d9cfba] p-5 shadow-[0_18px_45px_rgba(24,33,45,0.08)] sm:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#a12c2f]">
              Desk Highlights
            </p>
            <h2 className="mt-3 font-display text-[2rem] text-slate-950 sm:text-4xl">
              A stronger publication starts with sharper desk coverage.
            </h2>
          </div>
          <p className="text-sm leading-7 text-[#6f6758]">
            Featured articles from the publication&apos;s core reporting areas.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {deskHighlights.map((article) => (
            <Link
              key={article._id}
              to={createArticlePath(article)}
              className="group overflow-hidden rounded-[1.35rem] border border-[#d9cfba] bg-white transition hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(24,33,45,0.08)]"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18212d] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 rounded-full bg-[#a12c2f] px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-white">
                  {article.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display text-[1.7rem] leading-snug text-slate-950">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#544f45]">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#a12c2f]">
            Latest Articles
          </p>
          <h2 className="mt-3 font-display text-[2rem] text-slate-950 sm:text-4xl">
            {activeSection === "All" ? "New from the publication" : `${activeSection} desk posts`}
          </h2>
          <p className="mt-2 text-base text-[#544f45] sm:text-lg">
            Long-form reporting, opinion-led essays, and grounded analysis from across the site.
          </p>
        </div>

        <div className="space-y-5">
          {(latestStories.length > 0 ? latestStories : visibleArticles).map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
