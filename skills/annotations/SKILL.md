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
   - **Act & Resolve:** Execute the requested change, apply the refactor, or choose the best technical approach.
   - **Escalate:** If another human must answer, extract the question to a separate summary note.
   - **Skip:** Leave the annotation intact only when there is not enough context or authority to resolve it.
4. Update the content so the annotation is no longer needed.
5. Remove every annotation that was resolved or escalated.
6. Preserve the document's existing tone, structure, heading style, and formatting.
7. Report what happened to each annotation in the final response.

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

Escalated annotations:
- `{!ask Bob}`: Captured as an open question about deployment ownership.

Skipped annotations:
- `{!confirm target version}`: Left in place because the target version is not present in the repo or provided context.
```

Omit empty sections.
