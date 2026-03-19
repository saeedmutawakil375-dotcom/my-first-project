import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const categories = ["World", "Technology", "Business", "Culture", "Opinion", "Community"];

const NewsroomPage = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    category: "Technology",
    title: "",
    excerpt: "",
    featuredImage: "",
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
  const navigate = useNavigate();

  useEffect(() => {
    setProfileForm({
      name: user?.name || "",
      bio: user?.bio || "",
      password: ""
    });
  }, [user]);

  useEffect(() => {
    const fetchMyArticles = async () => {
      try {
        const response = await api.get("/articles/mine/list", {
          params: {
            search: newsroomSearch || undefined
          }
        });
        setMyArticles(response.data);
      } catch (_error) {
        setMyArticles([]);
      }
    };

    fetchMyArticles();
  }, [newsroomSearch]);

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
      const response = await api.post("/articles", formData);
      setMessage(
        formData.status === "published"
          ? "Article published successfully."
          : "Draft saved to your newsroom."
      );
      setFormData({
        category: "Technology",
        title: "",
        excerpt: "",
        featuredImage: "",
        description: "",
        status: "draft"
      });
      setNewsroomSearch("");
      navigate(`/articles/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to publish your article");
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
      await updateProfile(profileForm);
      setProfileMessage("Profile updated successfully.");
      setProfileForm((previous) => ({
        ...previous,
        password: ""
      }));
    } catch (err) {
      setProfileError(err.response?.data?.message || "Unable to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="space-y-8">
        <section className="border border-black/10 bg-black p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/65">
            Newsroom Access
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight">Welcome back, {user?.name}</h1>
          <p className="mt-4 text-lg leading-8 text-white/75">
            Draft a headline, file a feature, and publish directly to the front page.
          </p>
          <div className="mt-8 space-y-4 border-t border-white/15 pt-6 text-sm uppercase tracking-[0.2em] text-white/60">
            <p>Section: {formData.category}</p>
            <p>Status: {formData.status === "published" ? "Publish on submit" : "Save as draft"}</p>
            <p>Output: Feature package + commentary</p>
            <p>Byline: {user?.bio || "Add a strong author bio in your profile."}</p>
          </div>
        </section>

        <section className="border border-black/10 bg-[#faf6ef] p-8">
          <h2 className="font-display text-3xl text-black">Contributor Profile</h2>
          <p className="mt-3 text-lg leading-7 text-black/65">
            Update your byline details so every article carries a sharper editorial identity.
          </p>

          {profileMessage && (
            <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {profileMessage}
            </div>
          )}

          {profileError && (
            <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {profileError}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-black/60"
              >
                Display Name
              </label>
              <input
                id="profile-name"
                name="name"
                type="text"
                value={profileForm.name}
                onChange={handleProfileChange}
                className="w-full border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-[#b80018]"
              />
            </div>

            <div>
              <label
                htmlFor="profile-bio"
                className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-black/60"
              >
                Author Bio
              </label>
              <textarea
                id="profile-bio"
                name="bio"
                rows="4"
                value={profileForm.bio}
                onChange={handleProfileChange}
                className="w-full border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-[#b80018]"
              />
            </div>

            <div>
              <label
                htmlFor="profile-password"
                className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-black/60"
              >
                New Password
              </label>
              <input
                id="profile-password"
                name="password"
                type="password"
                value={profileForm.password}
                onChange={handleProfileChange}
                className="w-full border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-[#b80018]"
                placeholder="Leave blank to keep your current password"
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="border border-black bg-black px-6 py-3 font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#b80018] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {profileLoading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </section>
      </div>

      <section className="border border-black/10 bg-[#fbf8f2] p-8">
        <h2 className="font-display text-3xl text-black">Publish a New Article</h2>
        <p className="mt-3 text-lg leading-7 text-black/65">
          Write a strong headline and a detailed body so the article feels ready for a news
          homepage, feature column, or developing story slot.
        </p>

        {message && (
          <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-black/60"
            >
              Workflow
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-[#b80018]"
            >
              <option value="draft">Save as Draft</option>
              <option value="published">Publish Now</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-black/60"
            >
              Section
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-[#b80018]"
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
              htmlFor="title"
              className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-black/60"
            >
              Headline
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-[#b80018]"
              placeholder="Inside the pressure reshaping independent tech careers"
              required
            />
          </div>

          <div>
            <label
              htmlFor="excerpt"
              className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-black/60"
            >
              Standfirst / Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows="3"
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-[#b80018]"
              placeholder="A concise editorial summary that will appear on the front page and at the top of the article."
              required
            />
          </div>

          <div>
            <label
              htmlFor="featuredImage"
              className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-black/60"
            >
              Featured Image URL
            </label>
            <input
              id="featuredImage"
              name="featuredImage"
              type="url"
              value={formData.featuredImage}
              onChange={handleChange}
              className="w-full border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-[#b80018]"
              placeholder="https://images.unsplash.com/..."
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-black/60"
            >
              Article Body
            </label>
            <textarea
              id="description"
              name="description"
              rows="6"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-[#b80018]"
              placeholder="Write the story, include the context, and invite readers to weigh in with their own perspectives."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="border border-[#b80018] bg-[#b80018] px-6 py-3 font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8f0012] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading
              ? formData.status === "published"
                ? "Publishing..."
                : "Saving..."
              : formData.status === "published"
                ? "Publish Article"
                : "Save Draft"}
          </button>
        </form>
      </section>

      <section className="border border-black/10 bg-[#faf6ef] p-8 lg:col-span-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl text-black">Your Newsroom Queue</h2>
            <p className="mt-2 text-lg leading-7 text-black/65">
              Review your drafts and published articles in one place.
            </p>
          </div>
          <div className="w-full max-w-md">
            <label
              htmlFor="newsroom-search"
              className="mb-2 block text-sm font-medium uppercase tracking-[0.18em] text-black/60"
            >
              Search your articles
            </label>
            <input
              id="newsroom-search"
              type="search"
              value={newsroomSearch}
              onChange={(event) => setNewsroomSearch(event.target.value)}
              className="w-full border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-[#b80018]"
              placeholder="Search your headlines and drafts..."
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {myArticles.length === 0 ? (
            <div className="border border-dashed border-black/20 bg-white p-6 text-black/60">
              No articles found in your newsroom yet.
            </div>
          ) : (
            myArticles.map((article) => (
              <article
                key={article._id}
                className="grid gap-4 border border-black/10 bg-white p-5 md:grid-cols-[1fr_auto]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-black/55">
                    <span className="bg-[#b80018] px-2 py-1 text-white">{article.category}</span>
                    <span>{article.status === "published" ? "published" : "draft"}</span>
                    <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl text-black">{article.title}</h3>
                  <p className="mt-3 max-w-3xl text-base leading-7 text-black/70">
                    {article.excerpt}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => navigate(`/articles/${article._id}`)}
                    className="border border-black px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:border-[#b80018] hover:text-[#b80018]"
                  >
                    Open
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
