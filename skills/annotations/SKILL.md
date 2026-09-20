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
- `logPath`: Path to the central tracker document.
- `thresholdAlert`: Number of occurrences in a category before suggesting codification (default: `3`).

## Workflow

1. Scan the target content for `{!`.
2. Read enough surrounding context to understand the annotation's intent.
3. Determine intent: **Is the user directing code or implementation to be different?**
   - **YES (Code / Style / Architecture Correction):**
     - Assign an **organic, descriptive category** (e.g. `Type Safety`, `Styling & Tokens`, `Angular Signals`, `Component Scope`, `Code Hygiene`, `State Management`, etc.). Do NOT force fit into a rigid closed list—allow new categories to emerge naturally as patterns arise.
     - Append the entry to the configured `logPath` under that category's section as a bullet point:
       `- **YYYY-MM-DD** [workspace]: Context/Problem: "raw annotation snippet" → action taken`
       (Include the context/problem so subsequent agents understand the concrete anti-pattern being addressed).
     - Increment the count in the category summary at the top of the tracker (or add the new category if newly created).
     - When a pattern of similar annotations addressing the same underlying problem emerges, audit existing rules first to check if one exists; if so, diagnose why it failed to be followed and propose a solution, or if none exists, propose a specific rule.
   - **NO (General Question, Comment, or Domain Decision):**
     - Answer, clarify, or implement the requested decision directly inline. Do not log to the code correction tracker.
4. Update the content so the annotation is no longer needed.
5. Remove every annotation that was resolved or escalated.
6. Preserve the document's existing tone, structure, heading style, and formatting.
7. Report what happened to each annotation in the final response.

## Log Structure, Organic Categories & Subcategories

The tracker file is maintained as:
- **Summary Overview:** A compact list or count of all active categories, subcategories, and their total entries.
- **Category & Subcategory Sections:** Markdown sections per category (`## Category Name` or `## Category / Subcategory`), containing a chronological bullet list of entries.
- **Organic Evolution & Subcategories:** Categories are open-ended. When a category accumulates 4 or more entries (such as `Type Safety` or `Code Hygiene`), agents must proactively inspect and evaluate the entries, but decompose them into focused subcategories only when appropriate (e.g. when distinct, coherent sub-patterns naturally emerge). Do not force artificial sub-groupings if the entries all address the same single concept.
- **Reorganizing & Adjusting Log Categories:** Agents are explicitly authorized and encouraged to adjust the categorization and subcategorization of existing entries in the tracker whenever it makes patterns clearer and more actionable.
- **Mandatory Entry Context:** Every entry must include rich context describing what was being worked on and the concrete problem/anti-pattern:
  `- **YYYY-MM-DD** [workspace]: **[Context / Problem]**: "raw annotation snippet" → action taken`
  Do NOT record bare quotes without context. When reviewing the tracker, update existing entries that lack context.

## Smart Pattern Alerts & Rule Codification Nudge

The tracker is an empirical tool to discover where permanent rules are needed. **Never focus on exact entry counts or raw numbers** (e.g. NEVER say "Category X has reached N entries" or "There are now 3 entries under Type Safety").

Because broad categories (such as `Type Safety`) can encompass dozens of different issues, an arbitrary count threshold does NOT mean a rule should be created. Instead, agents must be smarter:
1. **Focus on Recurring Specifics, Not Counts:** Only proceed when you observe a pattern of *similar enough annotations* addressing the exact same underlying problem or anti-pattern across multiple reviews (e.g., repeatedly eliminating `as unknown as Type` double-casts, repeatedly replacing hardcoded hex colors with CSS tokens, or creating backward-compatibility shims on active code).
2. **Synthesize the Pattern:** Articulate the precise technical anti-pattern being corrected.
3. **Audit Existing Rules First (MANDATORY):** Before proposing a new rule, inspect existing instructions (`ai-docs/instructions/`), repository rules (`.agents/rules/`), and user rules to determine if a rule covering this issue **already exists**:
   - **If a rule already exists:**
     - Do NOT propose a duplicate or redundant rule.
     - Determine **why that rule isn't being followed** (e.g., Is it ambiguously worded or passive? Is it buried in an obscure file that agents don't see? Is it framed too narrowly or project-specifically? Is it missing automated lint/test enforcement? Is it absent from the root rules index?).
   - **If no rule exists:**
     - Draft concise, negative-constraint rule text (e.g. *"NEVER use `as unknown as` double-casting"*).
     - Identify the single most logical instruction file in `instructions/` to house it.
