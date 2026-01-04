import { useState } from "react";

export default function Library() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setBooks(data.docs.slice(0, 12)); // limit results
    } catch (err) {
      setError("Failed to load books. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="library-page">
      <h1>📚 E-Library</h1>
      <p className="muted">
        Search millions of books from the Open Library.
      </p>

      <form className="library-search" onSubmit={searchBooks}>
        <input
          type="text"
          placeholder="Search by title, author, or keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn primary">Search</button>
      </form>

      {loading && <p className="muted">Loading books…</p>}
      {error && <p className="error">{error}</p>}

      <div className="library-grid">
        {books.map((book, index) => (
          <div className="book-card" key={index}>
            <h3>{book.title}</h3>
            <p className="muted">
              {book.author_name?.join(", ") || "Unknown author"}
            </p>
            <p className="year">
              {book.first_publish_year || "Year N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
