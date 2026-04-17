import { useCallback, useEffect, useMemo, useState } from "react";
import { CHECKLISTS } from "../content";
import { InteractiveChecklist } from "./blocks";

const STORAGE_KEY = "crs:checklist-session";

function readState(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function writeState(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

export function ChecklistsView() {
  const [checked, setChecked] = useState<Set<string>>(() => readState());

  useEffect(() => {
    writeState(checked);
  }, [checked]);

  const onToggle = useCallback((key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const total = useMemo(() => {
    let t = 0;
    for (const list of CHECKLISTS) {
      for (const group of list.groups) {
        t += group.items.length;
      }
    }
    return t;
  }, []);
  const done = checked.size;

  const onReset = useCallback(() => {
    setChecked(new Set());
  }, []);

  return (
    <div className="checklists">
      <header className="checklists-head">
        <h1 className="checklists-title">Quick-reference checklists</h1>
        <p className="checklists-lead">
          Reviewer's and author's self-review checklists, distilled from the guide. State persists in your browser under a separate key from your section-study progress — reset it per PR.
        </p>
        <div className="checklists-toolbar">
          <span className="checklists-count">
            {done} of {total} items checked
          </span>
          <button type="button" className="btn-toggle" onClick={onReset}>
            Reset for new PR
          </button>
        </div>
      </header>
      {CHECKLISTS.map((list) => (
        <InteractiveChecklist
          key={list.id}
          checklist={list}
          checked={checked}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
