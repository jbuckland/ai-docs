# CSS/LESS Styling Patterns

## Critical Rules

### 1. Component Inventory & "Lift-First" Workflow (Step 1)
Before authoring any CSS for a new component or feature:
1. **Inventory Existing Primitives**: Check the shared component styles directory (e.g. `src/styles/components/` or equivalent) to see what UI building blocks already exist (cards, buttons, avatars, badges, status pills, toggle switches, tables).
2. **Lift Reusable Primitives**: If a UI pattern (e.g. status indicator, avatar badge, toggle switch, action button variant) is or will be used in more than one place, declare it in the shared component directory and consume it via shared class names. Do NOT recreate duplicate styling inside local component files.

---

### 2. Tokenized Custom Properties & Zero Fallbacks
All theme colors, surfaces, borders, and tokenized dimensions MUST use CSS custom properties (`var(--token)`).

**NEVER** add a hardcoded fallback value inside `var(--token)`. If a design token is undefined or missing, that is a design system bug to fix in `variables.less` (or equivalent), not a value to paper over in local components.

#### ✅ DO THIS
```less
.my-component {
  color: var(--text-primary);
  background-color: var(--surface-primary);
  border: 1px solid var(--border-primary);
  margin-bottom: var(--space-6);

  &:hover {
    background-color: var(--surface-hover);
    color: var(--color-primary);
  }
}
```

#### ❌ NEVER DO THIS
```less
.my-component {
  // ❌ Hardcoded values break theming
  color: @text-primary;                                      // Compile-time only, no dark mode
  background-color: #ffffff;                                 // Hardcoded hex
  border: 1px solid --border-primary;                        // Missing var()

  // ❌ NEVER add fallbacks inside var()
  background: var(--color-error-subtle, #fff0f0);            // Hardcoded fallback
  color: var(--color-success, #27ae60);                      // Hardcoded fallback
  margin-bottom: var(--space-6, 1.5rem);                     // Hardcoded fallback
  // ❌ NEVER invent undeclared tokens
  background-color: var(--surface-card);                     // Nonexistent token! Use --surface-primary
  color: var(--color-brand-blue);                            // Nonexistent token!
}
```

- **No Inventing Tokens:** Never use undeclared token names. All design tokens must exist in the design system token registry (e.g. `variables.less`). If a token is needed, declare it in the design system first.
- **Compose Global Control Classes:** Do NOT re-implement button, input, or card styles in component `.less`. Compose canonical classes directly in templates (e.g. `<button class="btn btn-secondary">`) and only apply local positioning.

---

### 3. Local vs. Global CSS Scope Boundaries
- **Shared / Global Styles** (`src/styles/components/` or equivalent): Provide the visual appearance of reusable UI building blocks (cards, buttons, pills, avatars, tables, switches).
- **Component-Specific Styles** (`*.component.less`): Should **only** declare layout positioning (flexbox/grid flow, gap) and structural geometry unique to that specific component.
- **Unique & Single-Use Geometry**: When a component has a dimension or geometric constraint that is strictly unique and will not be reused elsewhere (e.g. `min-width: 260px`, `max-width: 540px`), define it directly in the local stylesheet without creating unnecessary design tokens.
- **Spacing & Display Density**: In applications that utilize tokenized spacing/density scales (e.g. `--space-*`, `--card-padding`, `--table-row-padding-y`), use those tokens for consistency and responsive density adaptability.
- **Stylesheet Size & Smell Flag**: A component-scoped stylesheet exceeding 200 lines is a red flag for deeper review. It strongly suggests un-lifted global primitives, duplicate control styles, or runaway local CSS. Review and verify whether base styles should be inherited from the shared design system.

---

### 4. Strict Ban on Specificity Hacks & Deep Nesting
- ❌ **No `!important`**: Never use `!important` to force styling. Fix specificity or selector structure instead.
- ❌ **No Deep Nesting**: Do not nest LESS selectors more than 3 levels deep.

---

### 5. Component LESS Variable Scope & Explicit Imports
Angular compiles component styles in isolated contexts and does **not** inherit compile-time LESS variables automatically.
- If a component stylesheet references compile-time LESS variables or mixins (e.g. `@variables`, `@screen-tablet`), it MUST explicitly import the variable definition file:
  ```less
  @import 'src/styles/variables.less';
  ```
- Failure to import causes silent build-time compile errors or fallback failures during production builds.

---

## Component LESS Organization Example

```less
// my-feature.component.less
:host {
  display: block;
}

// Local layout container
.feature-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: var(--max-content-width);
  margin: 0 auto;
}

// Unique single-use component geometry
.search-sidebar {
  min-width: 260px;
  flex-shrink: 0;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
```

---

## Responsive Design Patterns

```less
// Breakpoints
@mobile: ~"(max-width: 767px)";
@tablet: ~"(min-width: 768px) and (max-width: 1023px)";
@desktop: ~"(min-width: 1024px)";

.feature-container {
  padding: var(--space-3);
  
  @media @desktop {
    padding: var(--space-6);
  }
}
```

---

## Accessibility in CSS

```less
// Focus styles
.button {
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

// Screen reader only
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Best Practices Checklist

### ✅ DO
- Check shared style directories before creating local component styles.
- Lift multi-use UI primitives (cards, badges, avatars, buttons, switches) to shared global stylesheets.
- Use CSS custom properties (`var(--token)`) for all colors and theme surfaces.
- Use tokenized spacing/density properties (`var(--space-*)`, `var(--card-padding)`) when available in the application.
- Keep component `.less` files focused on local layout and component-specific geometry.
- Include focus styles for accessibility.

### ❌ NEVER
- Include fallback values in `var(--token, fallback)`.
- Use undeclared or nonexistent token names (e.g. `--surface-card`).
- Hardcode color hex/rgb/hsl values.
- Re-declare button, form control, or card styles locally instead of composing global classes (`.btn`, `.form-control`).
- Duplicate common UI patterns (switches, avatars, status pills) across multiple component `.less` files.
- Let component stylesheets exceed 200 lines without a deeper review for un-lifted shared primitives.
- Use `!important`.
- Nest selectors more than 3 levels deep.
