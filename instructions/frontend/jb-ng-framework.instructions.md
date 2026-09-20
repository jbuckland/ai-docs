# Angular Framework Patterns

## Core Principles

- Always use standalone components (preferred for new code)
- Set `changeDetection: ChangeDetectionStrategy.OnPush`
- Use `input()` and `output()` functions for component API
- Implement lazy loading for feature routes

## Component Structure

**REQUIRED:** Always use separate files:
- ALWAYS use separate HTML files for templates
- ALWAYS use separate LESS files for styles
- Component files in folder named `component-name`

```
my-component/
  my-component.component.ts
  my-component.component.html
  my-component.component.less
  my-component.component.service.ts  // If needed
```

## Standalone Components

**Preferred for new code:**

```typescript
@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MyOtherComponent],
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent {
  // Component implementation
}
```

**NgModules (legacy, acceptable for existing code):**

```typescript
@NgModule({
  declarations: [MyComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [MyComponent]
})
export class MyModule { }
```

## Change Detection

**REQUIRED:** Always use OnPush.

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent {
  // Manual trigger when needed
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);
  
  someMethod(): void {
    // After async operation
    this._changeDetectorRef.markForCheck();
  }
}
```

## Modern Component API

**Preferred:** Use `input()` and `output()` functions.

```typescript
export class MyComponent {
  // Inputs
  readonly userId = input.required<number>();
  readonly title = input<string>('Default Title');
  
  // Outputs
  readonly userSelected = output<User>();
  readonly cancelled = output<void>();
  
  onUserClick(user: User): void {
    this.userSelected.emit(user);
  }
}
```

**Legacy (acceptable):**

```typescript
export class MyComponent {
  @Input({ required: true }) userId!: number;
  @Input() title = 'Default Title';
  
  @Output() userSelected = new EventEmitter<User>();
  @Output() cancelled = new EventEmitter<void>();
}
```

## Dependency Injection

**Preferred:** `inject()` function for new code.

```typescript
export class MyComponent {
  private readonly _userService = inject(UserService);
  private readonly _router = inject(Router);
  protected readonly $users = inject(UserStateService).$users;
}
```

**Legacy (acceptable):** Constructor injection.

```typescript
export class MyComponent {
  constructor(
    private readonly _userService: UserService,
    private readonly _router: Router
  ) {}
}
```

## Lazy Loading

**Feature modules:**

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
  }
];

// admin.routes.ts
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboardComponent
  }
];
```

## HTTP Interceptors

**Global error handling:**

```typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle error
        return throwError(() => error);
      })
    );
  }
}
```

## Feature Directory Structure

Maintain a clean, consistent folder hierarchy for all Angular features:
- **Feature Root:** `src/app/features/<feature-name>/`
- **Colocated Services:** Shared services and state managers for the feature must be colocated at the feature level (e.g. `src/app/features/<feature-name>/services/`), never buried in sub-component directories.
- **Routes:** `<feature-name>.routes.ts` declared at the feature root.
- **Components:** Sub-views and components live in dedicated child folders: `src/app/features/<feature-name>/components/<component-name>/`.

## Component-Specific ViewItems

- **Component-Specific ViewItems:** UI view models unique to a component belong in `src/app/features/<feature-name>/components/<component-name>/` (or colocated inside `<component-name>.service.ts`), extending the canonical domain entity.
- **Shared Domain Models:** Shared domain models belong in the project's canonical domain model location (see [jb-ts-conventions.instructions.md](./jb-ts-conventions.instructions.md)), never defined inside individual component folders.

## Browser Globals & Storage Abstraction

- **Testable Services (Strict Ban):** **NEVER** directly access browser global objects (`window`, `document`, `localStorage`, `sessionStorage`) inside services. Services must remain pure, mockable, and testable.
  - **Storage Services:** Inject dedicated storage abstraction services (e.g., `LocalStorageService`) that safely handle SSR, testing mocks, and storage exceptions.
  - **Platform Tokens:** When DOM or platform access is unavoidable, use Angular's canonical tokens:
    ```typescript
    import { PLATFORM_ID, inject } from '@angular/core';
    import { DOCUMENT, isPlatformBrowser } from '@angular/common';

    const document = inject(DOCUMENT);
    const platformId = inject(PLATFORM_ID);
    const isBrowser = isPlatformBrowser(platformId);
    ```
- **UI Components (Pragmatic Exception):** Direct browser access (e.g., calling `window.print()` or simple scrolling) is acceptable in small quantities inside component presentation methods where injecting platform abstraction tokens would be unnecessary ceremony.

## Vite Compilation & Path Mapping Gotchas

- **NG0203 Error on `@angular/*` Aliases:** Avoid adding `@angular/*` path aliases to `tsconfig.json` `paths`. In Vite-based Angular setups, custom aliases to Angular core libraries cause dual-module instantiation, resulting in runtime `NG0203: inject() must be called from an injection context` exceptions.

## Related Documentation

See [jb-ng-components.instructions.md](./jb-ng-components.instructions.md) for component patterns.
See [jb-ng-state.instructions.md](./jb-ng-state.instructions.md) for state management.
