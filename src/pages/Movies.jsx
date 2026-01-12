import { useEffect, useState, useMemo } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import MovieModal from "../components/MovieModal";

const TMDB_IMG = "https://image.tmdb.org/t/p/w500";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function Movies() {
  const { user } = useAuth();

  /* ---------------- STATE ---------------- */
  const [suggested, setSuggested] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState(null);

  /* ---------------- LOAD FAVOURITES (USER-SCOPED) ---------------- */
  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "favourites");

    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.docs.map((d) => d.data());
      setFavourites(data);
    });

    return () => unsub();
  }, [user]);

  /* ---------------- FETCH TRENDING ---------------- */
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`
        );

        if (!res.ok) throw new Error("Trending failed");

        const data = await res.json();

        setSuggested(
          data.results.filter(
            (i) =>
              (i.media_type === "movie" || i.media_type === "tv") &&
              i.poster_path
          )
        );
      } catch (err) {
        console.error("Trending error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

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
        )}&include_adult=false&api_key=${API_KEY}`
      );

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();

      setSearchResults(
        data.results.filter(
          (i) =>
            (i.media_type === "movie" || i.media_type === "tv") &&
            i.poster_path
        )
      );
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearching(false);
    }
  };

  /* ---------------- FAVOURITES (FIRESTORE) ---------------- */
  const toggleFavourite = async (item) => {
    if (!user) return;

    const favRef = doc(
      db,
      "users",
      user.uid,
      "favourites",
      `${item.id}-${item.media_type}`
    );

    const exists = favourites.some(
      (f) => f.id === item.id && f.media_type === item.media_type
    );

    if (exists) {
      await deleteDoc(favRef);
    } else {
      await setDoc(favRef, item);
    }
  };

  const isFavourite = (item) =>
    favourites.some(
      (f) => f.id === item.id && f.media_type === item.media_type
    );

  /* ---------------- SORT TRENDING (FAVS FIRST) ---------------- */
  const sortedTrending = useMemo(() => {
    const favIds = new Set(
      favourites.map((f) => `${f.id}-${f.media_type}`)
    );

    return [...suggested].sort((a, b) => {
      const aFav = favIds.has(`${a.id}-${a.media_type}`);
      const bFav = favIds.has(`${b.id}-${b.media_type}`);
      return bFav - aFav;
    });
  }, [suggested, favourites]);

  /* ---------------- UI ---------------- */
  return (
    <section className="movies-page">
      <h1>🎬 Movies & Series</h1>

      {/* SEARCH */}
      <form className="movie-search" onSubmit={searchTMDB}>
        <input
          placeholder="Search movies or series…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn primary">
          {searching ? "Searching…" : "Search"}
        </button>
      </form>

      {/* SEARCH RESULTS */}
      {searchResults.length > 0 && (
        <>
          <h2 className="section-title">🔍 Results</h2>
          <div className="movie-grid">
            {searchResults.map((item) => (
              <MovieCard
                key={`search-${item.id}`}
                item={item}
                isFavourite={isFavourite(item)}
                onFavourite={() => toggleFavourite(item)}
                onClick={() => setSelected(item)}
              />
            ))}
          </div>
        </>
      )}

      {/* FAVOURITES */}
      {favourites.length > 0 && (
        <>
          <h2 className="section-title">⭐ Your Favourites</h2>
          <div className="movie-grid">
            {favourites.map((item) => (
              <MovieCard
                key={`fav-${item.id}`}
                item={item}
                isFavourite
                onFavourite={() => toggleFavourite(item)}
                onClick={() => setSelected(item)}
              />
            ))}
          </div>
        </>
      )}

      {/* TRENDING */}
      <h2 className="section-title">🔥 Trending</h2>
      {loading && <p className="muted">Loading…</p>}

      <div className="movie-grid">
        {sortedTrending.map((item) => (
          <MovieCard
            key={`trend-${item.id}`}
            item={item}
            isFavourite={isFavourite(item)}
            onFavourite={() => toggleFavourite(item)}
            onClick={() => setSelected(item)}
          />
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <MovieModal item={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}

/* ---------------- CARD ---------------- */

function MovieCard({ item, onClick, onFavourite, isFavourite }) {
  return (
    <div className="movie-card" onClick={onClick}>
      <div className="poster-wrapper">
        <img
          src={`${TMDB_IMG}${item.poster_path}`}
          alt={item.title || item.name}
        />

        {isFavourite && <span className="fav-badge">★</span>}
      </div>

      <div className="movie-info">
        <h3>{item.title || item.name}</h3>

        <button
          className={`watchlist-btn ${isFavourite ? "saved" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onFavourite();
          }}
        >
          {isFavourite ? "★ Favourite" : "☆ Favourite"}
        </button>
      </div>
    </div>
  );
}
