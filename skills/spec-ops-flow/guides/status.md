# Guide: "What's Left?" (Status)

Answers progress questions without a master tasks file. Applies inside a SpecOps feature (a folder under a `specops/` directory).

## The rule

Status lives only in each runbook's `status` frontmatter (`../frontmatter-spec.md`). There is no separate tasks rollup to keep in sync; descriptions never duplicate.

## How to answer "what's left?"

1. Find every runbook under `implementation/`, recursing into any per-group subfolders. A runbook is recognized by meaning: an executable-step HOW doc carrying `status` frontmatter, meant to be worked turn-by-turn. That excludes context docs even when they carry frontmatter or sit at a similar path depth: `0-0-work-breakdown.md` (sequencing overview), a group index (`N-00-*.md`, a derived rollup), and any contract-baseline or reference doc that describes an interface rather than steps to execute (for example a `0-1-contracts.md`). Read `status:` from each recognized runbook.
2. Group by group number using the `N-` prefix on filenames (`3-01-*.md` belongs to group `3`; use `N-00-*.md` as the group label when present).
3. Report items whose notes describe them as blocked or waiting first (recognize this by meaning; the `Blocked:`/`Deferred:` prefix is a common convention but not required), then the rest of the non-`done` items (`draft`, `todo`, `in-progress`), then a compact `done` summary.
4. Present as a table: `Runbook | Status | Notes | Updated`. The `Notes` column surfaces the blocked/deferred reason so stalled work is not mistaken for fresh work.

## Regenerating the group index status column

- The status column in each `N-00-*.md` is a **derived view**, produced by this scan. Refresh it any time a runbook's status changes.
- If the index and a runbook's frontmatter disagree, the runbook frontmatter wins; fix the index.

## Cross-feature status

There is no global master status file across features. If asked "what's left across all my features," repeat this scan per feature root (each folder with a `feature-*.md`) under any `specops/` directory and present one table per feature.

