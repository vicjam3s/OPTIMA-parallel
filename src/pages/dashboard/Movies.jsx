import { useState } from "react";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w300";

export default function Movies() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
          query
        )}&api_key=${import.meta.env.VITE_TMDB_API_KEY}`
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      // filter to movies & tv only
      const filtered = data.results.filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
      );

      setResults(filtered.slice(0, 12));
    } catch (err) {
      setError("Could not load results. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="movies-page">
      <h1>🎬 Movies & Series</h1>
      <p className="muted">
        Search movies and TV shows powered by TMDB.
      </p>

      <form className="movies-search" onSubmit={search}>
        <input
          type="text"
          placeholder="Search for a movie or series..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn primary">Search</button>
      </form>

      {loading && <p className="muted">Loading results…</p>}
      {error && <p className="error">{error}</p>}

      <div className="movies-grid">
        {results.map((item) => (
          <div className="movie-card" key={item.id}>
            {item.poster_path ? (
              <img
                src={`${IMAGE_BASE}${item.poster_path}`}
                alt={item.title || item.name}
              />
            ) : (
              <div className="poster-placeholder">No Image</div>
            )}

            <div className="movie-info">
              <h3>{item.title || item.name}</h3>
              <p className="muted">
                {(item.release_date || item.first_air_date || "")
                  .slice(0, 4) || "Year N/A"}
              </p>
              <p className="rating">⭐ {item.vote_average?.toFixed(1)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
