---
name: AI Context Handoff
description: Generates a self-executing context brief to seamlessly migrate an active session to a fresh AI agent, reducing token costs and hallucination drift. Optimized for strict brevity.
version: 1.6
tags:
  - ai-skill
  - workflow
  - prompt
  - context-management
---

# Context Handoff

> ### User Instructions
> When your active AI session approaches context saturation, performance degrades, or you want to save tokens:
> 1. Type `/handoff` in chat (along with optional task updates or numbered feedback).
> 2. The AI will output a single copyable Markdown code block (and optionally create a local anchor file if feedback is extensive).
> 3. Copy the entire generated code block, open a fresh AI session, and paste it as your first prompt.

---

## Agent Execution Rules (Active Session)

**Trigger:** `/handoff`

### 1. Invocation Modes & Parsing

When `/handoff` appears anywhere in a user message, parse **deferred instructions** (work intended for the *next* agent session). Evaluate whether to execute work now or capture it only in the brief.

* **Default (Brief-Only):** `/handoff` generates the brief only. Capture deferred instructions in `IMMEDIATE NEXT STEPS` (§2). Do **NOT** execute them now.
* **Execute-Then-Handoff:** Explicit forward-sequencing cues (`then`, `and then`, `after that`, `finish X then /handoff`, `/handoff after <work>`) require you to:
  1. Execute the specified work first.
  2. Generate and emit the handoff brief.
  3. Place any remaining deferred instructions in `IMMEDIATE NEXT STEPS`.
* **Preceding Logic:** Forms like `/handoff <instructions>`, `<instructions> with a /handoff`, or `/handoff then do <instructions>` are brief-only (the trigger follows the deferred instructions).
* **Explicit Overrides:**
  * `do not implement` / `handoff only` → Enforce **Brief-Only**.
  * `implement now` / `fix it now` → **Execute immediately** regardless of `/handoff` position.
* **Ambiguous Cases:** Default to Brief-Only. Add a single-line note directly above the output code block explaining your parsing assumption.

---

### 2. Deferred Work

Classify each deferred instruction (§1) separately. A single handoff often combines types.

| Type | Condition | Brief Format |
| :--- | :--- | :--- |
| **Pointer** | Work already written in a file (TODOs, inline markers, open questions) | File path + item to find. Do *not* restate file content. |
| **Direct** | Stated directly in chat; not detailed in any file | Verbatim user wording or a concise, faithful summary. |
| **Numbered** | References a prior agent response by section number | Follow §3 (Numbered Feedback Protocol). |

#### Example Processing
**User Input:** `/handoff resolve {!} in 3-05. Run the 3-04 E2E checklist on dev. 2.1 fix`

```text
## IMMEDIATE NEXT STEPS
* Resolve `{!` in `3-05-intent-shape-and-extraction-cleanup-plan.md`; read and edit in place.
* Run the manual E2E scenarios in `3-04` on a dev tenant.
* [2.1] excerpt: "<quote from anchor>" — User comment: "<verbatim>"
```

---

### 3. Numbered Feedback Protocol

Applies when numbered comments accompany `/handoff` in the current or immediately preceding message (e.g., `1.2 fix`, `→ 3.1.4 explain`).

#### Execution Principles
* **Deferred Processing:** Treat all numbered references/comments as **deferred inputs**, not immediate commands (unless overridden by `implement now`). Do **NOT** fix or resolve them in this session.
* **Anchor Resolution:** Locate the latest structured agent response containing the referenced section numbers.
* **Missing Anchor:** If the referenced response is outside accessible context memory, **halt execution**. Request the user paste or point to the reference, then rerun `/handoff`. Do not reconstruct from memory.

#### Decision Gates

* **Option A: Brief-Sufficient (No Temp File)** — *All must be true:*
  * ≤ 3 distinct references; total comment text is short.
  * References span ≤ 2 top-level sections.
  * Excerpts require ≤ 40 words each; total `IMMEDIATE NEXT STEPS` bullets ≤ 6.

  *Inline Format:* Embed directly in brief under `IMMEDIATE NEXT STEPS`:  
  `[ref] excerpt: "<quote>" — User comment: "<verbatim comment>"`

* **Option B: Anchor File Required** — *Any are true:*
  * ≥ 4 distinct references or extensive feedback comments.
  * References span ≥ 3 top-level sections.
  * Anchor response is large (≥ 6 top-level sections or extensive text).
  * Explicit user request (`save anchor` / `full context`).

  *Anchor File Spec:*
  * **Path:** `.handoffs/` or project root directory (Do **not** use Canvas).
  * **Filename:** `handoff-anchor-YYYY-MM-DD-HHmm.md` (append `-2` on collision).
  * **Contents:** Must contain two verbatim sections:
    1. `## Prior Assistant Response (Verbatim)`
    2. `## User Numbered Comments (Verbatim)`  
    *(Optional: Append `## Handoff Notes` for rules omitted from the brief).*

#### Status Line Output
Print one line directly above the output code block:  
`Anchor file created: <path>` **OR** `Brief-sufficient; no anchor file created.`

---

### 4. Brief Generation & Output Format

Output the payload strictly inside **one single Markdown code block**. Do not include conversational preambles, introductions, or postscripts outside or inside the block.

* Each `IMMEDIATE NEXT STEPS` bullet follows §2 (pointer, direct, or numbered).
* Do not collapse mixed instructions into one paraphrased summary.
* If numbered feedback exists:
  * Limits for `CORE CONTEXT & RULES` and `ACCOMPLISHED SO FAR` remain max 3 bullets.
  * `IMMEDIATE NEXT STEPS` expands up to 6 bullets to fit feedback tasks.

#### Output Template (Receiving Agent Payload)

Construct the brief using the exact format below:

```text
Act as a continuation of my previous AI assistant. Read this context brief, acknowledge understanding in one sentence, and immediately begin executing the items under "IMMEDIATE NEXT STEPS".

If numbered follow-ups are pending: address them directly in this chat using matching section numbers; do not generate standalone resolution documents unless explicitly requested.

# CONTEXT HANDOFF BRIEF
**Project/Goal:** [1 sentence maximum on overarching goal]
**Current Status:** [1 short sentence on current state]

## CORE CONTEXT & RULES
* [Max 3 bullets: non-standard constraints, tech stack versions, or mandatory rules]

## ACCOMPLISHED SO FAR
* [Max 3 bullets: recent, high-impact decisions or completions directly relevant to next steps]

## ACTIVE WORKING STATE
* [Critical file paths, function names, or key mid-edit states only; no full code blocks]

## IMMEDIATE NEXT STEPS
* [One bullet per deferred instruction — pointer, direct, or numbered per §2/§3]
```