import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const categories = ["World", "Technology", "Business", "Culture", "Opinion", "Community"];

const NewsroomPage = () => {
  const [formData, setFormData] = useState({
    category: "Technology",
    title: "",
    excerpt: "",
    featuredImage: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((previous) => ({
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
      setMessage("Article published successfully.");
      setFormData({
        category: "Technology",
        title: "",
        excerpt: "",
        featuredImage: "",
        description: ""
      });
      navigate(`/articles/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to publish your article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
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
          <p>Status: Ready to publish</p>
          <p>Output: Feature package + commentary</p>
          <p>Byline: {user?.bio || "Add a strong author bio in your profile."}</p>
        </div>
      </section>

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
            {loading ? "Publishing..." : "Publish Article"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default NewsroomPage;