4. **Prompt with the Pattern Nudge:** Alert the user naturally to the recurring pattern, focusing on conveying the core ideas:
   - Identify the concrete recurring problem or anti-pattern observed across reviews.
   - If an existing rule covers it: cite the existing rule and file, explain why it was violated, and propose the solution to enforce or clarify it.
   - If no existing rule covers it: propose specific, actionable rule wording and name the target rule file.

Do not modify permanent rule files automatically. Wait for the user's explicit directive.

## Resolution Rules

- For direct edit requests, make the edit inline and remove the annotation.
- After removing an annotation, the remaining content must stand on its own. If the annotation asks for a judgment, answer, clarification, or recommendation, rewrite the surrounding text to incorporate the result; do not leave behind a bare response like "yes", "it is", or "use that one."
- For source code annotations, resolve the requested change in the code itself and remove the marker. Preserve valid syntax and follow the surrounding code style.
- For removal requests, remove the referenced content and the annotation.
- For unclear requests, infer conservatively from nearby content. If the inference would be risky, skip and explain why.
- For human-dependent questions such as `{!ask Bob}`, move the question into an `Open Questions` or equivalent summary section. If no suitable section exists, add one when appropriate; otherwise leave the annotation in place and report why.
- When an annotation asks for an explanation, answer in blockquotes so the added context reads as an aside instead of becoming part of the document's main flow.
- For transcript or meeting-note documents, also use blockquotes for any other agent-added context so it is visually distinct from the original record.
- Do not preserve compatibility with the annotation text. The annotation is task metadata, not user-facing content.

### Strict Rule: Questions Are Questions, NOT Instructions

- **MANDATORY:** Agents must **ALWAYS** treat questions as questions, **NEVER** as instructions.
- **Zero Veiled Instructions Assumption:** Even if a question could be interpreted as a rhetorical or veiled instruction (e.g. `{!is this really an ng-framework instruction?}` or `{!why do these 5 get special treatment?}`), agents are strictly **FORBIDDEN** from modifying code, moving files, or deleting content based on the question alone.
- **Required Protocol for Questions:**
  1. **Answer & Discuss:** Address the question directly in your response—explain the reasoning, evaluate the architectural trade-offs, or answer the technical question.
  2. **Wait for Explicit Directive:** Do NOT make code or document edits based on a question. Present options or your recommendation, and wait for the user's explicit directive (e.g., "delete it", "move it", "proceed with option A").
  3. **User Stance:** If the user inadvertently gave a veiled instruction through a question and the agent treats it strictly as a question, that is on the user ("that's on me"). The agent must never attempt to read between the lines or assume an imperative command.

## Final Response

When annotations were present, include a concise annotation report:

```markdown
Resolved annotations:
- `{!remove dependency}`: Removed the dependency note from the affected section.
- `{!what's a better way?}`: Replaced the proposed approach with the existing project pattern.

Logged code corrections (to `annotation-tracker.md`):
- `[Category / Subcategory]`: **[Context / Problem]**: "annotation quote" → action taken

Pattern Alert (when a recurring pattern is identified):
- Highlight the recurring anti-pattern.
- If an existing rule covers it: cite the existing rule and file, diagnose why it was not followed, and propose the solution to enforce or clarify it.
- If no existing rule covers it: propose specific rule text and name the target rule file.

Escalated annotations:
- `{!ask Bob}`: Captured as an open question about deployment ownership.

Skipped annotations:
- `{!confirm target version}`: Left in place because the target version is not present in the repo or provided context.
```

Omit empty sections.
