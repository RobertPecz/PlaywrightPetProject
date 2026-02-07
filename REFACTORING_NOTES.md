# RegisterPage Refactoring: Open-Closed Principle (OCP) Implementation

## Summary

The `RegisterPage` class has been refactored to follow the **Open-Closed Principle** from SOLID. The class is now **open for extension** (via dependency injection) and **closed for modification** (no need to edit core methods when adding new behaviors).

## Key Changes

### 1. **Strategy Pattern for Email Handling**

- **Before**: Email logic embedded in `populateRegisterData()` with switch/case statements
- **After**: Email behaviors are defined as handler strategies in `defaultEmailHandlers`
- **Benefit**: Adding new email validation types no longer requires editing `populateRegisterData()`

### 2. **Dependency Injection**

- Constructor now accepts optional `emailHandlers` parameter
- Default handlers provided out-of-the-box
- Custom handlers can be injected for testing or extending functionality

```typescript
// Standard usage (uses default handlers)
const registerPage = new RegisterPage(page);

// Custom handlers (for extension)
const customHandlers = {
  customEmailValidation: async (page, options) => { ... }
};
const registerPage = new RegisterPage(page, customHandlers);
```

### 3. **Separated Concerns**

- `populateRegisterData()`: Orchestrates the registration process (public)
- `fillGender()`: Gender-specific logic (private)
- `fillFirstName()`: First name logic (private)
- `fillLastName()`: Last name logic (private)
- `fillEmail()`: Email strategy selection and delegation (private)
- `fillPassword()`: Password logic (private)
- `submit()`: Form submission (private)

### 4. **Helper Functions Extracted**

- `generateRandomString()`: Generates random alphanumeric strings
- `generateRandomEmail()`: Generates valid/invalid email addresses
- These are now module-level functions, not class methods

## How to Extend (Without Modifying the Class)

### Adding a New Email Validation Strategy

```typescript
import RegisterPage from './pages/registerpage';

// Define your custom handler
const myCustomHandlers = {
  corporateEmail: async (page, options) => {
    const emailInput = page.getByTestId('Email');
    await emailInput.fill('user@company.com');
  },
};

// Inject into RegisterPage
const registerPage = new RegisterPage(page, myCustomHandlers);

// Or add to existing handlers at runtime
registerPage.setEmailHandlers(myCustomHandlers);

// Use it in tests
await registerPage.populateRegisterData({
  emailOptions: { isValidEmail: true }, // Your custom handler will be used
});
```

### Creating Test Fixtures with Custom Handlers

```typescript
test('Custom email scenario', async ({ page }) => {
  const testHandlers = {
    blockedEmail: async (page, options) => {
      const emailInput = page.getByTestId('Email');
      await emailInput.fill('blocked@example.com');
    },
  };

  const registerPage = new RegisterPage(page, testHandlers);
  await registerPage.populateRegisterData({
    emailOptions: { isValidEmail: true },
  });
  // Test blocked email behavior
});
```

## Backward Compatibility

✅ All existing tests work without modification. The method signatures and behaviors are preserved:

- `populateRegisterData()` accepts the same parameters
- Default behavior is identical to the original implementation
- Tests in `register.spec.ts` run unchanged

## Benefits of This Refactoring

| Aspect               | Before                                    | After                                       |
| -------------------- | ----------------------------------------- | ------------------------------------------- |
| **Extensibility**    | Requires editing `populateRegisterData()` | Add new handlers without touching core code |
| **Testability**      | Hard to mock email behavior               | Can inject custom handlers in tests         |
| **Readability**      | One long method with mixed concerns       | Clear, focused private methods              |
| **Maintainability**  | Changes to one field affect entire method | Changes isolated to specific field methods  |
| **SOLID Compliance** | Violates OCP                              | Follows OCP via Strategy pattern + DI       |

## Implementation Details

### Email Handler Type

```typescript
type EmailHandler = (page: Page, options: emailOptions) => Promise<void>;
```

### Default Handlers Registry

```typescript
const defaultEmailHandlers: Record<string, EmailHandler> = {
  validEmail: async (page, options) => { ... },
  invalidEmail: async (page, options) => { ... },
  alreadyRegisteredEmail: async (page, options) => { ... },
  emptyEmail: async (page, options) => { ... },
};
```

### Handler Selection Logic

The `fillEmail()` method maps email options to handler keys:

- `emptyEmail: true` → uses `emptyEmail` handler
- `isValidEmail: false` → uses `invalidEmail` handler
- `alreadyRegisteredEmail: true` → uses `alreadyRegisteredEmail` handler
- Default → uses `validEmail` handler

## Future Enhancements

If you need to extend further, consider:

1. **Password Handlers**: Similar strategy pattern for password validation rules
2. **Gender Handlers**: If gender field needs dynamic behavior
3. **Event Hooks**: Add before/after hooks for each field (e.g., `onBeforeFillEmail()`)
4. **Composite Handlers**: Chain multiple handlers for complex scenarios

---

**Refactored**: February 2026  
**SOLID Principle Applied**: Open-Closed Principle (OCP)
