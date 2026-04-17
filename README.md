# Code Review — Study App

A self-contained study reader distilled from 22 Reddit threads on code review.
Content lives as typed TypeScript data in [src/content/](src/content/) — no
external markdown, no runtime parsing.

- **Home** — doc intro, four Core Principles, part cards with per-part progress rings.
- **Section view** — renders typed content blocks (prose, Reddit quote cards,
  priority lists, callouts, checklists, code). Each quote links to both its
  original Reddit thread and the app's Sources page.
- **Checklists** — reviewer's and author's self-review checklists as interactive
  checkboxes. State persists under a separate localStorage key so it can be
  reset per PR without touching section-study progress.
- **Sources** — all 22 threads grouped by subreddit, with back-links to every
  section that cites each one.

Section-study progress and last-section resume are stored in `localStorage`
under `crs:completed` and `crs:last-section`. Sidebar collapse state under
`crs:sidebar-open-parts`. Checklist state under `crs:checklist-session`.

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Keyboard shortcuts (in section view)

- `j` / `→` — next section
- `k` / `←` — previous section
- `x` — toggle studied on the current section
- `g` — jump to first section
- `G` — jump to last section

## Build

```bash
npm run build
npm run preview
```

## Editing content

All content is under [src/content/](src/content/):

- [intro.ts](src/content/intro.ts) — doc title, intro, Core Principles.
- [sources.ts](src/content/sources.ts) — the 22 SourceRef entries.
- [parts/part1-reviewing.ts](src/content/parts/part1-reviewing.ts) through
  [part4-antipatterns.ts](src/content/parts/part4-antipatterns.ts) — each Part's
  sections as `Block[]`.
- [checklists.ts](src/content/checklists.ts) — reviewer's and author's checklists.
- [types.ts](src/content/types.ts) — the block union.

To add a quote, reference a `sourceId` from `sources.ts`. To add a new thread,
add a `SourceRef` there first.
