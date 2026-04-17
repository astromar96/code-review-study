import { useCallback, useEffect, useMemo, useState } from "react";

const COMPLETED_KEY = "crs:completed";
const LAST_KEY = "crs:last-section";

function readCompleted(): Set<string> {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x) => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function writeCompleted(set: Set<string>) {
  localStorage.setItem(COMPLETED_KEY, JSON.stringify([...set]));
}

export function useProgress(totalSections: number) {
  const [completed, setCompleted] = useState<Set<string>>(() => readCompleted());

  useEffect(() => {
    writeCompleted(completed);
  }, [completed]);

  const toggle = useCallback((id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const markDone = useCallback((id: string) => {
    setCompleted((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const isDone = useCallback((id: string) => completed.has(id), [completed]);

  const stats = useMemo(() => {
    const done = completed.size;
    const pct = totalSections === 0 ? 0 : Math.round((done / totalSections) * 100);
    return { done, total: totalSections, pct };
  }, [completed, totalSections]);

  return { completed, toggle, markDone, isDone, stats };
}

export function getLastSection(): string | null {
  return localStorage.getItem(LAST_KEY);
}

export function setLastSection(id: string) {
  localStorage.setItem(LAST_KEY, id);
}
