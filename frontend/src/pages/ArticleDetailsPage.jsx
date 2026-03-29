import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import ShareButton from "../components/ShareButton";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import usePageMeta from "../hooks/usePageMeta";
import createArticlePath from "../utils/articlePath";
import { getYouTubeEmbedUrl } from "../utils/youtube";

const categories = [
  "World",
  "Technology",
  "Business",
  "Finance",
  "Sports",
  "Entertainment",
  "Health",
  "Science",
  "Culture",
  "Opinion",
  "Community"
];

const estimateReadMinutes = (text = "") => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 180));
};

const ArticleDetailsPage = () => {
  const { slugOrId } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [articleForm, setArticleForm] = useState(null);
  const [editingArticle, setEditingArticle] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState("");
  const [editingCommentText, setEditingCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  usePageMeta({
    title: article ? article.title : "Story",
    description:
      article?.excerpt ||
      "Read the latest story and follow the conversation on SAEED DAILY."
  });

  const fetchArticleDetails = async () => {
    try {
      const response = await api.get(`/articles/${slugOrId}`);
      setArticle(response.data.article);
      setComments(response.data.comments);
      setArticleForm({
        category: response.data.article.category,
        title: response.data.article.title,
        excerpt: response.data.article.excerpt,
        featuredImage: response.data.article.featuredImage,
        youtubeUrl: response.data.article.youtubeUrl || "",
        description: response.data.article.description,
        status: response.data.article.status
      });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load this article");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticleDetails();
  }, [slugOrId]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setError("Please sign in to leave feedback.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      showToast({
        title: "Posting Feedback",
        message: "Sending your response to the conversation.",
        type: "loading",
        duration: 1500
      });
      await api.post(`/articles/${article._id}/comments`, { text: commentText });
      setCommentText("");
      await fetchArticleDetails();
      showToast({
        title: "Feedback Posted",
        message: "Your response is now live on the story.",
        type: "success"
      });
    } catch (err) {
      const message = err.response?.data?.message || "Unable to publish comment";
      setError(message);
      showToast({
        title: "Comment Failed",
        message,
        type: "error",
        duration: 4500
      });
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
      showToast({
        title: "Reaction Added",
        message: "That feedback now ranks higher in the conversation.",
        type: "success"
      });
    } catch (err) {
      const message = err.response?.data?.message || "Unable to recommend this comment";
      setError(message);
      showToast({
        title: "Action Failed",
        message,
        type: "error",
        duration: 4500
      });
    }
  };

  const handleArticleChange = (event) => {
    setArticleForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  };

  const handleArticleUpdate = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await api.put(`/articles/${article._id}`, articleForm);
      setEditingArticle(false);
      await fetchArticleDetails();
      showToast({
        title: "Post Updated",
        message: "Your story changes are now live.",
        type: "success"
      });
    } catch (err) {
      const message = err.response?.data?.message || "Unable to update article";
      setError(message);
      showToast({
        title: "Update Failed",
        message,
        type: "error",
        duration: 4500
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleArticleDelete = async () => {
    const confirmed = window.confirm("Delete this post and all of its feedback?");

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/articles/${article._id}`);
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete article");
    }
  };

  const handleCommentEditStart = (comment) => {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.text);
  };

  const handleCommentUpdate = async (commentId) => {
    try {
      await api.put(`/comments/${commentId}`, { text: editingCommentText });
      setEditingCommentId("");
      setEditingCommentText("");
      await fetchArticleDetails();
      showToast({
        title: "Feedback Updated",
        message: "Your edited response is now live.",
        type: "success"
      });
    } catch (err) {
      const message = err.response?.data?.message || "Unable to update comment";
      setError(message);
      showToast({
        title: "Edit Failed",
        message,
        type: "error",
        duration: 4500
      });
    }
  };

  const handleCommentDelete = async (commentId) => {
    const confirmed = window.confirm("Delete this feedback?");

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/comments/${commentId}`);
      await fetchArticleDetails();
      showToast({
        title: "Feedback Deleted",
        message: "The response has been removed.",
        type: "success"
      });
    } catch (err) {
      const message = err.response?.data?.message || "Unable to delete comment";
      setError(message);
      showToast({
        title: "Delete Failed",
        message,
        type: "error",
        duration: 4500
      });
    }
  };

  const isArticleOwner = user?._id === article?.author?._id;
  const readMinutes = estimateReadMinutes(article?.description);
  const embeddedVideoUrl = getYouTubeEmbedUrl(article?.youtubeUrl);

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        Loading post...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="rounded-[2rem] border border-red-200 bg-red-50 p-12 text-center text-red-700 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        {error || "Post not found"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="animate-fade-up overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="relative min-h-[26rem] overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#07111f] via-[#07111f]/30 to-transparent" />
          <img
            src={article.featuredImage}
            alt={article.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 z-20 p-6 text-white sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.3em] text-white/80">
              <span className="rounded-full bg-[#4c8df6] px-3 py-1 text-white">
                {article.category}
              </span>
              <span>{article.status === "published" ? "Published" : "Draft"}</span>
              <span>{readMinutes} min read</span>
              <span>{new Date(article.createdAt).toLocaleString()}</span>
            </div>
            <h1 className="mt-5 max-w-5xl font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>
            <p className="mt-5 max-w-4xl text-xl leading-9 text-white/78">{article.excerpt}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <section className="animate-fade-up rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.3em] text-[#4c8df6]">
                  By {article.author?.name || "SAEED DAILY Team"}
                </p>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
                  {article.author?.bio || "Creator commentary and reporting from SAEED DAILY."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <ShareButton
                  title={article.title}
                  path={createArticlePath(article)}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-slate-800 transition hover:border-[#4c8df6] hover:text-[#4c8df6]"
                />
                {isArticleOwner ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditingArticle((previous) => !previous)}
                      className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-slate-800 transition hover:border-[#4c8df6] hover:text-[#4c8df6]"
                    >
                      {editingArticle ? "Close editor" : "Edit post"}
                    </button>
                    <button
                      type="button"
                      onClick={handleArticleDelete}
                      className="rounded-full border border-red-300 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-red-700 transition hover:bg-red-50"
                    >
                      Delete post
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            <div className="mt-8 whitespace-pre-line text-xl leading-10 text-slate-700">
              {article.description}
            </div>
          </section>

          {embeddedVideoUrl ? (
            <section className="animate-fade-up overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.3em] text-[#4c8df6]">
                  Related Video
                </p>
                <h2 className="mt-3 font-display text-3xl text-slate-950">Watch with the story</h2>
              </div>
              <div className="aspect-video bg-black">
                <iframe
                  className="h-full w-full"
                  src={embeddedVideoUrl}
                  title={`${article.title} video`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </section>
          ) : null}

          {editingArticle && articleForm ? (
            <section className="animate-fade-up rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8">
              <h2 className="font-display text-3xl text-slate-950">Edit Post</h2>
              <form onSubmit={handleArticleUpdate} className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="edit-status"
                    className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
                  >
                    Workflow
                  </label>
                  <select
                    id="edit-status"
                    name="status"
                    value={articleForm.status}
                    onChange={handleArticleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
                  >
                    <option value="draft">Save as Draft</option>
                    <option value="published">Publish Now</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="edit-category"
                    className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
                  >
                    Category
                  </label>
                  <select
                    id="edit-category"
                    name="category"
                    value={articleForm.category}
                    onChange={handleArticleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="edit-title"
                    className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
                  >
                    Headline
                  </label>
                  <input
                    id="edit-title"
                    name="title"
                    value={articleForm.title}
                    onChange={handleArticleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-excerpt"
                    className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
                  >
                    Summary
                  </label>
                  <textarea
                    id="edit-excerpt"
                    name="excerpt"
                    rows="3"
                    value={articleForm.excerpt}
                    onChange={handleArticleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-image"
                    className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
                  >
                    Hero Image URL
                  </label>
                  <input
                    id="edit-image"
                    name="featuredImage"
                    value={articleForm.featuredImage}
                    onChange={handleArticleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-youtube"
                    className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
                  >
                    YouTube Video URL
                  </label>
                  <input
                    id="edit-youtube"
                    name="youtubeUrl"
                    value={articleForm.youtubeUrl}
                    onChange={handleArticleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-description"
                    className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
                  >
                    Post Body
                  </label>
                  <textarea
                    id="edit-description"
                    name="description"
                    rows="8"
                    value={articleForm.description}
                    onChange={handleArticleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-[#4c8df6] px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#3c7add] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Saving..." : "Save Post"}
                </button>
              </form>
            </section>
          ) : null}

          <section className="animate-fade-up rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8">
            <h2 className="font-display text-3xl text-slate-950">Join the Conversation</h2>
            <p className="mt-3 text-lg leading-8 text-slate-600">
              Leave feedback, context, or a thoughtful reaction beneath the post.
            </p>

            {error ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleCommentSubmit} className="mt-6 space-y-4">
              <textarea
                rows="6"
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 outline-none transition focus:border-[#4c8df6] focus:bg-white"
                placeholder="Add your feedback, opinion, or extra insight..."
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-[#07111f] px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#0d223d] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Posting..." : "Post Feedback"}
              </button>
            </form>
          </section>

          <section className="space-y-4">
            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.3em] text-[#4c8df6]">
                Community Feedback
              </p>
              <h2 className="mt-3 font-display text-3xl text-slate-950">Top Responses</h2>
            </div>

            {comments.length === 0 ? (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                No feedback yet. Be the first to react.
              </div>
            ) : (
              comments.map((comment, index) => (
                <article
                  key={comment._id}
                  className="animate-fade-up rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_35px_rgba(15,23,42,0.06)]"
                  style={{ animationDelay: `${0.06 * index}s` }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[#4c8df6]">
                        {comment.author?.name || "Guest Contributor"}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRecommend(comment._id)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-slate-700 transition hover:border-[#4c8df6] hover:text-[#4c8df6]"
                    >
                      {comment.likes} recommend
                    </button>
                  </div>

                  {editingCommentId === comment._id ? (
                    <div className="mt-4 space-y-3">
                      <textarea
                        rows="4"
                        value={editingCommentText}
                        onChange={(event) => setEditingCommentText(event.target.value)}
                        className="w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
                      />
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleCommentUpdate(comment._id)}
                          className="rounded-full bg-[#07111f] px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#0d223d]"
                        >
                          Save Feedback
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCommentId("");
                            setEditingCommentText("");
                          }}
                          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 whitespace-pre-line text-lg leading-8 text-slate-700">
                      {comment.text}
                    </p>
                  )}

                  {user?._id === comment.author?._id && editingCommentId !== comment._id ? (
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleCommentEditStart(comment)}
                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-slate-700 transition hover:border-[#4c8df6] hover:text-[#4c8df6]"
                      >
                        Edit Feedback
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCommentDelete(comment._id)}
                        className="rounded-full border border-red-300 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-red-700 transition hover:bg-red-50"
                      >
                        Delete Feedback
                      </button>
                    </div>
                  ) : null}
                </article>
              ))
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <div className="animate-slide-in rounded-[2rem] border border-slate-200 bg-[#07111f] p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.34em] text-[#66e0c2]">
              Post Snapshot
            </p>
            <div className="mt-5 space-y-4 text-sm uppercase tracking-[0.2em] text-white/65">
              <p className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <span>Category</span>
                <span className="text-white">{article.category}</span>
              </p>
              <p className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <span>Status</span>
                <span className="text-white">
                  {article.status === "published" ? "Published" : "Draft"}
                </span>
              </p>
              <p className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <span>Reading time</span>
                <span className="text-white">{readMinutes} min</span>
              </p>
              <p className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <span>Feedback</span>
                <span className="text-white">{comments.length}</span>
              </p>
              <p className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <span>Sharing</span>
                <span className="text-white">Enabled</span>
              </p>
              <p className="flex items-center justify-between gap-3">
                <span>Video</span>
                <span className="text-white">{embeddedVideoUrl ? "Included" : "Optional"}</span>
              </p>
            </div>
          </div>

          <div className="animate-slide-in delay-1 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.34em] text-[#4c8df6]">
              Creator Profile
            </p>
            <h3 className="mt-4 font-display text-3xl text-slate-950">
              {article.author?.name || "SAEED DAILY"}
            </h3>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {article.author?.bio ||
                "Publishing stories, explainers, and feedback-led posts on SAEED DAILY."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ArticleDetailsPage;
