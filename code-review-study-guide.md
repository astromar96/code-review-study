# Code Review: A Study Guide from Reddit

A distilled reader on how to get better at code review — both as a reviewer and as
an author — built from 22 high-signal threads across r/ExperiencedDevs,
r/programming, r/cscareerquestions, r/webdev, and r/AskProgramming. Every lesson
below is anchored to a quote from a real developer and links back to the source
thread so you can go read the full discussion.

This guide is intentionally opinionated where Reddit is opinionated, and neutral
where Reddit is split. When developers disagree — and they disagree a lot on
code review — both sides are presented.

---

## How to use this guide

- **Read it once end-to-end.** Each part is short. The goal is to build a mental
  model, not memorize rules.
- **Then skim the quick-reference checklists** at the end. Pin them somewhere.
- **Click through to the source threads** for any topic that hits close to
  something you're currently struggling with. Reading ten devs fight about it is
  usually more useful than reading the synthesis.
- **Revisit quarterly.** Your own review style is shaped by the last team you
  worked on; this guide is a way to recalibrate against the wider industry.

---

## Core principles (the spine of everything below)

These four ideas show up everywhere in the threads. Most concrete advice is a
corollary of one of them.

1. **Code review is a communication skill more than a technical skill.** You are
   writing to a human who will be in the same Slack tomorrow. Tone, framing, and
   choice of battles matter more than finding every defect.
2. **Small + self-reviewed + well-described beats everything else.** The single
   biggest lever an author controls is the size and clarity of their PR, not how
   good the code is.
3. **Automate anything a machine can check.** Style, formatting, lint, simple
   complexity thresholds — these should never reach a human reviewer. Humans
   fighting about tabs is a failure of tooling.
4. **Culture is top-down.** If management rewards velocity and punishes
   "blockers," reviews rot into LGTM rubber-stamps regardless of what any
   individual does. You can push back against this, but know what you're
   pushing against.

---

# Part 1 — Reviewing others' code

## 1.1 What to actually look for

The consensus priority order in reviews:

1. **Correctness and risk.** Does this introduce bugs, data loss, race
   conditions, security holes, or failure modes that aren't behind a feature
   flag?
2. **Design and structure.** Is this in the right place? Is it creating
   duplication? Is it coupling things that shouldn't be coupled?
3. **Readability and maintainability.** Will the next person understand this?
   Are the names accurate to what the thing actually does?
4. **Tests.** Do they exist? Do they cover the behavior the code claims to
   implement, not just "assert true == true"?
5. **Nits (style, naming preferences, minor refactors).** Only after all of the
   above.

