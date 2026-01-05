import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <section className="landing">
      {/* hero stays the same */}

      <div className="features">
        <div
          className="feature-card library"
          onClick={() => navigate("/dashboard/library")}
        >
          <span>📚 E-Library</span>
        </div>

        <div
          className="feature-card music"
          onClick={() => navigate("/dashboard/music")}
        >
          <span>🎧 Study Music</span>
        </div>

        <div
          className="feature-card focus"
          onClick={() => navigate("/dashboard/focus")}
        >
          <span>⏱ Focus Timer</span>
        </div>

        <div
          className="feature-card movies"
          onClick={() => navigate("/dashboard/movies")}
        >
          <span>🎬 Movies & Series</span>
        </div>

        <div
          className="feature-card calendar"
          onClick={() => navigate("/dashboard/calendar")}
        >
          <span>🗓 Calendar & Tasks</span>
        </div>

        <div
          className="feature-card news"
          onClick={() => navigate("/dashboard/news")}
        >
          <span>📰 Daily News</span>
        </div>

        <div
          className="feature-card notes"
          onClick={() => navigate("/dashboard/notes")}
        >
          <span>📝 Notes</span>
        </div>
      </div>
    </section>
  );
}


