import { CORE_PRINCIPLES, DOC_LEAD, DOC_TITLE, HOW_TO_USE, type Part } from "../content";
import { Inline } from "./Inline";

type Props = {
  parts: Part[];
  isDone: (id: string) => boolean;
  onOpenSection: (id: string) => void;
  onOpenChecklists: () => void;
  onOpenSources: () => void;
  resumeSectionId: string | null;
  resumeSectionTitle: string | null;
  onResume: () => void;
};

export function Home({
  parts,
  isDone,
  onOpenSection,
  onOpenChecklists,
  onOpenSources,
  resumeSectionId,
  resumeSectionTitle,
  onResume,
}: Props) {
  return (
    <div className="home">
      <header className="home-hero">
        <h1 className="home-title">{DOC_TITLE}</h1>
        {DOC_LEAD.map((p, i) => (
          <p key={i} className="home-lead">
            <Inline text={p} />
          </p>
        ))}
        {resumeSectionId && resumeSectionTitle ? (
          <button type="button" className="home-resume" onClick={onResume}>
            Resume: <span className="home-resume-title">{resumeSectionTitle}</span>
          </button>
        ) : null}
      </header>

      <section className="home-principles">
        <h2 className="home-section-title">Core principles</h2>
        <p className="home-section-lead">
          These four ideas show up everywhere in the threads. Most concrete advice is a corollary of one of them.
        </p>
        <ol className="principle-grid">
          {CORE_PRINCIPLES.map((p, i) => (
            <li key={i} className="principle-card">
              <span className="principle-num">{i + 1}</span>
              <h3 className="principle-title"><Inline text={p.title} /></h3>
              <p className="principle-body"><Inline text={p.body} /></p>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-parts">
        <h2 className="home-section-title">The guide</h2>
        <div className="part-grid">
          {parts.map((part) => {
            const done = part.sections.filter((s) => isDone(s.id)).length;
            const total = part.sections.length;
            return (
              <article key={part.id} className="part-card">
                <header className="part-card-head">
                  <h3 className="part-card-title">{part.title}</h3>
                  <ProgressRing done={done} total={total} />
                </header>
                <p className="part-card-summary">{part.summary}</p>
                <ol className="part-card-sections">
                  {part.sections.map((s) => (
                    <li key={s.id} className={isDone(s.id) ? "is-done" : undefined}>
                      <button type="button" onClick={() => onOpenSection(s.id)}>
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ol>
              </article>
            );
          })}
        </div>
      </section>

      <section className="home-extras">
        <button type="button" className="extra-tile" onClick={onOpenChecklists}>
          <span className="extra-tile-label">Checklists</span>
          <span className="extra-tile-hint">Reviewer's + author's self-review. Check items off per PR.</span>
        </button>
        <button type="button" className="extra-tile" onClick={onOpenSources}>
          <span className="extra-tile-label">Source threads</span>
          <span className="extra-tile-hint">Browse all 22 Reddit threads and the sections that cite each.</span>
        </button>
      </section>

      <section className="home-howto">
        <h2 className="home-section-title">How to use this guide</h2>
        <ul className="home-howto-list">
          {HOW_TO_USE.map((item, i) => (
            <li key={i}><Inline text={item} /></li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ProgressRing({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : done / total;
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * pct;
  return (
    <div className="progress-ring" role="img" aria-label={`${done} of ${total} sections studied`}>
      <svg viewBox="0 0 40 40" width="40" height="40">
        <circle cx="20" cy="20" r={radius} className="progress-ring-track" />
        <circle
          cx="20"
          cy="20"
          r={radius}
          className="progress-ring-fill"
          style={{ strokeDasharray: `${dash} ${circumference}` }}
          transform="rotate(-90 20 20)"
        />
      </svg>
      <span className="progress-ring-label">{done}/{total}</span>
    </div>
  );
}
