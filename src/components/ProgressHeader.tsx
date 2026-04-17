import type { Part } from "../content/types";

type Props = {
  parts: Part[];
  stats: { done: number; total: number; pct: number };
  isDone: (id: string) => boolean;
  onResume: () => void;
  onGoHome: () => void;
  onOpenDrawer?: () => void;
  showHome: boolean;
};

export function ProgressHeader({ parts, stats, isDone, onResume, onGoHome, onOpenDrawer, showHome }: Props) {
  return (
    <div className="progress-header">
      <button
        type="button"
        className="btn-menu"
        onClick={onOpenDrawer}
        aria-label="Open contents"
      >
        <span aria-hidden="true">☰</span>
      </button>
      {showHome ? (
        <button type="button" className="btn-home" onClick={onGoHome} aria-label="Go to home">
          <span aria-hidden="true">⌂</span>
          <span className="btn-home-label">Home</span>
        </button>
      ) : null}
      <div className="progress-main">
        <div className="progress-main-label">
          Progress <strong>{stats.done}</strong> / {stats.total}{" "}
          <span className="muted">· {stats.pct}%</span>
        </div>
        <div className="progress-bar" aria-label="Overall progress">
          <div className="progress-bar-fill" style={{ width: `${stats.pct}%` }} />
        </div>
      </div>
      <div className="progress-parts">
        {parts.map((p) => {
          const done = p.sections.filter((s) => isDone(s.id)).length;
          const total = p.sections.length;
          const pct = total === 0 ? 0 : Math.round((done / total) * 100);
          return (
            <div key={p.id} className="progress-part" title={`${p.title}: ${done}/${total}`}>
              <div className="progress-part-label">{shortPartTitle(p.title)}</div>
              <div className="progress-part-bar">
                <div className="progress-part-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="progress-part-count">
                {done}/{total}
              </div>
            </div>
          );
        })}
      </div>
      <button type="button" className="btn-resume" onClick={onResume}>
        Resume
      </button>
    </div>
  );
}

function shortPartTitle(t: string): string {
  const m = t.match(/^Part (\d+)/);
  if (m) return `Part ${m[1]}`;
  return t.length > 14 ? t.slice(0, 12) + "…" : t;
}
