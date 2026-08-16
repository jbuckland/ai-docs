---
name: spec-ops-flow
description: SpecOps Flow — spec-driven development for feature planning docs. Author and maintain the WHAT feature plan, HOW implementation runbooks and contracts, research notes, a decisions log, status tracking, and archive. Use when planning or building a feature through planning docs, creating a feature plan or runbook, asking what work is left, archiving or superseding a plan, or when a doc lives under a `specops/` directory.
---

# SpecOps Flow

Spec-driven development flow for feature planning docs. One feature is one folder that separates WHAT (intent) from HOW (execution) and keeps them honest as the work proceeds. The flow is feature-agnostic and self-contained: this skill folder holds everything it needs.

**Naming:** Official name **SpecOps Flow**; shorthand **SpecOps** in prose; filesystem marker `specops/` (skill id `spec-ops-flow`). The skill folder name deliberately differs from the `specops/` marker so the skill's own docs never match its own activation glob and self-manage.

**Principles:** This is spec-driven, but intent lives in prose in the feature plan, not in a requirement-delta grammar or a validator CLI. Rules below describe what agents should recognize by meaning (a runbook, a stalled item, a feature root), not literal filename or token matching.

## Activation: the specops/ directory

- **Managed docs:** Any markdown file whose path contains a `specops` directory segment is SpecOps-managed, at any depth (`.../specops/dnipro4/agent-wo-create/...`, `.../specops/banana-feature/...`). One `specops/` directory can hold many features.
- **Feature root:** The folder that owns a doc's `feature-*.md`, `implementation/`, `decisions.md`, and `archive/`. Find it by walking up from the edited file to the **nearest** ancestor directory that directly contains a `feature-*.md`. Everything below that folder belongs to that feature. While bootstrapping a brand-new feature, the agent is creating that folder and its `feature-*.md` together, so no separate marker file is needed.
- **No marker, no script:** being under `specops/` is the gate; the nearest `feature-*.md` is how you locate the root.
  
- **Nested features:** A deeper folder with its own `feature-*.md` is a **separate** feature root. For a file inside it, the **nearest** `feature-*.md` on the walk up wins. That scopes maintenance:
  - **Feature plan sync** uses that root's `feature-*.md`, not a parent's.
  - **`decisions.md` / `readme.md`** are the ones at that root only.
  - **Status scans** include only `implementation/` under that root.
  - **Upward/downward propagation** does not cross into a parent or sibling feature.
  - Parent and child are independent features; link between them in prose if needed, not shared frontmatter.
  
## The loop

`explore` -> `feature plan (WHAT)` -> `research` -> `runbooks (HOW) + contracts` -> `build` -> `verify` -> `ship / freeze` -> `archive on pivot`

## Feature folder shape

A feature folder lives under a `specops/` directory (e.g. `.../specops/dnipro4/agent-wo-create/`). Being under `specops/` is what makes it SpecOps-managed.

```text
<feature>/
  readme.md                    entrypoint: purpose, links, "implement next"
  feature-*.md                 WHAT plan (status frontmatter)
  decisions.md                 append-log: Date | Status | Summary
  research/                    facts-only notes (see Research below)
  implementation/
    0-0-work-breakdown.md      repos, groups, sequencing, feature flag
    N-00-*.md                  group index (derived status column)
    N-xx-*.md                  turn-sized runbooks (flat under implementation/, or grouped in a subfolder)
  archive/                     superseded/abandoned docs, kept for history
  ```

A group is a set of related runbooks sharing the same `N` number, identified by the `N-` prefix on filenames. Flat is the default: runbooks and their group index live as sibling files directly under `implementation/`. A per-group subfolder is an optional escape hatch for when one group's docs pile up (for example `implementation/2-ai-backend/2-00-*.md` plus its runbooks); the status scan finds runbooks wherever they sit under `implementation/`, flat or nested. Additional HOW docs (for example contract baselines) are fine when the agent adds them; SpecOps does not require a fixed filename beyond the conventions above.

## Routing (read the guide for the task)

