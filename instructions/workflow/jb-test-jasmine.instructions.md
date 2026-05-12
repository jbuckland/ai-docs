# Testing with Jasmine/Karma

**Framework:** Jasmine/Karma
**Recommended:** ts-mockito for mocking

## Pattern: AAA (Arrange-Act-Assert)

```typescript
import { mock, instance, when, verify, capture } from 'ts-mockito';

describe('MyService', () => {
  let dataAccess: DataAccess;
  let svc: MyService;
  
  beforeEach(() => {
    // Arrange
    dataAccess = mock(DataAccess);
    svc = new MyService(instance(dataAccess));
  });
  
  it('should load data', async () => {
    // Arrange
    const mockData = { id: 111, name: 'Test' };
    when(dataAccess.getData()).thenReturn(Promise.resolve(mockData));
    
    // Act
    const result = await svc.loadData();
    
    // Assert
    expect(result.id).toBe(111);
    verify(dataAccess.getData()).once();
  });
});
```

## ts-mockito Usage

```typescript
import { mock, instance, when, verify, anything, capture } from 'ts-mockito';

// Create mock
const mockService = mock(MyService);

// Get instance for injection
const serviceInstance = instance(mockService);

// Setup behavior
when(mockService.getData()).thenReturn(mockData);
when(mockService.search(anything())).thenResolve(results);

// Verify calls
verify(mockService.getData()).once();
verify(mockService.getData()).never();
verify(mockService.search('test')).once();

// Capture arguments
const [arg] = capture(mockService.search).first();
expect(arg).toBe('test');
```

## Jasmine Spies (Secondary alternative)

```typescript
describe('MyComponent', () => {
  let component: MyComponent;
  let serviceSpy: jasmine.SpyObj<MyService>;
  
  beforeEach(() => {
    serviceSpy = jasmine.createSpyObj('MyService', ['getData', 'save']);
    component = new MyComponent(serviceSpy);
  });
  
  it('should call getData', async () => {
    serviceSpy.getData.and.returnValue(Promise.resolve(mockData));
    
    await component.loadData();
    
    expect(serviceSpy.getData).toHaveBeenCalled();
  });
});
```

## Test Data Standards

```typescript
// Use distinguishable values
const TEST_ID_1 = 111;
const TEST_ID_2 = 222;
const TEST_NAME_1 = 'Test Name 1';
const TEST_NAME_2 = 'Test Name 2';

// Mock data factory, if needed
function createMockProject(id: number = 111): Project {
  return {
    id,
    name: `Test Project ${id}`,
    status: 'active'
  };
}

// Reusable test data
const MOCK_PROJECT_1 = createMockProject(111);
const MOCK_PROJECT_2 = createMockProject(222);
```

## Test Organization

```typescript
describe('MyService', () => {
  let service: MyService;
  let mockDependency: MockDependency;
  
  beforeEach(() => {
    mockDependency = mock(Dependency);
    service = new MyService(instance(mockDependency));
  });
  
  describe('getData()', () => {
    it('should return data when found', async () => {
      // Test implementation
    });
    
    it('should return undefined when not found', async () => {
      // Test implementation
    });
    
    it('should throw error on failure', async () => {
      // Test implementation
    });
  });
  
  describe('saveData()', () => {
    // More tests
  });
});
```

## What to Test

### DO Test
- ✅ Business logic
- ✅ Data transformations
- ✅ Error handling
- ✅ Edge cases
- ✅ Public API methods

### DON'T Test
- ❌ Framework code (Angular, RxJS)
- ❌ Third-party libraries
- ❌ Trivial getters/setters
- ❌ Private methods directly (test through public API)

## Best Practices

- Use AAA pattern consistently
- One assertion per test (when possible)
- Clear, descriptive test names
- Use beforeEach for common setup
- Clean up in afterEach if needed
- Mock all dependencies
- Test edge cases and error paths
- Aim for >80% code coverage
