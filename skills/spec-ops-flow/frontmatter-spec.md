# SpecOps Flow — Frontmatter Spec

Single authority for the YAML frontmatter SpecOps Flow supports. The maintenance contract in `SKILL.md` and the guides read and write only what is defined here.

**Closed schema:** only the keys listed below are supported. Do not invent new keys. A `status` value outside the four-value enum is a defect to fix or flag.

**Scope:** applies to any planning markdown file under a `specops/` directory. A file's feature root is the nearest ancestor directory containing a `feature-*.md`. See `SKILL.md` for activation and nested roots.

---

## 1. Planning doc frontmatter (one shape)

Every SpecOps Flow planning doc uses the same three keys:

```yaml
---
status: todo            # draft | todo | in-progress | done
updated: 2026-08-10     # ISO date; bump on every status change
notes:                  # optional; lifecycle detail, archive context, successor path
---
```

### `status` enum (four values only)

| Value | Meaning |
| --- | --- |
| `draft` | Not building yet (scope review or shelved draft; not yet accepted work) |
| `todo` | Accepted work not started (approved feature plan, runbook queued) |
| `in-progress` | Active work (building against the plan or executing a runbook) |
| `done` | Complete or closed (shipped feature plan, finished runbook, pivoted doc in `archive/`) |

Express everything else in `notes`, not in extra `status` values. Examples:

| Intent | `status` | `notes` (examples) |
| --- | --- | --- |
| Feature approved, ready for HOW | `todo` | `Approved for implementation.` |
| Feature plan is the live WHAT during build | `in-progress` | `Active WHAT; keep honest with HOW.` |
| Feature shipped or frozen | `done` | `Closed: scope delivered.` |
| Runbook parked | `todo` | `Deferred: waiting on API X.` |
| Runbook blocked mid-work | `in-progress` | `Blocked: API X returns 500.` |
| Moved to `archive/` after pivot | `done` | `Archived 2026-08-10. Superseded. Reason: … Successor: path.md` |
| Dropped with no successor | `done` | `Archived 2026-08-10. Abandoned. Reason: …` |

### Field rules

- **`status`:** single source of truth for where the doc is in the four-state lifecycle.
- **`updated`:** mandatory whenever `status` changes.
- **`notes`:** optional on any doc; required context for archive, defer, blocked, closed, and supersede lives here. Starting a stalled item's note with `Blocked:` or `Deferred:` is a recommended skimming convention, not a required token; `guides/status.md` recognizes stalled work by what the note says, not by a literal prefix match.

### Which docs carry frontmatter

Carry it: `feature-*.md`, `implementation/0-0-work-breakdown.md`, and each runbook (`N-xx`). Do not: the group index (`N-00`, a derived view) and `decisions.md` (prose log). See §2.

### Blocked and deferred (generic status, flagged in notes)

The `status` enum stays generic; there is no `blocked` or `deferred` value. Signal a stalled item in `notes` so the status scan can surface it by meaning. The recommended convention is a leading keyword:

- Not started, waiting on something: `status: todo`, note `Deferred: <reason>`.
- Started, then blocked: `status: in-progress`, note `Blocked: <reason>`.

Any note that clearly describes the item as waiting or blocked counts, even without that exact keyword.

### Done runbooks vs archive

Runbooks with `status: done` stay in `implementation/` when the work finished. Move to `archive/` when the approach was replaced or abandoned; set `status: done` and record why in `notes` (see `guides/archive.md`).

### Optional banner (archive)

An optional line under the title helps humans skimming (`> Archived YYYY-MM-DD. See <link>.`). `status`, `updated`, and `notes` remain authoritative for agents.

---

## 2. What is NOT frontmatter

- `decisions.md` is a prose append-log with a table (`Date | Status | Summary`), not YAML frontmatter.
- The group index status column is a **derived view**: rebuild it by scanning each runbook's `status` frontmatter in that group. You may edit the index file as part of that refresh, but do not invent statuses that are not backed by runbook frontmatter.
---

## 3. Enum quick reference

`status`: `draft` `todo` `in-progress` `done`

