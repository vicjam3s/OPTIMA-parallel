import { useEffect, useState } from "react";

const CACHE_KEY = "optima_news_cache";
const BOOKMARK_KEY = "optima_saved_news";
const CACHE_TIME = 15 * 60 * 1000;

const categories = [
  { label: "Top", value: "general" },
  { label: "Business", value: "business" },
  { label: "Technology", value: "technology" },
  { label: "Sports", value: "sports" },
  { label: "Health", value: "health" },
];

export default function News() {
  const [articles, setArticles] = useState([]);
  const [saved, setSaved] = useState([]);
  const [category, setCategory] = useState("general");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- LOAD SAVED ---------- */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(BOOKMARK_KEY)) || [];
    setSaved(stored);
  }, []);

  /* ---------- LOAD CACHE ---------- */
  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (cached && Date.now() - cached.time < CACHE_TIME) {
      setArticles(cached.data);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const fetchNews = async (searchTerm = "") => {
    setLoading(true);
    setError("");

    try {
      const url = searchTerm
        ? `https://gnews.io/api/v4/search?q=${encodeURIComponent(
            searchTerm
          )}&country=ke&max=10&token=${import.meta.env.VITE_GNEWS_API_KEY}`
        : `https://gnews.io/api/v4/top-headlines?country=ke&topic=${category}&max=10&token=${import.meta.env.VITE_GNEWS_API_KEY}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setArticles(data.articles || []);

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ time: Date.now(), data: data.articles })
      );
    } catch (err) {
      setError("Unable to load news.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- BOOKMARK LOGIC ---------- */
  const toggleSave = (article) => {
    const exists = saved.some((a) => a.url === article.url);

    let updated;
    if (exists) {
      updated = saved.filter((a) => a.url !== article.url);
    } else {
      updated = [...saved, article];
    }

    setSaved(updated);
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));
  };

  const isSaved = (article) =>
    saved.some((a) => a.url === article.url);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchNews(query);
  };

  return (
    <div className="news-page">
      <h1>📰 Daily News</h1>
      <p className="muted">
        Stay updated. Save articles to read later.
      </p>

      {/* SEARCH */}
      <form className="news-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search news…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn primary">Search</button>
      </form>

      {/* CATEGORIES */}
      <div className="news-categories">
        {categories.map((c) => (
          <button
            key={c.value}
            className={`chip ${category === c.value ? "active" : ""}`}
            onClick={() => setCategory(c.value)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading && <p className="muted">Loading news…</p>}
      {error && <p className="error">{error}</p>}

      {/* ARTICLES */}
      <div className="news-list">
        {articles.map((article, index) => (
          <article className="news-card" key={index}>
            <div className="news-header">
              <h3>{article.title}</h3>

              <button
                className={`bookmark ${isSaved(article) ? "saved" : ""}`}
                onClick={() => toggleSave(article)}
                title="Save article"
              >
                ★
              </button>
            </div>

            <p className="news-source">
              {article.source?.name}
            </p>

            <p className="news-desc">
              {article.description || "No description available."}
            </p>

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="news-link"
            >
              Read full article →
            </a>
          </article>
        ))}
      </div>

      {/* SAVED ARTICLES */}
      {saved.length > 0 && (
        <>
          <h2 className="saved-title">⭐ Saved Articles</h2>
          <div className="news-list">
            {saved.map((article, index) => (
              <article className="news-card saved" key={index}>
                <h3>{article.title}</h3>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-link"
                >
                  Open →
                </a>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


