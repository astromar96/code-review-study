import type { Part } from "../types";

const partId = "part-4-anti-patterns-horror-stories";

export const PART_4: Part = {
  id: partId,
  title: "Part 4 — Anti-patterns & horror stories",
  summary: "The shape of bad code review — things to notice in yourself and your team and correct.",
  sections: [
    {
      id: `${partId}--4-1-nitpicking-and-bikeshedding`,
      title: "4.1 Nitpicking and bikeshedding",
      partId,
      blocks: [
        { type: "prose", text: "**The pattern:** spending the bulk of review time on style, naming preferences, and structure that has no bearing on correctness. The technical term is *bikeshedding* (arguing about the color of the bike shed while ignoring the nuclear reactor)." },
        { type: "prose", text: "**Why it happens:** nits are easy to find and fun to argue about. Real design issues are hard. Reviewers gravitate to what they can comment on confidently." },
        { type: "prose", text: "**The canonical tell:** 180 nit-level comments from 5 reviewers on a simple refactor." },
        {
          type: "quote",
          sourceId: "ed-pedantic-arbitrary-rules",
          text: "For example, my first pull request for a relatively simple code refactor hit 180 comments from 5 different reviewers. 90% of the comments were nitpicks about spaces, symbol names, or grammar in code comments.",
        },
        { type: "prose", text: "**The fix:** automate style (1.2), label severity (1.4), document rules (3.2). If after all that someone is still writing 30 nit comments on a PR, that's an interpersonal issue to escalate — not a review issue." },
        { type: "prose", text: "**The frontend bikeshed menu** — the specific list of things teams burn hours arguing about in PR review that should *all* be lint rules or codified in a style guide once and then never discussed again:" },
        {
          type: "bulletList",
          items: [
            "Arrow components (`const Button = () => …`) vs. function declarations (`function Button() {}`).",
            "Named exports vs. default exports.",
            "`clsx` / `classnames` vs. template strings vs. conditional ternaries for dynamic classnames.",
            "CSS Modules vs. Tailwind vs. styled-components vs. vanilla-extract.",
            "`interface` vs. `type` for object shapes in TypeScript.",
            "Relative imports vs. `@/` alias imports.",
            "Props destructuring in the signature vs. inside the body.",
            "`async/await` vs. `.then()` inside `useEffect`.",
          ],
        },
        { type: "prose", text: "Every one of these is a legitimate preference. None of them is worth re-litigating every PR. Pick one in a style doc, put it in ESLint / `tsconfig` / `prettier` if it's enforceable, and move on." },
      ],
    },
    {
      id: `${partId}--4-2-the-first-pr-hazing-ritual`,
      title: "4.2 The first-PR hazing ritual",
      partId,
      blocks: [
        { type: "prose", text: "**The pattern:** new hires get dogpiled on their first few PRs with every preference and unwritten rule the team has." },
        {
          type: "quote",
          sourceId: "ed-pedantic-arbitrary-rules",
          text: "The first 3–5 PRs in a new company are a dick measuring contest or initiation ritual. I've seen it happen many times. After 6 months it's gonna be LGTM directly.",
        },
        { type: "prose", text: "**The fix (as a new hire):** do it for the first month. Accept that you're learning. Keep a list of every unwritten rule you bump into, and at the end of month one, propose codifying them as lint rules or a style-guide doc. You'll look like a hero and you'll never have to argue about it again." },
        { type: "prose", text: "**The fix (as the team):** write the damn style guide before the new hire starts." },
      ],
    },
    {
      id: `${partId}--4-3-the-pedantic-reviewer-disagreement-over-taste`,
      title: "4.3 The pedantic reviewer (disagreement over taste)",
      partId,
      blocks: [
        { type: "prose", text: "**The pattern:** one reviewer who requests changes on every PR based on personal preference, without a rationale beyond \"I don't like this\" or \"big-corporation does it differently.\"" },
        {
          type: "quote",
          sourceId: "ed-heavily-nitpicky-opinionated",
          text: "He'll question and nitpick EVERY decision made, e.g. 'Why are the projects organized like this?', 'I hate XYZ feature of the language, we shouldn't use it', 'Don't you think that structure is odd?' … I try to understand where he's coming from, so I ask him and get answers such as 'big corporation recommends it this way', 'Ehh, I just find it weird'.",
        },
        { type: "prose", text: "**Diagnostic:** if you ask \"why?\" and the answer is a preference, not a reason, it's taste. Taste comments should be explicit nits, not blockers." },
        { type: "prose", text: "**The fix:** adopt the \"author is owner\" rule (2.5). Escalate patterns to a manager with a time-cost case (\"we spent 8 hours on naming debates this sprint\"). Don't try to win individual reviews — fix the system." },
        { type: "prose", text: "Some of the threads raise the possibility that pedantic reviewers have undiagnosed neurodivergence or burnout. Useful to keep in mind for empathy, not as an excuse for the behavior." },
        { type: "prose", text: "**The frontend flavor of the pedantic reviewer.** A few specific archetypes to watch for:" },
        {
          type: "bulletList",
          items: [
            { lead: "The memoization crusader", body: "— insists every function be `useCallback`, every object `useMemo`, regardless of whether children are memoized or the path is hot. Has no Profiler data to back it up." },
            { lead: "The state-management evangelist", body: "— every PR comes back with \"have you considered Zustand / Redux / Jotai / Recoil / MobX / Signals?\" when the current solution is five lines of `useState`." },
            { lead: "The abstraction maximizer", body: "— two similar components, and the review demands a generic `<Polymorphic as={…} />` abstraction with six generic type parameters for the inevitable third caller that never arrives." },
            { lead: "The \"big-company did it this way\"", body: "— cites what Facebook / Airbnb / Google's internal style guide allegedly does as if it's binding on your team." },
          ],
        },
        { type: "prose", text: "Apply the same diagnostic as the general case: if the answer to \"why?\" is a preference or a citation of authority instead of a concrete, measurable tradeoff in *this* codebase, it's taste, not a blocker. The \"author is owner\" rule applies." },
      ],
    },
    {
      id: `${partId}--4-4-passive-aggressive-and-fake-socratic-review-styles`,
      title: "4.4 Passive-aggressive and fake-Socratic review styles",
      partId,
      blocks: [
        { type: "prose", text: "**The pattern:** questions that aren't questions. \"Why did you do it this way?\" when the reviewer already has a strong opinion. \"Wouldn't it be *better* to…?\"" },
        {
          type: "quote",
          sourceId: "prog-reviews-like-a-human",
          text: "The worst question I get asked: 'Why did you pick this design?' or 'Why did you do it this way?' 'Because it solved the problem' is the answer, but not the one they are looking for. If they want a more meaningful answer, they need to share their concerns.",
        },
        { type: "prose", text: "**The fix:** if you have a position, state it with rationale. If you don't, ask a question and mean it. Don't fake-Socratic your way into telling someone they're wrong." },
      ],
    },
    {
      id: `${partId}--4-5-rubber-stamping-and-review-theatre`,
      title: "4.5 Rubber-stamping and review theatre",
      partId,
      blocks: [
        { type: "prose", text: "**The pattern:** approving PRs without reading them. Especially prevalent on large PRs because reading them would take hours." },
        {
          type: "quote",
          sourceId: "ed-pr-bottlenecks-rubber-stamping",
          text: "Someone opens an 800-line PR touching a dozen files, and within minutes there's an approval with 'LGTM' and nothing else. No comments, no questions, no engagement with the changes.",
        },
        { type: "prose", text: "**The fix:** see 3.4. It's a team-level problem, not an individual one." },
      ],
    },
    {
      id: `${partId}--4-6-laundering-reviews-through-ai`,
      title: "4.6 Laundering reviews through AI",
      partId,
      blocks: [
        { type: "prose", text: "Covered in 2.6 from the author's side. From the reviewer's side, the mirror anti-pattern also exists: using AI to generate review comments you didn't actually think through." },
        {
          type: "quote",
          sourceId: "ed-ai-slop-burning",
          text: "Fight AI with AI? Use your own AI tool to give very strict code reviews.",
        },
        { type: "prose", text: "Some teams do this deliberately with tools like CodeRabbit or codium-PRAgent as a *first pass* — explicitly labeled as bot review — and then a human does a second pass. That's fine. What's not fine is pretending AI-generated review comments are your own thoughts." },
      ],
    },
    {
      id: `${partId}--4-7-the-protect-the-codebase-trap`,
      title: "4.7 The \"protect the codebase\" trap",
      partId,
      blocks: [
        { type: "prose", text: "**The pattern:** becoming the self-appointed quality gate on a team that doesn't share your quality values. Ends in burnout or career damage." },
        {
          type: "quote",
          sourceId: "ed-protect-the-codebase",
          text: "This is when you need to realize it's not your codebase and disconnect.",
        },
        { type: "prose", text: "**The fix:** articulate quality in business terms (see 3.5), pick your battles, and accept that you can't out-review bad incentives." },
      ],
    },
    {
      id: `${partId}--4-8-opening-a-counter-pr-to-someone-elses-pr`,
      title: "4.8 Opening a counter-PR to someone else's PR",
      partId,
      blocks: [
        { type: "prose", text: "**The pattern:** blocking someone's PR with \"requested changes\" and then immediately opening a competing PR that fixes the same thing your way." },
        {
          type: "quote",
          sourceId: "ed-counter-pr",
          text: "My coworker reviewed the PR, blocking it by requesting changes and shortly after opened their own PR fixing the same bug, requesting my review.",
        },
        { type: "prose", text: "Top response: *\"Definitely bad etiquette. If they had an issue, they need to work with you and find common ground on how to fix it. But just blocking your work and doing it themselves is borderline toxic.\"*" },
        { type: "prose", text: "**The fix:** if you disagree with an approach, say so in the review, propose your alternative in words, and let the author decide. Only open your own PR with the author's agreement." },
      ],
    },
    {
      id: `${partId}--4-9-re-reviewing-on-round-2-with-brand-new-feedback`,
      title: "4.9 Re-reviewing on round 2 with brand-new feedback",
      partId,
      blocks: [
        { type: "prose", text: "**The pattern:** reviewer leaves a batch of comments, author addresses them, reviewer comes back with *new* comments on untouched code. Infinite-review trap." },
        {
          type: "quote",
          sourceId: "prog-make-enemies",
          text: "Do the review in parts. Let them collect all the feedback, wait for them to apply it. Then re-review it and come up with totally new stuff on unchanged lines that were not part of the initial feedback. Best way is to do your review in 3 parts or more!",
        },
        { type: "prose", text: "(That's obviously satirical — but it's satire *because* people actually do this.)" },
        { type: "prose", text: "**The fix:** do the whole review in one pass. If you find something new on round 2, acknowledge that it's new and shouldn't block this PR (\"noticed this while reviewing your fix, consider a follow-up\")." },
      ],
    },
    {
      id: `${partId}--4-10-the-look-like-youre-working-review`,
      title: "4.10 The \"look like you're working\" review",
      partId,
      blocks: [
        { type: "prose", text: "**The pattern:** leaving comments for the sake of leaving comments, because approving with zero feedback feels lazy." },
        { type: "prose", text: "The antidote to this is approving with explicit praise when praise is warranted (\"this is a clean refactor, nothing to add\"). That's the equal-and-opposite of rubber-stamping: real engagement that also doesn't manufacture complaints." },
      ],
    },
  ],
};
