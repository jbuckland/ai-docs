# Guide: The WHAT Feature Plan

Defines what to build, for review before any technical HOW. Applies inside a SpecOps feature (a folder under a `specops/` directory).

## Use for

- New features or product-facing capabilities.
- Cross-repo or cross-team scope that needs agreement before coding.
- Consolidating meeting notes, experiments, or tickets into reviewable scope.

## Do not use for

- Technical runbooks with commands and code changes: use `guides/runbook.md`.
- Simple bug fixes or small mechanical edits: execute directly.
- Single-decision ADRs or knowledge-base articles: those belong outside SpecOps.

## Core directives

1. **WHAT, not HOW.** Behavior, responsibilities, contracts, outcomes. No terminal commands, no `// FROM:` / `// TO:` code.
2. **Review-first.** Output is for scope review. Stop after the plan unless the user asks to continue to implementation.
3. **Explicit boundaries.** Goals, non-goals, success criteria, deferred items.
4. **Zero business fluff.** No timelines, budgets, or resource planning unless explicitly requested.
5. **Length.** Target ~200 lines; max 400. Split parent + child feature plans when it overflows.

## New feature bootstrap

When starting a feature that doesn't exist yet, create scaffolding first, then explore, then draft the WHAT plan.

1. `<parent>/specops/<feature>/` — create the feature folder under a `specops/` directory. Being under `specops/` is what makes it SpecOps-managed; there is no marker file.
2. `<feature>/readme.md` — from `templates/feature-readme.md` (stub links are fine).
3. `<feature>/decisions.md` — from `templates/decisions.md`.
4. `<feature>/archive/` — create lazily, only when the first doc needs to move there.
5. **Explore** — see Workflow below (read-only repo/ticket research plus interactive Q&A with the user). Add `research/` notes when facts are too bulky for chat.
6. `<feature>/feature-<name>.md` — draft from `templates/feature-plan.md` once scope is clear enough to write WHAT.

## Workflow

1. Gather context: tickets, meeting notes, and read-only code behavior, plus interactive back-and-forth with the user until goals and boundaries are clear.
2. Draft `feature-<name>.md` from `templates/feature-plan.md`. That draft is the review artifact; iterate with the user until scope is accepted.
3. Do not auto-generate implementation runbooks unless the user asks to continue to HOW.
4. After approval, set `status: todo` (or `in-progress` if build already started) in the frontmatter and offer `guides/runbook.md`.

## Content checklist

- [ ] No implementation commands or code-change snippets
- [ ] Goals and non-goals are explicit
- [ ] Loose sequencing only when order matters ("this before that"); detailed work breakdown belongs in `implementation/0-0-work-breakdown.md`
- [ ] Open questions live in the feature plan **Open Questions** section until resolved; resolved decisions move to `decisions.md`, not inline in the plan body
- [ ] Success criteria are product/behavior outcomes, not build commands
- [ ] Frontmatter `status` and `updated` are set per `../frontmatter-spec.md`

