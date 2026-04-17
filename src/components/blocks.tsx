import type { Block, BulletItem, ChecklistGroup, PrioritizedItem } from "../content/types";
import { getSource } from "../content/sources";
import { Inline } from "./Inline";

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "prose":
      return <p className="block-prose"><Inline text={block.text} /></p>;
    case "heading":
      return <h3 className="block-heading"><Inline text={block.text} /></h3>;
    case "quote":
      return <QuoteBlock text={block.text} sourceId={block.sourceId} sameThread={block.sameThread} />;
    case "callout":
      return <CalloutBlock kind={block.kind} text={block.text} />;
    case "priorityList":
      return <PriorityListBlock ordered={block.ordered} items={block.items} />;
    case "bulletList":
      return <BulletListBlock items={block.items} />;
    case "checklist":
      return <InlineChecklistBlock items={block.items} />;
    case "code":
      return <CodeBlock lang={block.lang} code={block.code} />;
  }
}

function QuoteBlock({ text, sourceId, sameThread }: { text: string; sourceId: string; sameThread?: boolean }) {
  const src = getSource(sourceId);
  return (
    <figure className="quote-card">
      <blockquote className="quote-body">
        <Inline text={text} />
      </blockquote>
      <figcaption className="quote-attr">
        <a
          className={`chip chip-${src.subreddit.toLowerCase()}`}
          href={src.url}
          target="_blank"
          rel="noopener noreferrer"
          title={src.threadTitle}
        >
          r/{src.subreddit}
        </a>
        <span className="quote-thread">
          {sameThread ? "same thread — " : null}
          <a href={src.url} target="_blank" rel="noopener noreferrer">
            "{src.threadTitle}"
          </a>
        </span>
        <a className="quote-internal" href={`#/sources/${src.id}`} title="See all citations from this thread">
          all citations →
        </a>
      </figcaption>
    </figure>
  );
}

function CalloutBlock({ kind, text }: { kind: "translation" | "note" | "warning"; text: string }) {
  const label =
    kind === "translation" ? "Translation"
    : kind === "warning" ? "Warning"
    : "Note";
  return (
    <aside className={`callout callout-${kind}`}>
      <span className="callout-label">{label}</span>
      <span className="callout-text"><Inline text={text} /></span>
    </aside>
  );
}

function PriorityListBlock({ ordered, items }: { ordered: boolean; items: PrioritizedItem[] }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className="priority-list">
      {items.map((item, i) => (
        <li key={i}>
          <span className="priority-lead"><Inline text={item.lead} /></span>
          {item.body ? <> <span className="priority-body"><Inline text={item.body} /></span></> : null}
        </li>
      ))}
    </Tag>
  );
}

function BulletListBlock({ items }: { items: BulletItem[] }) {
  return (
    <ul className="bullet-list">
      {items.map((item, i) => (
        <li key={i}>
          {typeof item === "string" ? (
            <Inline text={item} />
          ) : (
            <>
              <span className="priority-lead"><Inline text={item.lead} /></span>{" "}
              <span className="priority-body"><Inline text={item.body} /></span>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

function InlineChecklistBlock({ items }: { items: string[] }) {
  return (
    <ul className="inline-checklist">
      {items.map((item, i) => (
        <li key={i}>
          <span className="inline-checklist-box" aria-hidden="true">☐</span>
          <Inline text={item} />
        </li>
      ))}
    </ul>
  );
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  return (
    <pre className={`code-block code-lang-${lang}`}>
      <code>{code}</code>
    </pre>
  );
}

type InteractiveChecklistProps = {
  checklist: ChecklistGroup;
  checked: Set<string>;
  onToggle: (key: string) => void;
};

export function InteractiveChecklist({ checklist, checked, onToggle }: InteractiveChecklistProps) {
  return (
    <section className="interactive-checklist">
      <h2 className="checklist-title">{checklist.title}</h2>
      {checklist.lead ? <p className="checklist-lead"><Inline text={checklist.lead} /></p> : null}
      {checklist.groups.map((group, gi) => (
        <div key={gi} className="checklist-group">
          {group.heading ? <h3 className="checklist-heading"><Inline text={group.heading} /></h3> : null}
          <ul className="checklist-items">
            {group.items.map((item, ii) => {
              const key = `${checklist.id}:${gi}:${ii}`;
              const isChecked = checked.has(key);
              return (
                <li key={key} className={`checklist-item${isChecked ? " is-checked" : ""}`}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggle(key)}
                    />
                    <Inline text={item} />
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
