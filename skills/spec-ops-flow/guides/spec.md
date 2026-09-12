# Guide: The WHAT System Spec (`spec.md`)

Defines how a subsystem works **right now** in production. Applies at a **domain root** (a folder under `specops/` containing `spec.md`).

## Use for

- Core subsystems that endure across multiple iterations (`callings`, `people`, `story-time`).
- Consolidating scattered tribal knowledge into one authoritative description.
- The graduation target when a domain initiative ships (see `guides/archive.md`).

## Do not use for

- A one-off tweak or spike: use Shape A with a `plan-*.md` only (no `spec.md`).
- Proposed changes or scope for a single initiative: use `guides/plan.md`.
- Technical runbooks with commands: use `guides/runbook.md`.
- Historical rationale for a decision: use `decisions.md`.

## Core directives

1. **Present tense only.** "This is how the system works." Not "we changed from A to B" or "will support."
2. **Timeless.** No PR references, ticket numbers, sprint names, or legacy debates.
3. **Capabilities and invariants.** UX flows, data models, contracts, business rules that hold today.
4. **Zero business fluff.** No timelines, budgets, or resource planning unless explicitly requested.
5. **Length.** Target ~200 lines; max 400. Split by bounded capability area if it overflows.

## Prohibitions

- No comparative/delta voice ("because of problem X we are changing Y").
- No implementation commands or `// FROM:` / `// TO:` code.
- No duplicate content that belongs in an active `plans/<initiative>/` folder.

## New domain bootstrap

When promoting standalone plans into a domain or starting a durable subsystem:

1. Create `specops/<domain>/`.
2. Add `spec.md` from `templates/spec.md`, written in present tense from current production reality.
3. Add `readme.md` from `templates/domain-readme.md` (navigation entrypoint).
4. Add `decisions.md` from `templates/decisions.md` (domain scope).
5. Create `plans/` and move active initiatives into `plans/<initiative>/` (Shape A inside; zero link breakage).
6. Create `archive/` lazily when the first initiative graduates or is shelved.

## Maintaining `spec.md`

- Update after a domain initiative **graduates** (runbooks done, capabilities verified). See `guides/archive.md`.
- Bump `updated` in frontmatter whenever the described system changes.
- If HOW work reveals the spec is wrong, follow upward propagation in `SKILL.md` (confirm before editing).

## Content checklist

- [ ] Written entirely in present tense
- [ ] Describes current production behavior, not proposed changes
- [ ] No ticket numbers, PR links, or "we used to" history
- [ ] Capabilities, data models, UX flows, and invariants are explicit
- [ ] Frontmatter `type: spec` and `updated` are set per `../frontmatter-spec.md`
