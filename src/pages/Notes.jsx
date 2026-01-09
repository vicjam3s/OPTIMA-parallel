import { useMemo, useState } from "react";
import usePersistentState from "../hooks/usePersistentState";

const STORAGE_KEY = "optima_notes";

export default function Notes() {
  const [notes, setNotes] = usePersistentState(
    STORAGE_KEY,
    [],
    (legacy) => [
      {
        id: Date.now(),
        title: "Recovered note",
        content: legacy,
        pinned: false,
        updatedAt: Date.now(),
      },
    ]
  );

  const [activeId, setActiveId] = useState(notes[0]?.id || null);
  const [search, setSearch] = useState("");
  const [lastSaved, setLastSaved] = useState("");

  /* ---------- CREATE ---------- */
  const createNote = () => {
    const newNote = {
      id: Date.now(),
      title: "Untitled note",
      content: "",
      pinned: false,
      updatedAt: Date.now(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setActiveId(newNote.id);
    setLastSaved("Saved just now");
  };

  /* ---------- DELETE ---------- */
  const deleteNote = (id) => {
    if (!window.confirm("Delete this note?")) return;

    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (id === activeId) setActiveId(null);
  };

  /* ---------- UPDATE ---------- */
  const updateNote = (fields) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeId
          ? { ...n, ...fields, updatedAt: Date.now() }
          : n
      )
    );
    setLastSaved("Saved just now");
  };

  const activeNote = notes.find((n) => n.id === activeId);

  /* ---------- SEARCH + SORT ---------- */
  const filteredNotes = useMemo(() => {
    return notes
      .filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.content.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) =>
        a.pinned === b.pinned
          ? b.updatedAt - a.updatedAt
          : b.pinned - a.pinned
      );
  }, [notes, search]);

  return (
    <div className="notes-page">
      <h1>📝 Notes</h1>

      <div className="notes-layout">
        <aside className="notes-sidebar">
          <button className="btn primary full" onClick={createNote}>
            + New Note
          </button>

          <input
            className="notes-search"
            placeholder="Search notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <ul className="notes-list">
            {filteredNotes.map((note) => (
              <li
                key={note.id}
                className={note.id === activeId ? "active" : ""}
                onClick={() => setActiveId(note.id)}
              >
                {note.title}
              </li>
            ))}
          </ul>
        </aside>

        <main className="notes-editor">
          {activeNote ? (
            <>
              <input
                className="notes-title"
                value={activeNote.title}
                onChange={(e) =>
                  updateNote({ title: e.target.value })
                }
              />

              <textarea
                className="notes-input"
                value={activeNote.content}
                onChange={(e) =>
                  updateNote({ content: e.target.value })
                }
              />

              <span className="muted">{lastSaved}</span>
            </>
          ) : (
            <p className="muted">Create or select a note.</p>
          )}
        </main>
      </div>
    </div>
  );
}



