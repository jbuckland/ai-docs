# Node.js/Express Patterns

## Route Handler Pattern

Route handlers are thin wrappers that:
1. Authorize the call (via middleware)
2. Resolve service from DI container
3. Extract request data via middleware
4. Call service method
5. Return response with appropriate HTTP status code

```typescript
import { Request, Response, Router } from 'express';
import { container } from '../core/container/container';
import { UserService } from '../core/services/user.service';

const router = Router();

router.get('/byId', authMiddleware, async (req: ApiRequest, res: Response) => {
  try {
    // 1. Resolve service
    const userService = container.resolve(UserService);
    
    // 2. Extract data (middleware populates req.envelope)
    const data = req.envelope;
    
    // 3. Call service
    const response = await userService.getUserById(data);
    
    // 4. Return response
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json(error);
  }
});

export { router as userRoutes };
```

## HTTP Status Codes

Routes return ONLY the following HTTP status codes:
- `200` = Success: service returned a valid response
- `4??` = Not Authorized: User not authorized to call the service (handled by middleware)
- `500` = Internal server error: service threw an error

**Rules:**
- No other status codes should be used by routes
- HTTP status codes are for transport-level statuses only
- Business-level statuses are in the ServiceResponse.statusCode field

## Dependency Injection

### Service Registration

Services are automatically registered when marked with `@injectable()`:

```typescript
import { injectable } from 'tsyringe';

@injectable()
export class MyService {
  constructor(
    private dataAccess: MyDataAccess,
    private otherService: OtherService
  ) {}
}
```

### Service Resolution

In route handlers, always resolve from container:

```typescript
// ✅ CORRECT - Resolve inside handler
router.get('/endpoint', async (req: Request, res: Response) => {
  const service = container.resolve(MyService);
  const result = await service.doSomething(req.body.data);
  res.json(result);
});

// ❌ WRONG - Don't resolve at module level
const service = container.resolve(MyService); // DON'T DO THIS
router.get('/endpoint', async (req: Request, res: Response) => {
  const result = await service.doSomething(req.body.data);
  res.json(result);
});
```

## Middleware Patterns

### Authentication Middleware

```typescript
import { Request, Response, NextFunction } from 'express';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### Envelope Middleware

```typescript
export function envelopeMiddleware(req: Request, res: Response, next: NextFunction) {
  // Extract data from request envelope
  req.envelope = req.body.data || {};
  next();
}
```

### Error Handling Middleware

```typescript
export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error('Unhandled error', err, {
    path: req.path,
    method: req.method
  });
  
  res.status(500).json({
    status: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    errors: [],
    timestamp: new Date().toISOString()
  });
}
```

## Async Patterns

### Backend Services: Use async/await

```typescript
// ✅ CORRECT - Backend services use async/await
async getUserById(request: GetUserByIdRequest): Promise<ServiceResponse<User>> {
  const user = await this.userDataAccess.getById(request.userId);
  return this.buildResponse(user);
}
```

### Data Access: Use Promises

```typescript
// ✅ CORRECT - Data access returns Promises
async getById(userId: number): Promise<User | null> {
  const result = await this.pool.query(query, [userId]);
  return this.mapRow(result.rows[0]);
}
```

### Route Handlers: Use async/await

```typescript
// ✅ CORRECT - Route handlers use async/await
router.get('/endpoint', async (req: Request, res: Response) => {
  const service = container.resolve(MyService);
  const response = await service.doSomething(req.body.data);
  res.json(response);
});
```

## Best Practices

### Route Handler Design
1. Keep handlers thin
2. No business logic in handlers
3. Resolve services inside handler functions
4. Always handle errors
5. Use middleware for common concerns (auth, validation)

### Service Design
1. Keep services focused on single domain
2. Services can call other services
3. Always handle errors from called services
4. Log all error cases
5. Validate input before processing
6. Return consistent response format

## Related Documentation

See [jb-general-api-design.instructions.md](../patterns/jb-general-api-design.instructions.md) for API design patterns.
See [jb-node-error-handling.instructions.md](./jb-node-error-handling.instructions.md) for error handling patterns.
See [jb-node-data-access.instructions.md](./jb-node-data-access.instructions.md) for data access layer patterns.
