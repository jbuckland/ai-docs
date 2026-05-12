# Error Handling Patterns

## Error Types

### 1. Expected Errors
Return BusinessStatusCode in ServiceResponse.

**Examples:**
- Validation failures
- Record not found
- Business rule violations

```typescript
// Return error in ServiceResponse
return {
  success: false,
  businessStatusCode: BusinessStatusCode.VALIDATION_ERROR,
  message: 'Invalid input provided',
  data: undefined,
  errors: [{ field: 'email', message: 'Email format is invalid' }],
  timestamp: new Date().toISOString()
};
```

### 2. Unexpected Errors
Throw exceptions.

**Examples:**
- Database connection failures
- External service failures
- Programming errors

```typescript
// Throw exception for unexpected errors
throw new Error('Database connection failed');
```

## Error Logging

All errors must be logged with context:

```typescript
logger.error('Error description', error, {
  service: 'ServiceName',
  method: 'methodName',
  request: request,
  // ... other relevant context
});
```

**Example:**

```typescript
catch (error) {
  logger.error('Error getting user by ID', error, {
    service: 'UserService',
    method: 'getUserById',
    userId: request.userId
  });

  return {
    success: false,
    businessStatusCode: BusinessStatusCode.INTERNAL_ERROR,
    message: 'An error occurred while retrieving user',
    data: undefined,
    errors: [],
    timestamp: new Date().toISOString()
  };
}
```

## Service Error Handling Pattern

```typescript
async getUserById(request: GetUserByIdRequest): Promise<ServiceResponse<User|undefined>> {
  try {
    // Validate input
    if (!request.userId) {
      return {
        success: false,
        businessStatusCode: BusinessStatusCode.VALIDATION_ERROR,
        message: 'User ID is required',
        data: undefined,
        errors: [{ field: 'userId', message: 'Required field' }],
        timestamp: new Date().toISOString()
      };
    }

    // Business logic
    const user = await this.userDataAccess.getById(request.userId);

    if (!user) {
      return {
        success: false,
        businessStatusCode: BusinessStatusCode.NOT_FOUND,
        message: 'User not found',
        data: undefined,
        errors: [],
        timestamp: new Date().toISOString()
      };
    }

    // Success response
    return {
      success: true,
      businessStatusCode: BusinessStatusCode.SUCCESS,
      message: 'User retrieved successfully',
      data: user,
      errors: [],
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    logger.error('Error getting user by ID', error, {
      service: 'UserService',
      method: 'getUserById',
      userId: request.userId
    });

    return {
      success: false,
      businessStatusCode: BusinessStatusCode.INTERNAL_ERROR,
      message: 'An error occurred while retrieving user',
      data: undefined,
      errors: [],
      timestamp: new Date().toISOString()
    };
  }
}
```

## Error Messages

**IMPORTANT:** Error messages in ServiceResponse are intended for developers, not end users. End user messages should come from the UI, preferably from a language/i18n library.

**Developer-focused messages should:**
- Include specific details (IDs, values, etc.)
- Help with debugging
- Be clear and actionable
- Not expose sensitive data

**Examples:**

```typescript
// ✅ GOOD - Developer-friendly with details
message: 'User 123 not found'
message: 'Invalid email format: "bob@bob.com"'
message: 'An error occurred while saving user 123'

// ❌ BAD - Exposes internal implementation
message: 'Database query failed: SELECT * FROM users WHERE id = 123'
message: 'NullPointerException in UserService.getUserById'
message: 'Error: ECONNREFUSED 127.0.0.1:5432'
```

## Data Access Error Handling

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
- ✅ Log all errors with context
- ✅ Return expected errors in ServiceResponse
- ✅ Throw unexpected errors
- ✅ Use appropriate BusinessStatusCode
- ✅ Provide developer-friendly error messages


### DON'T
- ❌ Expose internal implementation details
- ❌ Return database errors to clients
- ❌ Swallow errors silently
- ❌ Use generic "Error occurred" messages for validation
- ❌ Mix HTTP status codes with business logic
- ❌ Log sensitive data (passwords, tokens, etc.)

## Related Documentation

See [jb-general-api-design.instructions.md](../patterns/jb-general-api-design.instructions.md) for API design patterns.
See [jb-node-express.instructions.md](./jb-node-express.instructions.md) for Express.js patterns.
