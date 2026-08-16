# Guide: HOW Runbooks, Contracts, and the Group Index

Turns an approved feature plan into buildable, turn-sized steps. Applies inside a SpecOps feature (a folder under a `specops/` directory).

## Use for

- Technical HOW after an approved feature plan.
- Multi-repo work breakdowns, cross-repo contract baselines, migrations, refactors.

## Do not use for

- Initial feature scoping: use `guides/feature-plan.md` first.
- Simple bug fixes: execute directly.

## Core directives

1. **Action-oriented.** Step-by-step, copy/paste-ready commands, precise code changes.
2. **Zero business fluff.** No time estimates, budgets, or team coordination overhead.
3. **Length limits.** Target ~200 lines, max 400 per runbook. Split by group/phase, not by cramming.
4. **Tone.** Direct, imperative, technical. "Copy files", "Update imports", "Run build."
5. **Turn-sized.** Each runbook (`N-xx`) should fit roughly one agent working session.

## What is a runbook

A runbook is executable build steps carrying `status` frontmatter, meant to be worked turn-by-turn. The work-breakdown, contract baselines, and the group index are context for that work, not work items themselves; they inform runbooks but are never scanned or counted as one.

## Structure levels

A **group** is a set of related runbooks sharing the same `N` number. Flat is the default: a group's runbooks and its index live as sibling files directly under `implementation/`. Use a per-group subfolder only as an escape hatch when that group's docs pile up (for example `implementation/2-ai-backend/` holding `2-00-*.md` plus its `2-xx` runbooks); nothing about the levels below changes when nested.

- `0-0-work-breakdown.md` — repos in play, groups, sequencing, feature-flag/activation strategy. No code. Carries `status`/`updated` frontmatter like the other planning docs.
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
