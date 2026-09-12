# SpecOps Flow — Frontmatter Spec

Single authority for the YAML frontmatter SpecOps Flow supports. The maintenance contract in `SKILL.md` and the guides read and write only what is defined here.

**Closed schema:** only the keys listed below are supported. Do not invent new keys. A `status` value outside the four-value enum is a defect to fix or flag.

**Scope:** applies to any planning markdown file under a `specops/` directory. A file's **plan root** is the nearest ancestor containing `plan-*.md` or `plan.md`. A file's **domain root** is the nearest ancestor containing `spec.md`. See `SKILL.md` for activation and nested roots.

---

## 1. Document types

### `spec.md` (WHAT — durable system spec)

No lifecycle `status`. Bump `updated` whenever the described system changes.

```yaml
---
type: spec
updated: 2026-08-16
notes: Authoritative domain spec for Callings subsystem.
---
```

### `plan-*.md` / `plan.md` (CHANGE — initiative proposal)

```yaml
---
type: plan
status: in-progress     # draft | todo | in-progress | done
updated: 2026-08-16
notes: Introducing To Schedule pipeline status and proposal notes.
---
```

### Runbooks and work breakdown (HOW)

```yaml
---
status: todo            # draft | todo | in-progress | done
updated: 2026-08-10
notes:                  # optional; lifecycle detail, archive context, successor path
---
```

Runbooks (`N-xx-*.md`) and `0-0-work-breakdown.md` carry `status` but not `type`.

---

## 2. `status` enum (plans and HOW docs only)

| Value | Meaning |
| --- | --- |
| `draft` | Not building yet (scope review or shelved draft; not yet accepted work) |
| `todo` | Accepted work not started (approved plan, runbook queued) |
| `in-progress` | Active work (building against the plan or executing a runbook) |
| `done` | Complete or closed (shipped plan, finished runbook, pivoted doc in `archive/`) |

Express everything else in `notes`, not in extra `status` values. Examples:

| Intent | `status` | `notes` (examples) |
| --- | --- | --- |
| Plan approved, ready for HOW | `todo` | `Approved for implementation.` |
| Plan is the live CHANGE during build | `in-progress` | `Active CHANGE; keep honest with HOW.` |
| Plan shipped or frozen | `done` | `Closed: scope delivered.` |
| Runbook parked | `todo` | `Deferred: waiting on API X.` |
| Runbook blocked mid-work | `in-progress` | `Blocked: API X returns 500.` |
| Moved to `archive/` after pivot | `done` | `Archived 2026-08-10. Superseded. Reason: … Successor: path.md` |
| Dropped with no successor | `done` | `Archived 2026-08-10. Abandoned. Reason: …` |

### Field rules

- **`type`:** `spec` or `plan` only, on those doc types. Do not add `type` to runbooks.
- **`status`:** single source of truth for where a plan or HOW doc is in the four-state lifecycle. Not used on `spec.md`.
- **`updated`:** mandatory whenever `status` changes on plans and runbooks; mandatory on `spec.md` whenever the described system changes.
- **`notes`:** optional on any doc; required context for archive, defer, blocked, closed, and supersede lives here. Starting a stalled item's note with `Blocked:` or `Deferred:` is a recommended skimming convention, not a required token; `guides/status.md` recognizes stalled work by what the note says, not by a literal prefix match.

### Which docs carry frontmatter

Carry it: `spec.md`, `plan-*.md` / `plan.md`, `0-0-work-breakdown.md`, and each runbook (`N-xx`). Do not: the group index (`N-00`, a derived view) and `decisions.md` (prose log). See §3.

### Blocked and deferred (generic status, flagged in notes)

The `status` enum stays generic; there is no `blocked` or `deferred` value. Signal a stalled item in `notes` so the status scan can surface it by meaning. The recommended convention is a leading keyword:

- Not started, waiting on something: `status: todo`, note `Deferred: <reason>`.
- Started, then blocked: `status: in-progress`, note `Blocked: <reason>`.

Any note that clearly describes the item as waiting or blocked counts, even without that exact keyword.

### Done runbooks vs archive

Runbooks with `status: done` stay in the plan folder when the work finished. Move to `archive/` when the approach was replaced or abandoned; set `status: done` and record why in `notes` (see `guides/archive.md`).

### Optional banner (archive)

An optional line under the title helps humans skimming (`> Archived YYYY-MM-DD. See <link>.`). `status`, `updated`, and `notes` remain authoritative for agents.

---

## 3. What is NOT frontmatter

- `decisions.md` is a prose append-log with a table (`Date | Status | Summary`), not YAML frontmatter. The `Status` column vocabulary (`Decided`, `Pivoted`, `Deferred`, `Superseded`) is separate from the frontmatter `status` enum.
- The group index status column is a **derived view**: rebuild it by scanning each runbook's `status` frontmatter in that group. You may edit the index file as part of that refresh, but do not invent statuses that are not backed by runbook frontmatter.

---

## 4. Enum quick reference

`type`: `spec` `plan` (on those doc types only)

`status`: `draft` `todo` `in-progress` `done` (plans and HOW docs only)
