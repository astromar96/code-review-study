import type { Section } from "../content/types";
import { BlockRenderer } from "./blocks";

type Props = {
  section: Section;
  isDone: boolean;
  onToggle: () => void;
  onMarkAndNext: () => void;
  hasNext: boolean;
};

export function SectionView({ section, isDone, onToggle, onMarkAndNext, hasNext }: Props) {
  return (
    <article className="section">
      <header className="section-head">
        <h1 className="section-title">{section.title}</h1>
        <button
          type="button"
          className={`btn-toggle ${isDone ? "is-done" : ""}`}
          onClick={onToggle}
          aria-pressed={isDone}
        >
          {isDone ? "✓ Studied" : "Mark as studied"}
        </button>
      </header>
      <div className="section-body">
        {section.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>
      <footer className="section-foot">
        <button
          type="button"
          className="btn-toggle"
          onClick={onToggle}
        >
          {isDone ? "Unmark studied" : "Mark as studied"}
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={onMarkAndNext}
          disabled={!hasNext}
        >
          {hasNext ? "Mark studied & next →" : "Mark studied (last section)"}
        </button>
      </footer>
    </article>
  );
}
