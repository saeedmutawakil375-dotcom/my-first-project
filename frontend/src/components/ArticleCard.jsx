import { Link } from "react-router-dom";
import createArticlePath from "../utils/articlePath";

const estimateReadMinutes = (text = "") => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 180));
};

const ArticleCard = ({ article }) => {
  const readMinutes = estimateReadMinutes(article.description);

  return (
    <article className="paper-panel group overflow-hidden rounded-[1.5rem] border border-[#d9cfba] shadow-[0_18px_45px_rgba(24,33,45,0.08)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(24,33,45,0.14)]">
      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <Link to={createArticlePath(article)} className="relative min-h-[15rem] overflow-hidden sm:min-h-[18rem]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#07111f] via-[#07111f]/20 to-transparent" />
          <img
            src={article.featuredImage}
            alt={article.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 z-20 p-4 text-white sm:p-6">
            <div className="flex flex-wrap items-center gap-3 text-[0.64rem] font-bold uppercase tracking-[0.28em] text-white/78 sm:text-[0.7rem] sm:tracking-[0.32em]">
              <span className="rounded-full bg-[#a12c2f] px-3 py-1 text-white">
                {article.category}
              </span>
              <span>{readMinutes} min read</span>
            </div>
            <h2 className="mt-4 font-display text-[2rem] leading-tight sm:text-4xl">
              {article.title}
            </h2>
          </div>
        </Link>

        <div className="flex h-full flex-col justify-between bg-transparent p-5 sm:p-7">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#6f6758] sm:text-[0.72rem] sm:tracking-[0.24em]">
              <span>{article.author?.name || "Atlas Wire Staff"}</span>
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>

            <p className="mt-4 text-base leading-7 text-[#544f45] sm:mt-5 sm:text-lg sm:leading-8">
              {article.excerpt}
            </p>
          </div>

          <div className="mt-6 border-t border-[#d9cfba] pt-5 sm:mt-8 sm:pt-6">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#6f6758] sm:text-xs sm:tracking-[0.3em]">
              Correspondent Note
            </p>
            <p className="mt-3 text-sm leading-7 text-[#544f45] sm:text-base">
              {article.author?.bio ||
                "Global reporting and analysis from the Atlas Wire network."}
            </p>
            <Link
              to={createArticlePath(article)}
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-[#a12c2f]"
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
