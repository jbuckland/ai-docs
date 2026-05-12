# API Design Patterns

## Request/Response Envelope Pattern

All API requests and responses use a consistent envelope format.

### Request Envelope

```typescript
{
  "data": {
    // Request parameters go here
  }
}
```

**Examples:**

```typescript
// Parameterless request
GET /api/users/current
Body: { data: {} }

// Single parameter
GET /api/users/byId
Body: { data: { userId: 123 } }

// Multiple parameters
GET /api/users/search
Body: { 
  data: { 
    query: "john",
    filters: { active: true }
  }
}
```

### Response Envelope

```typescript
{
  "status": "SUCCESS",
  "message": "Operation completed successfully",
  "data": {
    // Response payload
  },
  "errors": [],
  "timestamp": "2025-10-08T10:30:00Z"
}
```

### Service Method Pattern

All service methods follow this pattern:

```typescript
// Request object contains all parameters
interface MethodNameRequest {
  param1: Type1;
  param2: Type2;
}

// Service method signature
async methodName(request: MethodNameRequest): Promise<ServiceResponse<DataType>> {
  // Implementation
}
```

### Service Method Requirements

Every service method must:
- Accept a single request object containing all parameters
- Return `ServiceResponse<T>` where T is the data type
- Validate all input before processing
- Handle errors and return appropriate BusinessStatusCode
- Log errors with context (service name, method name, request data)
- Return created objects with IDs for create operations
- Return updated objects for update operations
- Only update passed-in fields for update operations



## HTTP Status Codes vs Business Status Codes

### HTTP Status Codes (Transport Layer)
- `200 OK`: Request was processed (regardless of business logic outcome)
- `400 Bad Request`: Malformed HTTP request
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Authenticated but not authorized
- `500 Internal Server Error`: Server error occurred

### Business Status Codes (Business Logic Layer)

Embedded in the response envelope:

```typescript
enum BusinessStatusCode {
  SUCCESS = 'SUCCESS',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}
```

## Route Naming Conventions

**Use flat route structure:**
- No route parameters (e.g., avoid `/api/users/123/action`)
- One verb per endpoint
- 'get' is always implied if no verb is specified
- Don't repeat the service name in the endpoint

**Format:** `camelCase` for multi-word endpoints

```typescript
// ✅ CORRECT
/api/session/byIds              // Not /session/sessionsByIds
/api/family/addMember
/api/user/updateProfile

// ❌ WRONG
/api/session/by-ids             // Don't use kebab-case
/api/session/sessions_by_ids    // Don't use snake_case, don't repeat service name
/api/users/123                  // Don't use route parameters
```

**Single words:** lowercase

```typescript
// ✅ CORRECT
/api/session/join
/api/user/login
/api/family/create
```

## Details Interface Pattern

When creating interfaces that extend a base entity with additional computed/joined fields:

**Format:** `[EntityName]Details`

```typescript
// Base entity
export interface Session {
  id: number;
  creatorId: number;
  familyId: number;
  sessionCode: string;
}

// Details interface extends base
export interface SessionDetails extends Session {
  familyName: string;      // Joined from families table
  participantCount: number; // Computed count
}
```

**Rules:**
- Use `[EntityName]Details` format (e.g., `SessionDetails`, `UserDetails`)
- DO NOT use `[EntityName]WithDetails` format
- Place in domain entity files
- Use for response types that include joined/computed data

## Error Response Format

```typescript
{
  "status": "VALIDATION_ERROR",
  "message": "Invalid input provided",
  "data": null,
  "errors": [
    {
      "field": "email",
      "message": "Email format is invalid"
    },
    {
      "field": "name",
      "message": "Name is required"
    }
  ],
  "timestamp": "2025-10-08T10:30:00Z"
}
```

## Pagination Pattern

```typescript
// Request
{
  "data": {
    "page": 1,
    "limit": 20,
    "sortBy": "createdAt",
    "sortOrder": "desc"
  }
}

// Response
{
  "status": "SUCCESS",
  "message": "Data retrieved successfully",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "errors": [],
  "timestamp": "2025-10-08T10:30:00Z"
}
```

## Best Practices

### DO
- ✅ Use consistent envelope format for all requests/responses
- ✅ Use camelCase for multi-word route names
- ✅ Return appropriate business status codes
- ✅ Include timestamp in all responses
- ✅ Use Details interfaces for extended data
- ✅ Validate all input
- ✅ Log errors with context

### DON'T
- ❌ Mix HTTP status codes with business logic
- ❌ Use snake_case or kebab-case for routes
- ❌ Return raw database errors to clients
- ❌ Expose internal implementation details
- ❌ Use inconsistent response formats
