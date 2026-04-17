import { useMemo, useState } from "react";
import { EXTERNAL_RESOURCES, SOURCES, citationsForSource } from "../content";
import type { SourceRef } from "../content/types";

type Props = {
  focusId: string | null;
  onOpenSection: (id: string) => void;
};

export function SourcesView({ focusId, onOpenSection }: Props) {
  const [filter, setFilter] = useState<string>("all");

  const subreddits = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const s of SOURCES) {
      if (!seen.has(s.subreddit)) {
        seen.add(s.subreddit);
        list.push(s.subreddit);
      }
    }
    return list;
  }, []);

  const visible = useMemo(() => {
    if (filter === "all") return SOURCES;
    return SOURCES.filter((s) => s.subreddit === filter);
  }, [filter]);

  return (
    <div className="sources">
      <header className="sources-head">
        <h1 className="sources-title">Source threads</h1>
        <p className="sources-lead">
          All 22 Reddit threads this guide draws from, ordered by upvote score. Click a thread to open it on Reddit, or jump to the sections that cite it.
        </p>
        <nav className="sources-filter" aria-label="Filter by subreddit">
          <FilterChip label="All" value="all" current={filter} onSelect={setFilter} />
          {subreddits.map((sub) => (
            <FilterChip key={sub} label={`r/${sub}`} value={sub} current={filter} onSelect={setFilter} />
          ))}
        </nav>
      </header>

      <ul className="sources-list">
        {visible.map((s) => (
          <SourceCard
            key={s.id}
            source={s}
            focused={focusId === s.id}
            onOpenSection={onOpenSection}
          />
        ))}
      </ul>

      <section className="external-resources">
        <h2>External resources cited in the threads</h2>
        <ul>
          {EXTERNAL_RESOURCES.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noopener noreferrer">{r.label}</a>
              <span className="external-note"> — {r.note}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function FilterChip({
  label,
  value,
  current,
  onSelect,
}: {
  label: string;
  value: string;
  current: string;
  onSelect: (v: string) => void;
}) {
  return (
    <button
      type="button"
      className={`filter-chip${current === value ? " is-active" : ""}`}
      onClick={() => onSelect(value)}
    >
      {label}
    </button>
  );
}

function SourceCard({
  source,
  focused,
  onOpenSection,
}: {
  source: SourceRef;
  focused: boolean;
  onOpenSection: (id: string) => void;
}) {
  const citations = citationsForSource(source.id);
  const uniqueSections = useMemo(() => {
    const seen = new Set<string>();
    const list: { id: string; title: string; partTitle: string }[] = [];
    for (const c of citations) {
      if (seen.has(c.section.id)) continue;
      seen.add(c.section.id);
      list.push({ id: c.section.id, title: c.section.title, partTitle: c.part.title });
    }
    return list;
  }, [citations]);

  return (
    <li className={`source-card${focused ? " is-focused" : ""}`} id={`source-${source.id}`}>
      <div className="source-card-head">
        <a
          className={`chip chip-${source.subreddit.toLowerCase()}`}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          r/{source.subreddit}
        </a>
        {typeof source.score === "number" ? (
          <span className="source-score" title="Post upvotes">▲ {source.score.toLocaleString()}</span>
        ) : null}
        <span className="source-citations-count">
          {citations.length} quote{citations.length === 1 ? "" : "s"}
        </span>
      </div>
      <h2 className="source-title">
        <a href={source.url} target="_blank" rel="noopener noreferrer">
          {source.threadTitle}
        </a>
      </h2>
      {uniqueSections.length > 0 ? (
        <div className="source-citations">
          <span className="source-citations-label">Cited in:</span>
          <ul>
            {uniqueSections.map((sec) => (
              <li key={sec.id}>
                <button type="button" onClick={() => onOpenSection(sec.id)}>
                  {sec.title}
                </button>
                <span className="source-cite-part">{sec.partTitle}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}
