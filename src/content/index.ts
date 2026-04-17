import type { Block, Part, Section } from "./types";
import { PART_1 } from "./parts/part1-reviewing";
import { PART_2 } from "./parts/part2-receiving";
import { PART_3 } from "./parts/part3-team";
import { PART_4 } from "./parts/part4-antipatterns";

export { DOC_TITLE, DOC_LEAD, HOW_TO_USE, CORE_PRINCIPLES } from "./intro";
export { SOURCES, getSource, EXTERNAL_RESOURCES } from "./sources";
export { CHECKLISTS, REVIEWER_CHECKLIST, AUTHOR_CHECKLIST } from "./checklists";
export type {
  Block,
  BulletItem,
  ChecklistGroup,
  CorePrinciple,
  InlineText,
  Part,
  PrioritizedItem,
  Section,
  SourceRef,
} from "./types";

export const PARTS: Part[] = [PART_1, PART_2, PART_3, PART_4];

export const ALL_SECTIONS: Section[] = PARTS.flatMap((p) => p.sections);

const SECTION_MAP: Record<string, Section> = Object.fromEntries(
  ALL_SECTIONS.map((s) => [s.id, s]),
);

export function findSection(id: string | null): Section | null {
  if (!id) return null;
  return SECTION_MAP[id] ?? null;
}

export function neighborSections(id: string): { prev: Section | null; next: Section | null } {
  const idx = ALL_SECTIONS.findIndex((s) => s.id === id);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? ALL_SECTIONS[idx - 1] : null,
    next: idx < ALL_SECTIONS.length - 1 ? ALL_SECTIONS[idx + 1] : null,
  };
}

export type QuoteCitation = {
  section: Section;
  part: Part;
  block: Block & { type: "quote" };
};

const CITATIONS_BY_SOURCE: Record<string, QuoteCitation[]> = (() => {
  const map: Record<string, QuoteCitation[]> = {};
  for (const part of PARTS) {
    for (const section of part.sections) {
      for (const block of section.blocks) {
        if (block.type !== "quote") continue;
        (map[block.sourceId] ||= []).push({ section, part, block });
      }
    }
  }
  return map;
})();

export function citationsForSource(sourceId: string): QuoteCitation[] {
  return CITATIONS_BY_SOURCE[sourceId] ?? [];
}
