import guideMd from "../../code-review-study-guide.md?raw";
import type { Part, Section } from "../types";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s.-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/\.+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

type Block = { level: 1 | 2; title: string; body: string };

function splitByHeading(md: string, level: 1 | 2): Block[] {
  const marker = level === 1 ? /^# (.+)$/gm : /^## (.+)$/gm;
  const blocks: Block[] = [];
  const indices: { title: string; start: number; end: number }[] = [];

  let match: RegExpExecArray | null;
  const re = new RegExp(marker.source, "gm");
  while ((match = re.exec(md)) !== null) {
    indices.push({ title: match[1].trim(), start: match.index, end: re.lastIndex });
  }

  for (let i = 0; i < indices.length; i++) {
    const cur = indices[i];
    const next = indices[i + 1];
    const body = md.slice(cur.end, next ? next.start : md.length).trim();
    blocks.push({ level, title: cur.title, body });
  }

  return blocks;
}

function stripTrailingHr(s: string): string {
  return s.replace(/\n?---\s*$/g, "").trimEnd();
}

function parseGuide(md: string): { docTitle: string; intro: string; parts: Part[] } {
  const normalized = md.replace(/\r\n/g, "\n");

  const h1Blocks = splitByHeading(normalized, 1);
  if (h1Blocks.length === 0) {
    throw new Error("Guide parse error: no H1 found");
  }

  const [titleBlock, ...partBlocks] = h1Blocks;
  const docTitle = titleBlock.title;

  const titleBody = titleBlock.body;
  const firstH2InTitle = titleBody.search(/^## /m);
  const introProse = firstH2InTitle === -1
    ? stripTrailingHr(titleBody)
    : stripTrailingHr(titleBody.slice(0, firstH2InTitle));
  const titleRest = firstH2InTitle === -1 ? "" : titleBody.slice(firstH2InTitle);

  const parts: Part[] = [];

  if (titleRest.trim().length > 0) {
    const introSections = splitByHeading(titleRest, 2);
    if (introSections.length > 0) {
      const partId = "introduction";
      parts.push({
        id: partId,
        title: "Introduction",
        sections: introSections.map((s) => ({
          id: `${partId}--${slugify(s.title)}`,
          title: s.title,
          content: stripTrailingHr(s.body),
          partId,
        })),
      });
    }
  }

  for (const part of partBlocks) {
    const partId = slugify(part.title);
    const h2Sections = splitByHeading(part.body, 2);

    let sections: Section[];
    if (h2Sections.length === 0) {
      const partLeadBody = stripTrailingHr(part.body);
      sections = [
        {
          id: `${partId}--overview`,
          title: part.title,
          content: partLeadBody,
          partId,
        },
      ];
    } else {
      const firstH2Idx = part.body.search(/^## /m);
      const lead = firstH2Idx === -1 ? "" : stripTrailingHr(part.body.slice(0, firstH2Idx));

      sections = h2Sections.map((s, i) => {
        const body = stripTrailingHr(s.body);
        const content = i === 0 && lead.length > 0 ? `${lead}\n\n${body}` : body;
        return {
          id: `${partId}--${slugify(s.title)}`,
          title: s.title,
          content,
          partId,
        };
      });
    }

    parts.push({ id: partId, title: part.title, sections });
  }

  return { docTitle, intro: introProse, parts };
}

const parsed = parseGuide(guideMd);

export const DOC_TITLE = parsed.docTitle;
export const DOC_INTRO = parsed.intro;
export const PARTS: Part[] = parsed.parts;

export const ALL_SECTIONS: Section[] = PARTS.flatMap((p) => p.sections);

export function findSection(id: string | null): Section | null {
  if (!id) return null;
  return ALL_SECTIONS.find((s) => s.id === id) ?? null;
}

export function neighborSections(id: string): { prev: Section | null; next: Section | null } {
  const idx = ALL_SECTIONS.findIndex((s) => s.id === id);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? ALL_SECTIONS[idx - 1] : null,
    next: idx < ALL_SECTIONS.length - 1 ? ALL_SECTIONS[idx + 1] : null,
  };
}
