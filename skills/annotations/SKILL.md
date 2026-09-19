---
name: annotations
description: Process inline `{! ... }` annotations in any textual content the agent can read, including code, docs, configs, notes, plans, and generated artifacts. Use when a file or prompt contains annotation markers, the user asks to resolve annotations, or the task involves editing annotated content.
---

# Annotations

Use this skill when editing any readable textual content that contains natural language annotations in the form `{! ... }`.

## Core Rule

Treat each annotation as an instruction, question, or decision point embedded in the surrounding content. Resolve it in place whenever possible, then remove the `{! ... }` marker.

## Configuration

Configuration overrides live in `config.user.md` in this skill's directory (copied from `config.template.md`):
- `logPath`: Path to the central tracker document (default: `c:/stuff-john/github/ai-docs/logs/annotation-tracker.md`).
- `thresholdAlert`: Number of occurrences in a category before suggesting codification (default: `3`).

## Workflow

1. Scan the target content for `{!`.
2. Read enough surrounding context to understand the annotation's intent.
3. Determine intent: **Is the user directing code or implementation to be different?**
   - **YES (Code / Style / Architecture Correction):**
     - Assign an **organic, descriptive category** (e.g. `Type Safety`, `Styling & Tokens`, `Angular Signals`, `Component Scope`, `Code Hygiene`, `State Management`, etc.). Do NOT force fit into a rigid closed list—allow new categories to emerge naturally as patterns arise.
     - Append the entry to the configured `logPath` under that category's section as a bullet point:
       `- **YYYY-MM-DD** [workspace]: "raw annotation snippet" → action taken`
     - Increment the count in the category summary at the top of the tracker.
     - If the category has reached or exceeded `thresholdAlert` entries, flag it for the user in the final report.
   - **NO (General Question, Comment, or Domain Decision):**
     - Answer, clarify, or implement the requested decision directly inline. Do not log to the code correction tracker.
4. Update the content so the annotation is no longer needed.
5. Remove every annotation that was resolved or escalated.
6. Preserve the document's existing tone, structure, heading style, and formatting.
7. Report what happened to each annotation in the final response.

## Log Structure & Organic Categories

The tracker file (default: `c:/stuff-john/github/ai-docs/logs/annotation-tracker.md`) is maintained as:
- **Summary Overview:** A compact list or count of all active categories and their total entries.
- **Category Sections:** A markdown section per category (`## Category Name`), containing a chronological bullet list of entries.
- **Organic Evolution:** Categories are open-ended. When an annotation represents a distinct engineering or styling concept, create a new `## New Category` heading instead of shoehorning it into an existing one.

## Rule Codification Nudge

The tracker is an empirical tool to discover where permanent rules are needed. When a category accumulates multiple entries (>= `thresholdAlert`), prompt the user in the final response:

> "Pattern Alert: There are now N logged corrections under **[Category]**. Would you like to review these and codify a standing rule in `ai-docs/instructions/`?"

Do not modify permanent rule files automatically. Wait for the user's explicit directive.

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

Logged code corrections (to `annotation-tracker.md`):
- `[Category]`: "annotation quote" → action taken (Total in category: N)

Pattern Alert (if threshold reached):
- Category **[Category]** has reached N entries. Would you like to review and codify a permanent rule?

Escalated annotations:
- `{!ask Bob}`: Captured as an open question about deployment ownership.

Skipped annotations:
- `{!confirm target version}`: Left in place because the target version is not present in the repo or provided context.
```

Omit empty sections.
