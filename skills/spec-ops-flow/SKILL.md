---
name: spec-ops-flow
description: SpecOps Flow — spec-driven development for feature planning docs. Author and maintain durable system specs (WHAT), change plans (CHANGE), implementation runbooks (HOW), and decision logs (WHY). Use when planning or building through planning docs, writing a spec or plan, creating runbooks, asking what work is left, graduating a plan into a domain spec, archiving, or when a doc lives under a `specops/` directory.
---

# SpecOps Flow

Spec-driven development flow for feature planning docs. Separates present reality (WHAT), proposed change (CHANGE), technical execution (HOW), and historical rationale (WHY). The flow is feature-agnostic and self-contained: this skill folder holds everything it needs.

**Naming:** Official name **SpecOps Flow**; shorthand **SpecOps** in prose; filesystem marker `specops/` (skill id `spec-ops-flow`). The skill folder name deliberately differs from the `specops/` marker so the skill's own docs never match its own activation glob and self-manage.

**Principles:** This is spec-driven, but intent lives in prose, not in a requirement-delta grammar or a validator CLI. Rules below describe what agents should recognize by meaning (a runbook, a stalled item, a plan root), not literal filename or token matching. Living specs use timeless present tense; change plans use comparative/delta voice.

## The four pillars

Every document answers one of four sequential questions:

```text
1. WHAT     "What is it now?"              spec.md (current system; optional for one-offs)
   ↓
2. CHANGE   "Change it to be what?"        plan-*.md or plan.md (problem, delta, scope)
   ↓
3. HOW      "How are we going to do it?"   00-work-breakdown.md, N-00-*.md, N-xx-*.md (runbooks)
   ↓
4. WHY      "Why did we make the choices?" decisions.md (append-only log)
```

| Pillar | File | Voice |
| --- | --- | --- |
| WHAT | `spec.md` | Timeless present tense: "This is how the system works." |
| CHANGE | `plan-*.md` or `plan.md` | Comparative/delta: "Because of X, we are changing Y to Z." |
| HOW | `0-0-...`, `N-00-...`, `N-xx-...` | Imperative, step-by-step |
| WHY | `decisions.md` | Append-only: `Date \| Status \| Summary` |

## Activation: the specops/ directory

- **Managed docs:** Any markdown file whose path contains a `specops` directory segment is SpecOps-managed, at any depth. One `specops/` directory can hold many plans and domains.
- **Plan root:** Walk up from the edited file to the **nearest** ancestor directory that directly contains `plan-*.md` or `plan.md`. That folder scopes runbooks, work breakdown, plan-local `decisions.md`, and plan-local `archive/`. While bootstrapping a new plan, the agent is creating that folder and its plan doc together.
- **Domain root:** Walk up to the **nearest** ancestor containing `spec.md`. If you reach `specops/` without encountering `spec.md`, there is **no domain root** (standalone mode).
- **Nested plans:** A deeper folder with its own plan doc is a **separate** plan root. The nearest plan doc on the walk up wins. Domain `spec.md` and domain `decisions.md` belong to the domain root only; plan-local docs belong to the plan root only. Upward/downward propagation does not cross plan or domain boundaries without explicit graduation (see `guides/archive.md`).
- **No marker, no script:** being under `specops/` is the gate; plan and domain roots are found by walking up.

## The loop

`explore` -> `plan (CHANGE)` or `spec (WHAT)` -> `research` -> `runbooks (HOW)` -> `build` -> `verify` -> `ship / graduate / archive`

## Structural shapes

### Shape A: standalone one-off (no `spec.md`, no `readme.md`)

Best for quick tweaks, spikes, brownfield prototyping. Maximum velocity, zero boilerplate.

```text
specops/<plan>/                    or  specops/plans/<plan>/
  plan-<name>.md                   CHANGE (and combined WHAT for one-offs)
  decisions.md                     WHY: tactical choices during build
  0-0-work-breakdown.md            HOW: sequencing and groups
  N-00-*.md                        HOW: group index (derived status column)
  N-xx-*.md                        HOW: turn-sized runbooks
  research/                        optional facts-only notes
  archive/                         optional shelved docs
```

### Shape B: domain area (with `spec.md`)

Best for core subsystems that endure across iterations (`callings`, `people`, `story-time`).

```text
specops/<domain>/                  DOMAIN ROOT
  readme.md                        entrypoint and navigation (from templates/domain-readme.md)
  spec.md                          WHAT: authoritative current system description
  decisions.md                     WHY: domain-wide architectural rules and policies
  plans/
    <initiative>/                  SELF-CONTAINED PLAN (Shape A inside)
      plan-<name>.md
      decisions.md                 WHY: sprint-specific tactical choices
      0-0-work-breakdown.md
      N-00-*.md
      N-xx-*.md
  archive/
    <initiative>/                  retired initiative time-capsules
  research/                        optional domain-level facts
```

```text
specops/plans/                     ONE-OFF / UNGROUPED DRAWER
  <plan>/                          standalone Shape A plans
```

**Isomorphic plan folders:** The internal structure of a standalone plan is identical to a plan nested inside a domain. Moving a plan into `<domain>/plans/` is a zero-friction folder move with zero broken links.

**Runbook placement:** HOW docs live directly in the plan folder. A **group** is a set of related runbooks sharing the same `N` number. Flat is the default: runbooks and their group index are sibling files in the plan folder. A per-group subfolder is an optional escape hatch when one group's docs pile up; the status scan finds runbooks wherever they sit under the plan root.

## Routing (read the guide for the task)

