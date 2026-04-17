export type SourceRef = {
  id: string;
  subreddit: string;
  threadTitle: string;
  url: string;
  score?: number;
};

export type InlineText = string;

export type PrioritizedItem = { lead: InlineText; body: InlineText };

export type BulletItem = InlineText | PrioritizedItem;

export type Block =
  | { type: "prose"; text: InlineText }
  | { type: "heading"; level: 3; text: InlineText }
  | { type: "quote"; text: InlineText; sourceId: string; sameThread?: boolean }
  | { type: "callout"; kind: "translation" | "note" | "warning"; text: InlineText }
  | { type: "priorityList"; ordered: boolean; items: PrioritizedItem[] }
  | { type: "bulletList"; items: BulletItem[] }
  | { type: "checklist"; title?: InlineText; items: InlineText[] }
  | { type: "code"; lang: "tsx" | "yaml" | "json" | "markdown" | "text"; code: string };

export type Section = {
  id: string;
  title: string;
  partId: string;
  blocks: Block[];
};

export type Part = {
  id: string;
  title: string;
  summary: string;
  sections: Section[];
};

export type CorePrinciple = { title: InlineText; body: InlineText };

export type ChecklistGroup = {
  id: string;
  title: string;
  lead?: InlineText;
  groups: { heading?: InlineText; items: InlineText[] }[];
};
