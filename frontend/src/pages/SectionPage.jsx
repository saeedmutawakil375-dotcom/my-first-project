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
    <div className="space-y-8">
      <section className="animate-fade-up rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_22px_60px_rgba(15,23,42,0.08)] sm:p-10">
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.34em] text-[#b80018]">
          {section} Desk
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-slate-950 sm:text-5xl">
          {section} coverage from Atlas Wire
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Breaking updates, analysis, and major developments from the {section.toLowerCase()} desk.
        </p>
      </section>

      {loading ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          Loading {section.toLowerCase()} coverage...
        </div>
      ) : error ? (
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-12 text-center text-red-700 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          {error}
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          No published stories yet in the {section.toLowerCase()} desk.
        </div>
      ) : (
        <>
          {leadStory && (
            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
                <div className="relative min-h-[25rem] overflow-hidden">
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#07111f] via-[#07111f]/25 to-transparent" />
                  <img
                    src={leadStory.featuredImage}
                    alt={leadStory.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 z-20 p-6 text-white sm:p-8">
                    <div className="flex flex-wrap items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.3em] text-white/80">
                      <span className="rounded-full bg-[#b80018] px-3 py-1 text-white">
                        Lead Story
                      </span>
                      <span>{new Date(leadStory.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
                      {leadStory.title}
                    </h2>
                    <p className="mt-4 max-w-3xl text-lg leading-8 text-white/78">
                      {leadStory.excerpt}
                    </p>
                    <Link
                      to={createArticlePath(leadStory)}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-[#07111f]"
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
                    className="block rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_35px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(15,23,42,0.1)]"
                  >
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-[#b80018]">
                      {section}
                    </p>
                    <h3 className="mt-3 font-display text-2xl leading-snug text-slate-950">
                      {article.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-slate-600">{article.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-5">
            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.34em] text-[#b80018]">
                More from the Desk
              </p>
              <h2 className="mt-3 font-display text-3xl text-slate-950">Latest {section} reports</h2>
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
