---
name: pr-review
description: Comprehensive, framework-agnostic Pull Request review workflow. Evaluates UX polish, system cohesion, engineering craftsmanship, and architectural safety nets, producing an annotatable review worksheet with actionable findings.
version: 1.2
tags:
  - ai-skill
  - workflow
  - git
  - code-review
  - quality-assurance
---

# PR Review Skill

> **Purpose**: A structured, framework-agnostic review workflow that evaluates incoming Pull Requests through two distinct lenses: **Product Quality & System Cohesion** (the human reviewer's primary focus) and **Universal Architectural Safety Nets** (the AI watchdog), generating an annotatable markdown worksheet.

---

## Review Philosophy & Focus Areas

Every PR review conducted with this skill balances two tiers of inspection:

### Tier 1: Product Quality & System Cohesion (Primary Focus)
Evaluate the PR from the perspective of the **end user** and the **long-term maintainer**:

1. **User Experience & Interaction Polish**:
   - *Question:* Does this feel intuitive, responsive, and seamless to use?
   - *Inspection:* Visual hierarchy, interaction density, responsive ergonomics across viewport sizes (mobile bottom navigation, desktop split-panes, touch targets), layout stability, print/export styling, and accessibility.
2. **System Harmony & Architectural Cohesion**:
   - *Question:* Does this belong here, and does it feel like a natural part of the whole system?
   - *Inspection:* How cleanly the feature integrates with adjacent modules; avoiding disjointed state, clunky navigation seams, mismatched terminology, or fragmented domain representations. Separation of concerns (keeping presentation components thin; state and side-effects in dedicated backing services).
3. **Engineering Craftsmanship & Reusability**:
   - *Question:* Is this clean, maintainable, and respectful of established team standards?
   - *Inspection:* Adherence to workspace conventions (reactive state patterns, design system token usage over hardcoded values, strict typing), eliminating duplicate logic (DRY), and reusing existing shared abstractions instead of reinventing them.

---

### Tier 2: Universal Architectural Safety Nets (AI Watchdog)
Serve as the proactive safety net for systemic, cross-cutting concerns that human reviewers may not immediately inspect:

4. **Security, Privacy & Authorization Boundaries**:
   - Scrutinize access control enforcement, tenant/user data isolation, and unauthorized data leakage across client/server boundaries (e.g., verifying document-level field isolation under free-tier database constraints).
5. **Data Integrity, Contracts & Backwards Compatibility**:
   - Detect breaking database schema changes, API contract drift, migration prerequisites, rollback feasibility, and coexistence of legacy and modern clients.
6. **Dependency, Runtime & Performance Health**:
   - Evaluate new third-party packages, modern (ESM) vs. legacy (CommonJS) module formats, bundle budget impacts, resource leaks, and unnecessary vendor lock-in.
7. **Verification Blind Spots & Edge Cases**:
   - Identify edge cases unit tests often miss (concurrency/race conditions, error recovery, offline behavior) and flag items requiring physical browser/device testing (e.g., file downloads, native print dialogs, canvas rendering).
8. **Documentation & Specification Alignment**:
   - Verify that code changes align with active architectural specs, change plans, and changelog/versioning standards.

---

## Review Workflow Protocol

When invoked via `/pr-review`, "review PR #<number>", or "review <branch>", execute the following 6 phases:

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Target PR Resolution & Git Safety                   │
│ (Preserve untracked work -> fetch -> switch branch safely)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ Phase 2: Context Synthesis & Description                    │
│ (Scale depth to footprint -> tag [Inferred Rationale])       │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ Phase 3: Autonomous Test & Build Execution                  │
│ (Run affected monorepo test/build scripts -> record metrics)│
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ Phase 4: Two-Tier Code Inspection (Three-Dot Diff)          │
│ (git diff base...HEAD -> Categorize P1/P2/P3 -> Clean items) │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ Phase 5: Dynamic Location Resolution & Artifact Generation  │
│ (Save pr-review-<number>.md -> remain on PR branch)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ Phase 6: GitHub Submission (Inline Comments vs General Body)│
│ (Post inline diff comments on files/lines -> General PR body)│
└─────────────────────────────────────────────────────────────┘
```

---

### Phase 1: Target PR Resolution & Git Safety

1. **Resolve PR Metadata**:
   - Identify the PR number, author, source branch, and target base branch (using `gh pr view <number>` or git remotes).
2. **Preserve Current Working State**:
   - Check if already on the target PR branch. If so, proceed directly.
   - Otherwise, check `git status`. If uncommitted changes exist (staged, unstaged, or untracked), **safely preserve them** before switching branches:
     ```powershell
     git stash push --include-untracked -m "pre-pr-review-autostash"
     ```
3. **Switch to PR Branch**:
   - Fetch the latest remote branch and check it out cleanly:
     ```powershell
     git fetch origin <source-branch>
     git checkout -B <source-branch> origin/<source-branch>
     ```
4. **Remain on Branch Policy**:
   - Do **NOT** automatically switch back to the prior branch at the end of the review. Leave the PR branch active so the user can immediately inspect the code, test features locally, or run ad-hoc verification.

---

### Phase 2: Context Synthesis & Description

Before detailing critique or findings, synthesize what the PR does to provide clear context:

1. **Scale with PR Footprint**:
   - **Small PR (< 5 files, targeted fix):** Provide a tight 2–3 sentence summary of the bug and fix.
   - **Medium / Large PR (> 10 files, architectural shift):** Provide a substantive overview of user-facing changes, functional shifts, and updated system boundaries.
2. **Avoid Laundry Lists**:
   - Do **not** generate a mechanical, file-by-file listing of lines modified. The git diff already provides that. Synthesize cohesive feature behaviors.
3. **Explicitly Label Inferences**:
   - Separate documented facts (from the PR description, commit messages, or linked specs) from agent speculation.
   - If inferring the author's rationale, motivations, or design trade-offs, **always prefix with `[Inferred Rationale]` or `[Hypothesis]`**.

---

### Phase 3: Autonomous Build & Test Execution

Once the PR branch is checked out, autonomously run the project's verification suite without prompting for each command:

1. **Discover & Execute Across Affected Workspaces**:
   - Inspect the PR diff to see which packages, applications, or root scripts were touched.
   - In a monorepo (e.g. `apps/*`, `packages/*`, or workspace configurations), run the test suites and production builds for **all affected workspaces**, in addition to root validation scripts:
     ```powershell
     # Run tests for touched areas (e.g. root scripts or workspace packages)
     npm test
     npm run build
     ```
2. **Record Metrics**:
   - Capture exact counts: total test suites, test pass/fail counts, compiler warnings (e.g., CommonJS bailouts, deprecations), and bundle budget compliance.

---

### Phase 4: Two-Tier Code Inspection (Three-Dot Diffing)

Generate the diff using **three-dot syntax** against the merge-base to isolate only the commits introduced by the PR:
```powershell
git diff origin/<base-branch>...HEAD
```

Audit the isolated diff against both **Tier 1 (Product Quality & System Cohesion)** and **Tier 2 (AI Watchdog)**.

1. **Classify Findings by Severity**:
   - **🚨 P1 (Blocker):** Security vulnerabilities, privacy leaks, breaking data/schema changes without migrations, broken core user flows, build failures.
   - **⚠️ P2 (Important):** Missing typecheck exclusions, bundle optimization warnings, UX regressions on specific viewport sizes, tight coupling, code duplication.
   - **📝 P3 (Improvement / Nit):** Styling polish, minor convention tweaks, SpecOps documentation updates, naming alignment.
2. **No Pre-Generated Annotations**:
   - Do **NOT** pre-populate annotation tags in the generated review.
   - Output clean markdown checklist items `- [ ]` and clear descriptions. The human reviewer will insert their own annotations where desired.
3. **Specific File & Line Targeting**:
   - Whenever relevant, anchor findings and review comments directly to the specific file and line numbers (`[<file>#L...](file:///...)`) where the issue or pattern occurs. Avoid generic file-level generalities when an exact line or code block is known.
   - **Local Review Documents:** The local markdown review artifact (`pr-review-<number>.md`) CAN and SHOULD contain local `file:///` links with exact line numbers (`file:///path/to/file.ts#L10-L20`) so the developer can navigate directly to the code inside their IDE.
4. **Communication Tone: Business Human (No Sycophantic Fluff)**:
   - Write feedback in the voice of a practical, direct peer reviewer ("business human").
   - Strictly avoid sycophantic AI cadence or cheerleading ("Clean, elegant implementation!", "Exceptional work!", "Great job!"). State what passed, what blocks merge, and what concrete actions are needed.
   - Format large feedback and comment blocks into true bullet format or line-delimited sentences (one sentence per line) for fast reading.
5. **Separation of General PR vs. Inline File Comments**:
   - Always divide PR feedback into two distinct categories:
     - **General PR Comments:** High-level PR issues (e.g. branch rebase requirements, version alignment, overall sign-off status).
     - **Comments on Specific Files:** Actionable code findings tied to an exact file path and line number range.

---

### Phase 5: Dynamic Location Resolution & Artifact Generation

The review must be saved to a structured, annotatable markdown file named:
```text
pr-review-<number>.md
```

#### Dynamic Location Discovery Protocol
Do **not** hardcode a single repository path into the review tool. Determine the target folder using the following priority hierarchy:

1. **Explicit Prompt Override:**  
   If the user specifies a path (e.g., "put the review in `.user/pr-review/`"), use that exact folder.
2. **Repository & Gitignore Discovery:**  
   - Scan `.gitignore` for user-scratch directories (e.g., `**/.user/`, `**/.users/`, `.scratch/`).
   - Inspect the workspace for existing review folders matching `**/pr-review/` or `**/reviews/`.
   - Check for historical review artifacts (e.g., `pr_review_*.md` or `pr-review-*.md`).
   - If an established directory is detected (e.g., `.user/pr-review/`), write there automatically.
3. **Repository Guidelines / Rules:**  
   - Check `AGENTS.md` or `.agents/rules/` for a documented review artifact location.
4. **Prompted Fallback:**  
   - If no user directory or prior review folder exists, ask:  
     *"Where should I save `pr-review-<number>.md`?"* (providing detected gitignored folders as recommendations).

---

### Phase 6: GitHub Review Submission (General vs. Inline File Comments)

When submitting review feedback to GitHub (via `gh` CLI or GitHub API), strictly adhere to the following comment placement rules:

1. **Inline Comments on Specific Files & Lines (Diff Anchoring)**:
   - Any comment that relates to a specific file and line **MUST be posted as an inline code review comment directly on that file and line** within the PR diff on GitHub.
   - Do **NOT** lump specific file comments into the general PR review body.
   - Post inline comments using the GitHub API:
     ```powershell
     gh api repos/<owner>/<repo>/pulls/<pr-number>/comments --input comment.json
     ```
     Where `comment.json` contains:
     ```json
     {
       "body": "Comment text with markdown and code blocks",
       "commit_id": "<head-commit-sha>",
       "path": "path/to/file.ts",
       "line": 102,
       "side": "RIGHT"
     }
     ```
   - **Payload Safety:** Always use JSON payload files (`--input <file>.json`) rather than `-f body="..."` in PowerShell to prevent shell escaping from mangling backticks, newlines, and markdown blocks.

2. **General PR Review Body**:
   - The top-level PR review comment (submitted via `gh pr review <number> --request-changes / --approve`) must contain **only** high-level, cross-cutting feedback:
     - Branch rebase requirements.
     - Overall build or test status.
     - Final approval / changes requested decision.

3. **Link & URI Handling (Local vs. Remote)**:
   - **Local Review Document (`pr-review-<number>.md`):** Allowed and encouraged to use local `file:///...` links for fast in-editor navigation.
   - **GitHub Comments (Remote):** Must **NEVER** contain local `file://c:...` links (which are broken and unclickable on GitHub). Always use repository-relative paths (`path/to/file.ts:102`) or plain backticks.

---

## Review Worksheet Template

Every generated `pr-review-<number>.md` file must follow this structure. **All markdown tables MUST have columns aligned in raw text using monospaced padding.**

```markdown
# PR Review: #<number> ("<PR Title>")

**Pull Request:** [#<number>](<PR URL>)  
**Branch:** `<source-branch>` ➔ **Target:** `<base-branch>`  
**Author:** <Author Name>  
**Reviewer:** <Reviewer Name> / AI Peer Review  
**Date:** YYYY-MM-DD  
**Overall Status:** `PENDING_REVIEW`  

---

## 🎯 What This PR Does & What Changed

<!-- Scale depth to PR footprint. Focus on functional and system shifts. -->
<Summary of functional changes, user-facing behavior, and architectural updates.>

> [!NOTE]
> **Author Intent & Inferences:**  
> - **Stated Intent:** <Intent explicitly noted in PR body/commits>  
> - **[Inferred Rationale]:** <Agent's technical deduction of why this pattern was chosen>

---

## 📊 Summary of Findings

| ID | Severity | Area / Component    | Summary / Concern                     | Recommended Action                    | Status |
| :- | :------- | :------------------ | :------------------------------------ | :------------------------------------ | :----- |
| 1  | 🚨 P1    | <path/to/component> | <Brief description of blocker>        | <Actionable fix>                      | Open   |
| 2  | ⚠️ P2    | <path/to/module>    | <Brief description of warning/issue>  | <Actionable fix>                      | Open   |
| 3  | 📝 P3    | <path/to/file>      | <Polish or documentation alignment>   | <Actionable fix>                      | Open   |

---

## 🧪 Local Test & Build Verification Results

| Verification Suite          | Command           | Result         | Details / Metrics                     |
| :-------------------------- | :---------------- | :------------- | :------------------------------------ |
| Unit Test Suite             | `npm test`        | ✅ PASS (X/X)   | 0 failures, X tests passed            |
| Integration & Rules Tests   | `npm run test:..` | ✅ PASS (X/X)   | All integration suites passed         |
| Production Build            | `npm run build`   | ✅ PASS         | Bundle budget OK, X warnings observed |

---

## 🔍 Detailed Review Findings

### 1. <Finding Title> (Severity: 🚨 P1 / ⚠️ P2 / 📝 P3)
* **Location:** [`<file_path>`](file:///<absolute_path>#L10-L25)
* **Review Lens:** <e.g. UX & Interaction Polish | Security & Permissions | etc.>
* **Description:** <Clear explanation of the problem, root cause, and impact>
* **Suggested Resolution:** <Concrete, actionable steps or code snippet>
* **Action Items:**  
  - [ ] <Action item or decision point for reviewer>

---

## 👁️ Manual Verification Checklist (Blind Spots)

Items that automated tests cannot verify and require physical human verification:
- [ ] <e.g., Verify PDF download trigger and print stylesheet in desktop Chrome>
- [ ] <e.g., Verify mobile navigation touch targets on responsive screen size>

---

## ✍️ Peer Review Sign-Off

```markdown
Reviewer: <Reviewer Name>
Decision: [ ] APPROVED  [ ] CHANGES REQUESTED  [ ] COMMENT ONLY
Date: YYYY-MM-DD
```

**Feedback to Author:**  
*(Reviewer can add final comments here or use `{! ... }` annotations across the document)*

### General PR Comments
- <Overall summary, branch rebase requirements, architectural notes>

### Comments on Specific Files (Posted Inline to GitHub Diff)
- **`<file-path>:<line>`:**
  <Feedback anchored directly to this file and line on GitHub>
```
