import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const ArticleDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchArticleDetails = async () => {
    try {
      const response = await api.get(`/articles/${id}`);
      setArticle(response.data.article);
      setComments(response.data.comments);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load this article");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticleDetails();
  }, [id]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setError("Please sign in to publish a comment.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await api.post(`/articles/${id}/comments`, { text: commentText });
      setCommentText("");
      await fetchArticleDetails();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to publish comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecommend = async (commentId) => {
    if (!user) {
      setError("Please sign in to recommend a comment.");
      return;
    }

    try {
      await api.put(`/comments/${commentId}/recommend`);
      await fetchArticleDetails();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to recommend this comment");
    }
  };

  if (loading) {
    return (
      <div className="border border-black/10 bg-[#fbf8f2] p-8 text-center text-black/60">
        Loading article...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="border border-red-200 bg-red-50 p-8 text-center text-red-700">
        {error || "Article not found"}
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="space-y-8">
        <section className="border-b border-black/15 pb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-black/55">
            <span className="bg-[#b80018] px-3 py-1 text-white">{article.category}</span>
            <span>By {article.author?.name || "Staff Reporter"}</span>
          </div>
          <div className="mt-6 overflow-hidden border border-black/10 bg-[#f5efe4]">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="h-[26rem] w-full object-cover"
            />
          </div>
          <h1 className="mt-5 font-display text-4xl leading-tight text-black sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-4xl text-2xl leading-9 text-black/68">{article.excerpt}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm uppercase tracking-[0.2em] text-black/50">
            <span>{new Date(article.createdAt).toLocaleString()}</span>
            <span>{comments.length} reader comments</span>
          </div>
          <p className="mt-8 whitespace-pre-line text-xl leading-9 text-black/74">
            {article.description}
          </p>
        </section>

        <section className="border border-black/10 bg-[#fbf8f2] p-6 sm:p-8">
          <h2 className="font-display text-3xl text-black">Submit a Reader Comment</h2>
          <p className="mt-3 text-lg leading-7 text-black/65">
            Add context, analysis, or a sharp editorial response. The community can
            recommend the strongest commentary.
          </p>

          {error && (
            <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleCommentSubmit} className="mt-6 space-y-4">
            <textarea
              rows="6"
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              className="w-full border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-[#b80018]"
              placeholder="Write your comment, perspective, or editorial response..."
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="border border-[#b80018] bg-[#b80018] px-6 py-3 font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8f0012] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Publishing..." : "Publish Comment"}
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="font-display text-3xl text-black">Reader Commentary</h2>
            <p className="mt-2 text-lg text-black/65">
              Recommended comments rise to the top and shape the public conversation.
            </p>
          </div>

          {comments.length === 0 ? (
            <div className="border border-dashed border-black/20 bg-[#fbf8f2] p-8 text-center text-black/60">
              No commentary yet. Publish the first comment.
            </div>
          ) : (
            comments.map((comment) => (
              <article key={comment._id} className="border-t border-black/15 py-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b80018]">
                      {comment.author?.name || "Guest Contributor"}
                    </p>
                    <p className="mt-2 text-sm text-black/50">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRecommend(comment._id)}
                    className="border border-black/15 bg-[#faf6ef] px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:border-[#b80018] hover:text-[#b80018]"
                  >
                    {comment.likes} recommend
                  </button>
                </div>
                <p className="mt-4 whitespace-pre-line text-lg leading-8 text-black/74">
                  {comment.text}
                </p>
              </article>
            ))
          )}
        </section>
      </div>

      <aside className="space-y-6">
        <div className="border border-black/10 bg-black p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
            Story Snapshot
          </p>
          <p className="mt-4 text-lg leading-7 text-white/85">
            Each article blends original reporting with a ranked reader commentary thread.
          </p>
          <div className="mt-6 space-y-3 text-sm uppercase tracking-[0.2em] text-white/60">
            <p>Author: {article.author?.name || "Staff Reporter"}</p>
            <p>Section: {article.category}</p>
            <p>Published: {new Date(article.createdAt).toLocaleDateString()}</p>
            <p>Comments: {comments.length}</p>
          </div>
        </div>

        <div className="border border-black/10 bg-[#faf6ef] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b80018]">
            Author Profile
          </p>
          <p className="mt-4 text-base leading-7 text-black/70">
            {article.author?.bio || "Contributor at Current Chronicle."}
          </p>
        </div>
      </aside>
    </div>
  );
};

export default ArticleDetailsPage;
