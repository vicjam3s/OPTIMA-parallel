import { useEffect, useState } from "react";

const FAVORITES_KEY = "optima_favorite_books";

export default function Library() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- LOAD FAVORITES ---------------- */

  useEffect(() => {
    setFavorites(
      JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []
    );
  }, []);

  /* ---------------- RANDOM SUGGESTIONS ---------------- */

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          "https://openlibrary.org/search.json?q=fiction"
        );
        const data = await res.json();
        setSuggestions(data.docs.slice(0, 8));
      } catch {
        /* silent */
      }
    };

    fetchSuggestions();
  }, []);

  /* ---------------- SEARCH ---------------- */

  const searchBooks = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setBooks([]);

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setBooks(data.docs.slice(0, 12));
    } catch {
      setError("Failed to load books. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FAVORITES ---------------- */

  const toggleFavorite = (book) => {
    const exists = favorites.some((b) => b.key === book.key);

    const updated = exists
      ? favorites.filter((b) => b.key !== book.key)
      : [
          {
            key: book.key,
            title: book.title,
            author: book.author_name?.[0],
            cover_i: book.cover_i,
            year: book.first_publish_year,
          },
          ...favorites,
        ];

    setFavorites(updated);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  };

  const isFavorite = (book) =>
    favorites.some((b) => b.key === book.key);

  /* ---------------- RENDER BOOK CARD ---------------- */

  const renderBook = (book) => {
    const cover = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      : null;

    return (
      <div
        key={book.key}
        className="book-card"
        style={{
          backgroundImage: cover
            ? `url(${cover})`
            : "linear-gradient(135deg, #020617, #020617)",
        }}
        onClick={() => setSelected(book)}
      >
        <div className="book-overlay">
          <h3>{book.title}</h3>
          <p className="author">
            {book.author_name?.[0] || "Unknown author"}
          </p>
        </div>
      </div>
    );
  };

  /* ======================= UI ======================= */
  const getAvailability = (book) => {
  if (book.public_scan) {
    return { label: "Public Domain", class: "badge-public" };
  }

  if (book.ebook_count_i > 0) {
    return { label: "Borrow / Preview", class: "badge-borrow" };
  }

  return { label: "Metadata Only", class: "badge-locked" };
};


  return (
    <div className="library-page">
      <h1>📚 E-Library</h1>
      <p className="muted">
        Discover, save, and explore books curated for you.
      </p>

      {/* SEARCH */}
      <form className="library-search" onSubmit={searchBooks}>
        <input
          placeholder="Search by title, author, or keyword…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn primary">Search</button>
      </form>

      {/* FAVORITES */}
      {favorites.length > 0 && (
        <>
          <h2 className="section-title">⭐ Favorites</h2>
          <div className="library-grid">
            {favorites.map((book) => renderBook(book))}
          </div>
        </>
      )}

      {/* SUGGESTIONS */}
      {suggestions.length > 0 && (
        <>
          <h2 className="section-title">✨ Recommended Reads</h2>
          <div className="library-grid">
            {suggestions.map((book) => renderBook(book))}
          </div>
        </>
      )}

      {/* SEARCH RESULTS */}
      {loading && <p className="muted">Loading books…</p>}
      {error && <p className="error">{error}</p>}

      {books.length > 0 && (
        <>
          <h2 className="section-title">🔍 Search Results</h2>
          <div className="library-grid">
            {books.map((book) => renderBook(book))}
          </div>
        </>
      )}

      {/* BOOK MODAL */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {selected.cover_i && (
              <img
                src={`https://covers.openlibrary.org/b/id/${selected.cover_i}-L.jpg`}
                alt={selected.title}
              />
            )}

            <div className="modal-content">
              <h2>{selected.title}</h2>
              <p className="muted">
                {selected.author_name?.join(", ") || "Unknown author"}
              </p>

              <p className="muted">
                First published:{" "}
                {selected.first_publish_year || "N/A"}
              </p>

              <div className="modal-actions">
                <button
                  className={`btn ${
                    isFavorite(selected) ? "btn-ghost" : "btn-primary"
                  }`}
                  onClick={() => toggleFavorite(selected)}
                >
                  {isFavorite(selected)
                    ? "Remove from Favorites"
                    : "Add to Favorites"}
                </button>

                <button
                  className="btn btn-ghost"
                  onClick={() => setSelected(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