| Task | Guide | Template(s) |
| --- | --- | --- |
| Author or bootstrap the WHAT plan | [guides/feature-plan.md](guides/feature-plan.md) | [templates/feature-plan.md](templates/feature-plan.md), [templates/feature-readme.md](templates/feature-readme.md), [templates/decisions.md](templates/decisions.md) |
| Author HOW runbooks, contracts, group index | [guides/runbook.md](guides/runbook.md) | [templates/runbook.md](templates/runbook.md), [templates/group-index.md](templates/group-index.md) |
| "What's left?" | [guides/status.md](guides/status.md) | — |
| Pivot, supersede, or archive a doc | [guides/archive.md](guides/archive.md) | — |

## Research

Plain markdown under `research/`. No separate guide.

- **Belongs here:** Facts gathered during explore (API behavior, file paths, ticket excerpts, spike outcomes) that resolve open questions or `{! }` annotations in the feature plan.
- **Does not belong here:** Decisions (use `decisions.md`), HOW steps (use runbooks), or duplicate prose that should live in the feature plan.
- **Naming:** Descriptive filenames (`api-surface.md`, `flag-inventory.md`). Link from the feature plan's Open Questions or System Context when relevant.

## Frontmatter

Closed schema; full definitions and the enum table live in `frontmatter-spec.md` (the single authority). Three keys only: `status`, `updated`, `notes`.

## Maintenance contract

When the maintenance rule activates for a file under a `specops/` directory, keep docs correct automatically. Do not wait to be asked, and never leave the WHAT and the HOW silently disagreeing. Autofix by default: make corrective edits in the same turn, then report what changed. Do not stop to ask permission for routine sync upkeep, including keeping the `readme.md` "Implement next" pointer current as work finishes. One exception: editing the review-gated WHAT (`feature-*.md`) needs a one-line confirmation first (see **Upward propagation**).

### Frontmatter

- Closed schema only (`status`, `updated`, `notes`). Do not invent keys or values outside the enum in `frontmatter-spec.md`. Bump `updated` whenever `status` changes.

### Keep WHAT and HOW in sync

- **Upward propagation:** While editing a HOW doc under `implementation/`, if you find the feature plan's WHAT is wrong or incomplete, do not silently rewrite it. Ask a one-line confirmation that names the change (for example: `Runbook switched red to blue. OK to update the feature plan to match?`). On approval, edit `feature-*.md` at the **same feature root** and add a `decisions.md` entry explaining why. Routine sync (frontmatter, status, group index) still autofixes without asking.
- **Downward propagation:** If the feature plan's intent changes, flag or fix runbooks and contracts it invalidates under that root.
- **Honesty rule:** A feature plan with `status: in-progress` must describe the current intended WHAT. Drift is a defect to fix now.

### Track state, don't duplicate it

- State lives in each runbook's `status` frontmatter.
- When a runbook's lifecycle changes (done, deferred, superseded), update `status`, `updated`, and put defer/supersede detail in `notes` when needed.
- The group index (`N-00`) status column is a **derived view**: refresh it by scanning runbook `status:` values in that group. Do not maintain a second source of truth for status text.

### Pivots and superseding: archive, never delete

- When a plan or runbook is abandoned or replaced, move it into `archive/`. Do not delete it.
- Set the archived doc's frontmatter per `frontmatter-spec.md`, and follow `guides/archive.md` for the full workflow (banner, index cleanup, decisions entry).
- Append `decisions.md`: what was shelved, why, and a link to the archived doc.

### Record decisions

- Log meaningful decisions, pivots, and defers in `decisions.md` (prose append-log with `Date | Status | Summary`). Not frontmatter.

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
    feature-plan.md          authoring + bootstrap guide for the WHAT plan
    runbook.md               authoring guide for HOW runbooks, contracts, group index
    status.md                "what's left?" scan logic
    archive.md               pivot / supersede / archive workflow
  templates/
    feature-plan.md
    runbook.md
    group-index.md
    decisions.md
    feature-readme.md
    ```

