import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="settings-page">
      <h1>⚙️ Settings</h1>
      <p className="muted">Manage your OPTIMA experience</p>

      {/* THEME */}
      <section className="settings-section">
        <h2>🌗 Appearance</h2>
        <button className="btn primary" onClick={toggleTheme}>
          Switch to {theme === "dark" ? "Light" : "Dark"} Mode
        </button>
      </section>

      {/* PROFILE */}
      <section className="settings-section">
        <h2>👤 Profile</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Status:</strong> Logged in</p>
      </section>

      {/* FAQ */}
      <section className="settings-section">
        <h2>❓ FAQs</h2>
        <details>
          <summary>What is OPTIMA?</summary>
          <p>
            OPTIMA is a productivity-focused web app designed to help students
            manage studying, entertainment, and daily organization in one place.
          </p>
        </details>

        <details>
          <summary>Does OPTIMA store my data online?</summary>
          <p>
            Currently, OPTIMA stores your data locally in your browser.
            Cloud sync will be added later.
          </p>
        </details>

        <details>
          <summary>Can I use OPTIMA offline?</summary>
          <p>
            Notes and saved content are available offline once loaded.
          </p>
        </details>
      </section>

      {/* ABOUT */}
      <section className="settings-section">
        <h2>ℹ️ About OPTIMA</h2>
        <p>
          OPTIMA is an all-in-one student companion built to reduce friction
          between productivity and balance.
        </p>

        <p>
          The platform combines a focus timer, e-library powered by Open Library,
          Spotify-powered study music, a movie and series discovery hub,
          smart note-taking, and real-time news updates from trusted sources.
        </p>

        <p>
          By integrating tools students already use into one consistent
          interface, OPTIMA removes context switching and helps users stay
          focused longer while still enjoying well-earned breaks.
        </p>

        <p>
          OPTIMA is built with modern web technologies, prioritizing performance,
          accessibility, and a clean user experience.
        </p>
      </section>
    </div>
  );
}