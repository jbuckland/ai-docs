# Central Annotation & User Correction Tracker

This document is a centralized, empirical ledger for tracking John's review annotations (`{! ... }`) across all projects. It logs the kinds of corrections John makes during code reviews so recurring patterns can be identified, quantified, and codified into standing rules in `ai-docs/instructions/`.

> [!NOTE]
> This tracker is **temporary by design**. Categories and patterns emerge organically as reviews happen. When broad categories accumulate many entries, agents should break them down into focused subcategories. Agents are encouraged to adjust categorizations as patterns clarify, and only suggest new rules when there is a tight cluster of similar annotations addressing a specific problem.

---

## Category Summary

- **Type Safety:** 10 entries
  - *Boundary Casting & Type Evasion:* 4 entries
  - *Domain Model Contracts & Index Signatures:* 3 entries
  - *Discriminated Unions & ViewItem Inheritance:* 3 entries
- **Code Hygiene & Logic Clarity:** 11 entries
  - *Active Feature Evolution & Zero Backward-Compatibility Shims:* 4 entries
  - *Control Flow & Ternary Expression Overuse:* 3 entries
  - *Utility Colocation & Execution Flow:* 2 entries
  - *Separation of Presentation & Pure Logic:* 1 entry
  - *Synthetic & Dummy Form State:* 1 entry
- **Styling & Theming:** 7 entries
  - *Primitive Inheritance & Style Duplication:* 4 entries
  - *Design System Tokens & Runtime CSS Custom Properties:* 3 entries
- **Domain Modeling & Spec Discipline:** 5 entries
  - *Domain Semantics & UI Separation:* 3 entries
  - *Speculative Properties & Premature Taxonomies:* 2 entries
- **Component Scope & Modularity:** 3 entries
- **Angular Signals & Reactivity:** 2 entries
- **Component Architecture & Lifecycles:** 2 entries
- **File & Domain Naming:** 2 entries
- **SpecOps Planning & Documentation:** 1 entry
- **UI Fallbacks & Placeholder Copy:** 1 entry

---

## Type Safety / Boundary Casting & Type Evasion

- **2026-09-19** [`myward`]: **Double-casting to unknown at storage adapter boundary**: `"this got worse by casting to unknown then to Record<string,unknown>. These should be stronger types"` → Typed the persistence adapter boundary directly to prevent callers from casting through `unknown` to `Record<string, unknown>`.
- **2026-09-19** [`myward`]: **Untyped payload passed to service save method**: `"same issue as above"` → Replaced untyped section payloads with strongly typed section data payloads before calling the service save method.
- **2026-09-19** [`myward`]: **Feature service double-casting data service responses**: `"I want to avoid having to as unknown as ..."` → Typed `SacramentDataService.load()` and `watch()` to return domain `MeetingSnapshot`, eliminating `as unknown as MeetingSnapshot` double-casts across consuming feature services and components.
- **2026-09-19** [`myward`]: **Inlined string literal union for UI drawer state**: `"should we use a strong type here?"` → Defined exported `ActiveAgendaDrawer` union type in `sacrament-agenda.ts` and strongly typed `activeDrawer` signal.

## Type Safety / Domain Model Contracts & Index Signatures

- **2026-09-19** [`myward`]: **Loose Record extension and unknown fields in domain interfaces**: `"this smells. Why do we have so many unknowns? why are we extending Record<string,unknown>?"` → Replaced `Record<string, unknown>` extension and `unknown` fields with explicit, strongly typed domain interface contracts.
- **2026-09-19** [`myward`]: **Untyped announcement structures in domain models**: `"same comments as above"` → Defined a strongly typed `PublishedAnnouncement` interface with explicit `title` and `text` fields.
- **2026-09-19** [`myward`]: **Permissive index signatures on canonical domain models**: `"why are we allowing arbitrary additional properties in these interfaces?"` → Removed `[key: string]: unknown` index signatures from canonical domain models in `sacrament.ts` to enforce strict property typing.

## Type Safety / Discriminated Unions & ViewItem Inheritance

