import { useEffect, useMemo, useRef, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

const SAVE_DELAY = 500; // debounce ms

export default function Notes() {
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [lastSaved, setLastSaved] = useState("");

  const saveTimeout = useRef(null);

  /* ---------- REALTIME LOAD ---------- */
  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "notes");

    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setNotes(data);
      if (!activeId && data.length > 0) {
        setActiveId(data[0].id);
      }
    });

    return () => unsub();
  }, [user]);

  /* ---------- CREATE ---------- */
  const createNote = async () => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "notes");

    const docRef = await addDoc(ref, {
      title: "Untitled note",
      content: "",
      pinned: false,
      updatedAt: serverTimestamp(),
    });

    setActiveId(docRef.id);
  };

  /* ---------- DELETE ---------- */
  const deleteNoteById = async (id) => {
    if (!user) return;
    if (!window.confirm("Delete this note?")) return;

    await deleteDoc(doc(db, "users", user.uid, "notes", id));
    if (id === activeId) setActiveId(null);
  };

  /* ---------- UPDATE (DEBOUNCED) ---------- */
  const updateNote = (fields) => {
    if (!user || !activeId) return;

    clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(async () => {
      await updateDoc(
        doc(db, "users", user.uid, "notes", activeId),
        {
          ...fields,
          updatedAt: serverTimestamp(),
        }
      );

      setLastSaved("Saved");
      setTimeout(() => setLastSaved(""), 1200);
    }, SAVE_DELAY);
  };

  /* ---------- PIN ---------- */
  const togglePin = async (id, pinned) => {
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid, "notes", id), {
      pinned: !pinned,
      updatedAt: serverTimestamp(),
    });
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
          ? (b.updatedAt?.seconds || 0) -
            (a.updatedAt?.seconds || 0)
          : b.pinned - a.pinned
      );
  }, [notes, search]);

  return (
    <div className="notes-page">
      <h1>📝 Notes</h1>
      <p className="muted">Autosaved to your account.</p>

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
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePin(note.id, note.pinned);
                    }}
                  >
                    {note.pinned ? "📌" : "📍"}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNoteById(note.id);
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
                  {lastSaved || "Autosaving…"}
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




