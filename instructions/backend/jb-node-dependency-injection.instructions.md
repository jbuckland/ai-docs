# Dependency Injection Guidelines (TSyringe)

Guidelines for implementing dependency injection in Node.js/Express backend applications using **TSyringe**.

---

## 1. Core Principles

1. **Explicit Inversion of Control:** Services and data access classes declare dependencies in constructors using `@injectable()` and `@inject()`.
2. **Centralized Registration:** Database pools, external HTTP clients, and singleton tokens are registered once in a central container setup (`backend/src/core/container/container.ts`).
3. **Route Handler Resolution:** Route handlers resolve services from the container within the route callback (`container.resolve(ServiceClass)`), avoiding global mutable state or `new` instantiation in route definitions.
4. **Test Isolation Without Container Overhead:** Unit tests manually instantiate service classes with mocked dependencies in their constructors (`new Service(instance(mockDb), instance(mockLogger))`), completely bypassing container resolution.

---

## 2. Container Setup & Tokens

Tokens must be declared with clear domain names to prevent collisions.

```typescript
// backend/src/core/container/container.ts
import 'reflect-metadata';
import { container } from 'tsyringe';
import { Pool } from 'pg';

export const DB_POOL_TOKEN = 'DatabasePool';

export function registerDatabasePool(pool: Pool): void {
  container.registerInstance(DB_POOL_TOKEN, pool);
}

export { container };
```

In the main application entrypoint (`index.ts`), `reflect-metadata` **must** be the very first import:
```typescript
import 'reflect-metadata'; // MUST be the very first import
import { initializeDatabase } from './config/database';
import { registerDatabasePool } from './core/container/container';

const pool = await initializeDatabase();
registerDatabasePool(pool);
```

---

## 3. Service & Data Access Decoration

### Injecting Tokens
```typescript
import { injectable, inject } from 'tsyringe';
import { Pool } from 'pg';
import { DB_POOL_TOKEN } from '../core/container/container';

@injectable()
export class BasePromisesDb {
  constructor(@inject(DB_POOL_TOKEN) protected pool: Pool) {}
}

@injectable()
export class UserDb extends BasePromisesDb {
  async findById(id: number) {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }
}
```

### Injecting Services into Services
```typescript
import { injectable } from 'tsyringe';
import { UserDb } from '../../data/user.db';

@injectable()
export class UserService {
  constructor(private userDb: UserDb) {}

  async getUser(id: number) {
    return this.userDb.findById(id);
  }
}
```

---

## 4. Route Handlers (Express)

Always resolve the service inside the request callback:

```typescript
import { Router } from 'express';
import { container } from '../core/container/container';
import { UserService } from '../core/services/user.service';

const router = Router();

router.get('/:id', async (req, res, next) => {
  try {
    const userService = container.resolve(UserService);
    const user = await userService.getUser(Number(req.params.id));
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

export default router;
```

---

## 5. Scope Management

- **Default (Transient):** Classes decorated with `@injectable()` create a new instance each time `container.resolve()` is called. This is ideal for stateless domain services and request handlers.
- **Singleton (`@singleton()`):** If a service maintains in-memory caches, socket connections, or state across requests, decorate with `@singleton()`. Be cautious of memory leaks and cross-tenant data bleeding when using singletons.

---

## 6. Unit Testing Pattern

> [!IMPORTANT]
> **Do NOT use the DI container in unit tests.**
> Never register mocks in `container` or resolve services via `container.resolve` during unit tests. Always instantiate classes directly with mocked constructor arguments:

```typescript
import { mock, instance, when } from 'ts-mockito';
import { UserService } from './user.service';
import { UserDb } from '../../data/user.db';

describe('UserService', () => {
  let mockUserDb: UserDb;
  let userService: UserService;

  beforeEach(() => {
    mockUserDb = mock(UserDb);
    userService = new UserService(instance(mockUserDb));
  });

  it('retrieves a user by ID', async () => {
    when(mockUserDb.findById(1)).thenResolve({ id: 1, email: 'test@example.com' } as any);
    
    const user = await userService.getUser(1);
    expect(user?.email).toBe('test@example.com');
  });
});
```