- **2026-09-19** [`myward`]: **Disconnected ViewItem duplicating domain model**: `"having to go back and forth from AgendaItem and AgendaViewItem like this feel messy. maybe the view item should extend AgendaItem?"` → Refactored `AgendaItemViewItem` to directly extend canonical domain `AgendaItem`, eliminating repetitive back-and-forth mappings.
- **2026-09-19** [`myward`]: **Monolithic polymorphic interface mixing optional variant fields**: `"feels like this should be split into two different interfaces"` → Split monolithic polymorphic `AgendaItem` into `SpeakerAgendaItem` and `SongAgendaItem` discriminated union on `type: 'Speaker' | 'Song'`.
- **2026-09-19** [`myward`]: **Loose union parameters allowing mismatched section saves**: `"convert to discriminated union? or child classes of StorageData?"` → Codified discriminated union overloads using `AgendaSectionSavePayload` and typed section overloads on `SacramentService.save()`, preventing mismatched section/data argument pairs.

## Styling & Theming / Primitive Inheritance & Style Duplication

- **2026-09-19** [`myward`]: **Duplicated liturgical CSS rules across individual components**: `"it looks like we're using the same style..."` → Consolidated duplicated component styles into shared liturgical UI primitives in `agenda.less`.
- **2026-09-19** [`myward`]: **Redundant re-declaration of global drawer, button, form, and avatar primitives in component stylesheet**: `"review this for style duplication and other style rule violations"` → Eliminated duplicated global primitives (`.drawer-overlay`, `.drawer-panel`, `.form-control`, `.btn-*`, `.avatar-*`), reduced stylesheet from 614 lines to 267 lines, and inherited canonical design system classes from `src/styles/components/`.
- **2026-09-19** [`myward`]: **Duplicated card, button, and form control styles in component stylesheet**: `"are we duplicating any card, pill, button, or other styles here?"` → Eliminated redundant button heights, form-control box sizing, and card background/border styles from `sacrament-agenda-builder.component.less` and inherited shared design system classes (`.card-secondary`, `.card-compact`).
- **2026-09-20** [`myward`]: **Nonexistent surface tokens, button style duplication, and excessive selector nesting in component LESS**: `"do a check on this class to make sure it obeys all style rules"` → Replaced undeclared `--surface-card` with canonical `var(--surface-primary)`, composed `.btn .btn-secondary` on toggle buttons to eliminate style duplication, removed redundant button height constraints, flattened selector nesting to $\le 3$ levels, and replaced invalid `btn-success` with `btn-primary`.

## Styling & Theming / Design System Tokens & Runtime CSS Custom Properties

- **2026-09-19** [`myward`]: **Hardcoded hex codes introduced during refactoring**: `"why did these go back to hard coded colors??"` → Replaced hardcoded `#ffffff` and `#000000` with `var(--surface-primary)` and `var(--text-primary)` design tokens.
- **2026-09-19** [`myward`]: **LESS compile-time variables used instead of CSS runtime custom properties**: `"why @vars instead of css variables? and I'm still not convinced that these are unique colors/sizes. Will this work with dark and light mode??"` → Refactored LESS variables to CSS custom properties (`var(--...)`) for full runtime dark and light theme switching.
- **2026-09-19** [`myward`]: **Fallback parameters in CSS var() expressions and off-palette colors**: `"there are many style rule violations that need resolved here"` → Eliminated fallback parameters in all `var()` calls, replaced incorrect `--color-surface` and raw hex/rgba values with canonical `--surface-primary`, `--color-music`, `--text-inverse` tokens from `variables.less`.

## Component Scope & Modularity

- **2026-09-19** [`myward`]: **Monolithic component combining header, layout, and item management**: `"this file seems like it might be too long"` → Extracted `AgendaProgramComponent` subcomponent out of `SacramentAgendaBuilderComponent`.
- **2026-09-19** [`myward`]: **Oversized component stylesheet containing shared primitives**: `"this file also seems way too long"` → Lifted shared liturgical styling primitives from local component LESS to `src/styles/components/agenda.less`.
- **2026-09-19** [`myward`]: **Over-scoping drawer to musical numbers instead of pure hymnal catalog**: `"musical numbers aren't 'selected' from a drawer, only hymns are... this drawer doesn't need to worry about musicalNumbers, just hymns"` → Restricted `SacramentHymnDrawerComponent` slot typing strictly to `HymnKey`, decoupling custom musical numbers to agenda program level.

