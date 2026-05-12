# State Management - Signals + Observables

## Pattern: Signals + Observables Hybrid

**Signals:** Component state (preferred).
**Observables:** Async streams, HTTP, RxJS operators.

## Signal Usage

```typescript
import { signal, computed, WritableSignal, Signal } from '@angular/core';

// Mutable state
public readonly loading: WritableSignal<boolean> = signal(false);
public readonly items: WritableSignal<Item[]> = signal([]);

// Derived state
public readonly count: Signal<number> = computed(() => this.items().length);
public readonly hasItems: Signal<boolean> = computed(() => this.items().length > 0);

// Public readonly API
public readonly selected: Signal<Item | undefined>;
private readonly _selected: WritableSignal<Item | undefined> = signal(undefined);

constructor() {
  this.selected = this._selected.asReadonly();
}

// Update methods
public setItem(item: Item): void {
  this._selected.set(item);
}

public updateItem(id: number, changes: Partial<Item>): void {
  this.items.update(items => 
    items.map(item => item.id === id ? { ...item, ...changes } : item)
  );
}
```

## Observable Usage

```typescript
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

// Observable for async streams
public readonly projectId$: Observable<number>;
private readonly _projectIdSubject$ = new BehaviorSubject<number>(0);

// Signal for loaded data
public readonly project: WritableSignal<Project | undefined> = signal(undefined);

constructor() {
  this.projectId$ = this._projectIdSubject$.asObservable();
  
  // Convert observable to signal
  this.projectId$.pipe(
    switchMap(id => this._projectsService.getById(id)),
    takeUntil(this._onDestroy$)
  ).subscribe(project => {
    this.project.set(project);
  });
}
```

## Naming Conventions

```typescript
// ✅ CORRECT
public readonly count: WritableSignal<number> = signal(0);         // Signal: plain name
public readonly items: Signal<Item[]>;                             // Signal: plain name
public readonly items$: Observable<Item[]>;                        // Observable: suffix$

// ❌ WRONG
public readonly $count: WritableSignal<number> = signal(0);        // Don't use $ prefix
public readonly countSignal: WritableSignal<number> = signal(0);   // Don't use Signal suffix
```

## Rules

- ✅ Signals for component state
- ✅ Observables for HTTP, async streams
- ✅ `signal()` for mutable, `computed()` for derived
- ✅ `WritableSignal<T>` for mutable, `Signal<T>` for readonly
- ✅ Plain names for signals, `suffix$` for observables
- ✅ Convert observables to signals on data arrival
- ❌ No Redux/NgRx in new code

## Signal Update Patterns

```typescript
// Set new value
this.items.set([item1, item2]);

// Update existing value
this.count.update(count => count + 1);
this.items.update(items => [...items, newItem]);

// Computed (read-only)
this.filtered = computed(() => 
  this.items().filter(item => item.active)
);
```

## Observable to Signal Conversion

```typescript
// Method 1: toSignal()
import { toSignal } from '@angular/core/rxjs-interop';
public readonly data = toSignal(this.data$, { initialValue: [] });

// Method 2: Manual subscription
this.data$.subscribe(data => this.data.set(data));

// Method 3: Wrap Redux (if legacy integration required)
const state$ = this._store.select(selector).pipe(takeUntil(this._onDestroy$));
this.state = toSignal(state$, { initialValue: initialState() });
```

## Anti-Patterns

**FORBIDDEN:**
- Prefix for observables: `$items` ❌ (should be `items$`)
- Prefix for signals: `$count` ❌ (should be `count`)
- Redux/NgRx in new code ❌
