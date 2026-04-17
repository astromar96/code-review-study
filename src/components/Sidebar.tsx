import { useCallback, useEffect, useState } from "react";
import type { Part } from "../content/types";
import type { Route } from "../hooks/useHashRoute";

const OPEN_PARTS_KEY = "crs:sidebar-open-parts";

function readOpenParts(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(OPEN_PARTS_KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw);
    if (obj && typeof obj === "object" && !Array.isArray(obj)) return obj as Record<string, boolean>;
    return {};
  } catch {
    return {};
  }
}

type Props = {
  parts: Part[];
  route: Route;
  isDone: (id: string) => boolean;
  onToggle: (id: string) => void;
  onNavigate: (route: Route) => void;
};

export function Sidebar({ parts, route, isDone, onToggle, onNavigate }: Props) {
  const activeSectionId = route.kind === "section" ? route.id : null;
  const [openParts, setOpenParts] = useState<Record<string, boolean>>(() => readOpenParts());

  useEffect(() => {
    localStorage.setItem(OPEN_PARTS_KEY, JSON.stringify(openParts));
  }, [openParts]);

  useEffect(() => {
    if (!activeSectionId) return;
    const activePart = parts.find((p) => p.sections.some((s) => s.id === activeSectionId));
    if (activePart && openParts[activePart.id] === false) {
      setOpenParts((c) => ({ ...c, [activePart.id]: true }));
    }
  }, [activeSectionId, parts, openParts]);

  const toggleCollapsed = useCallback((partId: string, currentlyOpen: boolean) => {
    setOpenParts((c) => ({ ...c, [partId]: !currentlyOpen }));
  }, []);

  return (
    <nav className="toc">
      <div className="toc-global">
        <button
          type="button"
          className={`toc-global-item${route.kind === "home" ? " is-active" : ""}`}
          onClick={() => onNavigate({ kind: "home" })}
        >
          <span className="toc-global-icon" aria-hidden="true">⌂</span>
          <span>Home</span>
        </button>
        <button
          type="button"
          className={`toc-global-item${route.kind === "checklists" ? " is-active" : ""}`}
          onClick={() => onNavigate({ kind: "checklists" })}
        >
          <span className="toc-global-icon" aria-hidden="true">☑</span>
          <span>Checklists</span>
        </button>
        <button
          type="button"
          className={`toc-global-item${route.kind === "sources" || route.kind === "source" ? " is-active" : ""}`}
          onClick={() => onNavigate({ kind: "sources" })}
        >
          <span className="toc-global-icon" aria-hidden="true">♨</span>
          <span>Sources</span>
        </button>
      </div>
      {parts.map((part) => {
        const done = part.sections.filter((s) => isDone(s.id)).length;
        const total = part.sections.length;
        const isOpen = openParts[part.id] ?? true;
        return (
          <div key={part.id} className="toc-part">
            <button
              type="button"
              className="toc-part-header"
              onClick={() => toggleCollapsed(part.id, isOpen)}
              aria-expanded={isOpen}
            >
              <span className={`chev ${isOpen ? "" : "collapsed"}`}>▾</span>
              <span className="toc-part-title">{part.title}</span>
              <span className="toc-part-count">
                {done}/{total}
              </span>
            </button>
            {isOpen && (
              <ul className="toc-list">
                {part.sections.map((s) => {
                  const active = s.id === activeSectionId;
                  const done = isDone(s.id);
                  return (
                    <li key={s.id} className={`toc-item ${active ? "active" : ""} ${done ? "done" : ""}`}>
                      <label className="toc-check" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={done}
                          onChange={() => onToggle(s.id)}
                          aria-label={`Mark "${s.title}" as studied`}
                        />
                      </label>
                      <button
                        type="button"
                        className="toc-link"
                        onClick={() => onNavigate({ kind: "section", id: s.id })}
                        title={s.title}
                      >
                        {s.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