> *"I point out real bugs, mistakes we can't undo, or risks that aren't behind
> feature flags. If there aren't any problems like that, then I approve. When I
> approve, that's when the nitpicks and lower-priority feedback comes out."*
> — [r/ExperiencedDevs — "How do you give real code review feedback without sounding bossy?"](https://www.reddit.com/r/ExperiencedDevs/comments/1l4lsfw/how_do_you_give_real_code_review_feedback_without/)

The important pairing: **approve + leave nits is a legitimate outcome**, and
so is **block + explain the blocker**. Conflating the two (a blocking review
over a naming preference) is where most review conflict comes from.

Be aware of where reviews are **not** effective:

> *"Code reviews almost never catch serious problems. It would be nice if they
> did … realistically they don't. I test code for a living, if your code
> reviews caught the bugs, I'd be out of a job."*
> — [r/programming — "Code Review: How to make enemies"](https://www.reddit.com/r/programming/comments/v8f5lx/code_review_how_to_make_enemies/)

> *"Code review is an awful place to bring up [habitual style issues]. Those
> things are habits. For habits you need a very short feedback loop. I recommend
> pair programming, and evolve those things while pairing. Code review is
> better to check for correctness, and overall structure."*
> — [r/ExperiencedDevs — "I stopped caring about code quality during code reviews"](https://www.reddit.com/r/ExperiencedDevs/comments/ze31zn/i_stopped_caring_about_code_quality_during_code/)

Translation: if you're finding the same small-habit issues on every PR, stop
writing comments and start pairing or writing a lint rule.

## 1.2 What NOT to look for (automate it or skip it)

Things a reviewer should never manually catch:

- **Formatting, indentation, spacing, quote style.** Prettier/gofmt/black/etc.
- **Linting violations.** ESLint, ruff, golangci-lint.
- **Import order and relative-vs-absolute imports.** If the team has a rule,
  encode it.
- **Trailing whitespace, missing newlines.** Editor config.
- **Simple complexity caps** (max cyclomatic complexity, max function length).
  Lint rule.

> *"If it can't go into a lint rule, it doesn't exist. Simple. You have a style
> preference? Fine, I probably don't give a fuck. Write a lint rule."*
> — [r/ExperiencedDevs — "How do you handle teammates who are extremely pedantic about arbitrary rules?"](https://www.reddit.com/r/ExperiencedDevs/comments/1rq4prb/how_do_you_handle_teammates_who_are_extremely/)

> *"Offload as much CR work to robots as possible. It's much less of a personal
> affront to be told your code sucks by a mindless robot, than by a coworker."*
> — [r/ExperiencedDevs — "How to deal with a heavily nitpicky and opinionated developer"](https://www.reddit.com/r/ExperiencedDevs/comments/qt8xht/how_to_deal_with_a_heavily_nitpicky_and/)

If your team doesn't have this tooling yet, the highest-leverage review comment
you can make is a PR to add it — not another comment on someone else's PR.

## 1.3 How to phrase feedback

This is the part of code review people actually get wrong. Two opposing failure
modes:

- **Too curt.** Comes across as blaming or god-complex. ("This is wrong." "Why
  did you do it this way?" with no context.)
- **Too padded.** Hidden under "maybe consider," "wondering if," "just a
  thought." Author reads it as optional, ships broken code.

The technique most upvoted on Reddit: **phrase as a question when you're
genuinely curious; state a position when you have one.** Don't fake-Socratic.

> *"What are the benefits of doing X rather than Y?" — Perhaps the reviewee
> realizes that Y is actually a better choice, or maybe they reply with some
> considerations the reviewer didn't make. Either way the team will have a
> better understanding of the tradeoffs."*
> — [r/programming — "How to Do Code Reviews Like a Human"](https://www.reddit.com/r/programming/comments/75wmuw/how_to_do_code_reviews_like_a_human/)

> *"Personal preference but I loathe passive-aggressive questions in PR reviews.
> It feels infantilizing. If you think something should be different, say so
> and say why. If you actually don't understand why they made a choice, ask
> about that."*
> — [r/ExperiencedDevs — "How do you give real code review feedback without sounding bossy?"](https://www.reddit.com/r/ExperiencedDevs/comments/1l4lsfw/how_do_you_give_real_code_review_feedback_without/)

A widely-cited example of going *too* soft, from an author trying to tell a
junior their PR has no error handling:

> *"This works! One thing to maybe consider: what would happen if this call
> fails mid-request? Wondering if wrapping it in a retry + logging block might
> help."*

The top reply:

> *"You've gone way overboard. This is far too indirect. You make it sound
> like it's good work and you're wondering about a nice-to-have. You don't
> have to be scared and apologetic for giving something other than 100%
> praise. … Juniors need clear signals to understand where they are going
> wrong. She skipped error handling altogether! That is not a minor thing and
> you shouldn't be teaching her it is."*
> — same thread as above

**Three concrete framing tricks that are repeatedly praised:**

### Use "we" instead of "I/you"

> *"I now try to phrase everything in terms of 'we'. For example, 'We may want
> to do things this other way. Could we change this code to do things the
> other way?' This removes the implication of blame or shortcoming, and the
> implication that my way is the right way."*
> — [r/ExperiencedDevs — "Do people think your PR comments sound arrogant or judgmental?"](https://www.reddit.com/r/ExperiencedDevs/comments/u6fxbm/do_people_think_your_pr_comments_sound_arrogant/)

Caveat: "we" framing can feel infantilizing in some cultures and between peers
of similar seniority. Read the room.

### Keep each comment short (~300 chars)

> *"It turns out a wall-of-text response reads like a litany of complaints, no
> matter how well-intended. Now I just save my walls-of-text in a local
> document on my computer, include a summary in the PR comment, and reach out
> to the developer to see if they want to huddle to talk through it."*
> — same thread

### Comment on the good things too

> *"Someone solved a hard problem with a good idea? Let them know! 200 lines of
> frontend code replaced by a library? Give thanks. New tests added? Let them
> know it's awesome to see. Commenting on good behaviours reinforces them."*
> — same thread

There's a minority view that praise is noise, which is worth knowing:

> *"If something I wrote needs to be changed or there's a better way, I'd
> rather you just tell it to me and not feel the need to wrap it in
> politeness or add other positive comments to 'soften the blow'. The other
> stuff really just wastes time."*
> — [r/AskProgramming — "What do you think about words of praise in code review comments?"](https://www.reddit.com/r/AskProgramming/comments/i5bbdo/what_do_you_think_about_words_of_praise_in_code/)

The majority position, though: **juniors in particular need it.** "Smiley
faces work very well when communicating with juniors. We forget as seniors
that in many cases they're actually afraid of us."

## 1.4 Marking severity: nit / suggestion / blocking

The single most recommended resource across the threads is **Conventional
Comments** (<https://conventionalcomments.org/>), which prefixes every comment
with its intent:

- `nit:` — minor, non-blocking preference
- `suggestion:` — a proposal, take it or leave it
- `question:` — genuinely asking
- `issue:` — must address
- `praise:` — explicit positive feedback
- `thought:` — idea for the future, not this PR

Also widely referenced: **Netlify's feedback ladder** and **the Code Review
Emoji Guide**. The specific system matters less than *having* one — your author
should never have to guess whether a comment is blocking.

> *"NIT: a small change or opinion that doesn't affect my approval for this
> MR. Proceed at your own discretion but let's discuss this so we can agree on
> a standard moving forward."*
> — [r/ExperiencedDevs — "What is nitpicking in code reviews"](https://www.reddit.com/r/ExperiencedDevs/comments/1g2voyl/what_is_nitpicking_in_code_reviews/)

Nitpicks still belong in reviews — the rule is that they shouldn't block merge
and should be clearly labeled. Dismissing all nits leads to code rot; letting
all nits block leads to the 180-comment first-PR hazing described in section
4.2.

## 1.5 When to approve, when to block

A useful heuristic that cuts through most approve/block debate:

> *"I'll only approve a change if it would be okay to check in as-is. That
> might happen when I still have open comments if they're optional (e.g.
> 'consider making this a file-level constant'), but never if they're
> required."*
> — [r/ExperiencedDevs — "Should I approve a Pull request with nitpicky comments?"](https://www.reddit.com/r/ExperiencedDevs/comments/zpwdko/should_i_approve_a_pull_request_with_nitpicky/)

In other words: **if a comment is blocking, don't approve. If it's not
blocking, label it as a nit and approve.** The ambiguous middle (lots of
nits, some of which you'd really like addressed but none of which you're
willing to block on) is where reviewer/author frustration lives.

Reddit is split on whether "approve with a list of nits the author is trusted
to fix" is fine:

- **Pro** (majority on busy teams): *"If you can trust them to fix the
  nitpick stuff after you approve then no worries. If you need to hound them
  more then you need to be more conservative with your PR approvals."*
- **Con**: *"What's the point in having any of these rules if they aren't
  enforced? By approving you're saying none of these things are important."*

The deciding factor is trust and the maturity of the CI pipeline. If linting
fails the build, "approve with nits" is safe. If it doesn't, nits slip
permanently into main.

## 1.6 When to stop typing and talk

The most consistent advice across the entire corpus is the **2-comment rule**:
if you and the author have both replied to a comment without converging, take
it off the PR.

> *"Having long discussions as text only rarely is productive. If I'm
> following the 2-comment rule then I would contact [the author] and we'd
> talk about it."*
> — [r/ExperiencedDevs — "Do people think your PR comments sound arrogant or judgmental?"](https://www.reddit.com/r/ExperiencedDevs/comments/u6fxbm/do_people_think_your_pr_comments_sound_arrogant/)

Other times to drop async and go synchronous:

- You're about to leave >5 comments in a row.
- You notice a structural problem that invalidates the approach.
- You disagree on something that needs product/architectural context.
- You feel irritated while typing. (You will type something you'll regret.)
- You suspect the author is a junior who doesn't know what they don't know.

> *"I prefer face-to-face reviews. It's so much easier to spin up a casual
> conversation about the general approach and inject a question or raise a
> point like this in a natural way."*
> — [r/ExperiencedDevs — "How do you give real code review feedback without sounding bossy?"](https://www.reddit.com/r/ExperiencedDevs/comments/1l4lsfw/how_do_you_give_real_code_review_feedback_without/)

## 1.7 The reviewer's ethical duties to juniors

Two non-negotiables from the threads:

1. **Don't write their code for them.** Point in the direction; don't ship the
   fix via suggestion-button.
2. **Don't be vague with them.** Juniors read politeness as optionality. If
   something is wrong, say so clearly and explain why.

> *"Absolutely do not write the code for her. Your job is to point her in the
> right direction, not to do her work for her."*
> — [r/ExperiencedDevs — "How do you give real code review feedback without sounding bossy?"](https://www.reddit.com/r/ExperiencedDevs/comments/1l4lsfw/how_do_you_give_real_code_review_feedback_without/)

> *"Juniors aren't fragile. Bad production code is. Block the CR. Spell out
> the risk. Offer help. Then move on, you are protecting customers, not
> auditioning for Most Friendly Reviewer."*
> — same thread

---

# Part 2 — Receiving reviews (as the author)

## 2.1 The single most-leveraged habit: self-review

Before asking anyone else to look at your PR, **open the diff in the web UI
and read it as if a stranger wrote it.** This is *the* most praised author
habit in the corpus.

> *"The self-review is when you, the author, look at the same commit stack in
> a diff viewer like Github's and think about whether that commit stack is
> ready to merge. You aim to consider the change as the reviewer would. … You
> must transition from author to critic, something our human psychology is
> ill-suited to perform."*
> — [r/ExperiencedDevs — "The Pull Request Self-Review"](https://www.reddit.com/r/ExperiencedDevs/comments/1f5qo8x/the_pull_request_selfreview/)

> *"I catch so much stuff that way. For some reason viewing the code on a PR
> makes me analyse it in a different way to when I'm writing it."*
> — [r/programming — "How to Make Your Code Reviewer Fall in Love with You"](https://www.reddit.com/r/programming/comments/k5cbln/how_to_make_your_code_reviewer_fall_in_love_with/)

Specific self-review tactics from the threads:

- Open the PR in **draft** first. Don't mark ready-for-review until you've
  gone through the diff.
- **Leave comments on your own PR** to pre-answer things the reviewer will
  wonder about: *"these lines here do the key part," "no, I can't remove
  this workaround yet, because…"*
- Wait until CI is green. Don't make the reviewer be your CI.
- **Sleep on it** when possible. Morning-you is a better reviewer than
  tired-you.
- Delete commented-out code, debug prints, noisy test logs, `TODO(me)`.

There's a small minority that thinks this shouldn't need saying:

> *"The fact that we need thousand word essays about and have to label it
> 'the self-review' makes me weep for this industry. Anybody not reviewing
> their own code is just a bloody substandard developer."*
> — [r/ExperiencedDevs — "The Pull Request Self-Review"](https://www.reddit.com/r/ExperiencedDevs/comments/1f5qo8x/the_pull_request_selfreview/)

The dominant view: it *does* need saying, because most people don't do it.

## 2.2 Keep PRs small

This is the single biggest author-side lever for getting good reviews.

> *"Don't make large pull requests then. Easier said than done but it's just
> human nature, find 100 things wrong in 10 lines of code but 0 in 1000,
> breaking it up helps people focus on a specific change."*
> — [r/ExperiencedDevs — "How do you stop PR bottlenecks from turning into rubber stamping"](https://www.reddit.com/r/ExperiencedDevs/comments/1rv1ut2/how_do_you_stop_pr_bottlenecks_from_turning_into/)

> *"There are 0 reasons to ever accept a thousand line PR. AI or not. This is
> not an AI issue, it's a quality of work issue. … No PR over 200 (or
> whatever your team deems acceptable) lines will be reviewed. Learn to break
> up changes into manageable chunks."*
> — [r/ExperiencedDevs — "AI Slop PR's are burning me and my team out hard"](https://www.reddit.com/r/ExperiencedDevs/comments/1kr8clp/ai_slop_prs_are_burning_me_and_my_team_out_hard/)

The counter-view is real: some features genuinely can't be split because
they're an all-or-nothing swap or a branch that's already in-flight. Even
then:

- Split *pre-refactors* out into their own PRs ("make the change easy, then
  make the easy change").
- Ship behind a feature flag so you can merge incremental PRs.
- If you must ship big, **give the reviewer advance notice and schedule a
  walkthrough**.

> *"What's the difference between reviewing 5 small PRs of 50 lines each or a
> single 250 line PR? Review time? N minutes for each small one or 5N minutes
> for the large one. It comes down to expectations. If you ask someone to
> review, give them advance notice. Context of what your feature is. Tell
> them it's big."*
> — [r/ExperiencedDevs — "How do you stop PR bottlenecks from turning into rubber stamping"](https://www.reddit.com/r/ExperiencedDevs/comments/1rv1ut2/how_do_you_stop_pr_bottlenecks_from_turning_into/)

### Separate refactoring from behavior change

Whether you split into multiple PRs or just multiple commits within one PR,
the refactor-vs-behavior split is almost universally praised:

> *"First make your change/fix, and then refactor the code to make it look
> like your change was always part of the design to begin with. OR first
> refactor the code to make your change easy. Then make your change. In
> either case it will be very helpful for your reviewer to separate out the
> pure-refactoring code (which can be messy, but shouldn't change any logic)
> from the actual change itself."*
> — [r/programming — "How to Make Your Code Reviewer Fall in Love with You"](https://www.reddit.com/r/programming/comments/k5cbln/how_to_make_your_code_reviewer_fall_in_love_with/)

## 2.3 Write the PR description the reviewer needs

The threads are less explicit about description discipline than about PR size,
but the consensus habits:

- **Why, not what.** The diff shows what. The description explains why.
- **Tell the reviewer what to focus on** and what you've already verified.
- **Link the ticket/bug/design-doc.**
- **Call out intentional non-obvious choices.** ("I'm not catching this
  exception on purpose because…")
- **Mention what's out of scope.** Keeps reviewers from asking for the
  universe.
- **Include screenshots/recordings for UI changes.**

A strong signal of a good author culture, seen across multiple threads, is
**reviewers who pre-comment on their own PR** to flag tricky bits. This and a
good description are nearly equivalent.

## 2.4 Respond to feedback without ego

> *"Don't forget that a code review is not a critique of you and your
> personality. Admit that you write bugs. … Be happy when your code reviewer
> kicks your steaming pile of spaghetti back at you. That reviewer may have
> just saved you the embarrassment of having the test lead email your
> management."*
> — [r/programming — "How to Do Code Reviews Like a Human"](https://www.reddit.com/r/programming/comments/75wmuw/how_to_do_code_reviews_like_a_human/)

> *"Readability is determined by people who didn't write the code. You don't
> get to decide if code you wrote is easy to read and understand. Of course
> you understand it yourself! If a reviewer says there's a problem with
> readability, those words are THE TRUTH, amen."*
> — [r/programming — "How to Make Your Code Reviewer Fall in Love with You"](https://www.reddit.com/r/programming/comments/k5cbln/how_to_make_your_code_reviewer_fall_in_love_with/)

A practical posture: **if a change is small and the reviewer feels strongly,
just do it.** The time cost of making a small change is always less than the
time cost of arguing about it.

> *"If it's a nitpick i usually respond with 'sure' or a thumbs up and just
> do the change, because it'll take me less time to do the change than argue
> about something pointless."*
> — [r/ExperiencedDevs — "Best way to manage super pedantic team members?"](https://www.reddit.com/r/ExperiencedDevs/comments/1enrjmg/best_way_to_manage_super_pedantic_team_members/)

## 2.5 How to push back (and when)

Pushing back is fine, often necessary, and a sign of a healthy team. What's
*not* fine: "I just don't want to" with no rationale.

The formula that gets approval:

1. Acknowledge you've understood the concern.
2. State your rationale with concrete reasoning.
3. Offer to switch to a sync conversation if you suspect you're going to loop.
4. If you're still stuck after one round, get a third opinion or escalate.

> *"Some comments are a good net positive for the code, your work, and the
> codebase, and those should be added and implemented. Some others are not.
> A firm 'no unless you provide a solid technical reason beside your
> opinionated taste' sometime is necessary. You should stand for yourself."*
> — [r/ExperiencedDevs — "How to deal with a heavily nitpicky and opinionated developer"](https://www.reddit.com/r/ExperiencedDevs/comments/qt8xht/how_to_deal_with_a_heavily_nitpicky_and/)

> *"It's a code review, not a code demand letter. You don't have to actually
> do what the other developer is suggesting, especially if it's just 'I find
> it weird'. Just comment 'Thanks for the suggestion but in this case I think
> what I am doing is a better choice.' and don't change it."*
> — same thread

A good team rule for disputes:

> *"We have a rule that the author of the PR is an owner, and unless the PR
> is blocked — an owner can dismiss the comment, saying 'I prefer it this
> way'."*
> — [r/ExperiencedDevs — "Best way to manage super pedantic team members?"](https://www.reddit.com/r/ExperiencedDevs/comments/1enrjmg/best_way_to_manage_super_pedantic_team_members/)

### When *not* to push back

- The reviewer says it's confusing. (See the quote above — readability is
  decided by the reader.)
- The feedback concerns a real bug or risk, regardless of how it's phrased.
- It's a 30-second change.

## 2.6 Don't launder your review replies through AI

This is the most emotionally heated topic in recent threads.

> *"I'll spend 20 minutes writing a comment on his PR… giving context to some
> niche code path, how it interacts with other code paths. … Then I'll get
> back 5 paragraphs of perfect English with a jovial tone saying my points
> are so valid and here's why my coworker made this change. … Clearly my
> coworker took my painstaking reply, fed it into some model with a prompt
> like 'reply to this', and copy/pasted it back. Now instead of trying to
> work through the language barrier, I'm forced to interact with yet another
> chatbot instead of a human."*
> — [r/ExperiencedDevs — "My coworker uses AI to reply to my PR review and I hate it"](https://www.reddit.com/r/ExperiencedDevs/comments/1nq5npn/my_coworker_uses_ai_to_reply_to_my_pr_review_and/)

Top-rated reactions:

> *"If you can't take the time to write this, why should I take the time to
> read it?"*

> *"My line on this now is that if you can't be bothered writing it I can't
> be bothered reading it."*

> *"The core issue is that he's carelessly putting cognitive burden on you to
> read the AI summary and then craft a reply, point by point, but he hasn't
> put equal effort into the summary generation. It creates a weird power
> imbalance where the person using AI can flood everyone with 'their'
> content."*

The practical rule: **use AI to help you think or draft, but read it, edit
it, own it, and reply in your own voice.** Especially don't paste the
reviewer's comment into a chatbot and paste the output back unread — that's
the specific behavior getting people escalated to HR.

---

# Part 3 — Team & process

Individual review skill only goes so far. The threads make clear that most
review dysfunction is structural, not personal.

## 3.1 Automate everything a machine can check

Already covered in 1.2; repeated here because it's a team-level investment:

- Auto-format on commit (pre-commit hooks).
- Lint and type-check in CI, blocking merge.
- Static analysis (Sonarqube, codeclimate) for complexity/coverage
  thresholds.
- PR-size check — one team reports great results from a CI step that flags
  PRs >400 lines with a "needs walkthrough" label.

> *"The biggest thing that fixed this for us was not a process change but a
> tooling change. We added a CI step that flags PRs over 400 lines with a
> 'needs walkthrough' label. Author has to schedule a 15 minute screen share
> before it can be approved. … Killed rubber stamping almost overnight."*
> — [r/ExperiencedDevs — "How do you stop PR bottlenecks from turning into rubber stamping"](https://www.reddit.com/r/ExperiencedDevs/comments/1rv1ut2/how_do_you_stop_pr_bottlenecks_from_turning_into/)

## 3.2 Document the rules or they don't exist

Undocumented rules create the "first-PR hazing" pattern where every new hire
gets 180 comments learning the team's unwritten preferences.

> *"Ask them to document expectations. If it's not documented it is not a
> rule. Now it's their problem."*
> — [r/ExperiencedDevs — "How do you handle teammates who are extremely pedantic about arbitrary rules?"](https://www.reddit.com/r/ExperiencedDevs/comments/1rq4prb/how_do_you_handle_teammates_who_are_extremely/)

> *"Document your coding guidelines, making each section deep-linkable. If
> you can back up a CR comment with a link to a specific documented
> guideline, it's less of a me-versus-you scenario."*
> — [r/ExperiencedDevs — "How to deal with a heavily nitpicky and opinionated developer"](https://www.reddit.com/r/ExperiencedDevs/comments/qt8xht/how_to_deal_with_a_heavily_nitpicky_and/)

Good team practice: **every recurring review comment is a candidate for either
(a) a lint rule, or (b) a line in the style guide.** If neither, you probably
shouldn't be writing the comment repeatedly.

## 3.3 Small-PR culture is a top-down decision

If management measures velocity by feature throughput, people write big PRs
because small ones feel like bureaucratic overhead. If management backs "big
PRs get refactored before review," the culture flips.

> *"We don't allow large prs, and management backs this. You make a 5k loc
> change for a small feature that's in 1 commit? Congrats you get to spend
> time refactoring. 'This is too verbose for me to approve' is a complete
> sentence where I work."*
> — [r/ExperiencedDevs — "AI Slop PR's are burning me and my team out hard"](https://www.reddit.com/r/ExperiencedDevs/comments/1kr8clp/ai_slop_prs_are_burning_me_and_my_team_out_hard/)

Rules that teams with healthy review cultures actually enforce:

- PR must address a single issue.
- PR must have tests (or an explicit "no tests because X" in the
  description).
- PR must pass CI before review.
- PR over N lines must include a sync walkthrough or be split.

## 3.4 Protect against rubber-stamping

Rubber-stamping (instant LGTM on huge PRs) is the team-level failure mode of
review. Causes:

- Reviewers have too much queue, not enough time.
- Velocity/turnaround metrics reward clearing the queue.
- Social pressure to not be "the blocker."
- Authors are not trusted *and* not checked — the worst combo.

> *"If velocity pressure is so high that thorough review isn't valued or
> rewarded, then people will optimize for clearing their review queue
> quickly."*
> — [r/ExperiencedDevs — "How do you stop PR bottlenecks from turning into rubber stamping"](https://www.reddit.com/r/ExperiencedDevs/comments/1rv1ut2/how_do_you_stop_pr_bottlenecks_from_turning_into/)

Counterweights that work:

- **Stop measuring PR-review turnaround time as a team KPI.** It directly
  incentivizes rubber-stamping.
- Introduce the size-gated walkthrough rule (3.1).
- Pair-review big PRs: two reviewers compare notes.
- Rotate reviewers so no one becomes the only reviewer of a domain.

There's a dissenting perspective worth reading: LGTM on a small, trusted PR
is *not* rubber-stamping, it's efficient. The failure mode is specifically
LGTM on *complex or risky* PRs with no engagement.

> *"I do this all the time — if the code works and looks good then I think
> approving with LGTM is the best course of action. I probably request
> changes on about 25% of PRs, and it's usually a suggested improvement
> rather than anything else. I don't understand why every comment on this
> sub in this situation has such a different strategy to me."*
> — same thread

## 3.5 Review culture needs management backing

A recurring melancholy thread: engineers who care about code quality burn out
in environments that don't reward it.

> *"I've found that [protecting the codebase] is not only a thankless task,
> it's a task that will usually damage your career. … Your coworkers will
> probably resent you for overruling their coding decisions. Your cleanup
> work will enable your coworkers to move at a faster speed and avoid bugs
> and they will take the credit for that. You will be seen as a stick in the
> mud who doesn't produce shiny features."*
> — [r/ExperiencedDevs — "Do you ever start to feel like your primary job duty is to protect the codebase?"](https://www.reddit.com/r/ExperiencedDevs/comments/1pc9wu0/do_you_ever_start_to_feel_like_your_primary_job/)

> *"People always do what they're incentivized to do. If a company wants
> features fast, they build features fast. … Inserting yourself as the
> self-imposed (rather than management-directed) arbiter of code quality is
> career suicide."*
> — same thread

What to do about it: raise quality as a business concern (tie tech debt to
measurable slowdowns, bug rates, attrition), not a moral one. If management
won't listen, either let go of the perfectionism to avoid burnout, or
eventually change teams/companies. Neither is a failure — it's a skill to
recognize which game you're playing.

## 3.6 Review in the AI era

Three durable observations from 2024–2026 threads:

### (a) Hold AI-generated PRs to the same standard as human ones

> *"You hold it to the same standards as regular PRs. If there's too many
> problems to list, just cover the big themes. If it becomes a recurring
> pattern then you need to get engineering managers involved."*
> — [r/AskProgramming — "How do you handle obviously vibe coded PR's?"](https://www.reddit.com/r/AskProgramming/comments/1shyqso/how_do_you_handle_obviously_vibe_coded_prs/)

There's a minority view — "give the same amount of effort back that was put
in, which is zero" — but the majority position is that the author is
accountable for the code regardless of how it was written.

> *"The first pass on a PR should be the person who authored it. AI might
> generate code but the person writing the prompts owns the change."*
> — [r/ExperiencedDevs — "AI Slop PR's are burning me and my team out hard"](https://www.reddit.com/r/ExperiencedDevs/comments/1kr8clp/ai_slop_prs_are_burning_me_and_my_team_out_hard/)

### (b) Reviewing AI code takes longer, not shorter

> *"Estimate more time for code reviews, probably double that of non-AI code.
> With AI tools we are trading speed for understanding, which doesn't come
> for free, if we want to maintain quality."*
> — same thread

Why: AI code tends to be "plausible-looking" — syntactically fine, structured
in ways no human would naturally choose, occasionally with dangerous subtle
changes (weakened auth, over-broad try/catch, hallucinated dependencies).
Reviewers end up reading for *understanding* rather than *checking*, which is
slower work.

### (c) Watch for specific AI smells

Documented patterns to look for:

- **Try/catch around trivial code** (e.g., around a `console.log`).
- **Over-abstraction**: a 40-line helper that does what `Array.map` already
  does.
- **Misleading variable names** that sound right but don't match contents
  (e.g., `userPreferences` that holds a session token).
- **Hallucinated APIs or services** mocked out because they don't exist.
- **Tests that assert `true === true`** or mock the unit under test.
- **Silent changes to security or correctness** hidden inside an unrelated
  diff (auth early-return, for example).
- **5k+ line PRs** for what should be a 50-line change.

> *"Plausible-looking code that technically works but is structured in ways
> no human would choose. A try-catch around a console.log. A utility
> function that was 40 lines of enterprise-grade typescript doing exactly
> what Array.prototype.map already does. Variable names that sound right but
> don't match what the variable actually holds, like a thing called
> userPreferences that was actually a session token."*
> — [r/webdev — "I audited 6 months of PRs after my team went all-in on AI code generation"](https://www.reddit.com/r/webdev/comments/1sin68g/i_audited_6_months_of_prs_after_my_team_went/)

---

# Part 4 — Anti-patterns & horror stories

The shape of bad code review. Mostly collected negatively — these are things
to notice in yourself and your team and correct.

## 4.1 Nitpicking and bikeshedding

**The pattern:** spending the bulk of review time on style, naming
preferences, and structure that has no bearing on correctness. The technical
term is *bikeshedding* (arguing about the color of the bike shed while
ignoring the nuclear reactor).

**Why it happens:** nits are easy to find and fun to argue about. Real
design issues are hard. Reviewers gravitate to what they can comment on
confidently.

**The canonical tell:** 180 nit-level comments from 5 reviewers on a simple
refactor.

> *"For example, my first pull request for a relatively simple code refactor
> hit 180 comments from 5 different reviewers. 90% of the comments were
> nitpicks about spaces, symbol names, or grammar in code comments."*
> — [r/ExperiencedDevs — "How do you handle teammates who are extremely pedantic about arbitrary rules?"](https://www.reddit.com/r/ExperiencedDevs/comments/1rq4prb/how_do_you_handle_teammates_who_are_extremely/)

**The fix:** automate style (1.2), label severity (1.4), document rules
(3.2). If after all that someone is still writing 30 nit comments on a PR,
that's an interpersonal issue to escalate — not a review issue.

## 4.2 The first-PR hazing ritual

**The pattern:** new hires get dogpiled on their first few PRs with every
preference and unwritten rule the team has.

> *"The first 3–5 PRs in a new company are a dick measuring contest or
> initiation ritual. I've seen it happen many times. After 6 months it's
> gonna be LGTM directly."*
> — [r/ExperiencedDevs — "How do you handle teammates who are extremely pedantic about arbitrary rules?"](https://www.reddit.com/r/ExperiencedDevs/comments/1rq4prb/how_do_you_handle_teammates_who_are_extremely/)

**The fix (as a new hire):** do it for the first month. Accept that you're
learning. Keep a list of every unwritten rule you bump into, and at the end
of month one, propose codifying them as lint rules or a style-guide doc.
You'll look like a hero and you'll never have to argue about it again.

**The fix (as the team):** write the damn style guide before the new hire
starts.

## 4.3 The pedantic reviewer (disagreement over taste)

**The pattern:** one reviewer who requests changes on every PR based on
personal preference, without a rationale beyond "I don't like this" or
"big-corporation does it differently."

> *"He'll question and nitpick EVERY decision made, e.g. 'Why are the
> projects organized like this?', 'I hate XYZ feature of the language, we
> shouldn't use it', 'Don't you think that structure is odd?' … I try to
> understand where he's coming from, so I ask him and get answers such as
> 'big corporation recommends it this way', 'Ehh, I just find it weird'."*
> — [r/ExperiencedDevs — "How to deal with a heavily nitpicky and opinionated developer in code reviews?"](https://www.reddit.com/r/ExperiencedDevs/comments/qt8xht/how_to_deal_with_a_heavily_nitpicky_and/)

**Diagnostic:** if you ask "why?" and the answer is a preference, not a
reason, it's taste. Taste comments should be explicit nits, not blockers.

**The fix:** adopt the "author is owner" rule (2.5). Escalate patterns to a
manager with a time-cost case ("we spent 8 hours on naming debates this
sprint"). Don't try to win individual reviews — fix the system.

Some of the threads raise the possibility that pedantic reviewers have
undiagnosed neurodivergence or burnout. Useful to keep in mind for empathy,
not as an excuse for the behavior.

## 4.4 Passive-aggressive and fake-Socratic review styles

**The pattern:** questions that aren't questions. "Why did you do it this
way?" when the reviewer already has a strong opinion. "Wouldn't it be
*better* to…?"

> *"The worst question I get asked: 'Why did you pick this design?' or 'Why
> did you do it this way?' 'Because it solved the problem' is the answer, but
> not the one they are looking for. If they want a more meaningful answer,
> they need to share their concerns."*
> — [r/programming — "How to Do Code Reviews Like a Human"](https://www.reddit.com/r/programming/comments/75wmuw/how_to_do_code_reviews_like_a_human/)

**The fix:** if you have a position, state it with rationale. If you don't,
ask a question and mean it. Don't fake-Socratic your way into telling
someone they're wrong.

## 4.5 Rubber-stamping and review theatre

**The pattern:** approving PRs without reading them. Especially prevalent on
large PRs because reading them would take hours.

> *"Someone opens an 800-line PR touching a dozen files, and within minutes
> there's an approval with 'LGTM' and nothing else. No comments, no
> questions, no engagement with the changes."*
> — [r/ExperiencedDevs — "How do you stop PR bottlenecks from turning into rubber stamping"](https://www.reddit.com/r/ExperiencedDevs/comments/1rv1ut2/how_do_you_stop_pr_bottlenecks_from_turning_into/)

**The fix:** see 3.4. It's a team-level problem, not an individual one.

## 4.6 Laundering reviews through AI

Covered in 2.6 from the author's side. From the reviewer's side, the mirror
anti-pattern also exists: using AI to generate review comments you didn't
actually think through.

> *"Fight AI with AI? Use your own AI tool to give very strict code reviews."*
> — [r/ExperiencedDevs — "AI Slop PR's are burning me and my team out hard"](https://www.reddit.com/r/ExperiencedDevs/comments/1kr8clp/ai_slop_prs_are_burning_me_and_my_team_out_hard/)

Some teams do this deliberately with tools like CodeRabbit or codium-PRAgent
as a *first pass* — explicitly labeled as bot review — and then a human does
a second pass. That's fine. What's not fine is pretending AI-generated
review comments are your own thoughts.

## 4.7 The "protect the codebase" trap

**The pattern:** becoming the self-appointed quality gate on a team that
doesn't share your quality values. Ends in burnout or career damage.

> *"This is when you need to realize it's not your codebase and disconnect."*
> — [r/ExperiencedDevs — "Do you ever start to feel like your primary job duty is to protect the codebase?"](https://www.reddit.com/r/ExperiencedDevs/comments/1pc9wu0/do_you_ever_start_to_feel_like_your_primary_job/)

**The fix:** articulate quality in business terms (see 3.5), pick your
battles, and accept that you can't out-review bad incentives.

## 4.8 Opening a counter-PR to someone else's PR

**The pattern:** blocking someone's PR with "requested changes" and then
immediately opening a competing PR that fixes the same thing your way.

> *"My coworker reviewed the PR, blocking it by requesting changes and
> shortly after opened their own PR fixing the same bug, requesting my
> review."*
> — [r/ExperiencedDevs — "I opened a PR fixing a bug, coworker requested changes and then opened his own PR"](https://www.reddit.com/r/ExperiencedDevs/comments/1cs4xt7/i_opened_a_pr_fixing_a_bug_coworker_requested/)

Top response: *"Definitely bad etiquette. If they had an issue, they need to
work with you and find common ground on how to fix it. But just blocking
your work and doing it themselves is borderline toxic."*

**The fix:** if you disagree with an approach, say so in the review, propose
your alternative in words, and let the author decide. Only open your own PR
with the author's agreement.

## 4.9 Re-reviewing on round 2 with brand-new feedback

**The pattern:** reviewer leaves a batch of comments, author addresses them,
reviewer comes back with *new* comments on untouched code. Infinite-review
trap.

> *"Do the review in parts. Let them collect all the feedback, wait for them
> to apply it. Then re-review it and come up with totally new stuff on
> unchanged lines that were not part of the initial feedback. Best way is to
> do your review in 3 parts or more!"*
> — [r/programming — "Code Review: How to make enemies"](https://www.reddit.com/r/programming/comments/v8f5lx/code_review_how_to_make_enemies/)

(That's obviously satirical — but it's satire *because* people actually do
this.)

**The fix:** do the whole review in one pass. If you find something new on
round 2, acknowledge that it's new and shouldn't block this PR ("noticed
this while reviewing your fix, consider a follow-up").

## 4.10 The "look like you're working" review

**The pattern:** leaving comments for the sake of leaving comments, because
approving with zero feedback feels lazy.

The antidote to this is approving with explicit praise when praise is warranted
("this is a clean refactor, nothing to add"). That's the equal-and-opposite of
rubber-stamping: real engagement that also doesn't manufacture complaints.

---

# Quick reference: reviewer's checklist

Pin this next to your PR queue.

- [ ] Is the PR small enough that I can actually review it? If not, stop and
      ask the author to split it.
- [ ] Does it have a description that explains *why*? If not, ask.
- [ ] Is CI green? If not, wait.
- [ ] **First pass — correctness & risk.** Bugs, race conditions, security,
      data loss, error handling, auth, feature flags.
- [ ] **Second pass — design.** Is this in the right place? Duplication?
      Wrong coupling? Would this be easy to change later?
- [ ] **Third pass — readability.** Names accurate to what the thing does?
      Would a new hire understand this in 6 months?
- [ ] **Fourth pass — tests.** Present? Covering behavior, not
      implementation details?
- [ ] **Fifth pass — nits.** Clearly labeled `nit:` or `suggestion:`.
      Non-blocking.
- [ ] Am I about to leave >5 comments? Switch to a sync conversation.
- [ ] Is any comment a blocker? If yes, *don't* click approve. If no,
      approve and label the rest as nits.
- [ ] Did I comment on anything good? (Especially for juniors.)
- [ ] Would I be okay if this merged with just the non-blocking feedback
      addressed? That's my approval criterion.

---

# Quick reference: author's self-review checklist

Before you click "ready for review":

- [ ] Open the PR in the web UI and read the diff.
- [ ] Read it once for *correctness* — would I catch this if someone else
      wrote it?
- [ ] Read it once for *what the reviewer will ask* — pre-answer in a PR
      comment or simplify the code.
- [ ] Is the PR under ~200 lines? (If not, can I split it?)
- [ ] Is refactoring separated from behavior changes (at least in
      commits)?
- [ ] Is the description complete? Why + what + how-to-test + out-of-scope.
- [ ] Are the tests real or placeholder? Would they catch a regression?
- [ ] Is CI green?
- [ ] Any commented-out code, debug prints, TODOs meant for me only —
      removed?
- [ ] If any code was AI-assisted: did I read every line and can I defend
      it in a review?

When feedback arrives:

- [ ] Read all comments before replying to any.
- [ ] Thank the reviewer for catching real issues.
- [ ] If a change is small and the reviewer cares — just do it.
- [ ] If I disagree, state my reasoning with concrete rationale, once.
- [ ] If still deadlocked after one round, switch to a sync conversation.
- [ ] Never paste the review into a chatbot and paste its output back.
      Reply in my own voice.

---

# Appendix — Source threads

All 22 threads used in this guide, ordered by score. Click through for the
full discussion — most have 100+ comments with perspectives not captured
here.

- [r/webdev — "I audited 6 months of PRs after my team went all-in on AI code generation" (2035)](https://www.reddit.com/r/webdev/comments/1sin68g/i_audited_6_months_of_prs_after_my_team_went/)
- [r/ExperiencedDevs — "My coworker uses AI to reply to my PR review and I hate it" (1500)](https://www.reddit.com/r/ExperiencedDevs/comments/1nq5npn/my_coworker_uses_ai_to_reply_to_my_pr_review_and/)
- [r/programming — "How to Make Your Code Reviewer Fall in Love with You" (3131)](https://www.reddit.com/r/programming/comments/k5cbln/how_to_make_your_code_reviewer_fall_in_love_with/)
- [r/programming — "How to Do Code Reviews Like a Human" (2421)](https://www.reddit.com/r/programming/comments/75wmuw/how_to_do_code_reviews_like_a_human/)
- [r/programming — "Code Review: How to make enemies" (1251)](https://www.reddit.com/r/programming/comments/v8f5lx/code_review_how_to_make_enemies/)
- [r/ExperiencedDevs — "AI Slop PR's are burning me and my team out hard" (1149)](https://www.reddit.com/r/ExperiencedDevs/comments/1kr8clp/ai_slop_prs_are_burning_me_and_my_team_out_hard/)
- [r/ExperiencedDevs — "Just failed a code review interview as 7 YOE" (624)](https://www.reddit.com/r/ExperiencedDevs/comments/1r9c4pw/just_failed_a_code_review_interview_as_7_yoe_and/)
- [r/ExperiencedDevs — "6 Lessons I learned from working at a dysfunctional workplace!" (622)](https://www.reddit.com/r/ExperiencedDevs/comments/v45x2y/6_lessons_i_learned_from_working_at_a/)
- [r/ExperiencedDevs — "Do you ever start to feel like your primary job duty is to protect the codebase?" (602)](https://www.reddit.com/r/ExperiencedDevs/comments/1pc9wu0/do_you_ever_start_to_feel_like_your_primary_job/)
- [r/ExperiencedDevs — "Do people think your PR comments sound arrogant or judgmental?" (557)](https://www.reddit.com/r/ExperiencedDevs/comments/u6fxbm/do_people_think_your_pr_comments_sound_arrogant/)
- [r/ExperiencedDevs — "I stopped caring about code quality during code reviews" (519)](https://www.reddit.com/r/ExperiencedDevs/comments/ze31zn/i_stopped_caring_about_code_quality_during_code/)
- [r/ExperiencedDevs — "I opened a PR fixing a bug, coworker requested changes and then opened his own PR" (288)](https://www.reddit.com/r/ExperiencedDevs/comments/1cs4xt7/i_opened_a_pr_fixing_a_bug_coworker_requested/)
- [r/ExperiencedDevs — "How do you handle teammates who are extremely pedantic about arbitrary rules?" (271)](https://www.reddit.com/r/ExperiencedDevs/comments/1rq4prb/how_do_you_handle_teammates_who_are_extremely/)
- [r/ExperiencedDevs — "The Pull Request Self-Review" (265)](https://www.reddit.com/r/ExperiencedDevs/comments/1f5qo8x/the_pull_request_selfreview/)
- [r/ExperiencedDevs — "What is nitpicking in code reviews" (222)](https://www.reddit.com/r/ExperiencedDevs/comments/1g2voyl/what_is_nitpicking_in_code_reviews/)
- [r/ExperiencedDevs — "How do you stop PR bottlenecks from turning into rubber stamping" (218)](https://www.reddit.com/r/ExperiencedDevs/comments/1rv1ut2/how_do_you_stop_pr_bottlenecks_from_turning_into/)
- [r/ExperiencedDevs — "Should I approve a Pull request with nitpicky comments?" (182)](https://www.reddit.com/r/ExperiencedDevs/comments/zpwdko/should_i_approve_a_pull_request_with_nitpicky/)
- [r/ExperiencedDevs — "Best way to manage super pedantic team members?" (146)](https://www.reddit.com/r/ExperiencedDevs/comments/1enrjmg/best_way_to_manage_super_pedantic_team_members/)
- [r/ExperiencedDevs — "How do you give real code review feedback without sounding bossy?" (132)](https://www.reddit.com/r/ExperiencedDevs/comments/1l4lsfw/how_do_you_give_real_code_review_feedback_without/)
- [r/ExperiencedDevs — "How to deal with a heavily nitpicky and opinionated developer in code reviews?" (122)](https://www.reddit.com/r/ExperiencedDevs/comments/qt8xht/how_to_deal_with_a_heavily_nitpicky_and/)
- [r/AskProgramming — "How do you handle obviously vibe coded PR's?" (56)](https://www.reddit.com/r/AskProgramming/comments/1shyqso/how_do_you_handle_obviously_vibe_coded_prs/)
- [r/AskProgramming — "What do you think about words of praise in code review comments?" (51)](https://www.reddit.com/r/AskProgramming/comments/i5bbdo/what_do_you_think_about_words_of_praise_in_code/)

## External resources cited in the threads

- [Conventional Comments](https://conventionalcomments.org/) — the most
  recommended comment-labeling convention.
- [Netlify feedback ladders](https://www.netlify.com/blog/2020/03/05/feedback-ladders-how-we-encode-code-reviews-at-netlify/) —
  a severity-grading system for review comments.
- [Code Review Emoji Guide](https://github.com/erikthedeveloper/code-review-emoji-guide) —
  a lighter-weight visual convention.

---

*Last generated: 2026-04-17. Sourced from Reddit public JSON endpoints, 22
threads, ~2,000 comment-lines of raw material. Raw sources preserved in
[raw/threads/](raw/threads/) and [raw/digest.txt](raw/digest.txt).*
