# Guide: The CHANGE Plan (`plan-*.md` / `plan.md`)

Defines what to change, for review before any technical HOW. Applies at a **plan root** (a folder under `specops/` containing `plan-*.md` or `plan.md`).

## Use for

- New capabilities or product-facing changes.
- Cross-repo or cross-team scope that needs agreement before coding.
- Consolidating meeting notes, experiments, or tickets into reviewable scope.
- Standalone one-offs (Shape A) where the plan may also carry combined WHAT context.

## Do not use for

- Durable subsystem documentation of current reality: use `guides/spec.md` at domain level.
- Technical runbooks with commands and code changes: use `guides/runbook.md`.
- Simple bug fixes or small mechanical edits: execute directly.

## Core directives

1. **CHANGE, not HOW.** Problem, proposed delta, scope boundaries, outcomes. No terminal commands, no `// FROM:` / `// TO:` code.
2. **Comparative / delta voice.** "Because of problem X, we are changing Y to Z." Contrast with `spec.md` present tense.
3. **Review-first.** Output is for scope review. Stop after the plan unless the user asks to continue to implementation.
4. **Explicit boundaries.** Goals, non-goals, success criteria, deferred items.
5. **Zero business fluff.** No timelines, budgets, or resource planning unless explicitly requested.
6. **Length.** Target ~200 lines; max 400. Split parent + child plans when it overflows.

## New plan bootstrap (Shape A — standalone)

Maximum velocity; no `readme.md` or `spec.md` required.

1. `specops/<plan>/` or `specops/plans/<plan>/` — create the plan folder under `specops/`.
2. `plan-<name>.md` — draft from `templates/plan.md` once scope is clear enough.
3. `decisions.md` — from `templates/decisions.md` (plan scope).
4. `archive/` — create lazily, only when the first doc needs to move there.
5. **Explore** — read-only repo/ticket research plus interactive Q&A. Add `research/` notes when facts are too bulky for chat.

## New plan bootstrap (Shape B — inside a domain)

1. `specops/<domain>/plans/<initiative>/` — create the initiative folder (Shape A inside the domain).
2. `plan-<name>.md`, `decisions.md` — same as standalone; plan-local `decisions.md` is for tactical choices only.
3. Link to the domain `spec.md` in the plan's **System Context** or **Current State** when the delta builds on existing behavior.

## Workflow

1. Gather context: tickets, meeting notes, read-only code behavior, domain `spec.md` if present, plus interactive back-and-forth until goals and boundaries are clear.
2. Draft `plan-<name>.md` from `templates/plan.md`. That draft is the review artifact; iterate until scope is accepted.
3. Do not auto-generate runbooks unless the user asks to continue to HOW.
4. After approval, set `status: todo` (or `in-progress` if build already started) and offer `guides/runbook.md`.

## Content checklist

- [ ] No implementation commands or code-change snippets
- [ ] Problem and proposed changes are explicit (delta voice)
- [ ] Goals and non-goals are explicit
- [ ] Loose sequencing only when order matters; detailed groups live in `0-0-work-breakdown.md`
- [ ] Open questions live in the plan **Open Questions** section until resolved; resolved decisions move to plan `decisions.md`
- [ ] Success criteria are product/behavior outcomes, not build commands
- [ ] Frontmatter `type: plan`, `status`, and `updated` are set per `../frontmatter-spec.md`
