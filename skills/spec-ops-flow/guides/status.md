# Guide: "What's Left?" (Status)

Answers progress questions without a master tasks file. Applies inside SpecOps-managed docs under a `specops/` directory.

## The rule

Status lives only in each runbook's `status` frontmatter (`../frontmatter-spec.md`). There is no separate tasks rollup to keep in sync; descriptions never duplicate.

## How to answer "what's left?" (plan root)

Scope to the **plan root** (nearest ancestor with `plan-*.md` or `plan.md`):

1. Find every runbook under the plan root, recursing into any per-group subfolders. A runbook is recognized by meaning: an executable-step HOW doc carrying `status` frontmatter, meant to be worked turn-by-turn. That excludes context docs: `0-0-work-breakdown.md` (sequencing overview), a group index (`N-00-*.md`, a derived rollup), and any contract-baseline or reference doc that describes an interface rather than steps to execute. Read `status:` from each recognized runbook.
2. Group by group number using the `N-` prefix on filenames (`3-01-*.md` belongs to group `3`; use `N-00-*.md` as the group label when present).
3. Report items whose notes describe them as blocked or waiting first (recognize by meaning; `Blocked:`/`Deferred:` is a common convention but not required), then the rest of the non-`done` items (`draft`, `todo`, `in-progress`), then a compact `done` summary.
4. Present as a table: `Runbook | Status | Notes | Updated`. The `Notes` column surfaces the blocked/deferred reason so stalled work is not mistaken for fresh work.

## Domain-level status

When invoked at a **domain root** (nearest ancestor with `spec.md`):

1. Summarize each active plan under `plans/` by reading its `plan-*.md` frontmatter (`status`, `notes`, `updated`).
2. For each plan that is not `done`, run the plan-root runbook scan above and present one table per active initiative.
3. Optionally note `spec.md` `updated` date as the last time durable WHAT was refreshed.

## Regenerating the group index status column

- The status column in each `N-00-*.md` is a **derived view**, produced by the plan-root scan. Refresh it any time a runbook's status changes.
- If the index and a runbook's frontmatter disagree, the runbook frontmatter wins; fix the index.

## Cross-repo status

There is no global master status file. If asked "what's left across all my plans," repeat the appropriate scan per plan root (and per domain's `plans/` drawer) under any `specops/` directory.
