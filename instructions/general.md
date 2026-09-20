

* Before executing a terminal command, provide a single, brief sentence explaining your intent. Keep it concise and do not over-explain.
* Always write out the fully expanded, verbose versions of all commands and flags (e.g., use `--install` instead of `-i`, or `npm install` instead of `npm i`). Never use shorthand abbreviations.
* Deliver unvarnished honesty regarding code quality, architectural decisions, and potential errors.
* Run single, isolated terminal commands rather than complex chains (avoid `&&` or `;`). This ensures each step can be evaluated, approved, and debugged individually.
* Markdown Tables: Any markdown table wider than 120 characters MUST be reformatted as a structured bullet list or subheadings. Tables under 120 characters must have their columns aligned in raw source text using monospaced padding.
* Credentials & Secrets: Bitwarden is the standard password manager for all credentials and secrets; agents must always instruct saving secrets there and never commit or store credentials in plain text files.
* Component Stylesheet Length & Smell Flag: A component-scoped stylesheet exceeding 200 lines is a red flag for deeper review. It strongly suggests un-lifted global primitives, duplicate control styles, or runaway local CSS. Review and verify whether base styles should be inherited from the shared design system.
* In-Code Annotations: Questions are questions, NOT instructions. Never treat a question annotation as a directive to modify code or docs. Always answer the question, evaluate trade-offs, and wait for explicit user direction.
* Git Commits & Attribution: Commit all work to feature branches off the target development/staging branch. Never commit directly to main or production. Commit messages must accurately describe changes in that commit. Do NOT add AI attribution tags to commit messages (e.g., Generated with AI, Co-Authored-By: AI). Follow [jb-git-workflow.instructions.md](file:///c:/stuff-john/github/ai-docs/instructions/workflow/jb-git-workflow.instructions.md) for full branch and commit standards.

## Ruleset Architecture & Authority Hierarchy

* **Zero-Bandaid Rule Architecture:** Never band-aid agent compliance by copying or repeating domain-specific rules (e.g. TypeScript conventions, CSS tokens, framework patterns) into `general.md` or skills. `general.md` is strictly reserved for legitimately universal operating principles. If agents frequently miss a rule, diagnose and fix the root flaw (e.g., absent negative constraints, instruction structure, or missing automated linting) at the source rather than duplicating rules across files.
* **Authority Hierarchy (Personal SoT vs. Project SoT):**
  - `ai-docs` is John's personal Single Source of Truth (SSoT) for technical standards, architectural patterns, and workflow guidelines.
  - In any collaborative or team repository, the workspace `.agents/rules/` directory (or similar) is the authoritative project Source of Truth.
  - Never assume John's personal rules are automatic law for a shared project. Adhere to project-level rules and existing team conventions; propose harmonizing updates to `.agents/rules/` (or similar) only when rules misalign or contain outdated anti-patterns.
* **Negative Constraints Over Polite Suggestions:** Rules protecting architecture, type safety, and boundary integrity MUST be formulated as explicit negative constraints ("NEVER do X") rather than passive recommendations ("Prefer Y", "Avoid Z").
