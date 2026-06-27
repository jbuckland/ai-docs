---
name: generate-implementation-plan
description: Generate actionable, step-by-step technical runbooks designed for collaborative execution by a developer and an AI agent. The output must focus strictly on the "what" and "how" of technical execution, completely omitting project management and business overhead.
---
## Triggers

**USE THIS SKILL FOR:**
* Feature implementations and specifications
* Code migrations (e.g., between repositories)
* Refactoring efforts
* Multi-phase technical changes
* Breaking API changes
* Library creation and restructuring
* Complex bug fixes requiring planned steps

**DO NOT USE THIS SKILL FOR:**
* Business plans, executive summaries, or stakeholder communication
* Design documentation or Architecture Decision Records (ADRs)
* Knowledge base articles
* Simple bug fixes (just execute them directly)

## Core Directives

1.  **Be Action-Oriented:** Output must consist of step-by-step guides, copy/paste-ready terminal commands, and precise code changes.
2.  **Zero Business Fluff:** Do not include time estimates, schedules, risk analysis matrices, budget/cost info, training plans, or team coordination overhead.
3.  **Strict File Length Limits:** * **Target:** ~200 lines per document.
    * **Maximum:** 400 lines per document.
    * *Handling Overflows:* If a plan exceeds the limit, modularize it. Split into focused topic files (e.g., `plan-overview.md`, `plan-phase1.md`) and cross-reference them. Remove explanatory fluff before removing technical steps.
4.  **Tone & Voice:** Direct, imperative, and technical. Use commands like "Copy files", "Update imports", or "Run build." Assume the reader is technically competent and familiar with the codebase.

## Structure Template

Whenever executing this skill, adapt and use the following markdown template. Exclude sections if they are not applicable to the specific task.

```markdown
# [Feature/Task] Plan - [Phase/Topic]

**Repository:** `repo-name` (if applicable)  
**Goal:** One-sentence objective

## Current State (if applicable)
**Location:** File paths
**Components:** Bulleted list
**Dependencies:** Key items only

## Implementation Steps

### 1. [Step Name]

```[language]
# Copy/paste ready commands
command-here
```

**Code changes:**

```[language]
// FROM:
old code

// TO:
new code
```

## Validation

- [ ] Specific testable outcome
- [ ] Another specific outcome
- [ ] Build/test commands pass: `npm run build:prod`
```

## Content Requirements

When filling out the implementation steps, you must include the following details:

### 1. Exact Commands
Provide precise, copy/paste-ready commands for PowerShell, npm, or Git. 
*Example:*
```powershell
npm install @cw-ng/app-base@alpha
git checkout -b feature/DEV-12345-ai-assistant
```

### 2. Before/After Code Snippets
Show exact changes required in the codebase using the `// FROM:` and `// TO:` pattern.
*Example:*
```typescript
// FROM:
import { OldService } from '../old-path';
// TO:
import { NewService } from '@cw-ng/data';
```

### 3. Environment Specifics
* **File Paths:** Clearly denote source locations (e.g., `src/app/feature/`) and target locations.
* **Dependencies:** List specific npm packages, internal library updates, or breaking changes.
* **Configuration:** Note required updates to `package.json`, `tsconfig.json`, build scripts, or `angular.json`.

### 4. Concrete Validation
End every phase with a checklist (`- [ ]`) of testable outcomes. Examples include specific build commands (`ng build feature-name`), test commands (`npm test`), browser checks, and verifying the absence of console errors.