## Code Hygiene / Active Feature Evolution & Zero Backward-Compatibility Shims

- **2026-09-20** [`myward`]: **Artificial backward-compatibility wrappers on code in active development**: `"do NOT create 'backward-compatibility' structures for code we're activly working on!!"` → Removed backward-compatibility shims (`canPlan`, `canMusic`, etc.) and refactored all consumers in the active feature to consume `service.userPermissions()` directly.
- **2026-09-20** [`myward`]: **Type alias shim for renamed interface in active feature**: `"remove this alias, and just it as is"` → Removed `PulpitPronouns = GrammaticalPronouns` type alias and imported `GrammaticalPronouns` directly at call sites.
- **2026-09-20** [`myward`]: **Re-export function alias on freshly moved utility**: `"again, remove this alias and just use the actual method."` → Removed `formatPulpitTime` alias and imported canonical `format12HourTime` from `core/utils/date-utils.ts` directly.
- **2026-09-20** [`myward`]: **Standalone function exported alongside component service with redundant pass-through delegation method**: `"this functions seems like it should be part of the service, not an exported method. Why was it exported?" / "this feels odd. Why was this done this way?"` → Encapsulated the transformation logic directly inside `SacramentPulpitService.buildSteps`, eliminated the external standalone function, and removed the unnecessary delegation wrapper.

## Code Hygiene / Separation of Presentation & Pure Logic

- **2026-09-20** [`myward`]: **Hardcoded raw HTML markup constructed in logic class**: `"I don't like having html hard coded here. this class should be defining the data, not the format" / "more html in a logic class. no. This all needs to be refactored"` → Refactored `PulpitStepViewItem` to define pure, strongly typed structured presentation data, eliminating `fullScriptHtml` and moving all formatting and semantic markup into the Angular component template with native `@if` and `@for` control flow.

## Code Hygiene / Control Flow & Ternary Expression Overuse

- **2026-09-19** [`myward`]: **Nested ternary expressions controlling item instantiation**: `"remove ternary"` → Replaced nested ternaries with explicit control-flow branches for item creation.
- **2026-09-19** [`myward`]: **Ternary used for multi-branch array sorting**: `"I don't like this ternary"` → Replaced return ternary in `HymnDataService.searchHymns` with explicit `if/else` branches.
- **2026-09-19** [`myward`]: **Inline ternary template substitution for options**: `"yuck!"` → Replaced inline ternary string replacement in select dropdown with structured `LeadershipOfficerOption` model containing explicit `value` and `label` properties.

## Code Hygiene / Utility Colocation & Execution Flow

- **2026-09-19** [`myward`]: **Duplicated common execution paths across save section branches**: `"dedupe the branches to have 'always run' code happen after the if block"` → Extracted `buildSectionPayload(section)` helper and unified common `saveSection.emit()` and dirty-clearing logic after section dispatch.
- **2026-09-20** [`myward`]: **Time formatting utility placed in feature domain file**: `"should this be moved to date utils? or is this unique enough to be a one off?"` → Moved `format12HourTime` to `core/utils/date-utils.ts` with dedicated unit test coverage.

## Code Hygiene / Synthetic & Dummy Form State

- **2026-09-19** [`myward`]: **Dummy synthetic objects used to back draft forms**: `"ah, I see. You just moved the smell somewhere else..."` → Eliminated synthetic empty domain objects (`id: ''`) used to back draft forms.

## Domain Modeling / Domain Semantics & UI Separation

