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
    title: section ? `${section} | SAEED DAILY` : "Section",
    description: section
      ? `Read the latest ${section.toLowerCase()} posts, creator updates, and shared stories on SAEED DAILY.`
      : "Explore the latest desk coverage on SAEED DAILY."
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
      <section className="daily-card animate-fade-up rounded-[1.8rem] border border-[rgba(255,255,255,0.12)] p-6 shadow-[0_22px_60px_rgba(24,33,45,0.08)] sm:p-10">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#4c8df6] sm:text-[0.72rem] sm:tracking-[0.34em]">
          {section} Channel
        </p>
        <h1 className="headline-balance mt-4 font-display text-[2.5rem] leading-tight text-slate-950 sm:text-5xl">
          {section} on SAEED DAILY
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[#544f45] sm:text-lg sm:leading-8">
          Explore creator posts, curated reports, and discussions from the {section.toLowerCase()} channel.
        </p>
      </section>

      {loading ? (
        <div className="daily-card rounded-[1.8rem] border border-[rgba(255,255,255,0.12)] p-12 text-center text-[#5c6775] shadow-[0_18px_45px_rgba(24,33,45,0.08)]">
          Loading {section.toLowerCase()} coverage...
        </div>
      ) : error ? (
        <div className="rounded-[1.8rem] border border-red-200 bg-red-50 p-12 text-center text-red-700 shadow-[0_18px_45px_rgba(24,33,45,0.08)]">
          {error}
        </div>
      ) : articles.length === 0 ? (
        <div className="daily-card rounded-[1.8rem] border border-[rgba(255,255,255,0.12)] p-12 text-center text-[#5c6775] shadow-[0_18px_45px_rgba(24,33,45,0.08)]">
          No published stories yet in the {section.toLowerCase()} channel.
        </div>
      ) : (
        <>
          {leadStory && (
            <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              <article className="overflow-hidden rounded-[1.8rem] border border-[rgba(255,255,255,0.12)] bg-white shadow-[0_22px_60px_rgba(24,33,45,0.08)]">
                <div className="relative min-h-[20rem] overflow-hidden sm:min-h-[25rem]">
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#07111f] via-[#07111f]/25 to-transparent" />
                  <img
                    src={leadStory.featuredImage}
                    alt={leadStory.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 z-20 p-4 text-white sm:p-8">
                    <div className="flex flex-wrap items-center gap-3 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-white/80 sm:text-[0.72rem] sm:tracking-[0.3em]">
                      <span className="rounded-full bg-[#4c8df6] px-3 py-1 text-white">
                        Featured post
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
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#66e0c2] px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#041019] sm:mt-6"
                    >
                      Open full post
                    </Link>
                  </div>
                </div>
              </article>

              <div className="space-y-5">
                {articles.slice(1, 4).map((article) => (
                  <Link
                    key={article._id}
                    to={createArticlePath(article)}
                    className="daily-card block rounded-[1.5rem] border border-[rgba(255,255,255,0.12)] p-5 shadow-[0_16px_35px_rgba(24,33,45,0.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(24,33,45,0.1)] sm:p-6"
                  >
                    <p className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[#4c8df6] sm:text-[0.7rem] sm:tracking-[0.3em]">
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
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#4c8df6] sm:text-[0.72rem] sm:tracking-[0.34em]">
                More from the Channel
              </p>
              <h2 className="mt-3 font-display text-[2rem] text-slate-950 sm:text-3xl">
                Latest {section} posts
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
