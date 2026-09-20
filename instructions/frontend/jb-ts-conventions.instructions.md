# TypeScript Conventions

## Variable Declarations

```typescript
// ✅ CORRECT
const projectId = 123;                    // Immutable, prefer for most cases
let count = 0;                            // Mutable when needed
const items: Item[] = [];                 // Const reference, mutable contents

// ❌ WRONG
var name = 'test';                        // Never use var
```

**Rules:**
- Use `const` by default
- Use `let` only when reassignment needed
- Never use `var`

## Type Annotations

```typescript
// Explicit types when needed
function getData(id: number): Project | undefined { }
const items: Item[] = [];
const config: Config = { timeout: 5000 };

// Infer when obvious
const name = 'John';                      // Inferred as string
const count = 0;                          // Inferred as number
const isActive = true;                    // Inferred as boolean

// Function return types (always explicit for public APIs)
public getProject(id: number): Project | undefined {
  return this._projects.find(p => p.id === id);
}

// Generic types
function toArray<T>(item: T): T[] {
  return [item];
}
```

**Rules:**
- Explicit types for function parameters and returns
- Explicit types for class properties
- Infer for local variables when obvious
- Always type public APIs

## Access Modifiers

```typescript
export class MyService {
  // Public: External API only (methods called from outside the component/service)
  public loadData(): Promise<void> { }
  public saveItem(item: Item): Promise<void> { }
  
  // Protected: Template-accessed properties (PREFERRED for new code)
  protected readonly layoutId = 'myComponent';
  protected readonly items: WritableSignal<Item[]> = signal([]);
  protected readonly count: Signal<number> = computed(() => this.items().length);
  
  // Private: Internal implementation only
  private readonly _dataService = inject(DataService);
  private readonly _cache = new Map<number, Item>();
  
  constructor() {
    // Setup
  }
  
  protected loadItems(): void {
    // Template can call this
  }
  
  private _loadFromCache(): Item[] {
    // Internal only
    return [];
  }
}
```

