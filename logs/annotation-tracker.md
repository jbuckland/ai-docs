# Central Annotation & User Correction Tracker

This document is a centralized, empirical ledger for tracking John's review annotations (`{! ... }`) across all projects. It logs the kinds of corrections John makes during code reviews so recurring patterns can be identified, quantified, and codified into standing rules in `ai-docs/instructions/`.

> [!NOTE]
> This tracker is **temporary by design**. Categories and patterns emerge organically as reviews happen. When a category accumulates multiple entries, the agent will prompt to codify the pattern into a permanent rule. Once codified, entries can be retired.

---

## Category Summary

- **Type Safety:** 9 entries
- **Styling & Theming:** 3 entries
- **Component Scope:** 2 entries
- **Code Hygiene:** 2 entries
- **Angular Signals:** 1 entry
- **SpecOps Planning:** 1 entry
- **Domain Naming:** 1 entry
- **UI Fallbacks & Placeholder Copy:** 1 entry
- **Component Architecture:** 1 entry

---

## Type Safety

- **2026-09-19** [`myward`]: `"this got worse by casting to unknown then to Record<string,unknown>. These should be stronger types"` → Typed persistence adapter boundary; removed double cast to unknown.
- **2026-09-19** [`myward`]: `"same issue as above"` → Applied strongly typed section payload to service save call.
- **2026-09-19** [`myward`]: `"having to go back and forth from AgendaItem and AgendaViewItem like this feel messy. maybe the view item should extend AgendaItem?"` → Made `AgendaViewItem` extend domain `AgendaItem` directly.
- **2026-09-19** [`myward`]: `"this smells. Why do we have so many unknowns? why are we extending Record<string,unknown>?"` → Replaced `Record<string, unknown>` extension and `unknown` fields with explicit, typed domain interfaces.
- **2026-09-19** [`myward`]: `"same comments as above"` → Defined strongly typed `PublishedAnnouncement` interface.
- **2026-09-19** [`myward`]: `"why are we allowing arbitrary additional properties in these interfaces?"` → Removed `[key: string]: unknown` index signatures from canonical domain models.
- **2026-09-19** [`myward`]: `"feels like this should be split into two different interfaces"` → Split monolithic polymorphic `AgendaItem` into `SpeakerAgendaItem` and `SongAgendaItem` discriminated union.
- **2026-09-19** [`myward`]: Avoid double casting in service: `"I want to avoid having to as unknown as ..."` → Typed `SacramentDataService.load()` and `watch()` to return domain `MeetingSnapshot`, eliminating `as unknown as` casts in callers.
- **2026-09-19** [`myward`]: Section save typing: `"convert to discriminated union? or child classes of StorageData?"` → Codified discriminated union overloads using `AgendaSectionSavePayload` and typed section overloads on `SacramentService.save()`.

## Styling & Theming

- **2026-09-19** [`myward`]: `"why did these go back to hard coded colors??"` → Replaced hardcoded `#ffffff` and `#000000` with `var(--surface-primary)` and `var(--text-primary)` design tokens.
- **2026-09-19** [`myward`]: `"why @vars instead of css variables? and I'm still not convinced that these are unique colors/sizes. Will this work with dark and light mode??"` → Refactored LESS variables to CSS custom properties for runtime dark/light mode compatibility.
- **2026-09-19** [`myward`]: `"it looks like we're using the same style..."` → Consolidated duplicated component styles into shared liturgical UI primitives in `agenda.less`.

## Component Scope

- **2026-09-19** [`myward`]: `"this file seems like it might be too long"` → Extracted `AgendaProgramComponent` subcomponent out of `SacramentAgendaBuilderComponent`.
- **2026-09-19** [`myward`]: `"this file also seems way too long"` → Lifted shared liturgical styling primitives from local component LESS to `src/styles/components/agenda.less`.

## Code Hygiene

- **2026-09-19** [`myward`]: `"ah, I see. You just moved the smell somewhere else..."` → Eliminated synthetic empty domain objects (`id: ''`) used to back draft forms.
- **2026-09-19** [`myward`]: `"remove ternary"` → Replaced nested ternaries with explicit control-flow branches for item creation.

## Angular Signals

- **2026-09-19** [`myward`]: `"why do we need a viewchild reference? feels clunky"` → Replaced imperative `@ViewChild` component reference with reactive Angular Signals (`input`, `output`, `signal`).

## SpecOps Planning

- **2026-09-19** [`myward`]: `"how is this a decision??"` → Removed status progress updates from `decisions.md`; restricted log strictly to technical trade-offs and architecture choices.

## Domain Naming

- **2026-09-19** [`myward`]: `"looks like we don't use the work 'domain' in our domain objects. let's remove that."` → Renamed `*.domain.ts` files to `*.ts` to match existing repository naming conventions.

## UI Fallbacks & Placeholder Copy

- **2026-09-19** [`myward`]: Liturgical calling business fallback: `"in what case would we wind up showing "Unknown"?"` → Replaced arbitrary placeholder string `'Unknown'` with trimmed candidate name or clean empty string `''`.

## Component Architecture

- **2026-09-19** [`myward`]: Legacy form component service evaluation: `"evaluate this component as a candidate to recieve a backing service"` → Documented architectural evaluation: `SacramentAgendaFormComponent` delegates persistence to `SacramentService` and is superseded by `SacramentAgendaBuilderComponent`.

