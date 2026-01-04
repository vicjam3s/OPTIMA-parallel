import { useEffect, useState } from "react";

export default function Notes() {
  const [note, setNote] = useState("");

  // Load saved note on first render
  useEffect(() => {
    const savedNote = localStorage.getItem("optima_notes");
    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  // Save note whenever it changes
  useEffect(() => {
    localStorage.setItem("optima_notes", note);
  }, [note]);

  return (
    <div className="notes-page">
      <h1>📝 Notes</h1>
      <p className="muted">
        Your notes are saved automatically on this device.
      </p>

      <textarea
        className="notes-input"
        placeholder="Start typing your notes here..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </div>
  );
}
