import { useEffect, useState } from "react";

const PRESETS = [
  { label: "Pomodoro", minutes: 25 },
  { label: "Short Break", minutes: 5 },
  { label: "Long Break", minutes: 15 },
  { label: "Deep Focus", minutes: 50 },
];

const DEFAULT_TIME = 25 * 60;
const SESSION_KEY = "optima_focus_sessions";

export default function Focus() {
  const [time, setTime] = useState(DEFAULT_TIME);
  const [running, setRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const [sessions, setSessions] = useState([]);

  /* ---------- LOAD SESSION HISTORY ---------- */
  useEffect(() => {
    setSessions(JSON.parse(localStorage.getItem(SESSION_KEY)) || []);
  }, []);

  /* ---------- TIMER ---------- */
  useEffect(() => {
    if (!running) return;

    if (time === 0) {
      setRunning(false);

      // Log session if >= 10 minutes
      const minutes = Math.round(DEFAULT_TIME / 60);
      if (minutes >= 10) {
        const newSession = {
          id: Date.now(),
          duration: Math.round(DEFAULT_TIME / 60),
          completedAt: new Date().toLocaleTimeString(),
        };

        const updated = [newSession, ...sessions];
        setSessions(updated);
        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify(updated)
        );
      }

      return;
    }

    const interval = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running, time]);

  /* ---------- PRESETS ---------- */
  const applyPreset = (minutes) => {
    setRunning(false);
    setTime(minutes * 60);
  };

  /* ---------- CUSTOM ---------- */
  const applyCustomTime = () => {
    const minutes = Number(customMinutes);
    if (!minutes || minutes <= 0 || minutes > 180) return;

    setRunning(false);
    setTime(minutes * 60);
    setCustomMinutes("");
  };

  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <div className="focus-page">
      <h1>⏱ Focus Timer</h1>
      <p className="muted">
        Stay focused and track your progress.
      </p>

      {/* PRESETS */}
      <div className="preset-bar">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className="preset-btn"
            onClick={() => applyPreset(p.minutes)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* CUSTOM */}
      <div className="custom-timer">
        <input
          type="number"
          placeholder="Custom minutes"
          value={customMinutes}
          onChange={(e) => setCustomMinutes(e.target.value)}
        />
        <button className="btn ghost" onClick={applyCustomTime}>
          Set
        </button>
      </div>

      {/* DISPLAY */}
      <div className="timer-display">
        {minutes}:{seconds}
      </div>

      {/* CONTROLS */}
      <div className="timer-controls">
        <button
          className="btn primary"
          onClick={() => setRunning(!running)}
        >
          {running ? "Pause" : "Start"}
        </button>

        <button
          className="btn reset"
          onClick={() => {
            setRunning(false);
            setTime(DEFAULT_TIME);
          }}
        >
          Reset
        </button>
      </div>

      {/* SESSION HISTORY */}
      {sessions.length > 0 && (
        <div className="session-history">
          <h2>📊 Focus Sessions</h2>

          <ul>
            {sessions.map((s) => (
              <li key={s.id}>
                ⏱ {s.duration} min — {s.completedAt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


