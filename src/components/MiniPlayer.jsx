import { useMusic } from "../context/MusicContext";
import { useNavigate } from "react-router-dom";

export default function MiniPlayer() {
  const { nowPlaying, playing, pause, resume, stop } = useMusic();
  const navigate = useNavigate();

  if (!nowPlaying) return null;

  return (
    <div className="global-mini-player">
      <div className="mini-left">
        <span>🎧</span>
        <div>
          <small className="muted">Now Playing</small>
          <strong>{nowPlaying.title}</strong>
        </div>
      </div>

      <div className="mini-controls">
        <button
          className="mini-btn"
          onClick={playing ? pause : resume}
          title={playing ? "Pause session" : "Resume session"}
        >
          {playing ? "⏸" : "▶"}
        </button>

        <button
          className="mini-btn"
          onClick={() => navigate("/music")}
          title="Open Music"
        >
          ↗
        </button>

        <button
          className="mini-btn danger"
          onClick={stop}
          title="Stop"
        >
          ✖
        </button>
      </div>
    </div>
  );
}


