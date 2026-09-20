---
name: PR Prep & Pre-Submission Audit
description: Comprehensive, framework-agnostic pre-PR checklist and hardening audit to execute before submitting any Pull Request. Enforces multi-tier test execution (unit, integration, emulator, and database security rules), git hygiene, authentication/tenant lifecycle verification, permission scoping, and diff cleanliness.
version: 1.1
tags:
  - ai-skill
  - workflow
  - git
  - testing
  - quality-assurance
---

# PR Prep & Pre-Submission Audit

> **Purpose**: A rigorous, universal verification workflow to catch integration failures, security rule regressions, auth lifecycle edge cases, permission leaks, and git hygiene errors *before* submitting any pull request across any repository.

---

## Agent Execution Rules

When invoked via `/pr-prep`, "prepare PR", "ready for PR", or before declaring a feature branch complete, you MUST execute the following 5-phase verification protocol.

---

### Phase 1: Multi-Tier Test Suite Execution

Never rely solely on standard unit tests. You must inspect project scripts and execute **all** relevant test suites across all project tiers:

1. **Unit & Component Tests**:
   - Inspect `package.json` / build configuration for unit test commands.
   - Run the primary unit test suites and ensure a 100% pass rate.

2. **Integration, Database & Security Rules Tests**:
   - Scan for integration, database rule, or emulator-backed test scripts (e.g. `test:integration`, `test:firestore-integration`, `test:e2e`, `test:api`).
   - Execute all integration suites.
   - **Database Security Rules Check**: For rule-based backends (Firebase, Supabase, etc.), verify that permissions and rule evaluations properly differentiate read, write, update, and delete contexts (e.g., verifying `resource.data` on deletes vs `request.resource.data`).

3. **Compilation & Type-Check Verification**:
   - Run the development and production build/typecheck commands (e.g. `npm run build`, `npx tsc --noEmit`).
   - Verify 0 compilation errors and 0 type-check failures.

---

### Phase 2: Git Hygiene & Formatting Quality

1. **Trailing Whitespace & Conflict Markers**:
   - Execute: `git diff --check`
   - Automatically resolve any trailing whitespace, carriage-return inconsistencies, or lingering conflict markers.

2. **In-Code Annotations Check**:
   - Search the workspace for unresolved in-code notes (e.g. `{! ...}` markers, temporary `TODO`, or `FIXME` comments).
   - Address or resolve all temporary notes before PR creation.

3. **Working Tree & Commit History Review**:
   - Run `git status` to ensure no untracked temp files, logs, or scratch scripts are left behind.
   - Run `git log -n 5 --oneline` to ensure commits are clean, logical, and contain **NO AI attribution** (e.g. no "Co-authored-by: AI").

---

### Phase 3: Standing Instructions & Code Diff Cleanliness Audit

Before proceeding, perform an adversarial scan of the branch diff (`git diff origin/main...HEAD` or equivalent) against all applicable repository instructions (`ai-docs/instructions/` and `.agents/rules/`).
- Verify diff adherence to the **High-Attention Universal Rules** in [instructions/general.md](../../instructions/general.md) and all relevant domain guidelines (`instructions/frontend/`, `instructions/backend/`, etc.).
- Ensure changes are free of artificial compatibility shims, maintain strict type contracts, and preserve clear separation of presentation and logic.

---

### Phase 4: Authorization, Multi-Tenant & Auth Lifecycle Audit

Walk through all modified code with "adversarial multi-tenant" eyes:

1. **Auth Session Lifecycle Transitions**:
   - What happens when a user signs out and signs back in as a different user *without* a hard browser refresh?
   - Do singleton/root-scoped backing services clear account-bound signals, cached state, and permissions upon logout?

2. **Scoped vs. Unrestricted Permission Queries**:
   - Do data queries properly branch between admin/unrestricted scope and restricted role/tenant scopes?
   - When a user only has access to a specific sub-scope, does the query filter on the correct domain field?

3. **Cold-Start & Unauthenticated State Handling**:
   - What happens when the app loads in a signed-out or cold-start state?
   - Do auth observables wait for the session to resolve before evaluating permissions (preventing false "Unauthorized" error banners)?

---

### Phase 5: UX & Item-Level Filtering Sanity

1. **Container vs. Item-Level Filtering**:
   - When filtering lists, tables, or Kanban boards: does searching for an item properly filter sub-items, or does it render non-matching sub-items because their parent container matched?
   - Ensure search logic clearly distinguishes container-level matches from individual item matches.

2. **Action Guarding & Concurrency**:
   - Are destructive actions guarded by confirmation dialogs and atomic batch operations?
   - Are loading states and in-progress flags properly reset in both success and error handlers?

---

### Phase 6: PR Readiness Summary Output

After completing all phases, emit a structured audit report summarizing:
- **Test Results**: Unit suites passed, Integration/Security suites passed, Build status.
- **Git Hygiene**: `git diff --check` status, clean working tree, clean commit history.
- **Diff Cleanliness**: Zero type evasion, zero backward-compatibility shims, zero HTML in logic, zero styling violations.
- **Lifecycle & Security**: Auth lifecycle reset verified, security rules validated.
- **PR Readiness Verdict**: Explicit `READY FOR PR` or bulleted list of blocking items to resolve first.
