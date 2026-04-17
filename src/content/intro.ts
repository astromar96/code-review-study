import type { CorePrinciple } from "./types";

export const DOC_TITLE = "Code Review: A Study Guide from Reddit";

export const DOC_LEAD = [
  "A distilled reader on how to get better at code review — both as a reviewer and as an author — built from 22 high-signal threads across r/ExperiencedDevs, r/programming, r/cscareerquestions, r/webdev, and r/AskProgramming. Every lesson below is anchored to a quote from a real developer and links back to the source thread so you can go read the full discussion.",
  "This guide is intentionally opinionated where Reddit is opinionated, and neutral where Reddit is split. When developers disagree — and they disagree a lot on code review — both sides are presented.",
  "**Who this is for.** The underlying principles are stack-agnostic, but the examples throughout this edition lean frontend: React + TypeScript components, accessibility, bundle-size and runtime performance, CSS and design-system concerns, and React Testing Library / Playwright tests. If you work mainly on backend or infra code, the quotes still apply — just mentally substitute your own idioms for the JSX snippets.",
];

export const HOW_TO_USE = [
  "**Read it once end-to-end.** Each part is short. The goal is to build a mental model, not memorize rules.",
  "**Then skim the quick-reference checklists** at the end. Pin them somewhere.",
  "**Click through to the source threads** for any topic that hits close to something you're currently struggling with. Reading ten devs fight about it is usually more useful than reading the synthesis.",
  "**Revisit quarterly.** Your own review style is shaped by the last team you worked on; this guide is a way to recalibrate against the wider industry.",
];

export const CORE_PRINCIPLES: CorePrinciple[] = [
  {
    title: "Code review is a communication skill more than a technical skill.",
    body: "You are writing to a human who will be in the same Slack tomorrow. Tone, framing, and choice of battles matter more than finding every defect.",
  },
  {
    title: "Small + self-reviewed + well-described beats everything else.",
    body: "The single biggest lever an author controls is the size and clarity of their PR, not how good the code is.",
  },
  {
    title: "Automate anything a machine can check.",
    body: "Style, formatting, lint, simple complexity thresholds — these should never reach a human reviewer. Humans fighting about tabs is a failure of tooling.",
  },
  {
    title: "Culture is top-down.",
    body: "If management rewards velocity and punishes \"blockers,\" reviews rot into LGTM rubber-stamps regardless of what any individual does. You can push back against this, but know what you're pushing against.",
  },
];