| Task | Guide | Template(s) |
| --- | --- | --- |
| Author or maintain a durable system spec (WHAT) | [guides/spec.md](guides/spec.md) | [templates/spec.md](templates/spec.md) |
| Author or bootstrap a change plan (CHANGE) | [guides/plan.md](guides/plan.md) | [templates/plan.md](templates/plan.md), [templates/decisions.md](templates/decisions.md) |
| Bootstrap a domain | [guides/spec.md](guides/spec.md) | [templates/domain-readme.md](templates/domain-readme.md), [templates/spec.md](templates/spec.md) |
| Author HOW runbooks, contracts, group index | [guides/runbook.md](guides/runbook.md) | [templates/runbook.md](templates/runbook.md), [templates/group-index.md](templates/group-index.md) |
| "What's left?" | [guides/status.md](guides/status.md) | — |
| Graduate, pivot, supersede, or archive | [guides/archive.md](guides/archive.md) | — |

## Research

Plain markdown under `research/` at plan or domain level. No separate guide.

- **Belongs here:** Facts gathered during explore (API behavior, file paths, ticket excerpts, spike outcomes) that resolve open questions or `{! }` annotations.
- **Does not belong here:** Decisions (use `decisions.md`), HOW steps (use runbooks), or duplicate prose that belongs in `spec.md` or the plan.
- **Naming:** Descriptive filenames (`api-surface.md`, `flag-inventory.md`). Link from the plan or spec when relevant.

## Frontmatter

Closed schema per document type; full definitions live in `frontmatter-spec.md` (the single authority). Plans and runbooks carry `status`; `spec.md` does not.

## Maintenance contract

When the maintenance rule activates for a file under a `specops/` directory, keep docs correct automatically. Do not wait to be asked, and never leave the CHANGE and the HOW silently disagreeing. Autofix by default: make corrective edits in the same turn, then report what changed. Do not stop to ask permission for routine sync upkeep, including keeping domain `readme.md` "Implement next" pointers current as work finishes. One exception: editing the review-gated CHANGE doc (`plan-*.md` or `plan.md`) or the authoritative WHAT (`spec.md`) needs a one-line confirmation first (see **Upward propagation**).

### Frontmatter

- Closed schema only. Do not invent keys or values outside `frontmatter-spec.md`. Bump `updated` whenever `status` changes on plans and runbooks; bump `updated` on `spec.md` whenever the described system changes.

### Keep CHANGE, WHAT, and HOW in sync

- **Upward propagation:** While editing a HOW doc, if you find the plan's CHANGE scope or the domain `spec.md` is wrong or incomplete, do not silently rewrite it. Ask a one-line confirmation that names the change. On approval, edit the plan or `spec.md` at the appropriate root and add a `decisions.md` entry explaining why. Routine sync (frontmatter, status, group index) still autofixes without asking.
- **Downward propagation:** If a plan's intent changes, flag or fix runbooks it invalidates under that plan root.
- **Honesty rule:** A plan with `status: in-progress` must describe the current intended CHANGE. Drift is a defect to fix now. A `spec.md` must describe current production reality in present tense.

### Track state, don't duplicate it

- State lives in each runbook's `status` frontmatter.
- When a runbook's lifecycle changes (done, deferred, superseded), update `status`, `updated`, and put defer/supersede detail in `notes` when needed.
- The group index (`N-00`) status column is a **derived view**: refresh it by scanning runbook `status:` values in that group. Do not maintain a second source of truth for status text.

### Pivots, graduation, and superseding: archive, never delete

- When a plan or runbook is abandoned or replaced, move it into `archive/`. Do not delete it.
- When a domain initiative finishes, follow the **domain graduation flow** in `guides/archive.md`: update `spec.md`, log domain-wide decisions, move `plans/<name>/` to `archive/<name>/`.
- Set archived doc frontmatter per `frontmatter-spec.md`, and follow `guides/archive.md` for the full workflow.

### Record decisions

- **Plan-level** `decisions.md`: tactical implementation choices, bug workarounds, component-local decisions.
- **Domain-level** `decisions.md`: subsystem architectural rules, data model constraints, cross-plan policies.
- Log meaningful decisions, pivots, and defers as a prose append-log (`Date | Status | Summary`). Not frontmatter.
- **Strict Prohibition on Status Updates:** NEVER log task progress, completion milestones, or status tracking in `decisions.md`. Execution state belongs exclusively in runbook frontmatter (`status: done`) and group indexes. `decisions.md` is reserved strictly for architectural trade-offs, design choices, bug workarounds, and policies.

### Boundaries

- Applies to planning docs under a `specops/` directory only, never product-repo code.
- Feature-agnostic: keys off the `specops/` directory and folder shape, not a specific product feature.

## Automatic maintenance (install)

The hook rule at `rule/specops-maintenance.mdc` loads on `**/specops/**/*.md` and delegates here.

- **Your own plan repo:** symlink `rule/specops-maintenance.mdc` into `.cursor/rules/` so the installed rule cannot drift from the skill source.
- **Sharing:** copy the file into the recipient's `.cursor/rules/`; they get a plain copy with no symlink into your paths and no `pwsh` dependency.
- The `**/specops/**` glob is already precise, so the rule can live at the repo-root `.cursor/rules/`.

## Skill structure

```text
spec-ops-flow/
  SKILL.md                 this router + maintenance contract
  frontmatter-spec.md      closed frontmatter schema (the authority)
  rule/
    specops-maintenance.mdc  minimal hook (install into .cursor/rules/)
  guides/
    spec.md                  authoring + maintenance guide for durable WHAT specs
    plan.md                  authoring + bootstrap guide for CHANGE plans
    runbook.md               authoring guide for HOW runbooks, contracts, group index
    status.md                "what's left?" scan logic
    archive.md               graduation, pivot, supersede, archive workflow
  templates/
    spec.md
    plan.md
    runbook.md
    group-index.md
    decisions.md
    domain-readme.md
```
