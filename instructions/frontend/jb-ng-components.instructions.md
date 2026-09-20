# Angular Component Patterns

## Component-Service Pattern

**REQUIRED:** All components with **significant** logic must use component-service pattern.

```typescript
// component.service.ts
@Injectable()
export class MyComponentService {
  public readonly $data: WritableSignal<Data[]> = signal([]);
  
  private readonly _dataService = inject(DataService);
  
  public init(): void {
    // Initialization logic
  }
}

// component.ts
@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MyComponentService]
})
export class MyComponent {
  public readonly svc = inject(MyComponentService);
  
  ngOnInit(): void {
    this.svc.init();
  }
}
```

**Rules:**
- Service provided at component level
- Component exposes service as `public readonly svc`
- All business logic in service
- Template accesses via `svc.property` or `svc.method()`

## Naming Conventions

### Components
- **Selectors:** `kebab-case` (e.g., `app-user-profile`)
- **Classes:** `PascalCase` (e.g., `UserProfileComponent`)
- **Files:** `component-name.component.ts`

### Services
- **Classes:** `PascalCase` with `Service` suffix
- **Files:** `service-name.service.ts`, `component-name.service.ts` for component services

### API Clients 
- **Classes:** `PascalCase` with `ApiClient` suffix (e.g., `AuthApiClient`)
- **Files:** `domain-name.api-client.ts`

## File Organization

**REQUIRED:** Always use separate files linked via `templateUrl` and `styleUrl`:
```
my-component/
  my-component.component.ts
  my-component.component.html
  my-component.component.less
  my-component.component.service.ts
```

**FORBIDDEN:** Never use inline `template:` or inline `styles:`. Every component must have its own `.html` template and `.less` stylesheet.

## ViewItem Pattern

**Use when:** Component needs UI-specific computed properties.

```typescript
// Component-specific view model
export interface CallingViewItem extends Calling {
  statusSummary: string;
  needsAttention: boolean;
  displayName: string;
}

// Transform in component service
callingViewItems = computed(() => 
  this.callings().map(c => this.transformToViewItem(c))
);

private transformToViewItem(calling: Calling): CallingViewItem {
  return {
    ...calling,
    statusSummary: this.getStatusSummary(calling),
    needsAttention: calling.status === 'pending',
    displayName: `${calling.organization} - ${calling.position}`
  };
}
```

**Rules:**
- ViewItem interfaces MUST extend base entity (do not duplicate properties)
- ViewItems contain PURE structured data—never generate HTML markup or tag strings in ViewItem models
- Transformation logic in component service
- Use computed signals for reactive view items

## Service vs API Client Architecture

### API Clients
- **Purpose:** HTTP communication only
- **Naming:** `[Domain]ApiClient`
- **Responsibility:** Make HTTP requests, return observables

```typescript
@Injectable({ providedIn: 'root' })
export class UserApiClient {
  private readonly http = inject(HttpClient);
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
}
```

### State Services
- **Purpose:** State management, orchestration
- **Naming:** `[Domain]StateService`
- **Responsibility:** Manage state, orchestrate API clients, presentation logic

```typescript
@Injectable({ providedIn: 'root' })
export class UserStateService {
  private readonly apiClient = inject(UserApiClient);
  
  readonly $users: WritableSignal<User[]> = signal([]);
  
  loadUsers(): void {
    this.apiClient.getUsers().subscribe(users => {
      this.$users.set(users);
    });
  }
}
```

### Component Services
- **Purpose:** Component-specific logic
- **Location:** Same folder as component
- **Naming:** `[ComponentName]Service`
- **File:** `[component-name].component.service.ts`
- **Responsibility:** Complex logic specific to that component

```typescript
@Injectable()
export class UserListService {
  private readonly userState = inject(UserStateService);
  
  readonly $filteredUsers = computed(() => {
    return this.userState.$users().filter(u => u.isActive);
  });
}
```

## When to Use Component Services

**Use component service when:**
- Component has significant testable logic
- Multiple computed signals or complex transformations
- ViewItem pattern needed
- Logic is specific to that component

**Don't use component service when:**
- Component is simple presentation only
- Logic is shared across components (use state service instead)
- No testable logic

## Related Documentation

See [jb-ng-framework.instructions.md](./jb-ng-framework.instructions.md) for Angular framework patterns.
See [jb-ng-state.instructions.md](./jb-ng-state.instructions.md) for state management patterns.
