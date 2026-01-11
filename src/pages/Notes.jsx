import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "optima_notes";
const SAVE_DELAY = 500; // ms debounce

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [lastSaved, setLastSaved] = useState("");

  const hydrated = useRef(false);
const saveTimeout = useRef(null);

/* ---------- LOAD (SAFE HYDRATION) ---------- */
useEffect(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const stored = raw ? JSON.parse(raw) : [];
    setNotes(stored);
    if (stored.length > 0) setActiveId(stored[0].id);
  } catch (err) {
    console.warn("Invalid notes storage, resetting.");
    localStorage.removeItem(STORAGE_KEY);
    setNotes([]);
  } finally {
    hydrated.current = true;
  }
}, []);


  /* ---------- DEBOUNCED AUTOSAVE ---------- */
  useEffect(() => {
  if (!hydrated.current) return;

  clearTimeout(saveTimeout.current);

  saveTimeout.current = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    setLastSaved("Saved");
    setTimeout(() => setLastSaved(""), 1200);
  }, 500);

  return () => clearTimeout(saveTimeout.current);
}, [notes]);

  useEffect(() => {
  return () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  };
}, [notes]);




  /* ---------- FORCE SAVE ON UNMOUNT ---------- */
  useEffect(() => {
    return () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    };
  }, [notes]);

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
  };

  /* ---------- PIN ---------- */
  const togglePin = (id) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, pinned: !n.pinned } : n
      )
    );
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
      <p className="muted">Autosaved as you type.</p>

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
                  <button onClick={(e) => {
                    e.stopPropagation();
                    togglePin(note.id);
                  }}>
                    {note.pinned ? "📌" : "📍"}
                  </button>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}>
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




