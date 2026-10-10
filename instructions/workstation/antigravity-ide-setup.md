# Antigravity IDE & Workstation Configuration

Central reference for John's personal Antigravity IDE configuration, keybindings, and editor settings. Use this document when onboarding a new workstation or restoring IDE preferences.

---

## 1. File Locations (Windows)

| Configuration File | Path | Description |
| :--- | :--- | :--- |
| **Keybindings** | `%APPDATA%\Antigravity IDE\User\keybindings.json` | Custom keyboard shortcuts & command overrides |
| **User Settings** | `%APPDATA%\Antigravity IDE\User\settings.json` | Editor, diff, and model configuration |
| **Workspace Settings** | `<workspace>/.vscode/settings.json` | Repository-specific overrides |
| **Workspace Tasks** | `<workspace>/.vscode/tasks.json` | Build, dev, and test task runners |
| **Permissions / MCP** | `~/.gemini/config/settings.local.json` | Allowed terminal commands and tool permissions |

---

## 2. Keybindings Configuration (`keybindings.json`)

**Location:** `%APPDATA%\Antigravity IDE\User\keybindings.json`

### Purpose & Key Fixes:
1. **Restore `Ctrl+Backspace` for Word Deletion:** Unmaps the default AI agent step/hunk/file reject commands that hijack `Ctrl+Backspace`, binding it back to native editor `deleteWordLeft`.
2. **Find References:** Binds `Ctrl+U` to `references-view.findReferences` (unbinding default `cursorUndo`).
3. **Terminal Console:** Unbinds `Ctrl+Shift+C` from opening native external console when focus is in editor.

```json
// Place your key bindings in this file to override the defaults
[
    {
        "key": "ctrl+shift+c",
        "command": "-workbench.action.terminal.openNativeConsole",
        "when": "!terminalFocus"
    },
    {
        "key": "ctrl+u",
        "command": "-cursorUndo",
        "when": "textInputFocus"
    },
    {
        "key": "ctrl+u",
        "command": "references-view.findReferences",
        "when": "editorHasReferenceProvider"
    },
    {
        "key": "shift+alt+f12",
        "command": "-references-view.findReferences",
        "when": "editorHasReferenceProvider"
    },
    {
        "key": "ctrl+backspace",
        "command": "-antigravity.prioritized.agentRejectAllInFile"
    },
    {
        "key": "ctrl+backspace",
        "command": "-antigravity.prioritized.agentRejectFocusedHunk"
    },
    {
        "key": "ctrl+backspace",
        "command": "-antigravity.command.reject"
    },
    {
        "key": "ctrl+backspace",
        "command": "-antigravity.terminalCommand.reject"
    },
    {
        "key": "ctrl+backspace",
        "command": "-rejectAgentStep"
    },
    {
        "key": "ctrl+backspace",
        "command": "-chatEditing.discardFile"
    },
    {
        "key": "ctrl+backspace",
        "command": "-chatEditing.discardAllFiles"
    },
    {
        "key": "ctrl+backspace",
        "command": "-inlineChat.discardHunkChange"
    },
    {
        "key": "ctrl+backspace",
        "command": "-diffEditor.revert"
    },
    {
        "key": "ctrl+backspace",
        "command": "-workbench.action.compareEditor.revert"
    },
    {
        "key": "ctrl+backspace",
        "command": "-editor.action.inlineEdit.reject"
    },
    {
        "key": "ctrl+backspace",
        "command": "-inlineEdit.reject"
    },
    {
        "key": "ctrl+backspace",
        "command": "-editor.action.inlineSuggest.hide"
    },
    {
        "key": "ctrl+backspace",
        "command": "-inlineChat.reject"
    },
    {
        "key": "ctrl+backspace",
        "command": "-interactiveEditor.reject"
    },
    {
        "key": "ctrl+backspace",
        "command": "deleteWordLeft",
        "when": "textInputFocus"
    }
]
```

---

## 3. User Settings (`settings.json`)

**Location:** `%APPDATA%\Antigravity IDE\User\settings.json`

```json
{
    "agq.pinnedModels": [
        "MODEL_PLACEHOLDER_M133",
        "MODEL_PLACEHOLDER_M132",
        "MODEL_PLACEHOLDER_M298",
        "MODEL_PLACEHOLDER_M35",
        "MODEL_PLACEHOLDER_M401",
        "MODEL_PLACEHOLDER_M405"
    ],
    "diffEditor.ignoreTrimWhitespace": false,
    "explorer.compactFolders": false,
    "editor.quickSuggestions": {
        "other": "off"
    }
}
```

---

## 4. MCP Server Configuration (`mcp_config.json`)

**Location:** `%USERPROFILE%\.gemini\antigravity-ide\mcp_config.json`

Configures the Model Context Protocol (MCP) servers enabled in Antigravity IDE:

```json
{
  "mcpServers": {
    "supabase": {
      "serverUrl": "https://mcp.supabase.com/mcp"
    },
    "chrome-devtools-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest"
      ]
    },
    "render": {
      "command": "npx",
      "args": [
        "-y",
        "@niyogi/render-mcp"
      ],
      "disabled": true
    }
  }
}
```

---

## 5. Recommended IDE Extensions

Extensions are stored in `%USERPROFILE%\.antigravity\extensions`. Key extensions used across projects:

