import { useMemo } from "react";
import { Marked } from "marked";
import type { Section } from "../types";

const marked = new Marked({ gfm: true, breaks: false });

marked.use({
  renderer: {
    link(token) {
      const href = token.href ?? "";
      const title = token.title ? ` title="${escapeHtml(token.title)}"` : "";
      const text = this.parser.parseInline(token.tokens);
      const isExternal = /^https?:\/\//i.test(href);
      const attrs = isExternal ? ` target="_blank" rel="noopener noreferrer"` : "";
      return `<a href="${escapeAttr(href)}"${title}${attrs}>${text}</a>`;
    },
  },
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}

type Props = {
  section: Section;
  isDone: boolean;
  onToggle: () => void;
  onMarkAndNext: () => void;
  hasNext: boolean;
};

export function SectionView({ section, isDone, onToggle, onMarkAndNext, hasNext }: Props) {
  const html = useMemo(() => marked.parse(section.content) as string, [section.content]);

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
      <div className="section-body prose" dangerouslySetInnerHTML={{ __html: html }} />
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
