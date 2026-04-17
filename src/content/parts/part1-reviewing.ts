import type { Part } from "../types";

const partId = "part-1-reviewing-others-code";

export const PART_1: Part = {
  id: partId,
  title: "Part 1 — Reviewing others' code",
  summary: "What to look for, what to automate, how to phrase feedback, when to approve, and how to treat juniors.",
  sections: [
    {
      id: `${partId}--1-1-what-to-actually-look-for`,
      title: "1.1 What to actually look for",
      partId,
      blocks: [
        { type: "prose", text: "The consensus priority order in reviews:" },
        {
          type: "priorityList",
          ordered: true,
          items: [
            { lead: "Correctness and risk.", body: "Does this introduce bugs, data loss, race conditions, security holes, or failure modes that aren't behind a feature flag?" },
            { lead: "Design and structure.", body: "Is this in the right place? Is it creating duplication? Is it coupling things that shouldn't be coupled?" },
            { lead: "Readability and maintainability.", body: "Will the next person understand this? Are the names accurate to what the thing actually does?" },
            { lead: "Tests.", body: "Do they exist? Do they cover the behavior the code claims to implement, not just \"assert true == true\"?" },
            { lead: "Nits (style, naming preferences, minor refactors).", body: "Only after all of the above." },
          ],
        },
        {
          type: "quote",
          sourceId: "ed-feedback-without-bossy",
          text: "I point out real bugs, mistakes we can't undo, or risks that aren't behind feature flags. If there aren't any problems like that, then I approve. When I approve, that's when the nitpicks and lower-priority feedback comes out.",
        },
        { type: "prose", text: "The important pairing: **approve + leave nits is a legitimate outcome**, and so is **block + explain the blocker**. Conflating the two (a blocking review over a naming preference) is where most review conflict comes from." },
        { type: "prose", text: "Be aware of where reviews are **not** effective:" },
        {
          type: "quote",
          sourceId: "prog-make-enemies",
          text: "Code reviews almost never catch serious problems. It would be nice if they did … realistically they don't. I test code for a living, if your code reviews caught the bugs, I'd be out of a job.",
        },
        {
          type: "quote",
          sourceId: "ed-stopped-caring-quality",
          text: "Code review is an awful place to bring up [habitual style issues]. Those things are habits. For habits you need a very short feedback loop. I recommend pair programming, and evolve those things while pairing. Code review is better to check for correctness, and overall structure.",
        },
        {
          type: "callout",
          kind: "translation",
          text: "if you're finding the same small-habit issues on every PR, stop writing comments and start pairing or writing a lint rule.",
        },
        { type: "prose", text: "**Frontend-specific correctness checks.** On top of the priority order above, a frontend reviewer has a short list of category-1 (correctness & risk) traps that slip through type-checkers and unit tests:" },
        {
          type: "bulletList",
          items: [
            { lead: "Stale-closure bugs in hooks.", body: "A `useEffect` / `useCallback` / `useMemo` with a missing or lying dependency array. This is *the* single most common source of \"it works on my machine but breaks in prod when the parent re-renders.\"" },
            { lead: "Hydration mismatches.", body: "`Date.now()`, `Math.random()`, or `window` referenced during render in a component that also runs on the server. Produces a console warning in dev and silently broken UI in prod." },
            { lead: "Accessibility regressions.", body: "A `<button>` rewritten as `<div onClick>`, a dropped `alt`, a form input unlabeled, a focus ring deleted \"because designers didn't like it.\" These are bugs, not nits." },
            { lead: "Bundle-size regressions.", body: "`import _ from 'lodash'` instead of `import debounce from 'lodash/debounce'`. A `moment` import when `date-fns` or `Intl.DateTimeFormat` would do. One line of code, 70 KB of prod payload." },
            { lead: "Secret leakage.", body: "Anything that reads `process.env.FOO` from client code — if the variable isn't prefixed with `NEXT_PUBLIC_` / `VITE_` / `REACT_APP_` it's either broken or, worse, something server-only that got dragged into the client bundle." },
          ],
        },
        { type: "prose", text: "The canonical stale-closure example, because it shows up in every codebase:" },
        {
          type: "code",
          lang: "tsx",
          code: `// before — \`count\` is captured once, always reads 0
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000);
  return () => clearInterval(id);
}, []);

// after — either list the dep, or use the updater form
useEffect(() => {
  const id = setInterval(() => setCount(c => c + 1), 1000);
  return () => clearInterval(id);
}, []);`,
        },
        { type: "prose", text: "If you catch this in review, it's an `issue:`, not a `nit:`." },
      ],
    },
    {
      id: `${partId}--1-2-what-not-to-look-for-automate-it-or-skip-it`,
      title: "1.2 What NOT to look for (automate it or skip it)",
      partId,
      blocks: [
        { type: "prose", text: "Things a reviewer should never manually catch:" },
        {
          type: "bulletList",
          items: [
            { lead: "Formatting, indentation, spacing, quote style.", body: "Prettier/gofmt/black/etc." },
            { lead: "Linting violations.", body: "ESLint, ruff, golangci-lint." },
            { lead: "Import order and relative-vs-absolute imports.", body: "If the team has a rule, encode it." },
            { lead: "Trailing whitespace, missing newlines.", body: "Editor config." },
            { lead: "Simple complexity caps (max cyclomatic complexity, max function length).", body: "Lint rule." },
          ],
        },
        {
          type: "quote",
          sourceId: "ed-pedantic-arbitrary-rules",
          text: "If it can't go into a lint rule, it doesn't exist. Simple. You have a style preference? Fine, I probably don't give a fuck. Write a lint rule.",
        },
        {
          type: "quote",
          sourceId: "ed-heavily-nitpicky-opinionated",
          text: "Offload as much CR work to robots as possible. It's much less of a personal affront to be told your code sucks by a mindless robot, than by a coworker.",
        },
        { type: "prose", text: "If your team doesn't have this tooling yet, the highest-leverage review comment you can make is a PR to add it — not another comment on someone else's PR." },
        { type: "prose", text: "**The frontend toolchain version of \"automate it\":**" },
        {
          type: "bulletList",
          items: [
            { lead: "Prettier", body: "for formatting. No debates about JSX attribute wrapping or trailing commas." },
            { lead: "ESLint", body: "with `eslint-plugin-react-hooks` (catches stale-closure and dep-array bugs — the #1 runtime issue from 1.1), `eslint-plugin-jsx-a11y` (catches the `<div onClick>`, missing `alt`, and unlabeled input cases before review), and `@typescript-eslint` for the TS-specific rules." },
            { lead: "stylelint", body: "for CSS / CSS-in-JS consistency." },
            { lead: "`tsc --noEmit` in CI.", body: "If the PR breaks types, the reviewer shouldn't be the one to find out." },
            { lead: "size-limit or bundlewatch", body: "with a committed budget. Any PR that regresses the bundle by > N KB fails CI — no human has to eyeball the treemap." },
            { lead: "Lighthouse CI", body: "with budgets on LCP / CLS / TBT for the routes that matter." },
            { lead: "Chromatic, Percy, or Playwright screenshots", body: "for visual regression — catches the \"I didn't mean to change the Button padding\" class of accidents." },
            { lead: "axe-core", body: "in unit tests or via `@axe-core/playwright` for runtime a11y checks on key flows." },
          ],
        },
        { type: "prose", text: "Every one of these is a review comment you don't have to write." },
      ],
    },
    {
      id: `${partId}--1-3-how-to-phrase-feedback`,
      title: "1.3 How to phrase feedback",
      partId,
      blocks: [
        { type: "prose", text: "This is the part of code review people actually get wrong. Two opposing failure modes:" },
        {
          type: "bulletList",
          items: [
            { lead: "Too curt.", body: "Comes across as blaming or god-complex. (\"This is wrong.\" \"Why did you do it this way?\" with no context.)" },
            { lead: "Too padded.", body: "Hidden under \"maybe consider,\" \"wondering if,\" \"just a thought.\" Author reads it as optional, ships broken code." },
          ],
        },
        { type: "prose", text: "The technique most upvoted on Reddit: **phrase as a question when you're genuinely curious; state a position when you have one.** Don't fake-Socratic." },
        {
          type: "quote",
          sourceId: "prog-reviews-like-a-human",
          text: "\"What are the benefits of doing X rather than Y?\" — Perhaps the reviewee realizes that Y is actually a better choice, or maybe they reply with some considerations the reviewer didn't make. Either way the team will have a better understanding of the tradeoffs.",
        },
        {
          type: "quote",
          sourceId: "ed-feedback-without-bossy",
          text: "Personal preference but I loathe passive-aggressive questions in PR reviews. It feels infantilizing. If you think something should be different, say so and say why. If you actually don't understand why they made a choice, ask about that.",
        },
        { type: "prose", text: "A widely-cited example of going *too* soft, from an author trying to tell a junior their PR has no error handling:" },
        {
          type: "quote",
          sourceId: "ed-feedback-without-bossy",
          text: "This works! One thing to maybe consider: what would happen if this call fails mid-request? Wondering if wrapping it in a retry + logging block might help.",
        },
        { type: "prose", text: "The top reply:" },
        {
          type: "quote",
          sourceId: "ed-feedback-without-bossy",
          sameThread: true,
          text: "You've gone way overboard. This is far too indirect. You make it sound like it's good work and you're wondering about a nice-to-have. You don't have to be scared and apologetic for giving something other than 100% praise. … Juniors need clear signals to understand where they are going wrong. She skipped error handling altogether! That is not a minor thing and you shouldn't be teaching her it is.",
        },
        { type: "prose", text: "**Three concrete framing tricks that are repeatedly praised:**" },
        { type: "heading", level: 3, text: "Use \"we\" instead of \"I/you\"" },
        {
          type: "quote",
          sourceId: "ed-comments-arrogant-judgmental",
          text: "I now try to phrase everything in terms of 'we'. For example, 'We may want to do things this other way. Could we change this code to do things the other way?' This removes the implication of blame or shortcoming, and the implication that my way is the right way.",
        },
        { type: "prose", text: "Caveat: \"we\" framing can feel infantilizing in some cultures and between peers of similar seniority. Read the room." },
        { type: "heading", level: 3, text: "Keep each comment short (~300 chars)" },
        {
          type: "quote",
          sourceId: "ed-comments-arrogant-judgmental",
          sameThread: true,
          text: "It turns out a wall-of-text response reads like a litany of complaints, no matter how well-intended. Now I just save my walls-of-text in a local document on my computer, include a summary in the PR comment, and reach out to the developer to see if they want to huddle to talk through it.",
        },
        { type: "heading", level: 3, text: "Comment on the good things too" },
        {
          type: "quote",
          sourceId: "ed-comments-arrogant-judgmental",
          sameThread: true,
          text: "Someone solved a hard problem with a good idea? Let them know! 200 lines of frontend code replaced by a library? Give thanks. New tests added? Let them know it's awesome to see. Commenting on good behaviours reinforces them.",
        },
        { type: "prose", text: "There's a minority view that praise is noise, which is worth knowing:" },
        {
          type: "quote",
          sourceId: "askprog-words-of-praise",
          text: "If something I wrote needs to be changed or there's a better way, I'd rather you just tell it to me and not feel the need to wrap it in politeness or add other positive comments to 'soften the blow'. The other stuff really just wastes time.",
        },
        { type: "prose", text: "The majority position, though: **juniors in particular need it.** \"Smiley faces work very well when communicating with juniors. We forget as seniors that in many cases they're actually afraid of us.\"" },
        { type: "prose", text: "**A concrete frontend example of the \"too soft / too direct\" spectrum.** You spot `useEffect(() => { setTotal(items.reduce(…)) })` with no dep array in a junior's PR — it will re-run on every render and can infinite-loop. All three of these comments point at the same line:" },
        {
          type: "bulletList",
          items: [
            { lead: "Too soft (reads as optional):", body: "*\"Nice! One small thought — could we maybe think about whether this effect needs a dep array? Not a blocker.\"* The author ships it." },
            { lead: "Too curt (reads as blaming):", body: "*\"No dep array. Why?\"* The author gets defensive and the conversation stalls." },
            { lead: "Right tone — direct + specific + rationale:", body: "*\"`issue:` this effect has no dependency array, so it re-runs every render and will cause an infinite loop when `setTotal` triggers the next render. Either list `[items]` as the dep or hoist the reduce into a `useMemo` so it's derived, not effectful.\"*" },
          ],
        },
        { type: "prose", text: "The right-tone version takes ten more seconds to write and saves a round-trip." },
      ],
    },
    {
      id: `${partId}--1-4-marking-severity-nit-suggestion-blocking`,
      title: "1.4 Marking severity: nit / suggestion / blocking",
      partId,
      blocks: [
        { type: "prose", text: "The single most recommended resource across the threads is **Conventional Comments** ([conventionalcomments.org](https://conventionalcomments.org/)), which prefixes every comment with its intent:" },
        {
          type: "bulletList",
          items: [
            "`nit:` — minor, non-blocking preference",
            "`suggestion:` — a proposal, take it or leave it",
            "`question:` — genuinely asking",
            "`issue:` — must address",
            "`praise:` — explicit positive feedback",
            "`thought:` — idea for the future, not this PR",
          ],
        },
        { type: "prose", text: "Also widely referenced: **Netlify's feedback ladder** and **the Code Review Emoji Guide**. The specific system matters less than *having* one — your author should never have to guess whether a comment is blocking." },
        {
          type: "quote",
          sourceId: "ed-what-is-nitpicking",
          text: "NIT: a small change or opinion that doesn't affect my approval for this MR. Proceed at your own discretion but let's discuss this so we can agree on a standard moving forward.",
        },
        { type: "prose", text: "Nitpicks still belong in reviews — the rule is that they shouldn't block merge and should be clearly labeled. Dismissing all nits leads to code rot; letting all nits block leads to the 180-comment first-PR hazing described in section 4.2." },
        { type: "prose", text: "**What each label looks like on a frontend PR** — copy-ready phrasings so reviewers and authors share the same vocabulary:" },
        {
          type: "bulletList",
          items: [
            { lead: "`nit:`", body: "*\"prefer `clsx(base, { active: isActive })` over the template string here — it's what the rest of this file uses.\"*" },
            { lead: "`suggestion:`", body: "*\"`<PriceRow>` here is close to the one in `Cart.tsx` — could extract to `@/components/ui/PriceRow` in a follow-up.\"*" },
            { lead: "`question:`", body: "*\"why `useLayoutEffect` instead of `useEffect`? genuinely curious — is there a measurement happening I'm missing?\"*" },
            { lead: "`issue:`", body: "*\"this `<div onClick>` isn't keyboard-accessible and won't be announced by a screen reader. Use `<button>` (and let it inherit default focus styles), or add `role=\"button\" tabIndex={0}` + an `onKeyDown` handler.\"*" },
            { lead: "`praise:`", body: "*\"swapping the hand-rolled tooltip for `@radix-ui/react-tooltip` deletes ~120 lines and we get focus trapping for free — nice.\"*" },
            { lead: "`thought:`", body: "*\"long-term we should probably move this `useEffect` fetch into a loader / react-query — not this PR.\"*" },
          ],
        },
      ],
    },
    {
      id: `${partId}--1-5-when-to-approve-when-to-block`,
      title: "1.5 When to approve, when to block",
      partId,
      blocks: [
        { type: "prose", text: "A useful heuristic that cuts through most approve/block debate:" },
        {
          type: "quote",
          sourceId: "ed-approve-with-nitpicky",
          text: "I'll only approve a change if it would be okay to check in as-is. That might happen when I still have open comments if they're optional (e.g. 'consider making this a file-level constant'), but never if they're required.",
        },
        { type: "prose", text: "In other words: **if a comment is blocking, don't approve. If it's not blocking, label it as a nit and approve.** The ambiguous middle (lots of nits, some of which you'd really like addressed but none of which you're willing to block on) is where reviewer/author frustration lives." },
        { type: "prose", text: "Reddit is split on whether \"approve with a list of nits the author is trusted to fix\" is fine:" },
        {
          type: "bulletList",
          items: [
            { lead: "Pro (majority on busy teams):", body: "*\"If you can trust them to fix the nitpick stuff after you approve then no worries. If you need to hound them more then you need to be more conservative with your PR approvals.\"*" },
            { lead: "Con:", body: "*\"What's the point in having any of these rules if they aren't enforced? By approving you're saying none of these things are important.\"*" },
          ],
        },
        { type: "prose", text: "The deciding factor is trust and the maturity of the CI pipeline. If linting fails the build, \"approve with nits\" is safe. If it doesn't, nits slip permanently into main." },
        { type: "prose", text: "**Frontend blockers worth naming explicitly.** Several classes of change that *look* like polish but should block merge, because they degrade the product in ways unit tests won't catch:" },
        {
          type: "bulletList",
          items: [
            { lead: "Accessibility regressions.", body: "A keyboard trap inside a modal, a lost focus ring, a control without an accessible name, a heading level jump, `role=\"button\"` on something you can't `Tab` to. These aren't nits." },
            { lead: "Bundle-size spike over the committed budget.", body: "If `size-limit` / CI flags it, the PR is a blocker even if the feature works." },
            { lead: "Core Web Vitals regression.", body: "Layout shift (CLS) from unskeletoned content, LCP regression from a new above-the-fold image with no `width`/`height`/`loading=\"eager\"`, long tasks (TBT) from heavy work on mount." },
            { lead: "Broken SSR hydration.", body: "Any diff between server-rendered HTML and first-client-render HTML. Don't ship these and plan to fix later — they compound." },
            { lead: "Secrets or server-only modules reaching the client bundle.", body: "`process.env.API_SECRET` read in a client component. `fs` / `path` imported from a file that gets bundled. Grep the build output if in doubt." },
            { lead: "Silent API contract changes", body: "— a component that previously called `/v1/users` now calling `/v2/users` with no migration plan for in-flight sessions." },
          ],
        },
        { type: "prose", text: "These are all `issue:` / \"request changes,\" not nits-with-an-approval." },
      ],
    },
    {
      id: `${partId}--1-6-when-to-stop-typing-and-talk`,
      title: "1.6 When to stop typing and talk",
      partId,
      blocks: [
        { type: "prose", text: "The most consistent advice across the entire corpus is the **2-comment rule**: if you and the author have both replied to a comment without converging, take it off the PR." },
        {
          type: "quote",
          sourceId: "ed-comments-arrogant-judgmental",
          text: "Having long discussions as text only rarely is productive. If I'm following the 2-comment rule then I would contact [the author] and we'd talk about it.",
        },
        { type: "prose", text: "Other times to drop async and go synchronous:" },
        {
          type: "bulletList",
          items: [
            "You're about to leave >5 comments in a row.",
            "You notice a structural problem that invalidates the approach.",
            "You disagree on something that needs product/architectural context.",
            "You feel irritated while typing. (You will type something you'll regret.)",
            "You suspect the author is a junior who doesn't know what they don't know.",
          ],
        },
        {
          type: "quote",
          sourceId: "ed-feedback-without-bossy",
          text: "I prefer face-to-face reviews. It's so much easier to spin up a casual conversation about the general approach and inject a question or raise a point like this in a natural way.",
        },
      ],
    },
    {
      id: `${partId}--1-7-the-reviewers-ethical-duties-to-juniors`,
      title: "1.7 The reviewer's ethical duties to juniors",
      partId,
      blocks: [
        { type: "prose", text: "Two non-negotiables from the threads:" },
        {
          type: "priorityList",
          ordered: true,
          items: [
            { lead: "Don't write their code for them.", body: "Point in the direction; don't ship the fix via suggestion-button." },
            { lead: "Don't be vague with them.", body: "Juniors read politeness as optionality. If something is wrong, say so clearly and explain why." },
          ],
        },
        {
          type: "quote",
          sourceId: "ed-feedback-without-bossy",
          text: "Absolutely do not write the code for her. Your job is to point her in the right direction, not to do her work for her.",
        },
        {
          type: "quote",
          sourceId: "ed-feedback-without-bossy",
          sameThread: true,
          text: "Juniors aren't fragile. Bad production code is. Block the CR. Spell out the risk. Offer help. Then move on, you are protecting customers, not auditioning for Most Friendly Reviewer.",
        },
        { type: "prose", text: "**The frontend version of \"don't write their code for them\"** is resisting GitHub's suggestion button. It is very tempting, when a junior submits a component with a missing `key` prop or a broken `useMemo`, to paste the entire fixed component into a suggestion block — one click and they're done. Don't. They will click \"commit suggestion\" without understanding why, and the same bug will appear next week." },
        { type: "prose", text: "Better: *\"the `useMemo` here doesn't have `items` in the dep array, so it caches the first render's value forever. Read through [the React `useMemo` docs on dependency arrays] and try it again — the ESLint `react-hooks/exhaustive-deps` rule will also flag this locally if you enable it.\"* You've pointed them at the general rule, the official docs, and the automated check, without doing the fix for them." },
      ],
    },
  ],
};
