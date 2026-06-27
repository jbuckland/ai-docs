# Implementation Plan Format

## Purpose

Technical planning format for implementation plans aimed at **agent consumption**. The goal is to communicate *what to build and why the design is shaped that way* — not to write the code itself.

> **Planning Agent vs. Implementing Agent:** Plans are written by a planning agent and consumed by an implementing agent. The plan describes architecture, interactions, and key design decisions. It leaves code-writing decisions to the implementing agent.

---

## Two Modes of Implementation Plans

### Mode 1: Architectural Plan (Planning Agent Output)
Used when designing a new system or a non-trivial feature. The implementing agent reads this and writes the code.

**Focus on:**
- What files exist and what each one's single responsibility is
- How components interact (data flow, dependency direction)
- Key design decisions and **why** (e.g., "async because it will be swapped for DB")
- Constraints the implementing agent must not violate

**Minimize:**
- Full code listings — only include snippets for non-obvious interfaces or critical shapes
- Step-by-step execution details — the implementing agent figures those out

### Mode 2: Execution Plan (Runbook)
Used for well-understood, procedural tasks (migrations, deployments, config changes).

**Focus on:**
- Exact commands to run, in order
- Code snippets to add or modify
- Expected output and validation steps

---

## Architectural Plan Format

```markdown
# [Phase Name]: [Short Description]

**Parent:** [Link to parent plan, if sub-phase]
**Depends on:** [Link to prerequisite phases]

## Goal
One paragraph: what exists after this phase is complete. Focus on capability, not process.

## Core Principles
Bullet list of constraints the implementing agent must not violate.
Example: "Only xstate.adapter.ts may import from 'xstate'."

## Deliverables
Numbered list of files to create. One line each: path + one-sentence purpose.

## File Structure (End State)
Directory tree showing all new files.

---

## Step N: [Component Name]

**File:** `path/to/file.ts`

Describe the component's responsibility in 2–3 sentences. Then:

- What it depends on (imports)
- What depends on it (who calls it)
- Key behaviors or invariants

**Key design decisions:** (only when non-obvious)
- Decision + reason in one line each

### Interface / Shape (if public-facing)
Include a minimal code snippet or table for the public API only.
Full implementation is left to the implementing agent.

---

## Validation Checklist
Concrete, binary assertions. No "make sure it works" — each item must be falsifiable.

## Next Step
→ [Link to next phase]
```

---

## Architectural Plan Rules

### Length
- **Target:** 200–350 lines per plan
- **Maximum:** 400 lines
- If longer, split into sub-phases (e.g., 1A, 1B, 1C)

### Code Snippets — Use Sparingly
Include code **only** when:
- The interface shape is non-obvious and an implementing agent would reasonably guess it wrong
- A design decision is difficult to express in prose (e.g., discriminated union structure)
- The snippet is ≤ 20 lines

Do **not** include:
- Full class implementations
- Method bodies (describe behavior in prose instead)
- Boilerplate that any competent agent would write correctly

### Describing Interactions
Prefer prose or ASCII diagrams over code when showing how components interact:

```
Intent --> GameEngineRunner --> validates via GameEngine
                            --> applies via GameEngine
                            --> transitions StateMachineAdapter
                            --> appends to GameLedger (async)
```

### Describing Behaviors
Use a table when a component has multiple methods with distinct behaviors:

| Method         | Returns          | Purpose                           |
| :------------- | :--------------- | :-------------------------------- |
| `append(entry)`| `Promise<void>`  | Validates sequenceId, then pushes |
| `clear()`      | `Promise<void>`  | Resets to empty                   |

### Async-First Rule
When an interface will eventually need to be async (e.g., it will be backed by a DB or network in a later phase), **define it as async now**. In-memory implementations simply `Promise.resolve()`. This prevents interface breakage when swapping implementations.

### Abstraction Rule
If a third-party library is listed as a dependency (e.g., `xstate`, `socket.io`, `gsap`), the plan **must** define a project-owned interface (port) that wraps it. The plan must name exactly one file that is the sole importer of the library.

---

## Execution Plan Format (Runbook)

````markdown
# [Task Name]

## Goal
Brief description of the task.

## Prerequisites
- Required tools/dependencies

## Steps

### Step 1: [Action]
```bash
exact command here
```

### Step 2: [Action]
Create `path/to/file.ts`:
```typescript
// Only include if exact code is required
```

## Validation Checklist
- [ ] Binary assertion
- [ ] Another binary assertion


````

---

## Validation Checklist Items — Good vs. Bad

| ❌ Vague                             | ✅ Falsifiable                                               |
| :----------------------------------- | :----------------------------------------------------------- |
| "Tests pass"                         | "`npm test` exits with code 0"                              |
| "Make sure it works"                 | "Playing a winning game sequence sets `phase: 'gameOver'`"   |
| "Code is clean"                      | "`xstate` is imported in exactly one file: `xstate.adapter.ts`" |
| "Documentation updated"              | "Barrel export includes all 5 type files"                    |

---

## What NOT to Include (Either Mode)

- ❌ Time estimates
- ❌ Risk analysis
- ❌ Business justification
- ❌ Stakeholder approvals
- ❌ Project management overhead
- ❌ Full class implementations when prose suffices
- ❌ Redundant explanation of what TypeScript generics are

---

## AI Agent Artifact & Planning Workspace Rules

- **Workspace-Only Artifacts:** All AI agent planning and tracking artifacts (such as `implementation_plan.md`, `task.md`, and `walkthrough.md`) must be written directly to the `docs/ai-artifacts/` directory inside this repository workspace, rather than using the system's default hidden AppData directories.
- **Interactive Reviews via Git:** Writing plans directly to the repository allows the developer to review changes as normal Git diffs and provide annotations.
- **Developer Annotations:** The developer will add inline reviews using the `{!annotation}` syntax in the workspace markdown files. The agent must read the workspace file, address the annotations, and update it in-place.
- **AppData Redirects:** If the agent is prompted by the system to write files to the hidden AppData artifact directory, it should write a simple redirect message there pointing back to the workspace directory.

## Related Documentation

See [jb-doc-standards.instructions.md](./jb-doc-standards.instructions.md) for general documentation standards.
