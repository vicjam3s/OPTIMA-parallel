import { useState } from "react";
import { useMusic } from "../context/MusicContext";
import usePersistentState from "../hooks/usePersistentState";

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
  const { nowPlaying } = useMusic();

  const [favorites, setFavorites] = usePersistentState(
    FAVORITES_KEY,
    []
  );
  const [customPlaylists, setCustomPlaylists] =
    usePersistentState(CUSTOM_KEY, []);

  const [customUrl, setCustomUrl] = useState("");

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
  const addCustomPlaylist = async () => {
  if (!customUrl.includes("spotify.com")) return;

  const embedUrl = customUrl.replace(
    "open.spotify.com",
    "open.spotify.com/embed"
  );

  let title = "Custom Playlist";

  try {
    const res = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(
        customUrl
      )}`
    );
    const data = await res.json();
    if (data?.title) title = data.title;
  } catch {
    console.warn("Failed to fetch playlist title");
  }

  const newPlaylist = {
    id: Date.now(),
    title,
    description: "Added by you",
    embed: embedUrl,
  };

  setCustomPlaylists((prev) => [newPlaylist, ...prev]);
  setCustomUrl("");
};


  const removeCustomPlaylist = (id) => {
    setCustomPlaylists((prev) =>
      prev.filter((p) => p.id !== id)
    );
  };

  return (
    <div className="music-page">
      <h1>🎧 Music</h1>
      <p className="muted">
        Focus-enhancing playlists powered by Spotify.
      </p>

      {/* MINI PLAYER INDICATOR */}
      {nowPlaying && (
        <div className="mini-player">
          <span>🎶 Now Playing</span>
          <strong>{nowPlaying.title}</strong>
        </div>
      )}

      {/* ADD CUSTOM */}
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

      {/* FAVORITES */}
      {favorites.length > 0 && (
        <>
          <h2 className="section-title">⭐ Favorites</h2>
          <div className="playlist-grid">
            {favorites.map((p) => (
              <PlaylistCard
                key={p.id}
                playlist={p}
                onRemove={() => toggleFavorite(p)}
              />
            ))}
          </div>
        </>
      )}

      {/* DEFAULT */}
      <h2 className="section-title">🎶 Focus Playlists</h2>
      <div className="playlist-grid">
        {DEFAULT_PLAYLISTS.map((p) => (
          <PlaylistCard
            key={p.id}
            playlist={p}
            onSave={() => toggleFavorite(p)}
            saved={isFavorite(p)}
          />
        ))}
      </div>

      {/* CUSTOM */}
      {customPlaylists.length > 0 && (
        <>
          <h2 className="section-title">➕ Your Playlists</h2>
          <div className="playlist-grid">
            {customPlaylists.map((p) => (
              <PlaylistCard
                key={p.id}
                playlist={p}
                onSave={() => toggleFavorite(p)}
                onRemove={() => removeCustomPlaylist(p.id)}
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

function PlaylistCard({ playlist, onSave, onRemove, saved }) {
  const { play, nowPlaying, playing } = useMusic();

  const isCurrent = nowPlaying?.id === playlist.id;

  return (
    <div className="playlist-card">
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
          onClick={() => play(playlist)}
        >
          {isCurrent && playing ? "Playing" : "Play"}
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
