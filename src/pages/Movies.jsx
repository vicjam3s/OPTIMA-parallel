
import { useEffect, useState } from "react";
import MovieModal from "../components/MovieModal";

const TMDB_IMG = "https://image.tmdb.org/t/p/w500";
const WATCHLIST_KEY = "optima_watchlist";
const CONTINUE_KEY = "optima_continue_watching";

const PROVIDERS = [
  { id: 8, name: "Netflix", color: "#E50914" },
  { id: 9, name: "Prime Video", color: "#00A8E1" },
  { id: 350, name: "Apple TV", color: "#000000" },
  { id: 337, name: "Disney+", color: "#113CCF" },
];

export default function Movies() {
  const [suggested, setSuggested] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [selected, setSelected] = useState(null);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const [selectedProviders, setSelectedProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD LOCAL DATA ---------------- */

  useEffect(() => {
    setWatchlist(JSON.parse(localStorage.getItem(WATCHLIST_KEY)) || []);
    setContinueWatching(
      JSON.parse(localStorage.getItem(CONTINUE_KEY)) || []
    );
  }, []);

  /* ---------------- PROVIDER FILTER ---------------- */

  const filterByProviders = async (items) => {
    if (selectedProviders.length === 0) return items;

    const results = [];

    for (const item of items) {
      const type = item.media_type === "movie" ? "movie" : "tv";

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${item.id}/watch/providers`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        const providers = data.results?.KE?.flatrate || [];

        if (
          providers.some((p) =>
            selectedProviders.includes(p.provider_id)
          )
        ) {
          results.push(item);
        }
      } catch {
        /* ignore individual failures */
      }
    }

    return results;
  };

  /* ---------------- SEARCH ---------------- */

  const searchTMDB = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setSearchResults([]);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
          query
        )}&include_adult=false`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      const filtered = (data.results || []).filter(
        (i) =>
          (i.media_type === "movie" || i.media_type === "tv") &&
          i.poster_path
      );

      const finalResults =
        selectedProviders.length > 0
          ? await filterByProviders(filtered)
          : filtered;

      setSearchResults(finalResults);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearching(false);
    }
  };

  /* ---------------- SUGGESTIONS (FIXED AUTH) ---------------- */

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          "https://api.themoviedb.org/3/trending/all/week",
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        setSuggested(data.results || []);
      } catch (err) {
        console.error("TMDB error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  /* ---------------- WATCHLIST ---------------- */

  const toggleWatchlist = (item) => {
    const exists = watchlist.some(
      (m) => m.id === item.id && m.media_type === item.media_type
    );

    const updated = exists
      ? watchlist.filter(
          (m) => !(m.id === item.id && m.media_type === item.media_type)
        )
      : [...watchlist, item];

    setWatchlist(updated);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  };

  const isSaved = (item) =>
    watchlist.some(
      (m) => m.id === item.id && m.media_type === item.media_type
    );

  /* ---------------- CONTINUE WATCHING ---------------- */

  const startWatching = (item) => {
    if (
      continueWatching.some(
        (m) => m.id === item.id && m.media_type === item.media_type
      )
    )
      return;

    const updated = [{ ...item, progress: 5 }, ...continueWatching];
    setContinueWatching(updated);
    localStorage.setItem(CONTINUE_KEY, JSON.stringify(updated));
  };

  const toggleProvider = (id) => {
    setSelectedProviders((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  /* ======================= UI ======================= */

  return (
    <section className="movies-page">
      <h1>🎬 Movies & Series</h1>

      {/* SEARCH */}
      <form className="movie-search" onSubmit={searchTMDB}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies or series…"
        />
        <button className="btn btn-primary" type="submit">
          {searching ? "Searching…" : "Search"}
        </button>
      </form>

      {/* PROVIDER PILLS */}
      <div className="provider-pills">
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            className={`provider-pill ${
              selectedProviders.includes(p.id) ? "active" : ""
            }`}
            style={{
              borderColor: p.color,
              background: selectedProviders.includes(p.id)
                ? p.color
                : "transparent",
            }}
            onClick={() => toggleProvider(p.id)}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* SEARCH RESULTS */}
      {searchResults.length > 0 ? (
        <>
          <h2 className="section-title">🔍 Search Results</h2>
          <div className="movie-grid">
            {searchResults.map((item) => (
              <div
                key={`${item.id}-${item.media_type}`}
                className="movie-card"
                onClick={() => setSelected(item)}
              >
                <img
                  src={`${TMDB_IMG}${item.poster_path}`}
                  alt={item.title || item.name}
                />
                <div className="movie-info">
                  <h3>{item.title || item.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        !searching &&
        query && (
          <p className="muted">No results found for your search.</p>
        )
      )}

      {/* SUGGESTIONS */}
      <h2 className="section-title">🔥 Suggested for You</h2>
      {loading && <p className="muted">Loading…</p>}

      <div className="movie-grid">
        {suggested.map((item) => (
          <div
            key={`${item.id}-${item.media_type}`}
            className="movie-card"
            onClick={() => setSelected(item)}
          >
            {item.poster_path && (
              <img
                src={`${TMDB_IMG}${item.poster_path}`}
                alt={item.title || item.name}
              />
            )}
            <div className="movie-info">
              <h3>{item.title || item.name}</h3>
              <button
                className={`watchlist-btn ${
                  isSaved(item) ? "saved" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWatchlist(item);
                }}
              >
                {isSaved(item) ? "★ Watchlisted" : "☆ Add to Watchlist"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <MovieModal
          item={selected}
          onClose={() => setSelected(null)}
          onWatch={startWatching}
        />
      )}
    </section>
  );
}
