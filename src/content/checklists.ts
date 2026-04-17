import type { ChecklistGroup } from "./types";

export const REVIEWER_CHECKLIST: ChecklistGroup = {
  id: "reviewer-checklist",
  title: "Reviewer's checklist",
  lead: "Pin this next to your PR queue.",
  groups: [
    {
      items: [
        "Is the PR small enough that I can actually review it? If not, stop and ask the author to split it.",
        "Does it have a description that explains *why*? If not, ask.",
        "Is CI green? If not, wait.",
        "**First pass — correctness & risk.** Bugs, race conditions, security, data loss, error handling, auth, feature flags.",
        "**Second pass — design.** Is this in the right place? Duplication? Wrong coupling? Would this be easy to change later?",
        "**Third pass — readability.** Names accurate to what the thing does? Would a new hire understand this in 6 months?",
        "**Fourth pass — tests.** Present? Covering behavior, not implementation details?",
        "**Fifth pass — nits.** Clearly labeled `nit:` or `suggestion:`. Non-blocking.",
        "Am I about to leave >5 comments? Switch to a sync conversation.",
        "Is any comment a blocker? If yes, *don't* click approve. If no, approve and label the rest as nits.",
        "Did I comment on anything good? (Especially for juniors.)",
        "Would I be okay if this merged with just the non-blocking feedback addressed? That's my approval criterion.",
      ],
    },
    {
      heading: "If it's a UI PR, also check:",
      items: [
        "Keyboard navigation — every interactive element reachable and operable with `Tab` / Enter / Space / Escape / Arrow keys.",
        "Visible focus ring on every focusable element.",
        "Accessible names — `<img alt>`, `<label for>` / `aria-label`, headings in a sensible order, landmarks.",
        "Layout holds at 375 px, 768 px, 1440 px; `dir=\"rtl\"` doesn't explode.",
        "Empty / loading / error / long-text states all handled.",
        "Bundle delta is reasonable (size-limit passes; no new heavy deps for one-off use).",
        "No Core Web Vitals regression on the touched route.",
        "Tests assert user-visible behavior (`getByRole`, `getByLabelText`), not test-ids or snapshots-of-loading-state.",
      ],
    },
  ],
};

export const AUTHOR_CHECKLIST: ChecklistGroup = {
  id: "author-checklist",
  title: "Author's self-review checklist",
  lead: "Before you click \"ready for review\":",
  groups: [
    {
      items: [
        "Open the PR in the web UI and read the diff.",
        "Read it once for *correctness* — would I catch this if someone else wrote it?",
        "Read it once for *what the reviewer will ask* — pre-answer in a PR comment or simplify the code.",
        "Is the PR under ~200 lines? (If not, can I split it?)",
        "Is refactoring separated from behavior changes (at least in commits)?",
        "Is the description complete? Why + what + how-to-test + out-of-scope.",
        "Are the tests real or placeholder? Would they catch a regression?",
        "Is CI green?",
        "Any commented-out code, debug prints, TODOs meant for me only — removed?",
        "If any code was AI-assisted: did I read every line and can I defend it in a review?",
      ],
    },
    {
      heading: "When feedback arrives:",
      items: [
        "Read all comments before replying to any.",
        "Thank the reviewer for catching real issues.",
        "If a change is small and the reviewer cares — just do it.",
        "If I disagree, state my reasoning with concrete rationale, once.",
        "If still deadlocked after one round, switch to a sync conversation.",
        "Never paste the review into a chatbot and paste its output back. Reply in my own voice.",
      ],
    },
    {
      heading: "If it's a UI PR, also:",
      items: [
        "Ran `npm run build` and glanced at the bundle report (size-limit green; no surprise dependency; no untree-shaken icon library).",
        "Tabbed through the change with the keyboard, including Escape on any dialog.",
        "Spot-checked with VoiceOver / NVDA if anything has an ARIA role or custom input.",
        "Walked through empty, loading, error, long-text, and RTL states.",
        "Attached before/after screenshots at desktop + mobile. If interactive, attached a Loom.",
        "Ran the React DevTools Profiler on the changed screen if the PR touches perf-sensitive paths.",
      ],
    },
  ],
};

export const CHECKLISTS: ChecklistGroup[] = [REVIEWER_CHECKLIST, AUTHOR_CHECKLIST];
