import { useEffect, useRef, useState } from "react";

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

/* ================= LAZY CARD ================= */

function LazyNewsCard({ article, children, className }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setLoaded(true),
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className={className}
      style={{
        backgroundImage:
          loaded && article.image
            ? `url(${article.image})`
            : "linear-gradient(135deg, #020617, #020617)",
      }}
    >
      {children}
    </article>
  );
}

/* ================= MAIN ================= */

export default function News() {
  const [articles, setArticles] = useState([]);
  const [saved, setSaved] = useState([]);
  const [category, setCategory] = useState("general");
  const [query, setQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- LOAD SAVED ---------- */
  useEffect(() => {
    setSaved(JSON.parse(localStorage.getItem(BOOKMARK_KEY)) || []);
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
    // eslint-disable-next-line
  }, [category]);

  const fetchNews = async (search = "") => {
    setLoading(true);
    setError("");

    try {
      const url = search
        ? `https://gnews.io/api/v4/search?q=${encodeURIComponent(
            search
          )}&country=ke&max=10&token=${import.meta.env.VITE_GNEWS_API_KEY}`
        : `https://gnews.io/api/v4/top-headlines?country=ke&topic=${category}&max=10&token=${import.meta.env.VITE_GNEWS_API_KEY}`;

      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error();

      setArticles(data.articles || []);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ time: Date.now(), data: data.articles })
      );
    } catch {
      setError("Unable to load news.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (article) => {
    const exists = saved.some((a) => a.url === article.url);
    const updated = exists
      ? saved.filter((a) => a.url !== article.url)
      : [...saved, article];

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
          <LazyNewsCard
            key={index}
            article={article}
            className="news-card"
          >
            <div className="news-overlay">
              <div className="news-header">
                <span className="news-source">
                  {article.source?.name || "News"}
                </span>

                <button
                  className={`bookmark ${
                    isSaved(article) ? "saved" : ""
                  }`}
                  onClick={() => toggleSave(article)}
                >
                  ★
                </button>
              </div>

              <h3>{article.title}</h3>

              {article.description && (
                <p className="news-desc">{article.description}</p>
              )}

              <div className="news-actions">
                <button
                  className="news-link"
                  onClick={() => setSelectedArticle(article)}
                >
                  Read in OPTIMA →
                </button>

                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-link"
                >
                  Open source →
                </a>
              </div>
            </div>
          </LazyNewsCard>
        ))}
      </div>

      {/* READING MODE */}
      {selectedArticle && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="modal-card reading-mode"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedArticle.title}</h2>
            <p className="muted">
              {selectedArticle.source?.name}
            </p>

            <p className="reading-text">
              {selectedArticle.content ||
                selectedArticle.description ||
                "Full content available on the source website."}
            </p>

            <div className="modal-actions">
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Open original
              </a>

              <button
                className="btn btn-ghost"
                onClick={() => setSelectedArticle(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



