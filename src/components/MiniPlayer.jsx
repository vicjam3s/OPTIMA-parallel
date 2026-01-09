import { useNavigate } from "react-router-dom";
import { useMusic } from "../context/MusicContext";

export default function MiniPlayer() {
  const { nowPlaying, playing, pause, stop } = useMusic();
  const navigate = useNavigate();

  if (!nowPlaying) return null;

  return (
    <div className="global-mini-player">
      <div className="mini-left">
        <span className="mini-icon">🎧</span>
        <div className="mini-text">
          <span className="mini-label">Now Playing</span>
          <strong className="mini-title">{nowPlaying.title}</strong>
        </div>
      </div>

      <div className="mini-controls">
        <button
          className="mini-btn"
          title={playing ? "Pause (UI)" : "Resume (UI)"}
          onClick={pause}
        >
          {playing ? "⏸" : "▶"}
        </button>

        <button
          className="mini-btn danger"
          title="Stop"
          onClick={stop}
        >
          ✖
        </button>

        <button
          className="mini-btn ghost"
          title="Open Music"
          onClick={() => navigate("/music")}
        >
          ↗
        </button>
      </div>
    </div>
  );
}

