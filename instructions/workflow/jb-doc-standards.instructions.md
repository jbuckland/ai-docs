# Documentation Standards

## When to Document

**DO document:**
- ✅ New patterns or architectural decisions
- ✅ Complex business logic
- ✅ Breaking changes
- ✅ Non-obvious code behavior
- ✅ Public APIs
- ✅ Configuration requirements

**DON'T document:**
- ❌ Self-explanatory code
- ❌ Obvious implementations
- ❌ Temporary code
- ❌ What the code does (code should be self-documenting)

## How to Document

### Code Comments

```typescript
// ✅ GOOD - Explains WHY
// Use debounce to prevent excessive API calls during rapid user input
const search$ = searchInput$.pipe(debounceTime(300));

// ❌ BAD - Explains WHAT (obvious from code)
// Debounce the search input
const search$ = searchInput$.pipe(debounceTime(300));

// ✅ GOOD - Explains non-obvious behavior
// Note: This must run before authentication middleware
// because it sets up the request context
app.use(contextMiddleware);

// ✅ GOOD - Documents complex logic
/**
 * Calculates prorated cost based on partial month usage.
 * Formula: (days_used / days_in_month) * monthly_cost
 * 
 * Edge cases:
 * - Handles leap years correctly
 * - Rounds to 2 decimal places
 * - Returns 0 for invalid dates
 */
function calculateProratedCost(startDate: Date, endDate: Date, monthlyCost: number): number {
  // Implementation
}
```

### Method Documentation

```typescript
/**
 * Retrieves user by ID with related data.
 * 
 * @param userId - The unique identifier for the user
 * @returns User object with profile and preferences, or undefined if not found
 * @throws {ValidationError} If userId is invalid
 * @throws {DatabaseError} If database connection fails
 * 
 * @example
 * const user = await getUserById(123);
 * if (user) {
 *   console.log(user.profile.name);
 * }
 */
async getUserById(userId: number): Promise<User | undefined> {
  // Implementation
}
```

### File Headers

```typescript
/**
 * UserService
 * 
 * Handles user-related business logic including:
 * - User CRUD operations
 * - Profile management
 * - Preference updates
 * 
 * Dependencies: UserDataAccess, EmailService
 */
@injectable()
export class UserService {
  // Implementation
}
```

## Markdown Documentation

**Avoid using bold syntax** - Use headers, lists, and other formatting instead.

### Structure

```markdown
# Title

Brief description of what this document covers.

## Section 1

Content with examples.

### Subsection

More detailed information.

## Section 2

Additional content.

## Related Documentation

- [Link to related doc](./related-doc.md)
```

### Code Examples

````markdown
Example with syntax highlighting:

```typescript
const example = 'code';
```

Example with explanation:

```typescript
// This demonstrates the pattern
const pattern = usePattern();
```
````

### Tables

**IMPORTANT:** Always align table columns in the raw markdown source.

```markdown
| Feature | Status     | Notes         |
|---------|------------|---------------|
| Login   | ✅        | Complete      |
| Signup  | 🚧        | In progress   |
| Reset   | ❌        | Not started   |
```

## Best Practices

### DO
- ✅ Keep documentation close to code
- ✅ Update docs when code changes
- ✅ Use clear, concise language
- ✅ Include code examples
- ✅ Document edge cases
- ✅ Explain WHY, not WHAT
- ✅ Use consistent formatting

### DON'T
- ❌ Write novels (be concise)
- ❌ Duplicate information
- ❌ Document obvious code
- ❌ Leave outdated documentation
- ❌ Use jargon without explanation
- ❌ Forget to update docs with code changes

## Example File Organization

```
docs/
  architecture/
    system-overview.md
    data-flow.md
  api/
    endpoints.md
    authentication.md
  guides/
    getting-started.md
    deployment.md
```

## Documentation Types

### README Files
- Project overview
- Setup instructions
- Quick start guide
- Links to detailed docs

### API Documentation
- Endpoint descriptions
- Request/response formats
- Authentication requirements
- Error codes

### Architecture Documentation
- System design
- Component relationships
- Data flow
- Technology decisions

### User Guides
- Feature explanations
- Step-by-step instructions
- Screenshots/diagrams
- Troubleshooting

## Related Documentation

See [jb-general-annotations.instructions.md](../patterns/jb-general-annotations.instructions.md) for in-code annotation system.
