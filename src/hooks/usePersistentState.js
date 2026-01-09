import { useEffect, useRef, useState } from "react";

/**
 * usePersistentState
 * @param {string} key - localStorage key
 * @param {*} initialValue - fallback value
 * @param {Function} migrate - optional legacy migration fn
 */
export default function usePersistentState(
  key,
  initialValue,
  migrate
) {
  const [state, setState] = useState(initialValue);
  const hydrated = useRef(false);

  // HYDRATE
  useEffect(() => {
    const stored = localStorage.getItem(key);

    if (!stored) {
      hydrated.current = true;
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setState(parsed);
    } catch {
      if (migrate) {
        const migrated = migrate(stored);
        setState(migrated);
        localStorage.setItem(key, JSON.stringify(migrated));
      }
    } finally {
      hydrated.current = true;
    }
  }, [key, migrate]);

  // SAVE (AFTER HYDRATION)
  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
