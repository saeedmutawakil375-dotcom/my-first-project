import { Link } from "react-router-dom";
import createArticlePath from "../utils/articlePath";

const estimateReadMinutes = (text = "") => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 180));
};

const ArticleCard = ({ article }) => {
  const readMinutes = estimateReadMinutes(article.description);

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,23,42,0.14)]">
      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <Link to={createArticlePath(article)} className="relative min-h-[18rem] overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#07111f] via-[#07111f]/20 to-transparent" />
          <img
            src={article.featuredImage}
            alt={article.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 z-20 p-6 text-white">
            <div className="flex flex-wrap items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.32em] text-white/78">
              <span className="rounded-full bg-[#b80018] px-3 py-1 text-white">
                {article.category}
              </span>
              <span>{readMinutes} min read</span>
            </div>
            <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
              {article.title}
            </h2>
          </div>
        </Link>

        <div className="flex h-full flex-col justify-between bg-white p-6 sm:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
              <span>{article.author?.name || "Atlas Wire Staff"}</span>
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>

            <p className="mt-5 text-lg leading-8 text-slate-600">{article.excerpt}</p>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
              Correspondent Note
            </p>
            <p className="mt-3 text-base leading-7 text-slate-600">
              {article.author?.bio ||
                "Global reporting and analysis from the Atlas Wire network."}
            </p>
            <Link
              to={createArticlePath(article)}
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[#b80018]"
            >
              Read full report
              <span aria-hidden="true">View</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
