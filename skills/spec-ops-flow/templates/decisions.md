# [Scope Name] Decisions

Append-only log of decisions, pivots, and defers.

**Scope this file correctly:**

| Scope | Location | What belongs here |
| --- | --- | --- |
| **Plan-level** | `plans/<initiative>/decisions.md` | Tactical implementation choices, bug workarounds, component-local decisions. |
| **Domain-level** | `<domain>/decisions.md` | Subsystem architectural rules, data model constraints, cross-plan policies, security boundaries. |

Cross-domain decisions belong in a shared/platform decisions location, not here.

> [!IMPORTANT]
> **What DOES NOT belong here:**
> - ❌ **NEVER** record routine progress updates, task completion milestones, or status tracking (e.g. "Completed step 1", "Refactored component X").
> - Execution progress belongs exclusively in runbook frontmatter (`status: done`) and group indexes.
> - This log is strictly for technical trade-offs, architecture choices, bug workarounds, and policies.

The `Status` column below is a free-text label for this log entry (`Decided`, `Pivoted`, `Deferred`, `Superseded`, or similar). It is **not** the frontmatter `status` enum defined in `../frontmatter-spec.md`.

| Date | Status | Summary |
| ---- | ------ | ------- |
| YYYY-MM-DD | Decided | One-line decision, and why |