- **2026-09-19** [`myward`]: **Preset leadership strings hardcoded in UI component**: `"this seems like the wrong place for these strings to be defined"` → Extracted presiding and conducting officer presets into canonical domain collections (`PRESIDING_OFFICER_OPTIONS`, `CONDUCTING_OFFICER_OPTIONS`) in `sacrament-agenda.ts`.
- **2026-09-20** [`myward`]: **Overly broad title prefixing for presidency members**: `"I'm not sure prefixing all members of a presidency with "president" is the correct move"` → Restricted "President" title strictly to the actual Stake President or explicit titles, preventing counselors in bishoprics/auxiliary/quorum presidencies from being inaccurately titled as "President".
- **2026-09-20** [`myward`]: **Usage-specific pronoun return types instead of general grammatical cases**: `"instead of specifying the pronoun for a specific usage, let's just return the grammatical type of pronoun, and each usage can pick the correct type for it's use"` → Replaced usage-specific interface with `GrammaticalPronouns` (`subject`, `object`, `possessive`), allowing consumers to select the required grammatical case.

## Domain Modeling / Speculative Properties & Premature Taxonomies

- **2026-09-19** [`myward`]: **Premature synthetic category taxonomy in domain data**: `"yeah, not loving this. My instinct is to drop 'category' until we have a proper system in place"` → Dropped synthetic `category` field from `HymnCatalogItem` and removed category pill UI, deferring liturgical classification until a proper topic-tagging architecture is established.
- **2026-09-20** [`myward`]: **Speculative calling property on member model**: `"members have an array of callings, not a single calling, and we don't even use this here anyway"` → Removed obsolete `calling?: string` field from `SacramentMember` in `sacrament-data.service.ts`.

## Angular Signals & Reactivity

- **2026-09-19** [`myward`]: **Imperative `@ViewChild` component references**: `"why do we need a viewchild reference? feels clunky"` → Replaced imperative `@ViewChild` component reference with reactive Angular Signals (`input`, `output`, `signal`).
- **2026-09-19** [`myward`]: **Loose individual permission signals instead of structured permission state**: `"I'm thinking it would be a little cleaner to wrap all the 'can*' permissions into a single object, instead of 5 loose signals"` → Unified 5 loose capability signals into a single `SacramentPermissions` interface and `can = computed<SacramentPermissions>()` object signal with backward-compatible getters.

## SpecOps Planning & Documentation

- **2026-09-19** [`myward`]: **Status progress updates polluting architectural decisions log**: `"how is this a decision??"` → Removed status progress updates from `decisions.md`; restricted log strictly to technical trade-offs and architecture choices.

## File & Domain Naming

- **2026-09-19** [`myward`]: **Redundant `.domain` suffix in filenames**: `"looks like we don't use the work 'domain' in our domain objects. let's remove that."` → Renamed `*.domain.ts` files to `*.ts` to match existing repository naming conventions.
- **2026-09-20** [`myward`]: **Domain models and logic defined in component folder with .domain suffix**: `"if this is a domain file, shouldn't it be with the other domain files?"` → Relocated canonical domain models and functions (`PulpitStepIndex`, `GrammaticalPronouns`, `formatLeaderForPulpit`, `deriveGrammaticalPronouns`) to `apps/v2/src/app/core/domain/sacrament-pulpit.ts` (dropping `.domain` suffix per repo standards), and colocated component ViewItems inside `sacrament-pulpit.service.ts`.

## UI Fallbacks & Placeholder Copy

- **2026-09-19** [`myward`]: **Arbitrary literal placeholder rendered in agenda business order**: `"in what case would we wind up showing "Unknown"?"` → Replaced arbitrary placeholder string `'Unknown'` in `businessName()` with trimmed candidate name or clean empty string `''`.

## Component Architecture & Lifecycles

- **2026-09-19** [`myward`]: **Monolithic legacy form component lifecycle evaluation**: `"evaluate this component as a candidate to recieve a backing service"` → Documented architectural evaluation: `SacramentAgendaFormComponent` is the legacy V1 component superseded by `SacramentAgendaBuilderComponent`, which cleanly decomposes into child components backed by `SacramentService`.
- **2026-09-20** [`myward`]: **Direct window.localStorage access in testable feature service**: `"accessing window should not be done from a testable service. it should be in a dedicated storage service, which I believe we have"` → Created injectable `LocalStorageService` utilizing `PLATFORM_ID` and `DOCUMENT` to abstract browser storage and eliminate direct `window` access from feature services.

