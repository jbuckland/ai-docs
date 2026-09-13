# Antigravity Session Management & Switching: Architecture & Research

This document details the architectural findings, internal mechanisms, and feasibility analysis for discovering chat sessions, tracking their live execution state, and switching between sessions within **Google Antigravity IDE** for desktop workflows.

---

## 1. Executive Summary

| Capability                     | Feasibility        | Effort  | Primary Mechanism                                                            |
| :----------------------------- | :----------------- | :------ | :--------------------------------------------------------------------------- |
| **Status Bar Overview**        | 🟢 Native / High   | 1–2 hrs | `vscode.window.createStatusBarItem()` reading `brain/` directory             |
| **Session Discovery & Watcher**| 🟢 Native / High   | 2 hrs   | Scan `~/.gemini/antigravity-ide/brain/` & tail `transcript.jsonl`            |
| **Split-Pane Live Preview**    | 🟢 Native / High   | 1 hr    | Open session's live transcript / plan in split editor tab                    |
| **Trigger Native Picker**      | 🟢 Exposed Command | 15 mins | `vscode.commands.executeCommand("conversationPicker.showConversationPicker")`|
| **Auto-Select in Native Picker**| 🔴 Blocked in UI   | N/A     | Custom React overlay (`jetski-fast-pick`); renderer DOM isolated from ext   |
| **Direct 1-Click Silent Switch**| 🟡 Advanced / High | 4–8 hrs | Dispatch `setCascadeId` to local Language Server port / CSRF endpoint        |

---

## 2. Deep Dive: Antigravity IDE Workbench Internals

Decompilation and inspection of the running Antigravity IDE workbench (`workbench.desktop.main.js`) and extension host reveal the internal architecture:

### A. Core Engine Codenames
* **Cascade**: The agentic engine, conversation model, and chat runtime (`MainThreadAntigravityCascade`, `antigravityCascadeService`).
* **Jetski**: The IDE UI layer, custom overlay modals, and conversation picker (`jetski-fast-pick`).
* **UI Panel IDs**:
  * View Container: `antigravity.agentViewContainerId`
  * Chat Panels: `antigravity.agentPanel`, `antigravity.agentSidePanel`
  * Context Key: `antigravity.agentSidePanel.isFocused`

### B. The Native Conversation Picker (`yIt` & `jetski-fast-pick`)
When `conversationPicker.showConversationPicker` is executed, Antigravity does **not** use the standard VS Code `showQuickPick` API. Instead:
```javascript
// From workbench.desktop.main.js (yIt class):
createView(e, i) {
  return new Promise(n => {
    const r = ie("div.jetski-fast-pick");
    r.style.position = "fixed";
    r.style.top = "0";
    r.style.left = "0";
    r.style.width = "100%";
    r.style.height = "100%";
    r.style.zIndex = "1000";
    this._layoutService.mainContainer.appendChild(r);
    Kb(Iu(v7u, {
      currentCascadeId: e,
      conversationPickerRequest: i,
      onConversationPickerResponse: s => { n(s); this.hide(); }
    }), this._agentSidePanelServices, r);
  });
}
```
#### Why Auto-Selecting inside the Picker is Blocked:
1. **Renderer Isolation**: Standard VS Code extensions run in the Node.js Extension Host process, isolated from the Chromium renderer DOM. Extensions cannot access `document.querySelector("div.jetski-fast-pick")` to synthesize click events.
2. **No Pre-Selection Parameter**: The command `conversationPicker.showConversationPicker` takes an array of session summaries; it does not accept a `targetCascadeId` flag to bypass user selection.

---

## 3. How to Achieve 1-Click Silent Session Switching

If opening the picker is not acceptable, there are three architectural options for direct switching:

### Approach A: The Local Language Server Action Bus (Pure Extension, No Patching)
Inside Antigravity, the chat panel controller switches conversations via the local Language Server client:
```javascript
// Antigravity internal chat panel controller:
async _openChatPanel(cascadeId) {
  await this._cascadeService.openPanel();
  if (cascadeId) {
    const action = _r(Pjc, {
      actionType: "setCascadeId",
      payload: [new TextEncoder().encode(cascadeId)]
    });
    this._languageServerService.lsClient?.sendActionToChatPanel(action);
  }
}
```
* Antigravity launches `language_server_windows_x64.exe` locally.
* The workbench queries its port and CSRF token:
  ```javascript
  const port = this._languageServerService.getPort();
  const csrf = this._languageServerService.getCsrfToken();
  ```
* An extension running locally can establish a connection to this local port to send the `setCascadeId` action packet, switching the native chat panel silently without any popup.

### Approach B: Workbench 5-Line Command Registration (Direct Patch)
In `workbench.desktop.main.js`, where commands like `antigravity.openReviewChanges` are registered, add an explicit command:
```javascript
sn.registerCommand("antigravity.switchCascadeSession", (accessor, cascadeId) => {
  accessor.get(qw).lsClient?.sendActionToChatPanel(
    _r(Pjc, { actionType: "setCascadeId", payload: [new TextEncoder().encode(cascadeId)] })
  );
  accessor.get(lE).openPanel();
});
```
This gives any extension or keybinding direct access via `vscode.commands.executeCommand("antigravity.switchCascadeSession", id)`.

### Approach C: Split-Pane Companion View (No Main Chat Switching Needed)
Instead of forcing the main sidebar chat to switch back and forth:
* Clicking a session in the Status Bar / TreeView opens that session's live output, diffs, and artifacts in a split editor tab (`Walkthrough` / `Plan` / `Transcript`).
* You can have multiple agents running simultaneously while keeping your active code file and main chat in view.

---

## 4. Phase 1: Recommended Starting Point — The Status Bar Monitor

The cleanest, lowest-overhead tool to build first is a **VS Code Status Bar Item**:

```text
Status Bar:  $(hubot) 2 Active Agents (1 Ready)
```

### User Workflow
1. Sits quietly in the status bar at all times, refreshing via file watcher.
2. Clicking it opens a custom QuickPick:
   ```text
   🟢 [myward] Review Wendell's Open PRs (Waiting for your input · 5m ago)
   🟡 [stick-together] Fix auth race condition (Running: run_command · 45s)
   🔵 [ai-docs] Daily doc sync (Background task)
   ──────────────────────────────────────────────────
   $(history) Open Native Antigravity Conversation Picker...
   ```
3. Selecting a session:
   - **Default Action**: Opens the live transcript / walkthrough in a split editor tab.
   - **Alternative Action**: Copies ID / triggers the native picker.
4. When any background session finishes, the status bar flashes and shows a non-intrusive desktop notification toast:
   > *Session "Fix auth race condition" finished. [Inspect Changes]*

### Implementation Effort: ~2 Hours
* `SessionWatcher.ts`: Reads `~/.gemini/antigravity-ide/brain/` (40 lines of TypeScript).
* `StatusBarManager.ts`: Manages `vscode.window.createStatusBarItem()` and `vscode.window.showQuickPick()` (60 lines).
