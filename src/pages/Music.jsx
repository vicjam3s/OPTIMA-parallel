import { useEffect, useState } from "react";
import { useMusic } from "../context/MusicContext";

const FAVORITES_KEY = "optima_music_favorites";
const CUSTOM_KEY = "optima_music_custom";

/* ---------- DEFAULT PLAYLISTS ---------- */
const DEFAULT_PLAYLISTS = [
  {
    id: "focus-lofi",
    title: "Lofi Focus",
    description: "Chill beats for focus sessions",
    embed:
      "https://open.spotify.com/embed/playlist/37i9dQZF1DXdxcBWuJkbcy",
    focus: true,
  },
  {
    id: "deep-focus",
    title: "Deep Focus",
    description: "Minimal instrumental concentration",
    embed:
      "https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ",
    focus: true,
  },
];

export default function Music() {
  const [favorites, setFavorites] = useState([]);
  const [customPlaylists, setCustomPlaylists] = useState([]);
  const [customUrl, setCustomUrl] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const { play, nowPlaying } = useMusic();

  /* ---------- HYDRATE FROM STORAGE ---------- */
  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem(FAVORITES_KEY));
      if (Array.isArray(favs)) setFavorites(favs);

      const customs = JSON.parse(localStorage.getItem(CUSTOM_KEY));
      if (Array.isArray(customs)) setCustomPlaylists(customs);
    } catch {
      console.warn("Music storage corrupted");
    } finally {
      setHydrated(true);
    }
  }, []);

  /* ---------- SAVE (ONLY AFTER HYDRATION) ---------- */
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites)
    );
  }, [favorites, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      CUSTOM_KEY,
      JSON.stringify(customPlaylists)
    );
  }, [customPlaylists, hydrated]);

  /* ---------- FAVORITES ---------- */
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

  /* ---------- CUSTOM PLAYLIST ---------- */
  const addCustomPlaylist = () => {
    if (!customUrl.includes("spotify.com")) return;

    const embedUrl = customUrl.replace(
      "open.spotify.com",
      "open.spotify.com/embed"
    );

    const newPlaylist = {
      id: Date.now(),
      title: "Custom Playlist",
      description: "Added by you",
      embed: embedUrl,
    };

    setCustomPlaylists((prev) => [newPlaylist, ...prev]);
    setCustomUrl("");
  };

  /* ---------- FOCUS SYNC ---------- */
  const startFocusMusic = () => {
    const focusPlaylist =
      DEFAULT_PLAYLISTS.find((p) => p.focus) || null;

    if (focusPlaylist) play(focusPlaylist);
  };

  return (
    <div className="music-page">
      <h1>🎧 Music</h1>
      <p className="muted">
        Focus-enhancing playlists powered by Spotify.
      </p>

      {nowPlaying && (
        <div className="mini-player">
          <span>🎶 Now Playing</span>
          <strong>{nowPlaying.title}</strong>
        </div>
      )}

      <button
        className="btn primary"
        onClick={startFocusMusic}
        style={{ marginBottom: "1rem" }}
      >
        ▶ Start Focus Music
      </button>

      <div className="custom-playlist">
        <input
          placeholder="Paste Spotify playlist URL"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
        />
        <button className="btn ghost" onClick={addCustomPlaylist}>
          Add
        </button>
      </div>

      {favorites.length > 0 && (
        <>
          <h2 className="section-title">⭐ Favorites</h2>
          <div className="playlist-grid">
            {favorites.map((p) => (
              <PlaylistCard
                key={p.id}
                playlist={p}
                onPlay={play}
                onRemove={() => toggleFavorite(p)}
              />
            ))}
          </div>
        </>
      )}

      <h2 className="section-title">🎶 Focus Playlists</h2>
      <div className="playlist-grid">
        {DEFAULT_PLAYLISTS.map((p) => (
          <PlaylistCard
            key={p.id}
            playlist={p}
            onPlay={play}
            onSave={() => toggleFavorite(p)}
            saved={isFavorite(p)}
          />
        ))}
      </div>

      {customPlaylists.length > 0 && (
        <>
          <h2 className="section-title">➕ Your Playlists</h2>
          <div className="playlist-grid">
            {customPlaylists.map((p) => (
              <PlaylistCard
                key={p.id}
                playlist={p}
                onPlay={play}
                onSave={() => toggleFavorite(p)}
                saved={isFavorite(p)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- CARD ---------- */

function PlaylistCard({ playlist, onPlay, onSave, onRemove, saved }) {
  return (
    <div className="playlist-card">
      <h3>{playlist.title}</h3>
      <p className="muted">{playlist.description}</p>

      <iframe src={playlist.embed} allow="encrypted-media" />

      <div className="playlist-actions">
        <button
          className="btn primary"
          onClick={() => onPlay(playlist)}
        >
          Play
        </button>

        {onSave && (
          <button className="btn ghost" onClick={onSave}>
            {saved ? "★ Saved" : "☆ Save"}
          </button>
        )}

        {onRemove && (
          <button className="btn reset" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
}





