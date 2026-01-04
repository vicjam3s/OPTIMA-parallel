import { useEffect, useState } from "react";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/top-headlines?country=ke&pageSize=10&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
        );

        if (!res.ok) throw new Error("Failed to fetch news");

        const data = await res.json();
        setArticles(data.articles || []);
      } catch (err) {
        setError("Unable to load news at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="news-page">
      <h1>📰 Daily News</h1>
      <p className="muted">
        Top headlines from Kenya’s major news outlets.
      </p>

      {loading && <p className="muted">Loading news…</p>}
      {error && <p className="error">{error}</p>}

      <div className="news-list">
        {articles.map((article, index) => (
          <article className="news-card" key={index}>
            <h3>{article.title}</h3>
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
    </div>
  );
}
