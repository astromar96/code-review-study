import { Fragment, type ReactNode } from "react";

type Props = {
  text: string;
};

export function Inline({ text }: Props) {
  return <>{parseInline(text)}</>;
}

function parseInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  let bufStart = 0;
  let key = 0;
  const pushBuf = (end: number) => {
    if (end > bufStart) out.push(text.slice(bufStart, end));
  };

  while (i < text.length) {
    const ch = text[i];

    if (ch === "`") {
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        pushBuf(i);
        out.push(<code key={key++}>{text.slice(i + 1, end)}</code>);
        i = end + 1;
        bufStart = i;
        continue;
      }
    }

    if (ch === "[") {
      const close = text.indexOf("]", i + 1);
      if (close !== -1 && text[close + 1] === "(") {
        const parenClose = text.indexOf(")", close + 2);
        if (parenClose !== -1) {
          const linkText = text.slice(i + 1, close);
          const href = text.slice(close + 2, parenClose);
          pushBuf(i);
          out.push(<LinkNode key={key++} href={href}>{parseInline(linkText)}</LinkNode>);
          i = parenClose + 1;
          bufStart = i;
          continue;
        }
      }
    }

    if (ch === "*" && text[i + 1] === "*") {
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        pushBuf(i);
        out.push(<strong key={key++}>{parseInline(text.slice(i + 2, end))}</strong>);
        i = end + 2;
        bufStart = i;
        continue;
      }
    }

    if (ch === "*" && text[i + 1] !== "*") {
      const end = findSingleStarClose(text, i + 1);
      if (end !== -1) {
        pushBuf(i);
        out.push(<em key={key++}>{parseInline(text.slice(i + 1, end))}</em>);
        i = end + 1;
        bufStart = i;
        continue;
      }
    }

    i++;
  }

  pushBuf(i);
  return out.map((node, idx) =>
    typeof node === "string" ? <Fragment key={`t${idx}`}>{node}</Fragment> : node,
  );
}

function findSingleStarClose(text: string, from: number): number {
  let j = from;
  while (j < text.length) {
    if (text[j] === "*" && text[j + 1] !== "*" && text[j - 1] !== "*") {
      return j;
    }
    j++;
  }
  return -1;
}

function LinkNode({ href, children }: { href: string; children: ReactNode }) {
  const isExternal = /^https?:\/\//i.test(href);
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return <a href={href}>{children}</a>;
}
