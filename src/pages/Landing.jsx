import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <section className="landing">
      <div className="features">
        <div
          className="feature-card library"
          onClick={() => navigate("/library")}
        >
          <span>📚 E-Library</span>
        </div>

        <div
          className="feature-card music"
          onClick={() => navigate("/music")}
        >
          <span>🎧 Study Music</span>
        </div>

        <div
          className="feature-card focus"
          onClick={() => navigate("/focus")}
        >
          <span>⏱ Focus Timer</span>
        </div>

        <div
          className="feature-card movies"
          onClick={() => navigate("/movies")}
        >
          <span>🎬 Movies & Series</span>
        </div>

        <div
          className="feature-card calendar"
          onClick={() => navigate("/calendar")}
        >
          <span>🗓 Calendar & Tasks</span>
        </div>

        <div
          className="feature-card news"
          onClick={() => navigate("/news")}
        >
          <span>📰 Daily News</span>
        </div>

        <div
          className="feature-card notes"
          onClick={() => navigate("/notes")}
        >
          <span>📝 Notes</span>
        </div>
      </div>
    </section>
  );
}


