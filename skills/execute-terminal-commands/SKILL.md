---
name: execute_terminal_commands
description: "REQUIRED: Use this skill for ALL terminal, shell, or CLI command execution. Enforces PowerShell-native syntax and strictly prohibits Bash/Unix patterns. Triggers whenever a shell command must be run."
---

# SYSTEM CONTEXT: POWERSHELL ONLY
**ACTIVE SHELL:** `PowerShell`
**WARNING:** Bash/Unix syntax is completely unsupported and will result in execution failure. Apply the following constraints to ALL command executions.

### 1. SYNTAX & EXECUTION CONSTRAINTS
* **REQUIREMENT:** Use PowerShell-native syntax exclusively (e.g., here-strings `@"..."@`, `$LASTEXITCODE`).
* **FORBIDDEN (Bash Syntax):** `<<EOF`, `cat <<'EOF'`, bash-style `$(...)`, `&&`, `||`.
* **FORBIDDEN (Unix Commands):** `head`, `cat`, `touch`, `grep`, `rm`, `ls -la`.
* **EXECUTION FLOW:** Split sequential commands into separate shell calls. DO NOT chain commands using control syntax.
* **PIPING:** `|` is permitted ONLY IF both sides evaluate to valid PowerShell cmdlets or approved aliases.

### 2. CLI ARGUMENTS & FLAGS
* **REQUIREMENT:** You MUST use full parameter/flag names for ALL CLI tools (`npm`, `docker`, `git`, `dotnet`, etc.).
* **FORBIDDEN:** Shorthand flags and aliases.
    * **VALID:** `npm install --global`, `docker compose up --detach`, `git commit --message`
    * **INVALID:** `npm i -g`, `docker compose up -d`, `git commit -m`

### 3. TOOL-SPECIFIC WORKFLOWS

**Git**
* **FORBIDDEN:** `git -C <path>`. This violates system allowlists and will trigger a failure.
* **REQUIRED WORKFLOW:** To execute Git commands in a target directory:
    1.  `Set-Location <path>`
    2.  Execute `git` command
    3.  Restore previous location (if applicable)

**Python**
* **FORBIDDEN:** `python -c`.
* **DEFAULT:** Utilize native PowerShell cmdlets in place of Python wherever functionally equivalent.
* **OVERRIDE:** If Python is strictly required (e.g., missing library):
    1.  Output a brief justification explaining why PowerShell is insufficient.
    2.  Construct a highly readable PowerShell here-string.
    3.  Pipe the here-string directly into the `python` executable.

### 4. BACKGROUND PROCESSES & TASKS
* **TERMINAL LOCKOUT:** NEVER execute ad-hoc commands (e.g., `Start-Sleep`) in a terminal actively hosting a long-running background process. This terminates the process.
* **VSCODE TASKS:** You MUST route long-running services, servers, or background processes through `create_and_run_task`.
* **TASK PARAMETERS:** Ad-hoc VSCode tasks require the following configuration:
    * `label`: Contextually meaningful string.
    * `icon`: Appropriate identifier (e.g., `server`, `browser`, `database`).
    * `color`: ANSI color code (e.g., `terminal.ansiBlue`, `terminal.ansiRed`).