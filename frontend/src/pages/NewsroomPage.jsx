import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import usePageMeta from "../hooks/usePageMeta";
import createArticlePath from "../utils/articlePath";

const categories = [
  "World",
  "Technology",
  "Business",
  "Finance",
  "Sports",
  "Entertainment",
  "Health",
  "Science"
];

const NewsroomPage = () => {
  const { user, updateProfile } = useAuth();
  const { showToast, dismissToast } = useToast();
  const [formData, setFormData] = useState({
    category: "World",
    title: "",
    excerpt: "",
    featuredImage: "",
    youtubeUrl: "",
    description: "",
    status: "draft"
  });
  const [myArticles, setMyArticles] = useState([]);
  const [newsroomSearch, setNewsroomSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    password: ""
  });
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [queueLoading, setQueueLoading] = useState(true);
  const [searchStatus, setSearchStatus] = useState("");
  const navigate = useNavigate();
  const searchToastId = useRef(null);

  usePageMeta({
    title: "Creator Studio",
    description:
      "Write posts, publish stories, attach YouTube videos, manage drafts, and shape the community feed on SAEED DAILY."
  });

  useEffect(() => {
    setProfileForm({
      name: user?.name || "",
      bio: user?.bio || "",
      password: ""
    });
  }, [user]);

  useEffect(() => {
    const fetchMyArticles = async () => {
      setQueueLoading(true);

      if (newsroomSearch.trim()) {
        setSearchStatus(`Searching for "${newsroomSearch}"`);
        searchToastId.current = showToast({
          title: "Searching Studio",
          message: `Looking for posts matching "${newsroomSearch}".`,
          type: "loading",
          duration: 2000
        });
      } else {
        setSearchStatus("Showing all posts");
      }

      try {
        const response = await api.get("/articles/mine/list", {
          params: {
            search: newsroomSearch || undefined
          }
        });
        setMyArticles(response.data);

        if (newsroomSearch.trim()) {
          showToast({
            title: "Studio Updated",
            message: `Found ${response.data.length} matching post${response.data.length === 1 ? "" : "s"}.`,
            type: "info"
          });
        }
      } catch (_error) {
        setMyArticles([]);
        showToast({
          title: "Search Failed",
          message: "Unable to refresh your studio queue right now.",
          type: "error",
          duration: 4200
        });
      } finally {
        if (searchToastId.current) {
          dismissToast(searchToastId.current);
          searchToastId.current = null;
        }
        setQueueLoading(false);
      }
    };

    fetchMyArticles();
  }, [dismissToast, newsroomSearch, showToast]);

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  };

  const handleProfileChange = (event) => {
    setProfileForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      showToast({
        title: formData.status === "published" ? "Publishing Post" : "Saving Draft",
        message: "Sending your story to SAEED DAILY.",
        type: "loading",
        duration: 1800
      });
      const response = await api.post("/articles", formData);
      setMessage(
        formData.status === "published"
          ? "Post published successfully."
          : "Draft saved to your studio."
      );
      setFormData({
        category: "World",
        title: "",
        excerpt: "",
        featuredImage: "",
        youtubeUrl: "",
        description: "",
        status: "draft"
      });
      setNewsroomSearch("");
      showToast({
        title: formData.status === "published" ? "Post Published" : "Draft Saved",
        message:
          formData.status === "published"
            ? "Your post is now live on SAEED DAILY."
            : "Your draft is ready in your studio queue.",
        type: "success"
      });
      navigate(createArticlePath(response.data));
    } catch (err) {
      const message = err.response?.data?.message || "Unable to publish your post";
      setError(message);
      showToast({
        title: "Publishing Failed",
        message,
        type: "error",
        duration: 4500
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileLoading(true);
    setProfileMessage("");
    setProfileError("");

    try {
      showToast({
        title: "Updating Profile",
        message: "Saving your creator details.",
        type: "loading",
        duration: 1800
      });
      await updateProfile(profileForm);
      setProfileMessage("Profile updated successfully.");
      setProfileForm((previous) => ({
        ...previous,
        password: ""
      }));
      showToast({
        title: "Profile Updated",
        message: "Your byline is refreshed across SAEED DAILY.",
        type: "success"
      });
    } catch (err) {
      const message = err.response?.data?.message || "Unable to update profile";
      setProfileError(message);
      showToast({
        title: "Profile Update Failed",
        message,
        type: "error",
        duration: 4500
      });
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="animate-fade-up overflow-hidden rounded-[2rem] border border-slate-200 bg-[#07111f] text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-[radial-gradient(circle_at_top,_rgba(102,224,194,0.22),_transparent_35%),linear-gradient(160deg,#07111f_0%,#0d223d_42%,#0d3b66_100%)] p-8 sm:p-10">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.38em] text-white/60">
              Creator Studio
            </p>
            <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
              Welcome back, {user?.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
              Publish articles, blogs, opinion posts, and video-linked stories from one clean creator dashboard.
            </p>
          </div>

          <div className="grid gap-4 bg-white p-6 text-slate-950 sm:grid-cols-2 sm:p-8">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-slate-500">
                Active category
              </p>
              <p className="mt-3 text-3xl font-bold text-slate-950">{formData.category}</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-slate-500">
                Workflow
              </p>
              <p className="mt-3 text-3xl font-bold text-slate-950">
                {formData.status === "published" ? "Live" : "Draft"}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 sm:col-span-2">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-slate-500">
                Creator bio
              </p>
              <p className="mt-3 text-lg leading-7 text-slate-600">
                {user?.bio || "Add a clear creator bio in your profile."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="animate-fade-up rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8">
          <h2 className="font-display text-3xl text-slate-950">Creator Profile</h2>
          <p className="mt-3 text-lg leading-8 text-slate-600">
            Update your public creator profile so every post feels personal and trusted.
          </p>

          {profileMessage ? (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {profileMessage}
            </div>
          ) : null}

          {profileError ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {profileError}
            </div>
          ) : null}

          <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
              >
                Display Name
              </label>
              <input
                id="profile-name"
                name="name"
                type="text"
                value={profileForm.name}
                onChange={handleProfileChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="profile-bio"
                className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
              >
                Creator Bio
              </label>
              <textarea
                id="profile-bio"
                name="bio"
                rows="4"
                value={profileForm.bio}
                onChange={handleProfileChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="profile-password"
                className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
              >
                New Password
              </label>
              <input
                id="profile-password"
                name="password"
                type="password"
                value={profileForm.password}
                onChange={handleProfileChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
                placeholder="Leave blank to keep your current password"
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="rounded-full bg-[#07111f] px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#0d223d] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {profileLoading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </section>

        <section className="animate-fade-up rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8">
          <h2 className="font-display text-3xl text-slate-950">Publish a New Post</h2>
          <p className="mt-3 text-lg leading-8 text-slate-600">
            Publish a polished story, attach a YouTube video, and send it straight to the live feed.
          </p>

          {message ? (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
              >
                Workflow
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
              >
                <option value="draft">Save as Draft</option>
                <option value="published">Publish Now</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
              >
                Headline
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
                placeholder="A strong headline people will want to open"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="excerpt"
                className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
              >
                Summary
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows="3"
                value={formData.excerpt}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
                placeholder="A concise summary that explains why the post matters."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="featuredImage"
                className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
              >
                Hero Image URL
              </label>
              <input
                id="featuredImage"
                name="featuredImage"
                type="url"
                value={formData.featuredImage}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
                placeholder="https://images.unsplash.com/..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="youtubeUrl"
                className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
              >
                YouTube Video URL
              </label>
              <input
                id="youtubeUrl"
                name="youtubeUrl"
                type="url"
                value={formData.youtubeUrl}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
              >
                Post Body
              </label>
              <textarea
                id="description"
                name="description"
                rows="8"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
                placeholder="Write the full post, explain the context, and say why people should care."
                required
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-[#4c8df6] px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-white shadow-[0_16px_30px_rgba(76,141,246,0.22)] transition hover:bg-[#3c7add] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading
                  ? formData.status === "published"
                    ? "Publishing..."
                    : "Saving..."
                  : formData.status === "published"
                    ? "Publish Post"
                    : "Save Draft"}
              </button>
            </div>
          </form>
        </section>
      </div>

      <section className="animate-fade-up rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl text-slate-950">Your Studio Queue</h2>
            <p className="mt-2 text-lg leading-7 text-slate-600">
              Review drafts, published stories, and recent creator updates.
            </p>
          </div>

          <div className="w-full max-w-md">
            <label
              htmlFor="newsroom-search"
              className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
            >
              Search your posts
            </label>
            <input
              id="newsroom-search"
              type="search"
              value={newsroomSearch}
              onChange={(event) => setNewsroomSearch(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#4c8df6] focus:bg-white"
              placeholder="Search drafts, live posts, and category updates..."
            />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#6f6758]">
              {queueLoading ? "Refreshing your queue..." : searchStatus}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {queueLoading ? (
            <div className="daily-card rounded-[1.5rem] border border-[rgba(255,255,255,0.12)] p-6 text-[#6f6758]">
              Loading your studio queue...
            </div>
          ) : myArticles.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500">
              No posts found in your queue yet.
            </div>
          ) : (
            myArticles.map((article) => (
              <article
                key={article._id}
                className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 md:grid-cols-[1fr_auto]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-slate-500">
                    <span className="rounded-full bg-[#4c8df6] px-3 py-1 text-white">
                      {article.category}
                    </span>
                    <span>{article.status === "published" ? "live" : "draft"}</span>
                    <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl text-slate-950">{article.title}</h3>
                  <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                    {article.excerpt}
                  </p>
                </div>

                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => navigate(createArticlePath(article))}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-slate-800 transition hover:border-[#4c8df6] hover:text-[#4c8df6]"
                  >
                    Open Post
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsroomPage;
