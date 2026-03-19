import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import ArticleCard from "../components/ArticleCard";
import usePageMeta from "../hooks/usePageMeta";
import createArticlePath from "../utils/articlePath";
import { getSectionFromSlug } from "../utils/newsSections";

const SectionPage = () => {
  const { sectionSlug } = useParams();
  const section = getSectionFromSlug(sectionSlug);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  usePageMeta({
    title: section ? `${section} News` : "Section",
    description: section
      ? `Read the latest ${section.toLowerCase()} coverage, analysis, and breaking updates on Atlas Wire.`
      : "Explore the latest desk coverage on Atlas Wire."
  });

  useEffect(() => {
    const fetchSectionArticles = async () => {
      if (!section) {
        setLoading(false);
        setError("Section not found.");
        return;
      }

      try {
        const response = await api.get("/articles", {
          params: {
            status: "published",
            category: section
          }
        });
        setArticles(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load this section right now.");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchSectionArticles();
  }, [section]);

  const leadStory = articles[0];
  const moreStories = articles.slice(1);

  if (!section) {
    return (
      <div className="rounded-[2rem] border border-red-200 bg-red-50 p-12 text-center text-red-700 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        Section not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="paper-panel animate-fade-up rounded-[1.6rem] border border-[#d9cfba] p-6 shadow-[0_22px_60px_rgba(24,33,45,0.08)] sm:rounded-[2rem] sm:p-10">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#a12c2f] sm:text-[0.72rem] sm:tracking-[0.34em]">
          {section} Desk
        </p>
        <h1 className="headline-balance mt-4 font-display text-[2.5rem] leading-tight text-slate-950 sm:text-5xl">
          {section} coverage from Atlas Wire
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[#544f45] sm:text-lg sm:leading-8">
          Breaking updates, analysis, and major developments from the {section.toLowerCase()} desk.
        </p>
      </section>

      {loading ? (
        <div className="paper-panel rounded-[1.6rem] border border-[#d9cfba] p-12 text-center text-[#6f6758] shadow-[0_18px_45px_rgba(24,33,45,0.08)]">
          Loading {section.toLowerCase()} coverage...
        </div>
      ) : error ? (
        <div className="rounded-[1.6rem] border border-red-200 bg-red-50 p-12 text-center text-red-700 shadow-[0_18px_45px_rgba(24,33,45,0.08)]">
          {error}
        </div>
      ) : articles.length === 0 ? (
        <div className="paper-panel rounded-[1.6rem] border border-[#d9cfba] p-12 text-center text-[#6f6758] shadow-[0_18px_45px_rgba(24,33,45,0.08)]">
          No published stories yet in the {section.toLowerCase()} desk.
        </div>
      ) : (
        <>
          {leadStory && (
            <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              <article className="overflow-hidden rounded-[1.6rem] border border-[#d9cfba] bg-white shadow-[0_22px_60px_rgba(24,33,45,0.08)] sm:rounded-[2rem]">
                <div className="relative min-h-[20rem] overflow-hidden sm:min-h-[25rem]">
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#07111f] via-[#07111f]/25 to-transparent" />
                  <img
                    src={leadStory.featuredImage}
                    alt={leadStory.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 z-20 p-4 text-white sm:p-8">
                    <div className="flex flex-wrap items-center gap-3 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-white/80 sm:text-[0.72rem] sm:tracking-[0.3em]">
                      <span className="rounded-full bg-[#a12c2f] px-3 py-1 text-white">
                        Lead Story
                      </span>
                      <span>{new Date(leadStory.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className="headline-balance mt-4 font-display text-[2.3rem] leading-tight sm:text-5xl">
                      {leadStory.title}
                    </h2>
                    <p className="mt-4 max-w-3xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8">
                      {leadStory.excerpt}
                    </p>
                    <Link
                      to={createArticlePath(leadStory)}
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#fff6e8] px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#18212d] sm:mt-6"
                    >
                      Open full report
                    </Link>
                  </div>
                </div>
              </article>

              <div className="space-y-5">
                {articles.slice(1, 4).map((article) => (
                  <Link
                    key={article._id}
                    to={createArticlePath(article)}
                    className="paper-panel block rounded-[1.5rem] border border-[#d9cfba] p-5 shadow-[0_16px_35px_rgba(24,33,45,0.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(24,33,45,0.1)] sm:p-6"
                  >
                    <p className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[#a12c2f] sm:text-[0.7rem] sm:tracking-[0.3em]">
                      {section}
                    </p>
                    <h3 className="mt-3 font-display text-[1.8rem] leading-snug text-slate-950 sm:text-2xl">
                      {article.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#544f45] sm:text-base">{article.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-5">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#a12c2f] sm:text-[0.72rem] sm:tracking-[0.34em]">
                More from the Desk
              </p>
              <h2 className="mt-3 font-display text-[2rem] text-slate-950 sm:text-3xl">
                Latest {section} reports
              </h2>
            </div>

            <div className="space-y-5">
              {(moreStories.length > 0 ? moreStories : articles).map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default SectionPage;
