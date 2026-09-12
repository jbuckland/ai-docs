---
name: high-fidelity-prototype-generator
description: >-
  Generate zero-build, throwaway HTML/LESS/JS prototypes for new features or
  existing page updates in Angular applications, plus a structural change
  manifest for downstream SDD and implementation agents. Use when the user
  asks to prototype a feature, mock a page update, create a high-fidelity
  prototype, or visualize UI changes before implementation. Requires
  config.user.md.
---

# High-Fidelity Prototype Generator Skill

## Purpose

Generate zero-build, throwaway HTML/LESS/JS prototypes for new features or existing page updates in an Angular application. Output clean visual prototypes along with a structural change manifest to seed downstream SDD (Software Design Document) and implementation agents.

## Config (read first)

`config.user.md` lives in **this skill directory** (same folder as this `SKILL.md`).

1. Read `config.user.md`. Parse `prototypeDir` (root directory for all prototypes).
2. If missing → copy `config.template.md` → `config.user.md`, ask the user for `prototypeDir`, then continue.
3. Do not write prototype files until `prototypeDir` resolves.
4. Write each prototype to `{prototypeDir}/<feature-slug>/` (one subdirectory per feature).

---

## 1. Ingestion & Analysis

When triggered with a request (e.g., "let's prototype X on the employee admin page"):

1. **Locate Target Files:** Search the active workspace for matching Angular components (`*.component.html`, `*.component.less`, `*.routes.ts`).
2. **Flatten Markup:** Convert Angular syntax (`@if`, `@for`, `[class]`) into static HTML representing a realistic active state.
3. **Discover Styles:** Find global and shared style sources in the current project (e.g. `variables.less`, `styles.less`, theme files, `angular.json` style entries). Scrape primary branding colors, typography, and spacing variables from the best matches.

---

## 2. Execution & Output Files

Write the following 5 files into `{prototypeDir}/<feature-slug>/`:

### `index.html`

* Include CDN LESS browser compiler in `<head>`:
  ```html
  <link rel="stylesheet/less" type="text/css" href="styles.less" />
  <script src="https://cdn.jsdelivr.net/npm/less"></script>
  <script defer src="script.js"></script>
  ```
* Use semantic HTML5 elements with `data-component="ComponentName"` tags.
* Mark changed elements with visual diff attributes:
  * `data-change="new"` for added elements.
  * `data-change="modified"` for altered layout/controls.
  * `data-change="removed"` for deprecated nodes.

### `styles.less`

* Import or define extracted `:root` / `@variables` at the top from discovered project styles.
* Scope styles under component classes to prevent leakage.
* Include visual diff debugging overlay:
  ```less
  body.show-diff {
    [data-change="new"] { outline: 2px dashed #10b981; }
    [data-change="modified"] { outline: 2px dashed #f59e0b; }
    [data-change="removed"] { opacity: 0.4; text-decoration: line-through; }
  }
  ```

### `script.js`

* Use vanilla ES6 with top-level event delegation (`document.addEventListener('click', ...)`).
* Load `mock-data.json` via `fetch()` or inline promise wrapper.
* Structure state management reactively to mirror Angular Signals:
  * Pure JS state store objects (`const state = { ... }`).
  * Explicit mutation functions and UI render updates.
* Default to the "happy path"; add toggle buttons for edge/loading states only when requested.

### `mock-data.json`

* Provide realistic, context-aware mock payloads (no placeholder "lorem ipsum").

### `manifest.json`

* Generate a structured modification spec for downstream SDD agents:
  ```json
  {
    "feature": "Feature Name",
    "targetPage": "Path to target route/component",
    "changes": [
      {
        "id": "element-id",
        "type": "new | modified | removed",
        "targetAngularComponent": "src/app/path/to/component.ts",
        "summary": "High-level description of change",
        "signalState": "Proposed Angular Signals/reactive state updates",
        "apiDependencies": "Required API endpoints or contracts"
      }
    ]
  }
  ```

---

## 3. Final Response Requirements

Upon creating the files, print:

1. Summary of created/modified files.
2. Direct `file://` link to `index.html` so the user can CMD+Click to open in a browser.
3. Instructions on toggling `body.show-diff` in the dev tools or UI to inspect changes.