**Rules:**
- Always use access modifiers (don't rely on defaults)
- `public` for external API (methods called from other components/services)
- `protected` for template-accessed properties/methods (preferred for new code)
- `private` for internal implementation
- Always use `readonly` when possible

**Legacy code:** May use `public` for template-accessed properties. This is acceptable but `protected` is preferred for new code.

## Interfaces vs Types

```typescript
// Interfaces: For object shapes, extensible
interface Project {
  id: number;
  name: string;
  status: ProjectStatus;
}

interface ExtendedProject extends Project {
  description: string;
}

// Types: For unions, intersections, primitives
type ProjectStatus = 'active' | 'completed' | 'cancelled';
type ProjectOrContract = Project | Contract;
type Nullable<T> = T | null | undefined;

// Use interface for API response shapes
interface SearchResponse {
  items: Project[];
  total: number;
  page: number;
}

// Use type for function signatures
type SearchFunction = (query: string) => Promise<SearchResponse>;
```

**Rules:**
- Interfaces for object shapes
- Types for unions, intersections, mapped types
- Interfaces can be extended, merged
- Prefer interface unless you need type-specific features

## Enums vs Union Types

```typescript
// Union types (preferred for simple cases)
type ProjectStatus = 'active' | 'completed' | 'cancelled';
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Enums (when you need reverse mapping or complex values)
enum LicensedFeature {
  OpX = 'opx',
  Respond = 'respond',
  Atlas = 'atlas'
}

// Const enums (compile-time only, no runtime overhead)
const enum Direction {
  Up,
  Down,
  Left,
  Right
}
```

**Rules:**
- Prefer union types for simple string/number literals
- Use enums when you need reverse mapping or namespace
- Use const enums for compile-time constants

## Naming Conventions

### General Rules
- **Enums:** `PascalCase` (e.g., `UserRole`, `FamilyRole`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_FILE_SIZE`, `API_BASE_URL`)
- **Variables:** `camelCase`
- **Functions:** `camelCase`
- **Classes:** `PascalCase`
- **Interfaces:** `PascalCase` with `I` prefix (e.g., `IUser`, `IProject`)
- **Types:** `PascalCase`

## Async/Await Patterns

```typescript
// ✅ CORRECT - Use async/await
async function loadData(): Promise<Data> {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}

// ✅ CORRECT - Error handling
async function saveData(data: Data): Promise<void> {
  try {
    await this.apiClient.save(data);
  } catch (error) {
    logger.error('Failed to save data', error);
    throw error;
  }
}

// ❌ WRONG - Don't mix promises and async/await
async function mixedPattern(): Promise<void> {
  return this.apiClient.save(data).then(() => {
    // Don't do this
  });
}
```

**Rules:**
- Use async/await for all async operations
- Always handle errors with try/catch
- Don't mix .then() with async/await

## Null Handling

```typescript
// ✅ CORRECT - Explicit null checks
function processItem(item: Item | null): void {
  if (!item) {
    return;
  }
  // item is Item here
  console.log(item.name);
}

// ✅ CORRECT - Optional chaining
const name = user?.profile?.name;
const count = items?.length ?? 0;

// ✅ CORRECT - Nullish coalescing
const timeout = config.timeout ?? 5000;

// ❌ WRONG - Implicit any
function badFunction(item) {  // item is any
  return item.name;
}
```

**Rules:**
- Always handle null/undefined explicitly
- Use optional chaining (?.) for nested properties
- Use nullish coalescing (??) for default values
- Never use `any` type

## Destructuring

```typescript
// ✅ CORRECT - Object destructuring
const { id, name, status } = project;
const { data, error } = await fetchData();

// ✅ CORRECT - Array destructuring
const [first, second] = items;
const [count, setCount] = useState(0);

// ✅ CORRECT - Function parameters
function processProject({ id, name }: Project): void {
  console.log(id, name);
}

// ✅ CORRECT - Rest parameters
const { id, ...rest } = project;
const [first, ...remaining] = items;
```

**Rules:**
- Use destructuring for cleaner code
- Destructure function parameters when appropriate
- Use rest parameters to collect remaining properties

## Array Methods

```typescript
// ✅ CORRECT - Functional array methods
const activeProjects = projects.filter(p => p.status === 'active');
const projectNames = projects.map(p => p.name);
const totalCost = projects.reduce((sum, p) => sum + p.cost, 0);

// ✅ CORRECT - Find methods
const project = projects.find(p => p.id === targetId);
const hasActive = projects.some(p => p.status === 'active');
const allActive = projects.every(p => p.status === 'active');

// ❌ WRONG - Mutating original array unnecessarily
projects.forEach(p => p.status = 'completed');  // Use map instead

// ✅ CORRECT - Immutable update
const updated = projects.map(p => ({ ...p, status: 'completed' }));
```

**Rules:**
- Prefer functional methods (map, filter, reduce)
- Avoid mutating arrays when possible
- Use appropriate method for the task

## Type Guards

```typescript
// ✅ CORRECT - Type guard function
function isProject(item: Project | Contract): item is Project {
  return 'projectCode' in item;
}

// ✅ CORRECT - Using type guard
if (isProject(item)) {
  // item is Project here
  console.log(item.projectCode);
}

// ✅ CORRECT - Discriminated unions
type Result = 
  | { success: true; data: Data }
  | { success: false; error: string };

function handleResult(result: Result): void {
  if (result.success) {
    console.log(result.data);  // TypeScript knows data exists
  } else {
    console.error(result.error);  // TypeScript knows error exists
  }
}
```

**Rules:**
- Use type guards for runtime type checking
- Use discriminated unions for complex types
- Leverage TypeScript's type narrowing

## Generics

```typescript
// ✅ CORRECT - Generic functions
function toArray<T>(item: T): T[] {
  return [item];
}

function first<T>(items: T[]): T | undefined {
  return items[0];
}

// ✅ CORRECT - Generic interfaces
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// ✅ CORRECT - Generic classes
class DataStore<T> {
  private items: T[] = [];
  
  add(item: T): void {
    this.items.push(item);
  }
  
  getAll(): T[] {
    return [...this.items];
  }
}
```

**Rules:**
- Use generics for reusable, type-safe code
- Name generic parameters descriptively (T for type, K for key, V for value)
- Constrain generics when needed (`<T extends BaseType>`)

---

## Type Safety & Boundary Contracts

### Strict Ban on Type Evasion & Double-Casting
```typescript
// ❌ FORBIDDEN: Double-casting through unknown or untyped bags
const snapshot = data as unknown as MeetingSnapshot;
const payload = response as unknown as Record<string, unknown>;

// ✅ CORRECT: Strong types at the source or explicit type guards
const snapshot: MeetingSnapshot = await dataService.load();
if (isMeetingSnapshot(data)) {
  // data is narrowed safely
}
```
**Rules:**
- NEVER double-cast through `unknown` (`as unknown as TargetType`).
- Never cast to `Record<string, unknown>` or `any` at storage or service boundaries.
- Define explicit, strongly typed contracts for data adapters and service methods.

### Canonical Domain Model Integrity
```typescript
// ❌ FORBIDDEN: Permissive index signatures or arbitrary Record extension
export interface AgendaItem extends Record<string, unknown> {
  id: string;
  [key: string]: unknown;
}

// ✅ CORRECT: Strict, exhaustive property declarations
export interface AgendaItem {
  id: string;
  title: string;
  order: number;
}
```
**Rules:**
- Domain models and canonical entity interfaces MUST NOT declare index signatures (`[key: string]: unknown` or `[key: string]: any`).
- Do not extend `Record<string, unknown>` on domain entities. Declare all known properties explicitly.
- **Canonical Domain Model Location:** Shared domain entities, pure entity utilities, and domain constants belong in the project's canonical domain model directory (e.g. `src/app/core/domain/<name>.ts`, `packages/models/`, or equivalent), without a redundant `.domain` suffix (e.g. `sacrament.ts`, not `sacrament.domain.ts`). Never place canonical domain models inside individual component folders.

### Discriminated Unions for Polymorphic Entities & Method Payloads
```typescript
// ❌ FORBIDDEN: Monolithic interface with grab-bag of optional variant fields
interface AgendaItem {
  type: 'Speaker' | 'Song';
  speakerName?: string;
  talkTopic?: string;
  hymnNumber?: number;
  hymnTitle?: string;
}

// ✅ CORRECT: Strict discriminated union
export interface SpeakerAgendaItem {
  type: 'Speaker';
  speakerName: string;
  talkTopic: string;
}

export interface SongAgendaItem {
  type: 'Song';
  hymnNumber: number;
  hymnTitle: string;
}

export type AgendaItem = SpeakerAgendaItem | SongAgendaItem;
```
**Rules:**
- Polymorphic entities with distinct variant structures MUST be modeled as discriminated unions on a single literal property (e.g. `type: 'Speaker' | 'Song'`).
- Service methods that accept polymorphic payloads (e.g., section saves) must use discriminated unions or typed method overloads to prevent mismatched arguments.

---

## Active Development & Refactoring Discipline

### Direct Refactoring Over Compatibility Shims
```typescript
// ❌ FORBIDDEN: Artificial backward-compatibility shims
export type PulpitPronouns = GrammaticalPronouns; // Renamed alias shim
export const formatPulpitTime = format12HourTime; // Re-export shim
get canPlan() { return this.userPermissions().canPlan; } // Legacy getter shim

// ✅ CORRECT: Refactor all consumers directly
import { GrammaticalPronouns } from './grammatical-pronouns';
import { format12HourTime } from 'core/utils/date-utils';
// Consumers access service.userPermissions().canPlan directly
```
**Rules:**
- **Direct Refactoring Over Compatibility Layers:** When refactoring, renaming, or evolving types, utilities, or services, refactor all call sites directly across the workspace:
  - **Branches off `master`:** Any branch other than `master` is actively in development—zero compatibility shims or transitional aliases are permitted.
  - **Code on `master`:** Even when refactoring existing code on `master`, prefer exhaustively updating all consumers and call sites directly rather than leaving behind transitional "compatibility layers" or shims.
  - **Clean Code Default:** Compatibility layers should only be introduced when strictly necessary (e.g., external third-party consumers or independent deployment boundaries). The default across all repositories is clean, direct refactoring without artificial compatibility debt.
- **Forbidden Shims:** NEVER create transitional type aliases (`type Old = New`), function re-export aliases (`export const oldFn = newFn`), or legacy proxy getters/facades to paper over a refactor.

### Strict Separation of Markup and Logic
```typescript
// ❌ FORBIDDEN: Constructing HTML in TypeScript classes
export class PulpitStepViewItem {
  readonly fullScriptHtml = `<strong>${this.title}</strong>: <span>${this.text}</span>`;
}

// ✅ CORRECT: Pure structured data in TypeScript, markup in template
export interface PulpitStepViewItem {
  readonly title: string;
  readonly text: string;
}
// In template: <strong>{{ item.title }}</strong>: <span>{{ item.text }}</span>
```
**Rules:**
- Never generate raw HTML strings, tags, or template markup inside TypeScript classes, services, or ViewItem models.
- Presentation markup belongs exclusively in component templates (`.component.html`) leveraging native Angular `@if` and `@for` control flow.

### Control Flow & Ternary Restrictions
```typescript
// ❌ FORBIDDEN: Nested or multi-branch ternaries
const item = isSpeaker ? createSpeaker() : isSong ? createSong() : createDefault();
const label = conditionA ? (conditionB ? 'Both' : 'A') : 'None';

// ✅ CORRECT: Explicit control flow or structured lookup
if (isSpeaker) {
  return createSpeaker();
} else if (isSong) {
  return createSong();
}
return createDefault();
```
**Rules:**
- NEVER use nested ternaries (`a ? b : c ? d : e`).
- Do NOT use ternaries for multi-branch array sorting, complex conditional logic, or side effects. Use clear `if/else` statements.
- In templates and option lists, use structured option models with explicit `value` and `label` properties rather than inline ternary string replacements.

### Speculative Modeling & Synthetic Form State
- **No Speculative Domain Properties:** Never introduce unrequested properties, synthetic category taxonomies, or placeholder fields into domain models without an explicit design requirement.
- **No Dummy Domain Objects for Forms:** Do not initialize uncommitted or draft form state with synthetic domain objects containing fake IDs (`id: ''`). Use dedicated draft types, `Partial<T>`, or `Omit<T, 'id'>`.

---

## Compiler Hygiene & Unused Symbols

- **`noUnusedLocals` & `noUnusedParameters`:** Strict compiler checks are active across projects. Any variables, function arguments, or imports that become unused following refactoring MUST be pruned immediately.
- **Zero Dead Imports:** Always remove orphaned import statements, unused interfaces, and dead constants before completing changes to prevent build failures in strict CI environments.