| Extension Identifier | Description |
| :--- | :--- |
| `angular.ng-template` | Angular Language Service (templates, diagnostics, refactoring) |
| `firsttris.vscode-jest-runner` | Jest test runner UI directly from `.spec.ts` files |
| `github.vscode-pull-request-github` | GitHub Pull Request & Issue integration |
| `ms-vscode.powershell` | PowerShell extension for terminal scripts & tasks |
| `ms-vscode.vscode-typescript-next` | TypeScript & JavaScript Language Features (nightly / current) |
| `christian-kohler.npm-intellisense` | Autocompletes npm modules in import statements |
| `henrikdev.ag-quota` | Antigravity model quota and usage monitor |

---

## 6. Global Customizations & Skills (`~/.gemini/config`)

Personal agent customizations, skills, and plugins are loaded automatically from:
* **Customizations Root:** `%USERPROFILE%\.gemini\config`
  * `skills/`: Custom standalone skills (e.g. `skills/interactive-mode/SKILL.md`)
  * `plugins/`: Custom plugin packages (e.g. `plugins/firebase/`)
  * `rules/`: Global markdown rules or standalone `GEMINI.md`

---

## 7. Workstation Automated Setup Script (PowerShell)

Run the following PowerShell script on a fresh computer to apply John's complete Antigravity IDE preferences, keybindings, and MCP configuration:

```powershell
# 1. Ensure User Configuration Directory Exists
$userConfigDir = "$env:APPDATA\Antigravity IDE\User"
if (!(Test-Path $userConfigDir)) {
    New-Item -ItemType Directory -Path $userConfigDir -Force | Out-Null
}

# 2. Write keybindings.json (Restores Ctrl+Backspace word delete & Ctrl+U references)
$keybindings = @'
[
    {
        "key": "ctrl+shift+c",
        "command": "-workbench.action.terminal.openNativeConsole",
        "when": "!terminalFocus"
    },
    {
        "key": "ctrl+u",
        "command": "-cursorUndo",
        "when": "textInputFocus"
    },
    {
        "key": "ctrl+u",
        "command": "references-view.findReferences",
        "when": "editorHasReferenceProvider"
    },
    {
        "key": "shift+alt+f12",
        "command": "-references-view.findReferences",
        "when": "editorHasReferenceProvider"
    },
    {
        "key": "ctrl+backspace",
        "command": "-antigravity.prioritized.agentRejectAllInFile"
    },
    {
        "key": "ctrl+backspace",
        "command": "-antigravity.prioritized.agentRejectFocusedHunk"
    },
    {
        "key": "ctrl+backspace",
        "command": "-antigravity.command.reject"
    },
    {
        "key": "ctrl+backspace",
        "command": "-antigravity.terminalCommand.reject"
    },
    {
        "key": "ctrl+backspace",
        "command": "-rejectAgentStep"
    },
    {
        "key": "ctrl+backspace",
        "command": "-chatEditing.discardFile"
    },
    {
        "key": "ctrl+backspace",
        "command": "-chatEditing.discardAllFiles"
    },
    {
        "key": "ctrl+backspace",
        "command": "-inlineChat.discardHunkChange"
    },
    {
        "key": "ctrl+backspace",
        "command": "-diffEditor.revert"
    },
    {
        "key": "ctrl+backspace",
        "command": "-workbench.action.compareEditor.revert"
    },
    {
        "key": "ctrl+backspace",
        "command": "-editor.action.inlineEdit.reject"
    },
    {
        "key": "ctrl+backspace",
        "command": "-inlineEdit.reject"
    },
    {
        "key": "ctrl+backspace",
        "command": "-editor.action.inlineSuggest.hide"
    },
    {
        "key": "ctrl+backspace",
        "command": "-inlineChat.reject"
    },
    {
        "key": "ctrl+backspace",
        "command": "-interactiveEditor.reject"
    },
    {
        "key": "ctrl+backspace",
        "command": "deleteWordLeft",
        "when": "textInputFocus"
    }
]
'@
Set-Content -Path (Join-Path $userConfigDir "keybindings.json") -Value $keybindings -Encoding UTF8

# 3. Write settings.json
$settings = @'
{
    "agq.pinnedModels": [
        "MODEL_PLACEHOLDER_M133",
        "MODEL_PLACEHOLDER_M132",
        "MODEL_PLACEHOLDER_M298",
        "MODEL_PLACEHOLDER_M35",
        "MODEL_PLACEHOLDER_M401",
        "MODEL_PLACEHOLDER_M405"
    ],
    "diffEditor.ignoreTrimWhitespace": false,
    "explorer.compactFolders": false,
    "editor.quickSuggestions": {
        "other": "off"
    }
}
'@
Set-Content -Path (Join-Path $userConfigDir "settings.json") -Value $settings -Encoding UTF8

# 4. Write mcp_config.json
$mcpDir = "$env:USERPROFILE\.gemini\antigravity-ide"
if (!(Test-Path $mcpDir)) {
    New-Item -ItemType Directory -Path $mcpDir -Force | Out-Null
}
$mcpConfig = @'
{
  "mcpServers": {
    "supabase": {
      "serverUrl": "https://mcp.supabase.com/mcp"
    },
    "chrome-devtools-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest"
      ]
    },
    "render": {
      "command": "npx",
      "args": [
        "-y",
        "@niyogi/render-mcp"
      ],
      "disabled": true
    }
  }
}
'@
Set-Content -Path (Join-Path $mcpDir "mcp_config.json") -Value $mcpConfig -Encoding UTF8

Write-Host "Antigravity IDE workstation settings applied successfully." -ForegroundColor Green
```
