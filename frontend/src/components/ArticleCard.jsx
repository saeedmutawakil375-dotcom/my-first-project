import { Link } from "react-router-dom";
import ShareButton from "./ShareButton";
import createArticlePath from "../utils/articlePath";

const estimateReadMinutes = (text = "") => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 180));
};

const ArticleCard = ({ article }) => {
  const readMinutes = estimateReadMinutes(article.description);
  const articlePath = createArticlePath(article);

  return (
    <article className="daily-card group overflow-hidden rounded-[1.7rem] border border-[rgba(255,255,255,0.12)] shadow-[0_22px_55px_rgba(4,12,24,0.12)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_65px_rgba(4,12,24,0.2)]">
      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <Link to={articlePath} className="relative min-h-[15rem] overflow-hidden sm:min-h-[18rem]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#07131f] via-[#07131f]/18 to-transparent" />
          <img
            src={article.featuredImage}
            alt={article.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 z-20 p-4 text-white sm:p-6">
            <div className="flex flex-wrap items-center gap-3 text-[0.64rem] font-bold uppercase tracking-[0.28em] text-white/78 sm:text-[0.7rem] sm:tracking-[0.32em]">
              <span className="rounded-full bg-[#66e0c2] px-3 py-1 text-[#041019]">
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
            <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#6b7480] sm:text-[0.72rem] sm:tracking-[0.24em]">
              <span>{article.author?.name || "SAEED DAILY Team"}</span>
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>

            <p className="mt-4 text-base leading-7 text-[#52606d] sm:mt-5 sm:text-lg sm:leading-8">
              {article.excerpt}
            </p>
          </div>

          <div className="mt-6 border-t border-[rgba(5,18,28,0.08)] pt-5 sm:mt-8 sm:pt-6">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#6b7480] sm:text-xs sm:tracking-[0.3em]">
              Creator Note
            </p>
            <p className="mt-3 text-sm leading-7 text-[#52606d] sm:text-base">
              {article.author?.bio ||
                "Stories, commentary, and community-led publishing from SAEED DAILY."}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to={articlePath}
                className="inline-flex items-center gap-2 rounded-full bg-[#041019] px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-white"
              >
                Open Post
              </Link>
              <ShareButton
                title={article.title}
                path={articlePath}
                className="rounded-full border border-[rgba(5,18,28,0.12)] px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-[#041019] transition hover:border-[#4c8df6] hover:text-[#4c8df6]"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
