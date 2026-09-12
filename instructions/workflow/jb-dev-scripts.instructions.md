# Developer Scripts & Reusable Toolset Protocol

Guidelines for crafting developer scripts, automation tools, and enforcing the **Agent Reusable Toolset Accumulation** standard across project repositories.

---

## 1. The Reusable Toolset Protocol

> [!TIP]
> **Invest in Tooling Upfront:** It is always better to invest a little extra time now to build a well-tested, reusable tool than to execute an ad-hoc throwaway task. Reusable tooling compounds productivity for every future session.

When working on any repository, AI agents and developers must follow this three-step lifecycle:

1. **Check First:** Before authoring an ad-hoc script or running manual multi-step operations, agents MUST check the project's existing tool directory (`scripts/` or `tools/`) and `package.json` scripts to verify if a tool already exists to accomplish the task.
2. **Author & Accumulate:** If no existing tool matches the need, and there is a reasonable likelihood that future agents or developers will need to perform this task again (e.g., database switching, seeding, format checks, asset generation, audit sweeps), the agent must create a reusable tool script and add it to the project's toolset.
3. **Register & Document:** Add convenient npm script shortcuts in the root `package.json` whenever the tool represents a common operational task.

---

## 2. Script Architecture & Organization

- **Workspace Hierarchy:**
  - In a multi-package or monorepo workspace (`frontend`, `backend`, `shared`), high-level orchestration scripts live at the **root** `package.json` (`npm run dev`, `npm run test`, `npm run build`, `npm run db:switch`).
  - Scoped utilities reside in the relevant subproject's `scripts/` folder or local `package.json`.
  - Root scripts delegate to subproject scripts using `--prefix` or workspace commands (e.g., `npm run test --prefix ./backend`).
- **Implementation Language:**
  - One-line command chains belong in `package.json`.
  - Multi-step logic, validation, file operations, or interactive prompts MUST be implemented as dedicated Node.js scripts in `scripts/`.

---

## 3. Tool Ergonomics & UX Standards

Every tool added to the reusable toolset must adhere to these lightweight conventions:

1. **Top-of-File Header:** Include a clear comment block at the beginning of the file detailing its purpose, usage options, and example invocations:
   ```javascript
   #!/usr/bin/env node
   /**
    * scripts/db/seed-books.js
    * 
    * Seeds Story Time books from local JSON content into the database.
    * 
    * Usage:
    *   node scripts/db/seed-books.js [--dry-run] [--file <path>]
    */
   ```
2. **Help Support (`--help` / `-h`):** Every CLI tool must support `--help` or print usage instructions when invoked with invalid arguments.
3. **Actionable Remediation on Error:** Never fail with an unhelpful raw trace. Print clear guidance showing how to remediate the issue:
   ```
   Failed to connect to PostgreSQL at localhost:5432.
   Remediation: Ensure the local service is running ('Start-Service postgresql') 
   or toggle to remote staging with 'npm run db:switch remote'.
   ```
4. **Guard Destructive Operations:** Any operation that can wipe, drop, or alter data permanently MUST require explicit user confirmation or a `--force` / `--dry-run` flag.
5. **Interactive Prompts (Optional for Complex Tools):** For complex tools with multiple parameters, optional prompts may be provided if arguments are omitted, but standard CLI argument parsing with clear help is sufficient for lightweight scripts.


---

## 4. Cross-Platform Compatibility

- Always use Node.js standard modules (`path`, `fs`, `child_process`) rather than platform-specific shell commands (`rm -rf`, `grep`, `cat`).
- Format paths using `path.resolve()` and `path.join()` so commands execute seamlessly across Windows (PowerShell) and POSIX environments.
