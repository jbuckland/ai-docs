# Guide: Graduate, Pivot, Supersede, and Archive

Preserves shelved plans instead of deleting them. Applies inside SpecOps-managed docs under a `specops/` directory. The maintenance contract in `SKILL.md` invokes this automatically on a detected pivot or graduation.

## When to archive (standalone or plan-level)

- A plan or runbook is replaced by a different approach.
- A plan or runbook is abandoned before shipping but the thinking should stay recoverable.
- A standalone plan ships: set `status: done` on `plan-*.md` with `notes` explaining closure. The folder remains as a historical record or can move to `specops/archive/` or a top-level archive drawer. No parent `spec.md` exists to update.

## When to graduate (domain initiative complete)

When an active initiative in `<domain>/plans/<initiative>/` finishes and runbooks are verified:

1. **Update `spec.md`:** Bring the domain spec up to date with delivered capabilities, written cleanly in present tense. Bump `updated`.
2. **Record domain decisions:** If the initiative established new domain-wide architectural rules (for example "All status transitions must be reversible"), append them to `<domain>/decisions.md`, not the plan-local log.
3. **Archive the plan folder:** Move `plans/<initiative>/` to `archive/<initiative>/` as a retired time-capsule.
4. **Update domain `readme.md`:** Remove the initiative from active plans; add it to archived initiatives if listed.

Tactical choices that matter only for that sprint stay in the archived plan's `decisions.md`.

## Archive steps (single doc or plan folder)

1. Create `archive/` at the appropriate root (plan or domain) if it doesn't exist.
2. Move the doc or entire plan folder into `archive/`, keeping filenames.
3. Set frontmatter per `../frontmatter-spec.md`: `status: done` on plans and runbooks, bump `updated`, and record archive date, superseded vs abandoned, reason, and optional successor path in `notes`.
4. Optionally add a banner under the title when a link helps humans: `> Archived YYYY-MM-DD. See <link>.`
5. Update any index (`N-00`, domain `readme.md`) that linked the old doc so active docs do not point into `archive/`.
6. Append an entry to the appropriate `decisions.md` (plan-level for tactical, domain-level for architectural): what was shelved, why, and a link to the archived doc.

## Progressive consolidation (promoting standalone plans into a domain)

When multiple standalone plans accumulate around a subsystem:

1. Create `specops/<domain>/`.
2. Move standalone plan folders into `specops/<domain>/plans/<initiative>/` (zero link breakage; plan folders are self-contained).
3. Author `specops/<domain>/spec.md` summarizing current subsystem reality in present tense.
4. Add `readme.md` from `templates/domain-readme.md`.
5. Move any remaining unrelated one-offs into `specops/plans/`.

## Coming back to shelved work

Read `decisions.md` for the "why," open the linked `archive/` doc for the original thinking, and start a fresh plan or runbook that references both rather than restoring the old file in place.
