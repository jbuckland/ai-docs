# Central Annotation & User Correction Tracker

This document is a centralized, empirical ledger for tracking John's review annotations (`{! ... }`) across all projects. It logs the kinds of corrections John makes during code reviews so recurring patterns can be identified, quantified, and codified into standing rules in `ai-docs/instructions/`.

> [!NOTE]
> This tracker is **temporary by design**. Categories and patterns emerge organically as reviews happen. When broad categories accumulate many entries, agents should break them down into focused subcategories. Agents are encouraged to adjust categorizations as patterns clarify, and only suggest new rules when there is a tight cluster of similar annotations addressing a specific problem.

---

## Category Summary

- **Type Safety:** 9 entries
  - *Boundary Casting & Type Evasion:* 3 entries
  - *Domain Model Contracts & Index Signatures:* 3 entries
  - *Discriminated Unions & ViewItem Inheritance:* 3 entries
- **Styling & Theming:** 3 entries
- **Component Scope & Modularity:** 2 entries
- **Code Hygiene & Logic Clarity:** 2 entries
- **Angular Signals & Reactivity:** 1 entry
- **SpecOps Planning & Documentation:** 1 entry
- **File & Domain Naming:** 1 entry
- **UI Fallbacks & Placeholder Copy:** 1 entry
- **Component Architecture & Lifecycles:** 1 entry

---

## Type Safety / Boundary Casting & Type Evasion

- **2026-09-19** [`myward`]: **Double-casting to unknown at storage adapter boundary**: `"this got worse by casting to unknown then to Record<string,unknown>. These should be stronger types"` → Typed the persistence adapter boundary directly to prevent callers from casting through `unknown` to `Record<string, unknown>`.
- **2026-09-19** [`myward`]: **Untyped payload passed to service save method**: `"same issue as above"` → Replaced untyped section payloads with strongly typed section data payloads before calling the service save method.
- **2026-09-19** [`myward`]: **Feature service double-casting data service responses**: `"I want to avoid having to as unknown as ..."` → Typed `SacramentDataService.load()` and `watch()` to return domain `MeetingSnapshot`, eliminating `as unknown as MeetingSnapshot` double-casts across consuming feature services and components.

## Type Safety / Domain Model Contracts & Index Signatures

- **2026-09-19** [`myward`]: **Loose Record extension and unknown fields in domain interfaces**: `"this smells. Why do we have so many unknowns? why are we extending Record<string,unknown>?"` → Replaced `Record<string, unknown>` extension and `unknown` fields with explicit, strongly typed domain interface contracts.
- **2026-09-19** [`myward`]: **Untyped announcement structures in domain models**: `"same comments as above"` → Defined a strongly typed `PublishedAnnouncement` interface with explicit `title` and `text` fields.
- **2026-09-19** [`myward`]: **Permissive index signatures on canonical domain models**: `"why are we allowing arbitrary additional properties in these interfaces?"` → Removed `[key: string]: unknown` index signatures from canonical domain models in `sacrament.ts` to enforce strict property typing.

## Type Safety / Discriminated Unions & ViewItem Inheritance

- **2026-09-19** [`myward`]: **Disconnected ViewItem duplicating domain model**: `"having to go back and forth from AgendaItem and AgendaViewItem like this feel messy. maybe the view item should extend AgendaItem?"` → Refactored `AgendaItemViewItem` to directly extend canonical domain `AgendaItem`, eliminating repetitive back-and-forth mappings.
- **2026-09-19** [`myward`]: **Monolithic polymorphic interface mixing optional variant fields**: `"feels like this should be split into two different interfaces"` → Split monolithic polymorphic `AgendaItem` into `SpeakerAgendaItem` and `SongAgendaItem` discriminated union on `type: 'Speaker' | 'Song'`.
- **2026-09-19** [`myward`]: **Loose union parameters allowing mismatched section saves**: `"convert to discriminated union? or child classes of StorageData?"` → Codified discriminated union overloads using `AgendaSectionSavePayload` and typed section overloads on `SacramentService.save()`, preventing mismatched section/data argument pairs.

## Styling & Theming

- **2026-09-19** [`myward`]: **Hardcoded hex codes introduced during refactoring**: `"why did these go back to hard coded colors??"` → Replaced hardcoded `#ffffff` and `#000000` with `var(--surface-primary)` and `var(--text-primary)` design tokens.
- **2026-09-19** [`myward`]: **LESS compile-time variables used instead of CSS runtime custom properties**: `"why @vars instead of css variables? and I'm still not convinced that these are unique colors/sizes. Will this work with dark and light mode??"` → Refactored LESS variables to CSS custom properties (`var(--...)`) for full runtime dark and light theme switching.
- **2026-09-19** [`myward`]: **Duplicated liturgical CSS rules across individual components**: `"it looks like we're using the same style..."` → Consolidated duplicated component styles into shared liturgical UI primitives in `agenda.less`.

## Component Scope & Modularity

- **2026-09-19** [`myward`]: **Monolithic component combining header, layout, and item management**: `"this file seems like it might be too long"` → Extracted `AgendaProgramComponent` subcomponent out of `SacramentAgendaBuilderComponent`.
- **2026-09-19** [`myward`]: **Oversized component stylesheet containing shared primitives**: `"this file also seems way too long"` → Lifted shared liturgical styling primitives from local component LESS to `src/styles/components/agenda.less`.

## Code Hygiene & Logic Clarity

- **2026-09-19** [`myward`]: **Dummy synthetic objects used to back draft forms**: `"ah, I see. You just moved the smell somewhere else..."` → Eliminated synthetic empty domain objects (`id: ''`) used to back draft forms.
- **2026-09-19** [`myward`]: **Nested ternary expressions controlling item instantiation**: `"remove ternary"` → Replaced nested ternaries with explicit control-flow branches for item creation.

## Angular Signals & Reactivity

- **2026-09-19** [`myward`]: **Imperative `@ViewChild` component references**: `"why do we need a viewchild reference? feels clunky"` → Replaced imperative `@ViewChild` component reference with reactive Angular Signals (`input`, `output`, `signal`).

## SpecOps Planning & Documentation

- **2026-09-19** [`myward`]: **Status progress updates polluting architectural decisions log**: `"how is this a decision??"` → Removed status progress updates from `decisions.md`; restricted log strictly to technical trade-offs and architecture choices.

## File & Domain Naming

- **2026-09-19** [`myward`]: **Redundant `.domain` suffix in filenames**: `"looks like we don't use the work 'domain' in our domain objects. let's remove that."` → Renamed `*.domain.ts` files to `*.ts` to match existing repository naming conventions.

## UI Fallbacks & Placeholder Copy

- **2026-09-19** [`myward`]: **Arbitrary literal placeholder rendered in agenda business order**: `"in what case would we wind up showing "Unknown"?"` → Replaced arbitrary placeholder string `'Unknown'` in `businessName()` with trimmed candidate name or clean empty string `''`.

## Component Architecture & Lifecycles

- **2026-09-19** [`myward`]: **Monolithic legacy form component lifecycle evaluation**: `"evaluate this component as a candidate to recieve a backing service"` → Documented architectural evaluation: `SacramentAgendaFormComponent` is the legacy V1 component superseded by `SacramentAgendaBuilderComponent`, which cleanly decomposes into child components backed by `SacramentService`.

