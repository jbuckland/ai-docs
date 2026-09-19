---
name: annotations
description: Process inline `{! ... }` annotations in any textual content the agent can read, including code, docs, configs, notes, plans, and generated artifacts. Use when a file or prompt contains annotation markers, the user asks to resolve annotations, or the task involves editing annotated content.
---

# Annotations

Use this skill when editing any readable textual content that contains natural language annotations in the form `{! ... }`.

## Core Rule

Treat each annotation as an instruction, question, or decision point embedded in the surrounding content. Resolve it in place whenever possible, then remove the `{! ... }` marker.

## Workflow

1. Scan the target content for `{!`.
2. Read enough surrounding context to understand the annotation's intent.
3. Classify the annotation:
   - **Form:** `Correction` (correcting a pattern/mistake), `Direct Instruction` (explicit command), `Question` (asking why/how), `Comment` (feedback/observation), or `Escalation` (human decision).
   - **Purpose:** `User Preference / Code Craft` (style, typing, architecture, ergonomics) vs `Domain Logic` (business rules, meeting flow) vs `Task Orchestration` (runbook sequencing, git hygiene).
   - **Action:**
     - **Act & Resolve:** Execute the requested change, apply the refactor, or choose the best technical approach.
     - **Escalate:** If another human must answer, extract the question to a separate summary note.
     - **Skip:** Leave the annotation intact only when there is not enough context or authority to resolve it.
4. **Log User Corrections:** If Purpose is `User Preference / Code Craft`, record the correction in the central ledger:
   - Path: `c:/stuff-john/github/ai-docs/logs/annotation-tracker.md`
   - Update the **Frequency Summary** table (increment occurrence count or add new pattern).
   - Append a row to the **Chronological Review Ledger** with timestamp, workspace, form, category, raw snippet, and action taken.
5. Update the content so the annotation is no longer needed.
6. Remove every annotation that was resolved or escalated.
7. Preserve the document's existing tone, structure, heading style, and formatting.
8. Report what happened to each annotation in the final response.

## User Correction Tracking & Graduation

- **Central Location:** All coding preference and review corrections are tracked centrally in [`c:/stuff-john/github/ai-docs/logs/annotation-tracker.md`](file:///c:/stuff-john/github/ai-docs/logs/annotation-tracker.md), NOT in individual project repositories.
- **Taxonomy Categories:**
  - `Type Safety`: Closed domain interfaces, no loose index signatures (`[key: string]: unknown`), no double-casting via `unknown`, discriminated unions for polymorphic models, ViewItem extending domain models.
  - `Angular Signals`: Signals over `@ViewChild`, reactive inputs/outputs, zoneless state.
  - `Styling & Theming`: CSS custom properties (`var(--...)`) instead of LESS `@variables` or hardcoded hex colors, dark/light mode compatibility, token reuse from `variables.less`.
  - `Component Scope`: Splitting monolithic components/templates (> 200 lines), lifting shared CSS primitives to `src/styles/components/`.
  - `Code Hygiene`: Eliminating fake default objects (`id: ''`), eliminating nested ternaries in forms/drafts.
  - `SpecOps Planning`: Keeping `decisions.md` strictly for architectural trade-offs (not status summaries), authoring just-in-time runbooks, monospaced markdown tables.
- **Temporary Nature & Graduation:** The tracker is temporary. When a pattern recurs frequently (count >= 2–3), it is codified into a permanent rule in `ai-docs/instructions/` (or repository `.agents/rules/`). Once codified, mark the status as `Graduated to [file]` so future agents follow the rule proactively and repetitive annotations cease.

## Resolution Rules

- For direct edit requests, make the edit inline and remove the annotation.
- After removing an annotation, the remaining content must stand on its own. If the annotation asks for a judgment, answer, clarification, or recommendation, rewrite the surrounding text to incorporate the result; do not leave behind a bare response like "yes", "it is", or "use that one."
- For open-ended questions such as `{!what's a better way?}`, choose the best solution based on surrounding context and project conventions. Do not leave the question in place just because it was phrased as a question.
- For source code annotations, resolve the requested change in the code itself and remove the marker. Preserve valid syntax and follow the surrounding code style.
- For removal requests, remove the referenced content and the annotation.
- For unclear requests, infer conservatively from nearby content. If the inference would be risky, skip and explain why.
- For human-dependent questions such as `{!ask Bob}`, move the question into an `Open Questions` or equivalent summary section. If no suitable section exists, add one when appropriate; otherwise leave the annotation in place and report why.
- When an annotation asks for an explanation, answer in blockquotes so the added context reads as an aside instead of becoming part of the document's main flow.
- For transcript or meeting-note documents, also use blockquotes for any other agent-added context so it is visually distinct from the original record.
- Do not preserve compatibility with the annotation text. The annotation is task metadata, not user-facing content.

## Final Response

When annotations were present, include a concise annotation report:

```markdown
Resolved annotations:
- `{!remove dependency}`: Removed the dependency note from the affected section.
- `{!what's a better way?}`: Replaced the proposed approach with the existing project pattern.

Logged user corrections:
- Logged to `c:/stuff-john/github/ai-docs/logs/annotation-tracker.md`: [Category] pattern description (Count: N)

Escalated annotations:
- `{!ask Bob}`: Captured as an open question about deployment ownership.

Skipped annotations:
- `{!confirm target version}`: Left in place because the target version is not present in the repo or provided context.
```

Omit empty sections.
