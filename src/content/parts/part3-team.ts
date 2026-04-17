import type { Part } from "../types";

const partId = "part-3-team-process";

export const PART_3: Part = {
  id: partId,
  title: "Part 3 — Team & process",
  summary: "Most review dysfunction is structural. Automation, documentation, PR culture, and AI-era adjustments.",
  sections: [
    {
      id: `${partId}--3-1-automate-everything-a-machine-can-check`,
      title: "3.1 Automate everything a machine can check",
      partId,
      blocks: [
        { type: "prose", text: "Already covered in 1.2; repeated here because it's a team-level investment:" },
        {
          type: "bulletList",
          items: [
            "Auto-format on commit (pre-commit hooks).",
            "Lint and type-check in CI, blocking merge.",
            "Static analysis (Sonarqube, codeclimate) for complexity/coverage thresholds.",
            "PR-size check — one team reports great results from a CI step that flags PRs >400 lines with a \"needs walkthrough\" label.",
          ],
        },
        {
          type: "quote",
          sourceId: "ed-pr-bottlenecks-rubber-stamping",
          text: "The biggest thing that fixed this for us was not a process change but a tooling change. We added a CI step that flags PRs over 400 lines with a 'needs walkthrough' label. Author has to schedule a 15 minute screen share before it can be approved. … Killed rubber stamping almost overnight.",
        },
        { type: "prose", text: "**A concrete \"copy-this-pipeline\" frontend CI setup.** If your team doesn't have most of these, prioritizing adding them will remove more review friction than any amount of reviewer training:" },
        {
          type: "code",
          lang: "yaml",
          code: `# Runs on every PR, blocking merge
- prettier --check .
- eslint .
    # plugins: react, react-hooks, jsx-a11y, @typescript-eslint
- stylelint "**/*.{css,scss}"
- tsc --noEmit
- vitest run               # or jest
- playwright test --project=chromium
- size-limit               # fails if bundle > committed budget
- lhci autorun             # Lighthouse CI budgets on critical routes
- chromatic --exit-zero-on-changes=false  # visual regression
- npx @axe-core/cli https://preview.example.com/  # a11y on deploy preview`,
        },
        { type: "prose", text: "Every green check is a conversation the reviewer doesn't have to start. Every missing check is a review comment someone will have to write by hand — probably multiple times per week, forever." },
      ],
    },
    {
      id: `${partId}--3-2-document-the-rules-or-they-dont-exist`,
      title: "3.2 Document the rules or they don't exist",
      partId,
      blocks: [
        { type: "prose", text: "Undocumented rules create the \"first-PR hazing\" pattern where every new hire gets 180 comments learning the team's unwritten preferences." },
        {
          type: "quote",
          sourceId: "ed-pedantic-arbitrary-rules",
          text: "Ask them to document expectations. If it's not documented it is not a rule. Now it's their problem.",
        },
        {
          type: "quote",
          sourceId: "ed-heavily-nitpicky-opinionated",
          text: "Document your coding guidelines, making each section deep-linkable. If you can back up a CR comment with a link to a specific documented guideline, it's less of a me-versus-you scenario.",
        },
        { type: "prose", text: "Good team practice: **every recurring review comment is a candidate for either (a) a lint rule, or (b) a line in the style guide.** If neither, you probably shouldn't be writing the comment repeatedly." },
      ],
    },
    {
      id: `${partId}--3-3-small-pr-culture-is-a-top-down-decision`,
      title: "3.3 Small-PR culture is a top-down decision",
      partId,
      blocks: [
        { type: "prose", text: "If management measures velocity by feature throughput, people write big PRs because small ones feel like bureaucratic overhead. If management backs \"big PRs get refactored before review,\" the culture flips." },
        {
          type: "quote",
          sourceId: "ed-ai-slop-burning",
          text: "We don't allow large prs, and management backs this. You make a 5k loc change for a small feature that's in 1 commit? Congrats you get to spend time refactoring. 'This is too verbose for me to approve' is a complete sentence where I work.",
        },
        { type: "prose", text: "Rules that teams with healthy review cultures actually enforce:" },
        {
          type: "bulletList",
          items: [
            "PR must address a single issue.",
            "PR must have tests (or an explicit \"no tests because X\" in the description).",
            "PR must pass CI before review.",
            "PR over N lines must include a sync walkthrough or be split.",
          ],
        },
      ],
    },
    {
      id: `${partId}--3-4-protect-against-rubber-stamping`,
      title: "3.4 Protect against rubber-stamping",
      partId,
      blocks: [
        { type: "prose", text: "Rubber-stamping (instant LGTM on huge PRs) is the team-level failure mode of review. Causes:" },
        {
          type: "bulletList",
          items: [
            "Reviewers have too much queue, not enough time.",
            "Velocity/turnaround metrics reward clearing the queue.",
            "Social pressure to not be \"the blocker.\"",
            "Authors are not trusted *and* not checked — the worst combo.",
          ],
        },
        {
          type: "quote",
          sourceId: "ed-pr-bottlenecks-rubber-stamping",
          text: "If velocity pressure is so high that thorough review isn't valued or rewarded, then people will optimize for clearing their review queue quickly.",
        },
        { type: "prose", text: "Counterweights that work:" },
        {
          type: "bulletList",
          items: [
            "**Stop measuring PR-review turnaround time as a team KPI.** It directly incentivizes rubber-stamping.",
            "Introduce the size-gated walkthrough rule (3.1).",
            "Pair-review big PRs: two reviewers compare notes.",
            "Rotate reviewers so no one becomes the only reviewer of a domain.",
          ],
        },
        { type: "prose", text: "There's a dissenting perspective worth reading: LGTM on a small, trusted PR is *not* rubber-stamping, it's efficient. The failure mode is specifically LGTM on *complex or risky* PRs with no engagement." },
        {
          type: "quote",
          sourceId: "ed-pr-bottlenecks-rubber-stamping",
          sameThread: true,
          text: "I do this all the time — if the code works and looks good then I think approving with LGTM is the best course of action. I probably request changes on about 25% of PRs, and it's usually a suggested improvement rather than anything else. I don't understand why every comment on this sub in this situation has such a different strategy to me.",
        },
      ],
    },
    {
      id: `${partId}--3-5-review-culture-needs-management-backing`,
      title: "3.5 Review culture needs management backing",
      partId,
      blocks: [
        { type: "prose", text: "A recurring melancholy thread: engineers who care about code quality burn out in environments that don't reward it." },
        {
          type: "quote",
          sourceId: "ed-protect-the-codebase",
          text: "I've found that [protecting the codebase] is not only a thankless task, it's a task that will usually damage your career. … Your coworkers will probably resent you for overruling their coding decisions. Your cleanup work will enable your coworkers to move at a faster speed and avoid bugs and they will take the credit for that. You will be seen as a stick in the mud who doesn't produce shiny features.",
        },
        {
          type: "quote",
          sourceId: "ed-protect-the-codebase",
          sameThread: true,
          text: "People always do what they're incentivized to do. If a company wants features fast, they build features fast. … Inserting yourself as the self-imposed (rather than management-directed) arbiter of code quality is career suicide.",
        },
        { type: "prose", text: "What to do about it: raise quality as a business concern (tie tech debt to measurable slowdowns, bug rates, attrition), not a moral one. If management won't listen, either let go of the perfectionism to avoid burnout, or eventually change teams/companies. Neither is a failure — it's a skill to recognize which game you're playing." },
      ],
    },
    {
      id: `${partId}--3-6-review-in-the-ai-era`,
      title: "3.6 Review in the AI era",
      partId,
      blocks: [
        { type: "prose", text: "Three durable observations from 2024–2026 threads:" },
        { type: "heading", level: 3, text: "(a) Hold AI-generated PRs to the same standard as human ones" },
        {
          type: "quote",
          sourceId: "askprog-vibe-coded-prs",
          text: "You hold it to the same standards as regular PRs. If there's too many problems to list, just cover the big themes. If it becomes a recurring pattern then you need to get engineering managers involved.",
        },
        { type: "prose", text: "There's a minority view — \"give the same amount of effort back that was put in, which is zero\" — but the majority position is that the author is accountable for the code regardless of how it was written." },
        {
          type: "quote",
          sourceId: "ed-ai-slop-burning",
          text: "The first pass on a PR should be the person who authored it. AI might generate code but the person writing the prompts owns the change.",
        },
        { type: "heading", level: 3, text: "(b) Reviewing AI code takes longer, not shorter" },
        {
          type: "quote",
          sourceId: "ed-ai-slop-burning",
          sameThread: true,
          text: "Estimate more time for code reviews, probably double that of non-AI code. With AI tools we are trading speed for understanding, which doesn't come for free, if we want to maintain quality.",
        },
        { type: "prose", text: "Why: AI code tends to be \"plausible-looking\" — syntactically fine, structured in ways no human would naturally choose, occasionally with dangerous subtle changes (weakened auth, over-broad try/catch, hallucinated dependencies). Reviewers end up reading for *understanding* rather than *checking*, which is slower work." },
        { type: "heading", level: 3, text: "(c) Watch for specific AI smells" },
        { type: "prose", text: "Documented patterns to look for:" },
        {
          type: "bulletList",
          items: [
            "**Try/catch around trivial code** (e.g., around a `console.log`).",
            "**Over-abstraction**: a 40-line helper that does what `Array.map` already does.",
            "**Misleading variable names** that sound right but don't match contents (e.g., `userPreferences` that holds a session token).",
            "**Hallucinated APIs or services** mocked out because they don't exist.",
            "**Tests that assert `true === true`** or mock the unit under test.",
            "**Silent changes to security or correctness** hidden inside an unrelated diff (auth early-return, for example).",
            "**5k+ line PRs** for what should be a 50-line change.",
          ],
        },
        {
          type: "quote",
          sourceId: "webdev-audited-6-months-ai-prs",
          text: "Plausible-looking code that technically works but is structured in ways no human would choose. A try-catch around a console.log. A utility function that was 40 lines of enterprise-grade typescript doing exactly what Array.prototype.map already does. Variable names that sound right but don't match what the variable actually holds, like a thing called userPreferences that was actually a session token.",
        },
        { type: "prose", text: "**Frontend-specific AI smells to flag.** Layered on top of the general list above, these are patterns that appear almost exclusively in AI-assisted frontend PRs:" },
        {
          type: "bulletList",
          items: [
            { lead: "Hallucinated hooks or packages.", body: "`import { useFetch } from 'react-use-fetch-v2'`. `useDebouncedState` from a package that doesn't exist on npm. Check the package.json diff — if a brand-new dependency has < 100 weekly downloads, something is wrong." },
            { lead: "Server/Client component boundary confusion", body: "(Next.js App Router, Remix, etc.). `useState` or `useEffect` in a file that doesn't start with `'use client'`. `export const metadata` from a client component. These often build successfully but fail at runtime or silently render wrong on the server." },
            { lead: "Invented design-system tokens.", body: "`className=\"text-primary-550\"` when your Tailwind config only defines 500 and 600. `var(--color-surface-3)` when your token file stops at `surface-2`. These produce \"invisible\" bugs — the element renders with no color." },
            { lead: "`useEffect` re-implementing `useMemo` / derived state.", body: "An effect that reads `props.items`, computes a sum, and stores it in a state — for data that should just be `const total = useMemo(() => items.reduce(…), [items])`." },
            { lead: "Tests that don't actually test.", body: "`expect(screen).toBeTruthy()`, `expect(wrapper.exists()).toBe(true)`, a snapshot of a loading skeleton that never asserts the loaded state." },
            { lead: "A11y stripped silently.", body: "An AI-\"cleaned-up\" component where `<button aria-label={…}>` became `<div onClick={…}>`, or `<label>` elements disappeared because \"the UI looked cleaner without them.\"" },
            { lead: "Invented Playwright locators.", body: "`page.getByTestId('submit-btn')` when the actual test id in the component is `'submit'`, or `page.getByRole('link', { name: 'Checkout' })` on a `<button>`. Tests pass locally by timing out in a way CI masks." },
          ],
        },
        { type: "prose", text: "If more than one of these shows up in a PR, ask for the Loom of the change running in a real browser before you spend another minute reading code." },
      ],
    },
  ],
};
