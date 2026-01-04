export default function Music() {
  return (
    <div className="music-page">
      <h1>🎧 Study Music</h1>
      <p className="muted">
        Focus-enhancing playlists powered by Spotify.
      </p>

      <div className="playlist-grid">
        <iframe
          title="Deep Focus"
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ"
          allow="encrypted-media"
        ></iframe>

        <iframe
          title="Lo-Fi Beats"
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DXdxcBWuJkbcy"
          allow="encrypted-media"
        ></iframe>

        <iframe
          title="Peaceful Piano"
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO"
          allow="encrypted-media"
        ></iframe>
      </div>
    </div>
  );
}
