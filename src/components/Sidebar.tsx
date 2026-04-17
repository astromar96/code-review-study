import { useEffect, useState } from "react";
import type { Part } from "../types";

type Props = {
  parts: Part[];
  activeId: string | null;
  isDone: (id: string) => boolean;
  onToggle: (id: string) => void;
  onNavigate: (id: string) => void;
};

export function Sidebar({ parts, activeId, isDone, onToggle, onNavigate }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const activePart = parts.find((p) => p.sections.some((s) => s.id === activeId));
    if (activePart && collapsed[activePart.id]) {
      setCollapsed((c) => ({ ...c, [activePart.id]: false }));
    }
  }, [activeId, parts, collapsed]);

  return (
    <nav className="toc">
      {parts.map((part) => {
        const done = part.sections.filter((s) => isDone(s.id)).length;
        const total = part.sections.length;
        const isCollapsed = collapsed[part.id] ?? false;
        return (
          <div key={part.id} className="toc-part">
            <button
              type="button"
              className="toc-part-header"
              onClick={() => setCollapsed((c) => ({ ...c, [part.id]: !isCollapsed }))}
              aria-expanded={!isCollapsed}
            >
              <span className={`chev ${isCollapsed ? "collapsed" : ""}`}>▾</span>
              <span className="toc-part-title">{part.title}</span>
              <span className="toc-part-count">
                {done}/{total}
              </span>
            </button>
            {!isCollapsed && (
              <ul className="toc-list">
                {part.sections.map((s) => {
                  const active = s.id === activeId;
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
                        onClick={() => onNavigate(s.id)}
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
