# Data Access Layer Patterns

## Naming Conventions

1. **Class Naming**: `<DomainObject>Db` (e.g., `UserDb`, `FamilyDb`, `SessionDb`)
2. **File Naming**: `<domain-object>.db.ts` (e.g., `user.db.ts`, `family.db.ts`)
3. **Inheritance**: Extend `BasePromisesDb`
4. **Method Naming**: Clear, descriptive names like `getById`, `findById`, `listAll`, `create`, `update`, `delete`

## Data Access Pattern

```typescript
import { injectable, inject } from 'tsyringe';
import { Pool } from 'pg';
import { DB_POOL_TOKEN } from '../core/container/container';
import { BasePromisesDb } from './base-promises.db';
import { User } from '../core/domain/user';

@injectable()
export class UserDb extends BasePromisesDb {
  // Pool is managed by BasePromisesDb via DB_POOL_TOKEN injection

  async getById(userId: number): Promise<User | null> {
    const query = `
      SELECT id, email, first_name, last_name
      FROM users
      WHERE id = $1 AND is_active = true
    `;
    
    const result = await this.pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToUser(result.rows[0]);
  }

  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name
    };
  }
}
```

## Transaction Pattern

```typescript
async updateUserAndFamily(userId: number, familyId: number): Promise<void> {
  const client = await this.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    await client.query('UPDATE users SET family_id = $1 WHERE id = $2', [familyId, userId]);
    await client.query('UPDATE families SET member_count = member_count + 1 WHERE id = $1', [familyId]);
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

## Error Handling

```typescript
async getById(userId: number): Promise<User | null> {
  try {
    const result = await this.pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return null;  // Not found, not an error
    }
    
    return this.mapRow(result.rows[0]);
  } catch (error) {
    // Log and re-throw database errors
    logger.error('Database error in getById', error, { userId });
    throw error;
  }
}
```

## Best Practices

### DO
- ✅ One data access class per database table/domain
- ✅ Use parameterized queries (prevent SQL injection)
- ✅ Return null or empty array for not found, don't throw
- ✅ Throw exceptions for database errors
- ✅ Map database rows to domain models
- ✅ Use transactions for atomic operations

### DON'T
- ❌ Put business logic in data access layer
- ❌ Use string concatenation for queries
- ❌ Swallow errors silently
- ❌ Return undefined (use null instead)
- ❌ Mix data access with HTTP concerns

## Related Documentation

See [jb-node-express.instructions.md](./jb-node-express.instructions.md) for Express.js patterns.
See [jb-node-error-handling.instructions.md](./jb-node-error-handling.instructions.md) for error handling patterns.
