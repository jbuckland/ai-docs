# Guide: HOW Runbooks, Contracts, and the Group Index

Turns an approved change plan into buildable, turn-sized steps. Applies at a **plan root** (a folder under `specops/` containing `plan-*.md` or `plan.md`).

## Use for

- Technical HOW after an approved plan.
- Multi-repo work breakdowns, cross-repo contract baselines, migrations, refactors.

## Do not use for

- Initial scope or CHANGE authoring: use `guides/plan.md` first.
- Durable system documentation: use `guides/spec.md`.
- Simple bug fixes: execute directly.

## Core directives

1. **Action-oriented.** Step-by-step, copy/paste-ready commands, precise code changes.
2. **Zero business fluff.** No time estimates, budgets, or team coordination overhead.
3. **Length limits.** Target ~200 lines, max 400 per runbook. Split by group/phase, not by cramming.
4. **Tone.** Direct, imperative, technical. "Copy files", "Update imports", "Run build."
5. **Turn-sized.** Each runbook (`N-xx`) should fit roughly one agent working session.
6. **Linear.** Steps MUST be executable strictly top to bottom. Each step may depend only on state produced by an earlier step. A step or section must never depend on, assume, or forward-reference a later one. The reader (agent or human) follows the runbook start to finish with no jumping ahead and no backtracking.
   - No "see step N below", "as configured later", or checks that need something a later step creates.
   - When a natural dependency runs backwards, reorder the steps so the prerequisite comes first. If reordering is impossible, split into separate runbooks sequenced by their `N` number.
   - Cross-runbook ordering follows the same rule: a later `N-xx` may build on an earlier one, never the reverse.

## What is a runbook

A runbook is executable build steps carrying `status` frontmatter, meant to be worked turn-by-turn. The work-breakdown, contract baselines, and the group index are context for that work, not work items themselves; they inform runbooks but are never scanned or counted as one.

## Structure levels

A **group** is a set of related runbooks sharing the same `N` number. Flat is the default: a group's runbooks and its index are sibling files directly in the plan folder. Use a per-group subfolder only as an escape hatch when that group's docs pile up.

- `0-0-work-breakdown.md` — repos in play, groups, sequencing, feature-flag/activation strategy. No code. Carries `status`/`updated` frontmatter.
- `N-00-*.md` — group index: lists that group's runbooks with a **generated status column** (see `guides/status.md`). Never hand-author the status column.
- `N-xx-*.md` — a single turn-sized runbook, from `templates/runbook.md`.

## Runbook content requirements

1. **Exact commands** — copy/paste-ready for PowerShell, npm, or Git.
2. **Before/after code** — `// FROM:` / `// TO:` blocks.
3. **Environment specifics** — file paths, dependencies, config changes.
4. **Validation** — a `- [ ]` checklist of testable outcomes per phase.
5. **What You Can Do Now** — required tail on every runbook, separate from Validation. States the concrete new capability (call a function, hit an endpoint, click through a UI, watch a log line) and what you'd see back. Say plainly when nothing is observable yet, and flag when a capability is still gated behind a flag or stub.

## Frontmatter and status

- Every runbook carries `status`/`updated` frontmatter per `../frontmatter-spec.md`.
- Set `status: done` only when Validation passes.
- When you finish a runbook in chat (not just authoring the doc), report the same "What You Can Do Now" callout back to the user.
