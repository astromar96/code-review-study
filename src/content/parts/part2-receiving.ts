import type { Part } from "../types";

const partId = "part-2-receiving-reviews-as-the-author";

export const PART_2: Part = {
  id: partId,
  title: "Part 2 — Receiving reviews (as the author)",
  summary: "Self-review, PR size, description discipline, responding without ego, pushing back, and AI replies.",
  sections: [
    {
      id: `${partId}--2-1-the-single-most-leveraged-habit-self-review`,
      title: "2.1 The single most-leveraged habit: self-review",
      partId,
      blocks: [
        { type: "prose", text: "Before asking anyone else to look at your PR, **open the diff in the web UI and read it as if a stranger wrote it.** This is *the* most praised author habit in the corpus." },
        {
          type: "quote",
          sourceId: "ed-self-review",
          text: "The self-review is when you, the author, look at the same commit stack in a diff viewer like Github's and think about whether that commit stack is ready to merge. You aim to consider the change as the reviewer would. … You must transition from author to critic, something our human psychology is ill-suited to perform.",
        },
        {
          type: "quote",
          sourceId: "prog-reviewer-fall-in-love",
          text: "I catch so much stuff that way. For some reason viewing the code on a PR makes me analyse it in a different way to when I'm writing it.",
        },
        { type: "prose", text: "Specific self-review tactics from the threads:" },
        {
          type: "bulletList",
          items: [
            "Open the PR in **draft** first. Don't mark ready-for-review until you've gone through the diff.",
            "**Leave comments on your own PR** to pre-answer things the reviewer will wonder about: *\"these lines here do the key part,\" \"no, I can't remove this workaround yet, because…\"*",
            "Wait until CI is green. Don't make the reviewer be your CI.",
            "**Sleep on it** when possible. Morning-you is a better reviewer than tired-you.",
            "Delete commented-out code, debug prints, noisy test logs, `TODO(me)`.",
          ],
        },
        { type: "prose", text: "There's a small minority that thinks this shouldn't need saying:" },
        {
          type: "quote",
          sourceId: "ed-self-review",
          sameThread: true,
          text: "The fact that we need thousand word essays about and have to label it 'the self-review' makes me weep for this industry. Anybody not reviewing their own code is just a bloody substandard developer.",
        },
        { type: "prose", text: "The dominant view: it *does* need saying, because most people don't do it." },
        { type: "prose", text: "**Frontend self-review tactics** — a concrete checklist to run before you click \"ready for review\" on any UI PR:" },
        {
          type: "bulletList",
          items: [
            { lead: "Run `npm run build`", body: "(or `pnpm build` / `yarn build`). Look at the `size-limit` / webpack-bundle-analyzer / Vite-bundle-visualizer output. Did you pull in a new dependency? Is it tree-shaking? 80 KB added for a single icon is the tell that you imported an entire icon library instead of a single SVG." },
            { lead: "Open the changed screen in the React DevTools Profiler.", body: "Record an interaction. Are components re-rendering that shouldn't? Is there a cascade triggered by a new context value?" },
            { lead: "Tab through the UI with only the keyboard.", body: "Every interactive element must be focusable, have a visible focus ring, and be operable with Enter / Space. Pop a modal? `Escape` should close it. Open a menu? Arrow keys should navigate it." },
            { lead: "Spot-check with a screen reader.", body: "VoiceOver (⌘F5 on macOS) or NVDA on Windows. If the reader says \"button\" with no label, you have a bug." },
            { lead: "Walk through empty / loading / error / long-text / RTL states.", body: "Not just the happy path. A name field with a 64-character German compound word. A product list with zero items. A failing API response. `dir=\"rtl\"` on the root." },
            { lead: "Run axe DevTools", body: "(browser extension) or the Storybook a11y addon on the changed screen." },
            { lead: "Attach before/after screenshots", body: "at desktop + mobile viewports. If the change involves interaction, record a 10-second Loom." },
          ],
        },
        { type: "prose", text: "Most of these take two minutes combined once you're in the habit. They save an hour of reviewer time and a round-trip." },
      ],
    },
    {
      id: `${partId}--2-2-keep-prs-small`,
      title: "2.2 Keep PRs small",
      partId,
      blocks: [
        { type: "prose", text: "This is the single biggest author-side lever for getting good reviews." },
        {
          type: "quote",
          sourceId: "ed-pr-bottlenecks-rubber-stamping",
          text: "Don't make large pull requests then. Easier said than done but it's just human nature, find 100 things wrong in 10 lines of code but 0 in 1000, breaking it up helps people focus on a specific change.",
        },
        {
          type: "quote",
          sourceId: "ed-ai-slop-burning",
          text: "There are 0 reasons to ever accept a thousand line PR. AI or not. This is not an AI issue, it's a quality of work issue. … No PR over 200 (or whatever your team deems acceptable) lines will be reviewed. Learn to break up changes into manageable chunks.",
        },
        { type: "prose", text: "The counter-view is real: some features genuinely can't be split because they're an all-or-nothing swap or a branch that's already in-flight. Even then:" },
        {
          type: "bulletList",
          items: [
            "Split *pre-refactors* out into their own PRs (\"make the change easy, then make the easy change\").",
            "Ship behind a feature flag so you can merge incremental PRs.",
            "If you must ship big, **give the reviewer advance notice and schedule a walkthrough**.",
          ],
        },
        {
          type: "quote",
          sourceId: "ed-pr-bottlenecks-rubber-stamping",
          sameThread: true,
          text: "What's the difference between reviewing 5 small PRs of 50 lines each or a single 250 line PR? Review time? N minutes for each small one or 5N minutes for the large one. It comes down to expectations. If you ask someone to review, give them advance notice. Context of what your feature is. Tell them it's big.",
        },
        { type: "heading", level: 3, text: "Separate refactoring from behavior change" },
        { type: "prose", text: "Whether you split into multiple PRs or just multiple commits within one PR, the refactor-vs-behavior split is almost universally praised:" },
        {
          type: "quote",
          sourceId: "prog-reviewer-fall-in-love",
          text: "First make your change/fix, and then refactor the code to make it look like your change was always part of the design to begin with. OR first refactor the code to make your change easy. Then make your change. In either case it will be very helpful for your reviewer to separate out the pure-refactoring code (which can be messy, but shouldn't change any logic) from the actual change itself.",
        },
        { type: "prose", text: "**A concrete frontend split: \"add dark mode.\"** A version of this that lands as a single 2,000-line PR is miserable to review and almost guaranteed to regress something. Broken into commits or separate PRs:" },
        {
          type: "priorityList",
          ordered: true,
          items: [
            { lead: "Tokens PR", body: "— introduce semantic color tokens (`--color-bg`, `--color-fg`, `--color-accent`) in the design-system package. Default theme only, no UI changes. Purely additive." },
            { lead: "Theme provider PR", body: "— add `<ThemeProvider>`, `useTheme`, the `data-theme` attribute on `<html>`, and the dark palette alongside the light one. No components consume it yet. Still no visible change." },
            { lead: "Button migration PR", body: "— migrate `<Button>` off hex literals onto the tokens. Visual regression: none in light, Button now supports dark. Small, easy to review." },
            { lead: "Card / Input / Modal migrations", body: "— one PR each (or one commit each in a parent PR), with Chromatic diffs attached." },
            { lead: "Toggle + persistence PR", body: "— the actual user-facing dark-mode switch, `localStorage`, SSR-safe initial theme." },
          ],
        },
        { type: "prose", text: "Each of these is reviewable in under ten minutes. The reviewer who finds a problem with the tokens in PR #1 saves you from five follow-up PRs on top of a broken foundation." },
      ],
    },
    {
      id: `${partId}--2-3-write-the-pr-description-the-reviewer-needs`,
      title: "2.3 Write the PR description the reviewer needs",
      partId,
      blocks: [
        { type: "prose", text: "The threads are less explicit about description discipline than about PR size, but the consensus habits:" },
        {
          type: "bulletList",
          items: [
            "**Why, not what.** The diff shows what. The description explains why.",
            "**Tell the reviewer what to focus on** and what you've already verified.",
            "**Link the ticket/bug/design-doc.**",
            "**Call out intentional non-obvious choices.** (\"I'm not catching this exception on purpose because…\")",
            "**Mention what's out of scope.** Keeps reviewers from asking for the universe.",
            "**Include screenshots/recordings for UI changes.**",
          ],
        },
        { type: "prose", text: "A strong signal of a good author culture, seen across multiple threads, is **reviewers who pre-comment on their own PR** to flag tricky bits. This and a good description are nearly equivalent." },
        { type: "prose", text: "**A frontend-specific PR-description template** that front-loads the information the reviewer actually needs:" },
        {
          type: "code",
          lang: "markdown",
          code: `## What
One-sentence summary of the user-visible change.

## Why
Link to ticket / design doc / bug. What changes for the user?

## Screenshots / recording
| Before | After |
| --- | --- |
| <img desktop> | <img desktop> |
| <img mobile 375px> | <img mobile 375px> |
<Loom URL for any interaction>

## States covered
- [x] loading, empty, error, long-text, RTL
- [x] keyboard navigation end-to-end
- [x] screen reader spot-check (VoiceOver)

## Perf / bundle
- Bundle delta: +1.2 KB gzipped (size-limit report attached)
- Lighthouse: LCP unchanged, CLS 0 (was 0.03)

## Out of scope
- Refactoring the parent route — follow-up in FE-4821
- Translating the new copy — waiting on loc`,
        },
        { type: "prose", text: "Even 60% of this template beats the default \"updates the thing\" PR body." },
      ],
    },
    {
      id: `${partId}--2-4-respond-to-feedback-without-ego`,
      title: "2.4 Respond to feedback without ego",
      partId,
      blocks: [
        {
          type: "quote",
          sourceId: "prog-reviews-like-a-human",
          text: "Don't forget that a code review is not a critique of you and your personality. Admit that you write bugs. … Be happy when your code reviewer kicks your steaming pile of spaghetti back at you. That reviewer may have just saved you the embarrassment of having the test lead email your management.",
        },
        {
          type: "quote",
          sourceId: "prog-reviewer-fall-in-love",
          text: "Readability is determined by people who didn't write the code. You don't get to decide if code you wrote is easy to read and understand. Of course you understand it yourself! If a reviewer says there's a problem with readability, those words are THE TRUTH, amen.",
        },
        { type: "prose", text: "A practical posture: **if a change is small and the reviewer feels strongly, just do it.** The time cost of making a small change is always less than the time cost of arguing about it." },
        {
          type: "quote",
          sourceId: "ed-manage-pedantic-team-members",
          text: "If it's a nitpick i usually respond with 'sure' or a thumbs up and just do the change, because it'll take me less time to do the change than argue about something pointless.",
        },
      ],
    },
    {
      id: `${partId}--2-5-how-to-push-back-and-when`,
      title: "2.5 How to push back (and when)",
      partId,
      blocks: [
        { type: "prose", text: "Pushing back is fine, often necessary, and a sign of a healthy team. What's *not* fine: \"I just don't want to\" with no rationale." },
        { type: "prose", text: "The formula that gets approval:" },
        {
          type: "priorityList",
          ordered: true,
          items: [
            { lead: "Acknowledge you've understood the concern.", body: "" },
            { lead: "State your rationale with concrete reasoning.", body: "" },
            { lead: "Offer to switch to a sync conversation if you suspect you're going to loop.", body: "" },
            { lead: "If you're still stuck after one round, get a third opinion or escalate.", body: "" },
          ],
        },
        {
          type: "quote",
          sourceId: "ed-heavily-nitpicky-opinionated",
          text: "Some comments are a good net positive for the code, your work, and the codebase, and those should be added and implemented. Some others are not. A firm 'no unless you provide a solid technical reason beside your opinionated taste' sometime is necessary. You should stand for yourself.",
        },
        {
          type: "quote",
          sourceId: "ed-heavily-nitpicky-opinionated",
          sameThread: true,
          text: "It's a code review, not a code demand letter. You don't have to actually do what the other developer is suggesting, especially if it's just 'I find it weird'. Just comment 'Thanks for the suggestion but in this case I think what I am doing is a better choice.' and don't change it.",
        },
        { type: "prose", text: "A good team rule for disputes:" },
        {
          type: "quote",
          sourceId: "ed-manage-pedantic-team-members",
          text: "We have a rule that the author of the PR is an owner, and unless the PR is blocked — an owner can dismiss the comment, saying 'I prefer it this way'.",
        },
        { type: "heading", level: 3, text: "When *not* to push back" },
        {
          type: "bulletList",
          items: [
            "The reviewer says it's confusing. (See the quote above — readability is decided by the reader.)",
            "The feedback concerns a real bug or risk, regardless of how it's phrased.",
            "It's a 30-second change.",
          ],
        },
        { type: "prose", text: "**A concrete frontend pushback example.** Reviewer: *\"wrap every function in `useCallback` and every object in `useMemo` — it'll be faster.\"* This is a common taste-driven comment that's actually wrong more often than right." },
        { type: "prose", text: "A good pushback:" },
        {
          type: "quote",
          sourceId: "ed-heavily-nitpicky-opinionated",
          text: "Thanks — before I change this, two questions: (1) are any of the children that receive these props wrapped in `React.memo`? I checked `<OrderRow>` and it's not, so referential stability wouldn't avoid a re-render either way. (2) do we have a profiler capture showing this path is hot? I'd rather not pay the `useCallback` cognitive overhead on code that isn't measurably slow — happy to add it if you've got a Profiler flame graph showing it's needed.",
        },
        { type: "prose", text: "You've (a) acknowledged the concern, (b) given concrete technical reasons, (c) asked for evidence rather than flatly refusing, and (d) offered to change course if the data says so. That's how this conversation should read — not *\"I don't want to\"* and not silent compliance." },
      ],
    },
    {
      id: `${partId}--2-6-dont-launder-your-review-replies-through-ai`,
      title: "2.6 Don't launder your review replies through AI",
      partId,
      blocks: [
        { type: "prose", text: "This is the most emotionally heated topic in recent threads." },
        {
          type: "quote",
          sourceId: "ed-coworker-ai-replies",
          text: "I'll spend 20 minutes writing a comment on his PR… giving context to some niche code path, how it interacts with other code paths. … Then I'll get back 5 paragraphs of perfect English with a jovial tone saying my points are so valid and here's why my coworker made this change. … Clearly my coworker took my painstaking reply, fed it into some model with a prompt like 'reply to this', and copy/pasted it back. Now instead of trying to work through the language barrier, I'm forced to interact with yet another chatbot instead of a human.",
        },
        { type: "prose", text: "Top-rated reactions:" },
        {
          type: "quote",
          sourceId: "ed-coworker-ai-replies",
          sameThread: true,
          text: "If you can't take the time to write this, why should I take the time to read it?",
        },
        {
          type: "quote",
          sourceId: "ed-coworker-ai-replies",
          sameThread: true,
          text: "My line on this now is that if you can't be bothered writing it I can't be bothered reading it.",
        },
        {
          type: "quote",
          sourceId: "ed-coworker-ai-replies",
          sameThread: true,
          text: "The core issue is that he's carelessly putting cognitive burden on you to read the AI summary and then craft a reply, point by point, but he hasn't put equal effort into the summary generation. It creates a weird power imbalance where the person using AI can flood everyone with 'their' content.",
        },
        { type: "prose", text: "The practical rule: **use AI to help you think or draft, but read it, edit it, own it, and reply in your own voice.** Especially don't paste the reviewer's comment into a chatbot and paste the output back unread — that's the specific behavior getting people escalated to HR." },
      ],
    },
  ],
};
