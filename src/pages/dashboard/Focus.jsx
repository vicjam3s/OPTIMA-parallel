import { useEffect, useState } from "react";

const DEFAULT_TIME = 25 * 60; // 25 minutes in seconds

export default function Focus() {
  const [time, setTime] = useState(DEFAULT_TIME);
  const [running, setRunning] = useState(false);

  // Countdown logic
  useEffect(() => {
    if (!running) return;

    if (time === 0) {
      setRunning(false);
      return;
    }

    const interval = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running, time]);

  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <div className="focus-page">
      <h1>⏱ Focus Timer</h1>
      <p className="muted">
        Use focused sessions to improve concentration.
      </p>

      <div className="timer-display">
        {minutes}:{seconds}
      </div>

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
    </div>
  );
}
