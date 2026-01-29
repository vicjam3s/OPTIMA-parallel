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

const IDLE_SAVE_DELAY = 4000; // 4s after typing stops
const IDLE_CHECK_INTERVAL = 500;

export default function Notes() {
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [lastSaved, setLastSaved] = useState("");

  // LOCAL EDITOR STATE (NO LAG)
  const [localTitle, setLocalTitle] = useState("");
  const [localContent, setLocalContent] = useState("");

  // REFS FOR IDLE SAVE
  const lastEditRef = useRef(0);
  const isDirtyRef = useRef(false);
  const idleSaveTimeout = useRef(null);
  const checkIdleRef = useRef(null);

  /* ---------- REALTIME LOAD ---------- */
  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "notes");

    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setNotes((prevNotes) => {
        // Only update if the data actually changed
        if (JSON.stringify(prevNotes) === JSON.stringify(data)) {
          return prevNotes;
        }
        return data;
      });

      if (!activeId && data.length) {
        setActiveId(data[0].id);
      }
    });

    return () => unsub();
  }, [user, activeId]);

  /* ---------- SYNC ACTIVE NOTE TO LOCAL ---------- */
  useEffect(() => {
    const note = notes.find((n) => n.id === activeId);
    if (!note) return;

    setLocalTitle(note.title || "");
    setLocalContent(note.content || "");

    isDirtyRef.current = false;
  }, [activeId, notes]);

  /* ---------- IDLE SAVE LOGIC ---------- */
  useEffect(() => {
    const checkIdle = async () => {
      const elapsed = Date.now() - lastEditRef.current;

      if (elapsed < IDLE_SAVE_DELAY) {
        checkIdleRef.current = setTimeout(
          checkIdle,
          IDLE_CHECK_INTERVAL
        );
        return;
      }

      if (isDirtyRef.current && activeId && user) {
        await updateDoc(
          doc(db, "users", user.uid, "notes", activeId),
          {
            title: localTitle,
            content: localContent,
            updatedAt: serverTimestamp(),
          }
        );

        isDirtyRef.current = false;
        setLastSaved("Saved");
        setTimeout(() => setLastSaved(""), 1500);
      }

      checkIdleRef.current = null;
    };

    checkIdleRef.current = checkIdle;
  }, [user, activeId, localTitle, localContent]);

  const markDirtyAndScheduleSave = () => {
    if (!user || !activeId) return;

    isDirtyRef.current = true;
    lastEditRef.current = Date.now();

    if (idleSaveTimeout.current) {
      clearTimeout(idleSaveTimeout.current);
    }

    idleSaveTimeout.current = setTimeout(
      () => {
        if (checkIdleRef.current) {
          checkIdleRef.current();
        }
      },
      IDLE_CHECK_INTERVAL
    );
  };

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

  /* ---------- PIN ---------- */
  const togglePin = async (id, pinned) => {
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid, "notes", id), {
      pinned: !pinned,
      updatedAt: serverTimestamp(),
    });
  };

  /* ---------- SEARCH + SORT ---------- */
  const filteredNotes = useMemo(() => {
    const q = search.toLowerCase();

    return notes
      .filter((n) => n.title.toLowerCase().includes(q))
      .sort((a, b) =>
        a.pinned === b.pinned
          ? (b.updatedAt?.seconds || 0) -
            (a.updatedAt?.seconds || 0)
          : b.pinned - a.pinned
      );
  }, [notes, search]);

  //-------------Delete logic-------------
  const deleteActiveNote = async () => {
  if (!activeId) return;

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this note?"
  );
  if (!confirmDelete) return;

  // cancel pending idle save
  if (idleSaveTimeout.current) {
    clearTimeout(idleSaveTimeout.current);
    idleSaveTimeout.current = null;
  }

  isDirtyRef.current = false;

  await deleteDoc(
    doc(db, "users", user.uid, "notes", activeId)
  );

  setActiveId(null);
  setLocalTitle("");
  setLocalContent("");
};


  return (
    <div className="notes-page">
      <h1>📝 Notes</h1>
      <p className="muted">Autosaved after you pause typing.</p>

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
          {activeId ? (
            <>
              <input
                className="notes-title"
                value={localTitle}
                onChange={(e) => {
                  setLocalTitle(e.target.value);
                  markDirtyAndScheduleSave();
                }}
              />

              <textarea
                className="notes-input"
                placeholder="Start writing…"
                value={localContent}
                onChange={(e) => {
                  setLocalContent(e.target.value);
                  markDirtyAndScheduleSave();
                }}
              />

              <div className="notes-footer">
                <span className="muted">
                  {lastSaved || "Idle saving…"}
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





