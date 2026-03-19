import { Link } from "react-router-dom";

const ArticleCard = ({ article }) => {
  return (
    <article className="group border-t border-black/15 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-black/55">
        <span className="bg-[#b80018] px-2 py-1 text-white">{article.category}</span>
        <span>{article.author?.name || "Staff Reporter"}</span>
        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="grid gap-5 md:grid-cols-[1.4fr_0.6fr] md:items-start">
        <div>
          <div className="overflow-hidden border border-black/10 bg-[#f5efe4]">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          </div>
          <h2 className="font-display text-2xl leading-tight text-black transition group-hover:text-[#b80018] sm:text-3xl">
            <Link to={`/articles/${article._id}`} className="mt-4 inline-block">
              {article.title}
            </Link>
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-black/72">{article.excerpt}</p>
          <Link
            to={`/articles/${article._id}`}
            className="mt-5 inline-flex items-center text-sm font-semibold uppercase tracking-[0.25em] text-[#b80018]"
          >
            Read article
          </Link>
        </div>

        <div className="border border-black/10 bg-[#f5efe4] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/55">
            Reader Desk
          </p>
          <p className="mt-3 text-sm leading-6 text-black/70">
            Published responses appear beneath each story as ranked commentary from the
            audience and contributor network.
          </p>
          <p className="mt-4 text-sm leading-6 text-black/70">
            {article.author?.bio || "Contributor at Current Chronicle."}
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-black/45">
            Story ID
          </p>
          <p className="mt-2 break-all text-sm text-black/60">{article._id}</p>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
