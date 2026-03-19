import { useEffect, useState } from "react";
import api from "../api";
import ArticleCard from "../components/ArticleCard";

const sections = ["All", "World", "Technology", "Business", "Culture", "Opinion", "Community"];

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [activeSection, setActiveSection] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get("/articles");
        setArticles(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load articles right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles =
    activeSection === "All"
      ? articles
      : articles.filter((article) => article.category === activeSection);
  const leadStory = filteredArticles[0];
  const secondaryStories = filteredArticles.slice(1, 3);
  const latestStories = filteredArticles.slice(1);

  return (
    <div className="space-y-10">
      <section className="flex flex-wrap items-center gap-3 border-y border-black/10 py-4">
        {sections.map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => setActiveSection(section)}
            className={`border px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition ${
              activeSection === section
                ? "border-[#b80018] bg-[#b80018] text-white"
                : "border-black/10 bg-[#fbf8f2] text-black/65 hover:border-[#b80018] hover:text-[#b80018]"
            }`}
          >
            {section}
          </button>
        ))}
      </section>

      <section className="grid gap-8 border-b border-black/15 pb-10 lg:grid-cols-[1.6fr_0.8fr]">
        <div className="grid gap-6 border-b border-black/10 pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-black/55">
            <span className="bg-[#b80018] px-3 py-1 text-white">Lead Story</span>
            <span>Analysis and community reporting</span>
          </div>
          <div>
            <h1 className="font-display max-w-4xl text-4xl leading-tight text-black sm:text-5xl lg:text-6xl">
              Reader-powered headlines with the pace of a newsroom and the depth of a
              community forum.
            </h1>
            <p className="mt-5 max-w-3xl text-xl leading-8 text-black/70">
              Current Chronicle turns every article into a polished feature, editorial brief,
              or developing story. Readers can publish their own reporting, then add ranked
              perspectives beneath each article.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="border border-black/10 bg-[#faf6ef] p-5">
              <p className="text-4xl font-bold text-[#b80018]">{articles.length}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.25em] text-black/55">
                Published stories
              </p>
            </div>
            <div className="border border-black/10 bg-[#faf6ef] p-5">
              <p className="text-4xl font-bold text-[#b80018]">24/7</p>
              <p className="mt-2 text-sm uppercase tracking-[0.25em] text-black/55">
                Rolling updates
              </p>
            </div>
            <div className="border border-black/10 bg-[#faf6ef] p-5">
              <p className="text-4xl font-bold text-[#b80018]">Live</p>
              <p className="mt-2 text-sm uppercase tracking-[0.25em] text-black/55">
                Reader reactions
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="border border-black/10 bg-black px-5 py-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
              Editor&apos;s Note
            </p>
            <p className="mt-3 text-lg leading-7 text-white/90">
              Post a new story from the newsroom and watch the front page reshape itself in
              real time.
            </p>
          </div>
          {secondaryStories.length > 0 ? (
            secondaryStories.map((story, index) => (
              <article key={story._id} className="border border-black/10 bg-[#faf6ef] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b80018]">
                  {story.category} Brief {index + 1}
                </p>
                <h2 className="mt-3 font-display text-2xl leading-snug text-black">
                  {story.title}
                </h2>
                <p className="mt-3 text-base leading-7 text-black/70">
                  {story.excerpt}
                </p>
              </article>
            ))
          ) : (
            <div className="border border-dashed border-black/20 p-6 text-black/60">
              Publish a few stories to populate the briefing rail.
            </div>
          )}
        </aside>
      </section>

      {loading ? (
        <div className="border border-black/10 bg-[#fbf8f2] p-10 text-center text-black/60">
          Loading the latest edition...
        </div>
      ) : error ? (
        <div className="border border-red-200 bg-red-50 p-10 text-center text-red-700">
          {error}
        </div>
      ) : articles.length === 0 ? (
        <div className="border border-dashed border-black/20 bg-[#fbf8f2] p-10 text-center text-black/60">
          The front page is empty. Open the newsroom and publish the first article.
        </div>
      ) : (
        <>
          {leadStory && (
            <section className="grid gap-8 border-b border-black/15 pb-10 lg:grid-cols-[1.35fr_0.65fr]">
              <article className="border border-black/10 bg-[#fbf8f2] p-6 sm:p-8">
                <div className="overflow-hidden border border-black/10 bg-[#f5efe4]">
                  <img
                    src={leadStory.featuredImage}
                    alt={leadStory.title}
                    className="h-80 w-full object-cover"
                  />
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b80018]">
                    Top Story
                  </p>
                  <span className="border border-black/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-black/60">
                    {leadStory.category}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-4xl leading-tight text-black sm:text-5xl">
                  {leadStory.title}
                </h2>
                <p className="mt-5 max-w-4xl text-lg leading-8 text-black/72">
                  {leadStory.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm uppercase tracking-[0.2em] text-black/55">
                  <span>By {leadStory.author?.name || "Staff Reporter"}</span>
                  <span>{new Date(leadStory.createdAt).toLocaleString()}</span>
                </div>
              </article>

              <div className="border-l border-black/10 pl-0 lg:pl-8">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-black/55">
                  Latest Dispatches
                </p>
                <div className="space-y-2">
                  {articles.slice(0, 4).map((story) => (
                    <ArticleCard key={story._id} article={story} />
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <div className="mb-5">
                <h2 className="font-display text-3xl text-black">Features and Analysis</h2>
                <p className="mt-2 text-lg text-black/65">
                  Long-form articles and developing stories from the {activeSection} desk.
                </p>
              </div>

              <div className="space-y-2">
                {(latestStories.length > 0 ? latestStories : filteredArticles.slice(1)).map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="border border-black/10 bg-black p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                  Opinion Watch
                </p>
                <h3 className="mt-4 font-display text-3xl leading-snug">
                  Every article opens a thread for community perspective.
                </h3>
                <p className="mt-4 text-base leading-7 text-white/80">
                  Readers can add insights, analysis, and practical responses beneath each
                  piece. The strongest responses rise through helpful votes.
                </p>
              </div>

              <div className="border border-black/10 bg-[#faf6ef] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b80018]">
                  Publishing Cadence
                </p>
                <div className="mt-4 space-y-4 text-black/70">
                  <p className="border-b border-black/10 pb-4">
                    Front-page stories are sorted newest first and highlighted with editorial
                    framing.
                  </p>
                  <p className="border-b border-black/10 pb-4">
                    Article pages read like long-form features with reader commentary beneath.
                  </p>
                  <p>Writers can publish instantly from the newsroom after signing in.</p>
                </div>
              </div>
            </aside>
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;
