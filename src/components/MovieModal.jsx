import { useEffect, useState } from "react";

const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

export default function MovieModal({ item, onClose, onWatch }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [providers, setProviders] = useState([]);

  const isMovie = item.media_type === "movie";
  const type = isMovie ? "movie" : "tv";

  

  /* ---------- FETCH TRAILER ---------- */
  useEffect(() => {
    const fetchTrailer = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/${type}/${item.id}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
      );
      const data = await res.json();

      const trailer = data.results?.find(
        (v) => v.site === "YouTube" && v.type === "Trailer"
      );

      setTrailerKey(trailer?.key || null);
    };

    fetchTrailer();
  }, [item, type]);

  /* ---------- FETCH WATCH PROVIDERS (KENYA) ---------- */
  useEffect(() => {
    const fetchProviders = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/${type}/${item.id}/watch/providers?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
      );
      const data = await res.json();

      setProviders(data.results?.KE?.flatrate || []);
    };

    fetchProviders();
  }, [item, type]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {item.poster_path && (
          <img
            src={`${TMDB_IMG}${item.poster_path}`}
            alt={item.title || item.name}
          />
        )}

        <div className="modal-content">
          <h2>{item.title || item.name}</h2>

          <p className="muted">
            ⭐ {item.vote_average?.toFixed(1)} •{" "}
            {isMovie ? "Movie" : "TV Series"} •{" "}
            {(item.release_date || item.first_air_date || "").slice(0, 4)}
          </p>

          <p className="modal-overview">
            {item.overview || "No description available."}
          </p>

          {/* TRAILER */}
          {trailerKey && (
            <div className="trailer">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Trailer"
                allowFullScreen
              />
            </div>
          )}
          

          {/* WHERE TO WATCH */}
          <div className="providers">
            <h4>Where to Watch</h4>

            {providers.length > 0 ? (
              <div className="provider-list">
                {providers.map((p) => (
                  <div key={p.provider_id} className="provider">
                    <img
                      src={`${TMDB_IMG}${p.logo_path}`}
                      alt={p.provider_name}
                      title={p.provider_name}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">
                No streaming providers available in your region.
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="modal-actions">
            <button
              className="btn btn-primary"
              onClick={() => onWatch(item)}
            >
              ▶ Start Watching
            </button>

            <button className="btn btn-ghost" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

