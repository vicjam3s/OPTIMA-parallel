export default function Landing() {
  return (
    <section className="landing">
      <div className="hero">
        <h1>OPTIMA</h1>
        <p>
          A smart productivity platform designed to help students
          study better, stay focused, and stay informed.
        </p>

        <div className="hero-actions">
          <a href="/signup" className="btn primary">Get Started</a>
          <a href="/login" className="btn secondary">Login</a>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">📚 E-Library</div>
        <div className="feature-card">🎧 Study Music</div>
        <div className="feature-card">⏱ Focus Timer</div>
        <div className="feature-card">🎬 Movies & Series</div>
        <div className="feature-card">🗓 Calendar & Tasks</div>
        <div className="feature-card">📰 Daily News</div>
        <div className="feature-card">📝 Notes</div>
      </div>
    </section>
  );
}

