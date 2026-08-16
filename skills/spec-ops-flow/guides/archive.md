# Guide: Pivot, Supersede, and Archive

Preserves shelved plans instead of deleting them. Applies inside a SpecOps feature (a folder under a `specops/` directory). The maintenance contract in `SKILL.md` invokes this automatically on a detected pivot.

## When to archive

- A plan or runbook is replaced by a different approach (often a pivot for speed: the original was sound, just too slow).
- A plan or runbook is abandoned before shipping but the thinking should stay recoverable.
- A feature ships or is frozen: set the feature plan to `status: done` with `notes` explaining closure (for example `Closed: scope delivered.`) and leave it in place (not in `archive/`). Only superseded or abandoned intermediate docs move to `archive/`.

## Steps

1. Create `<feature>/archive/` if it doesn't exist.
2. Move the doc into `archive/`, keeping its filename.
3. Set frontmatter per `../frontmatter-spec.md`: `status: done`, bump `updated`, and record archive date, superseded vs abandoned, reason, and optional successor path in `notes`.
4. Optionally add a banner under the title when a link helps humans: `> Archived YYYY-MM-DD. See <link>.`
5. Update any index (`N-00`, `readme.md`) that linked the old doc so active docs do not point into `archive/`.
6. Append an entry to `decisions.md`: what was shelved, why, and a link to the archived doc.

## Coming back to a shelved feature

To resume a feature that pivoted away from an idea: read `decisions.md` for the "why," open the linked `archive/` doc for the original thinking, and start a fresh runbook or plan section that references both rather than restoring the old file in place.
