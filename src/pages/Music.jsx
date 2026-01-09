import { useEffect, useState } from "react";

const FAVORITES_KEY = "optima_music_favorites";

/* ---------- PRESET PLAYLISTS ---------- */
const PLAYLISTS = [
  {
    id: "lofi",
    title: "Lofi Beats",
    description: "Chill beats to study and relax",
    embed:
      "https://open.spotify.com/embed/playlist/37i9dQZF1DXdxcBWuJkbcy",
  },
  {
    id: "classical",
    title: "Classical Focus",
    description: "Timeless classical music for deep concentration",
    embed:
      "https://open.spotify.com/embed/playlist/37i9dQZF1DWWEJlAGA9gs0",
  },
  {
    id: "deep",
    title: "Deep Focus",
    description: "Minimal, instrumental focus music",
    embed:
      "https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ",
  },
  {
    id: "coding",
    title: "Coding Mode",
    description: "Electronic & ambient for coding sessions",
    embed:
      "https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS",
  },
];

export default function Music() {
  const [favorites, setFavorites] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);

  /* ---------- LOAD FAVORITES ---------- */
  useEffect(() => {
    setFavorites(
      JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []
    );
  }, []);

  /* ---------- SAVE FAVORITES ---------- */
  useEffect(() => {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites)
    );
  }, [favorites]);

  const toggleFavorite = (playlist) => {
    const exists = favorites.some((p) => p.id === playlist.id);

    setFavorites(
      exists
        ? favorites.filter((p) => p.id !== playlist.id)
        : [...favorites, playlist]
    );
  };

  const isFavorite = (playlist) =>
    favorites.some((p) => p.id === playlist.id);

  return (
    <div className="music-page">
      <h1>🎧 Music</h1>
      <p className="muted">
        Focus-enhancing playlists powered by Spotify.
      </p>

      {/* NOW PLAYING */}
      {nowPlaying && (
        <div className="now-playing">
          <span>▶ Now Playing</span>
          <strong>{nowPlaying.title}</strong>
        </div>
      )}

      {/* FAVORITES */}
      {favorites.length > 0 && (
        <>
          <h2 className="section-title">⭐ Favorites</h2>
          <div className="playlist-grid">
            {favorites.map((playlist) => (
              <div className="playlist-card" key={playlist.id}>
                <h3>{playlist.title}</h3>
                <p className="muted">{playlist.description}</p>

                <iframe
                  src={playlist.embed}
                  allow="encrypted-media"
                  loading="lazy"
                />

                <div className="playlist-actions">
                  <button
                    className="btn ghost"
                    onClick={() => setNowPlaying(playlist)}
                  >
                    Play
                  </button>

                  <button
                    className="btn reset"
                    onClick={() => toggleFavorite(playlist)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PLAYLISTS */}
      <h2 className="section-title">🎶 Focus Playlists</h2>

      <div className="playlist-grid">
        {PLAYLISTS.map((playlist) => (
          <div className="playlist-card" key={playlist.id}>
            <h3>{playlist.title}</h3>
            <p className="muted">{playlist.description}</p>

            <iframe
              src={playlist.embed}
              allow="encrypted-media"
              loading="lazy"
            />

            <div className="playlist-actions">
              <button
                className="btn primary"
                onClick={() => setNowPlaying(playlist)}
              >
                Play
              </button>

              <button
                className={`btn ghost ${
                  isFavorite(playlist) ? "saved" : ""
                }`}
                onClick={() => toggleFavorite(playlist)}
              >
                {isFavorite(playlist) ? "★ Saved" : "☆ Save"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

