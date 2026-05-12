# CSS/LESS Styling Patterns

## Critical Rule: Always Use CSS Custom Properties for Colors

### ✅ DO THIS - Always

```less
.my-component {
  color: var(--color-text-primary);
  background-color: var(--color-background-primary);
  border: 1px solid var(--color-border);

  &:hover {
    background-color: var(--color-background-secondary);
    color: var(--color-primary);
  }
}
```

### ❌ DON'T DO THIS - Never

```less
.my-component {
  color: @text-primary;                    // ❌ Compile-time only, no dark mode
  background-color: #ffffff;               // ❌ Hard-coded, breaks theming
  border: 1px solid --color-border;        // ❌ Missing var()
}

// ❌ NEVER write this selector - it doesn't work
.dark .dark-mode & {
  color: @dark-text-primary;               // ❌ .dark-mode class doesn't exist
}
```

## LESS Preprocessor Usage

### Component Styling

**REQUIRED:** Always use separate LESS files for component styles.

```
my-component/
  my-component.component.ts
  my-component.component.html
  my-component.component.less  // ✅ Separate file
```

**FORBIDDEN:** Never use inline styles.

### LESS Features

```less
// Variables (for non-color values)
@spacing-sm: 8px;
@spacing-md: 16px;
@spacing-lg: 24px;

@font-size-sm: 12px;
@font-size-base: 14px;
@font-size-lg: 16px;

// Nesting
.card {
  padding: @spacing-md;
  
  &__header {
    font-size: @font-size-lg;
    margin-bottom: @spacing-sm;
  }
  
  &__body {
    font-size: @font-size-base;
  }
  
  &:hover {
    box-shadow: var(--shadow);
  }
}

// Mixins
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button {
  .flex-center();
  padding: @spacing-sm @spacing-md;
}
```

## CSS Organization

### Component-Specific Styles

**IMPORTANT:** Component style files should only declare styles that are unique to that component. If a style already exists in the global styles file, or SHOULD exist in the global styles file, reference it instead of duplicating it.

```less
// my-component.component.less
.my-component {
  // Layout
  display: flex;
  flex-direction: column;
  gap: @spacing-md;
  
  // Colors (always use CSS custom properties)
  background-color: var(--color-background-primary);
  color: var(--color-text-primary);
  
  // Typography
  font-size: @font-size-base;
  line-height: 1.5;
  
  // Spacing
  padding: @spacing-md;
  margin-bottom: @spacing-lg;
  
  // Nested elements (component-specific only)
  .header {
    font-weight: 600;
    color: var(--color-text-primary);
  }
  
  .content {
    flex: 1;
  }
}
```

## Responsive Design Patterns

```less
// Mobile-first approach
.component {
  padding: @spacing-sm;
  
  // Tablet
  @media (min-width: 768px) {
    padding: @spacing-md;
  }
  
  // Desktop
  @media (min-width: 1024px) {
    padding: @spacing-lg;
  }
}

// Breakpoint mixins
@mobile: ~"(max-width: 767px)";
@tablet: ~"(min-width: 768px) and (max-width: 1023px)";
@desktop: ~"(min-width: 1024px)";

.component {
  @media @mobile {
    font-size: @font-size-sm;
  }
  
  @media @desktop {
    font-size: @font-size-lg;
  }
}
```

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

// High contrast mode
@media (prefers-contrast: high) {
  .button {
    border: 2px solid var(--color-border-dark);
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Best Practices

### DO
- ✅ Use CSS custom properties for all colors
- ✅ Use LESS variables for spacing, font sizes, and other non-color values
- ✅ Use semantic class names
- ✅ Use separate LESS files for components
- ✅ Mobile-first responsive design
- ✅ Include focus styles for accessibility

### DON'T
- ❌ Hard-code color values
- ❌ Use inline styles
- ❌ Write dark mode selectors manually
- ❌ Duplicate styles in multiple files
- ❌ Use `!important` unless absolutely necessary
- ❌ Nest selectors more than 3 levels deep
- ❌ Use overly specific selectors

## Related Documentation

See project-specific theming documentation for available CSS custom properties and design tokens.
