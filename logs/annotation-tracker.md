# Central Annotation & User Correction Tracker

This document is a centralized, empirical ledger for tracking John's review annotations (`{! ... }`) across all projects. It logs the kinds of corrections John makes during code reviews so recurring patterns can be identified, quantified, and codified into standing rules in `ai-docs/instructions/`.

> [!NOTE]
> This tracker is **temporary by design**. Once a pattern recurs frequently (e.g. 2–3+ occurrences), it is codified into a permanent rule in `ai-docs` or repository standards, marked as **Graduated**, and its entries archived. Over time, as agents follow the updated rules, annotations in that category drop to zero.

---

## Frequency Summary

| Category          | Pattern / Anti-Pattern                                          | Occurrences | Status    | Target Rule File                    |
| :---------------- | :-------------------------------------------------------------- | :---------- | :-------- | :---------------------------------- |
| Type Safety       | Double-casting via `as unknown as Record<string, unknown>`      | 2           | Active    | `jb-ts-conventions.instructions.md` |
| Type Safety       | Weakening domain models with `[key: string]: unknown`           | 2           | Active    | `jb-ts-conventions.instructions.md` |
| Type Safety       | Monolithic polymorphic models (should be discriminated union)   | 2           | Active    | `jb-ts-conventions.instructions.md` |
| Type Safety       | ViewItem vs Domain duplication (ViewItem should extend domain)  | 1           | Active    | `component-patterns.md`             |
| Code Hygiene      | Fake default domain objects (`id: ''`) & ternaries to back forms| 2           | Active    | `jb-ts-conventions.instructions.md` |
| Styling & Theming | Hardcoded hex colors (`#fff`) or LESS `@vars` instead of tokens | 3           | Active    | `jb-css-styling.instructions.md`    |
| Component Scope   | Monolithic templates/styles > 200 lines (need subcomponents)    | 2           | Active    | `jb-ng-components.instructions.md`  |
| Domain Naming     | Suffixing domain filenames with `.domain.ts`                    | 1           | Graduated | `coding-standards.md`               |
| Angular Signals   | Imperative `@ViewChild` references for child component state    | 1           | Graduated | `jb-ng-components.instructions.md`  |
| SpecOps Planning  | Logging status summaries in `decisions.md`                      | 1           | Graduated | `spec-ops-flow/SKILL.md`            |

---

## Chronological Review Ledger

| Date       | Workspace | Form        | Category          | Raw Snippet                                                          | Action Taken                                                       |
| :--------- | :-------- | :---------- | :---------------- | :------------------------------------------------------------------- | :----------------------------------------------------------------- |
| 2026-09-19 | `myward`  | Correction  | Type Safety       | `{!this got worse by casting to unknown then to Record<string,...}`  | Typed persistence adapter boundary; removed double cast            |
| 2026-09-19 | `myward`  | Correction  | Type Safety       | `{!same issue as above}`                                             | Applied strongly typed save payload                                |
| 2026-09-19 | `myward`  | Comment     | Type Safety       | `{!having to go back and forth from AgendaItem and AgendaView...}`   | Made `AgendaViewItem` extend domain `AgendaItem`                   |
| 2026-09-19 | `myward`  | Question    | Styling & Theming | `{!why did these go back to hard coded colors??}`                    | Replaced `#ffffff`/`#000000` with `var(--surface-primary)` tokens  |
| 2026-09-19 | `myward`  | Comment     | Type Safety       | `{!this smells. Why do we have so many unknowns? why are we...}`     | Replaced `Record<string, unknown>` with explicit domain interfaces |
| 2026-09-19 | `myward`  | Comment     | Type Safety       | `{!same comments as above}`                                          | Defined strongly typed announcement shape                          |
| 2026-09-19 | `myward`  | Correction  | Code Hygiene      | `{!ah, I see. You just moved the smell somewhere else...}`           | Removed fake empty domain objects and nested form ternaries        |
| 2026-09-19 | `myward`  | Question    | Styling & Theming | `{!why @vars instead of css variables? and I'm still not...}`        | Refactored LESS variables to CSS custom properties for dark mode   |
| 2026-09-19 | `myward`  | Correction  | Type Safety       | `{!why are we allowing arbitrary additional properties in these...}` | Removed `[key: string]: unknown` index signatures from domain      |
| 2026-09-19 | `myward`  | Suggestion  | Type Safety       | `{!feels like this should be split into two different interfaces}`   | Split monolithic `AgendaItem` into discriminated union             |
| 2026-09-19 | `myward`  | Correction  | Domain Naming     | `{!looks like we don't use the work 'domain' in our domain...}`      | Renamed `*.domain.ts` to `*.ts`                                    |
| 2026-09-19 | `myward`  | Correction  | Angular Signals   | `{!why do we need a viewchild reference? feels clunky}`              | Replaced `@ViewChild` with reactive Signal inputs/outputs          |
| 2026-09-19 | `myward`  | Correction  | SpecOps Planning  | `{!how is this a decision??}`                                        | Removed status summaries from `decisions.md`                       |

---

## Graduation Workflow

1. **Review Frequency:** When John reviews this log, any pattern with `>= 2` occurrences is a prime candidate for rule codification.
2. **Codify Rule:** Author a concise rule entry directly in the appropriate instruction file (e.g. `c:/stuff-john/github/ai-docs/instructions/frontend/jb-ts-conventions.instructions.md`).
3. **Graduate:** Update this ledger:
   - Change pattern status to `Graduated to [file]`.
   - Clear or archive the associated active entries so the log remains lean.
4. **Enforcement:** Because agents automatically consult `ai-docs/instructions/`, subsequent agent generations will follow the rule proactively without requiring repetitive review annotations.
