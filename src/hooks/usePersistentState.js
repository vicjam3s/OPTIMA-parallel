import { useEffect, useRef, useState } from "react";

export default function usePersistentState(key, initialValue) {
  const [state, setState] = useState(initialValue);
  const hydrated = useRef(false);

  // 🔹 LOAD ONCE (hydration guard)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setState(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load from localStorage", err);
    } finally {
      hydrated.current = true;
    }
  }, [key]);

  // 🔹 SAVE ONLY AFTER HYDRATION
  useEffect(() => {
    if (!hydrated.current) return;

    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.error("Failed to save to localStorage", err);
    }
  }, [key, state]);

  return [state, setState];
}

