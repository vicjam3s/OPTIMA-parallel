import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "optima_notes";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [lastSaved, setLastSaved] = useState("");
  const [hydrated, setHydrated] = useState(false);

  /* ---------- HYDRATE NOTES ---------- */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      setHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setNotes(parsed);
        if (parsed.length > 0) setActiveId(parsed[0].id);
      }
    } catch {
      // Legacy plain-text recovery
      const migrated = [
        {
          id: Date.now(),
          title: "Recovered note",
          content: stored,
          pinned: false,
          updatedAt: Date.now(),
        },
      ];

      setNotes(migrated);
      setActiveId(migrated[0].id);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(migrated)
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  /* ---------- SAVE NOTES (AFTER HYDRATION) ---------- */
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));

    if (notes.length > 0) {
      setLastSaved("Saved just now");
      const t = setTimeout(() => setLastSaved(""), 1500);
      return () => clearTimeout(t);
    }
  }, [notes, hydrated]);

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
  };

  /* ---------- DELETE ---------- */
  const deleteNote = (id) => {
    if (!window.confirm("Delete this note?")) return;

    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);

    if (id === activeId && updated.length > 0) {
      setActiveId(updated[0].id);
    }
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
  };

  /* ---------- PIN ---------- */
  const togglePin = (id) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, pinned: !n.pinned } : n
      )
    );
  };

  /* ---------- EXPORT ---------- */
  const exportNote = (note) => {
    const blob = new Blob(
      [`${note.title}\n\n${note.content}`],
      { type: "text/plain" }
    );

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${note.title || "note"}.txt`;
    link.click();
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
      <p className="muted">Your thoughts, organized.</p>

      <div className="notes-layout">
        {/* SIDEBAR */}
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
                <span>{note.title}</span>

                <div className="note-actions">
                  <button
                    title="Pin"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePin(note.id);
                    }}
                  >
                    {note.pinned ? "📌" : "📍"}
                  </button>

                  <button
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                  >
                    🗑
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* EDITOR */}
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
                placeholder="Start writing…"
                value={activeNote.content}
                onChange={(e) =>
                  updateNote({ content: e.target.value })
                }
              />

              <div className="notes-footer">
                <span className="muted">
                  {lastSaved ||
                    `Last edited ${new Date(
                      activeNote.updatedAt
                    ).toLocaleTimeString()}`}
                </span>

                <button
                  className="btn ghost"
                  onClick={() => exportNote(activeNote)}
                >
                  Export
                </button>
              </div>
            </>
          ) : (
            <p className="muted">Create or select a note.</p>
          )}
        </main>
      </div>
    </div>
  );
}


