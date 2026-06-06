# Spec Generator

Generate Playwright `.spec.ts` test files in the `tests/` directory. Pass a feature name or test file name: `$ARGUMENTS`

## Instructions

### Step 1: Gather Inputs

Collect from the current conversation context:

- Test case data from `/process-test-cases` (structured JSON)
- Page objects available (existing in `pages/` + any just created by `/generate-page-objects`)
- GitHub issue requirements from `/fetch-tickets`
- `$ARGUMENTS` (e.g. "checkout" → `tests/checkout.spec.ts`)

### Step 2: Study Existing Spec Files

Read existing test files to extract patterns:

```bash
ls tests/
```

Read key files like `tests/login.spec.ts` or `tests/register.spec.ts` to understand:

- Import structure
- `test.describe()` and `test()` blocks
- `test.beforeEach()` setup
- `test.step()` for sub-steps
- `expect()` assertions
- Page object usage patterns
- Fixture data from `fixtures/`

### Step 3: Plan Spec Files

Organize test cases into spec files (one per feature/page):

```
Files to create:
1. tests/checkout.spec.ts
   Tests: "User can complete checkout", "Checkout fails without address"
   Page objects: CartPage, CheckoutPage, MainPage

2. tests/search.spec.ts
   Tests: "User can search for products", "Empty search shows message"
   Page objects: MainPage, SearchPage
```

Show the user this plan and ask: "Should I create these test files? Any adjustments?"

### Step 4: Generate Spec Files

For each spec file, follow this exact project pattern:

```typescript
import testData from '../fixtures/testData.json';
import { test, expect } from '@playwright/test';
import PageTwoPage from '../pages/pagetwopage';
import PageOnePage from '../pages/pageonepage';

test.describe('Feature Name Tests', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('User can do something successfully', async ({ page }) => {
    const pageOne = new PageOnePage(page);
    const pageTwo = new PageTwoPage(page);

    // Arrange
    await test.step('Set up preconditions', async () => {
      // setup
    });

    // Act
    await test.step('Perform the main action', async () => {
      // action
    });

    // Assert
    await test.step('Verify the expected outcome', async () => {
      await expect(pageTwo.elements.successMessage()).toBeVisible();
    });
  });
});
```

**Key conventions:**

- File: `tests/featurename.spec.ts` (lowercase)
- Use `test.describe()` to group related tests
- Use `test.step()` for AAA phases — name them clearly
- Import page objects from `../pages/`
- Import fixtures from `../fixtures/`
- Use `test.describe.configure({ mode: 'serial' })` when tests share state
- Add `test.beforeEach` for common setup (login, navigate)

### Step 5: Test Isolation for Cart/Account Tests

When tests involve shopping cart or user account state:

- In `beforeEach`: login → clear cart → logout (server-side cart persists between runs)
- Each test should start from a known clean state

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  const mainPage = new MainPage(page);
  await mainPage.userLogIn(testData.email, testData.password);
  const cartPage = new CartPage(page);
  await cartPage.clearCart();
  await mainPage.userLogOut();
  await page.goto('/');
});
```

### Step 6: Link Tests to GitHub Issues

In test descriptions, reference the issue:

```typescript
test('User can checkout with credit card (#42)', async ({ page }) => {
```

### Step 7: Validation Checklist

Before declaring done:

- [ ] All test cases have corresponding `test()` blocks
- [ ] File names follow convention
- [ ] All imports are correct and files exist
- [ ] AAA pattern followed with `test.step()`
- [ ] Assertions use `expect()` with meaningful messages
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Tests are isolated (no shared state leaks)

## Output

- List of created spec files with test names and counts
- Ready for: `/validate-tests`
