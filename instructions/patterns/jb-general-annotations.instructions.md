# In-Code Annotation System

## Purpose

Standardized annotations for AI collaboration and task management directly in code.

## Annotation Format

```typescript
// {!ANNOTATION_TYPE description}
```

## How Annotations Work

Annotation types are **flexible** - the AI should infer what the user means based on the ANNOTATION_TYPE used.

**Only two annotation types have specific, required behavior:**
- **{!QUESTION text}** - AI must answer the question inline
- **{!PM? text}** - AI must NOT answer (leave for human stakeholder)

**All other annotation types are interpreted by context.** The AI will infer the appropriate action based on the type used.

## Common Annotation Types

Here are common annotation types and what they typically mean:

### {!FIXME description}
**Typical meaning:** Code to be fixed.

**Example:**
```typescript
// {!FIXME This breaks when user has no email}
function sendNotification(user: User): void {
  sendEmail(user.email);  // Assumes email exists
}
```

**AI behavior:** Fix the issue.

### {!REFACTOR description}
**Typical meaning:** Code that works but should be improved.

**Example:**
```typescript
// {!REFACTOR Extract this into a separate service}
function processData(data: Data[]): ProcessedData[] {
  // 50 lines of complex logic
}
```

**AI behavior:** Refactor the code as described.

### {!DO description}
**Typical meaning:** A task that needs to be completed.

**Example:**
```typescript
// {!DO Add validation for email format}
function validateUser(user: User): boolean {
  return !!user.name;
}
```

**AI behavior:** Complete the task.

### {!IMPLEMENT description}
**Typical meaning:** Feature or functionality that needs to be added.

**Example:**
```typescript
// {!IMPLEMENT Add pagination support}
function getUsers(): User[] {
  return allUsers;
}
```

**AI behavior:** Implement the described functionality.

### {!TEST description}
**Typical meaning:** Tests that need to be written.

**Example:**
```typescript
// {!TEST Add unit tests for edge cases}
function calculateDiscount(price: number, percent: number): number {
  return price * (1 - percent / 100);
}
```

**AI behavior:** Write the requested tests.

### {!DECISION text}
**Typical meaning:** The user has made a decision that should be respected by the AI.

**Example:**
```typescript
// {!DECISION Use JWT tokens instead of sessions for better scalability}
const authMiddleware = jwtAuth();
```

**AI behavior:** Respect and follow this decision in related code.

### {!QUESTION text} ⚠️ REQUIRED BEHAVIOR
**Meaning:** Question for AI to answer inline.

**Example:**
```typescript
// {!QUESTION Should this be async or can it stay synchronous?}
function processItem(item: Item): void {
  // Processing logic
}
```

**AI behavior:**
- Answer the question inline (as a comment)
- Remove the annotation after answering

### {!PM? text} ⚠️ REQUIRED BEHAVIOR
**Meaning:** Question for PM/stakeholder - AI must NOT answer.

**Example:**
```typescript
// {!PM? Should free users have access to this feature?}
function exportData(user: User): Data {
  // Export logic
}
```

**AI behavior:**
- Do NOT answer the question
- Add the question to running questions document, if one exists.

### {!UPDATE description}

**Purpose:** A general update to the code.

**Usage:**
```typescript
// {!UPDATE this should be a general ng instruction}
const componentNaming = 'kebab-case';

// {!UPDATE this done differently}
enum Status {
  Active = 'active'
}
```
