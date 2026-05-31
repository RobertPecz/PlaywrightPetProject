---
name: Spec Generator
description: Generate Playwright .spec.ts test files from test cases
tools: ['create_file', 'read_file']
applyTo: ['test-spec-generation', 'test-creation']
---

# Spec Generator Agent

## Purpose

Generate Playwright test specification files (`.spec.ts`) in `tests/` directory based on test cases and page objects.

> NOTE: This agent is intended to be invoked only by `.github/agents/orchestrator.agent.md`. It does not make workflow decisions or call other agents.

## Instructions

### Step 1: Review Test Case Data

From previous steps, have:

- Structured test cases (from Test Case Processor)
- Available page objects (existing + newly created)
- Test organization by feature/category

### Step 2: Analyze Existing Spec Files

Examine patterns from:

- `tests/login.spec.ts`
- `tests/register.spec.ts`
- `tests/openGithubIssue.spec.ts`

Extract:

- Import structure and patterns
- Test suite organization (describe blocks)
- Test case structure (test/it blocks)
- Fixture usage
- Assertions and expectations
- Page object integration

### Step 3: Plan Spec Files

Organize test cases into spec files:

- One spec file per major feature/page
- File naming: `tests/featurename.spec.ts`
- Naming convention: lowercase, descriptive

### Step 4: Generate Spec Files

For each test case group, create:

```typescript
import { test, expect } from "@playwright/test";
import { [PageName] } from "../pages/[pagename]";

test.describe("[Feature Name] Tests", () => {
  let [pageInstance]: [PageName];

  test.beforeEach(async ({ page }) => {
    [pageInstance] = new [PageName](page);
    // Navigate to page
  });

  test("should [expected behavior]", async ({ page }) => {
    // Arrange: Setup test data

    // Act: Perform actions

    // Assert: Verify results
  });

  test("should [another expected behavior]", async ({ page }) => {
    // Test implementation
  });
});
```

### Step 5: Map Test Cases to Code

For each test case:

1. Create test case description from test case title
2. Implement "Arrange" phase (setup, navigate)
3. Implement "Act" phase (user interactions)
4. Implement "Assert" phase (verifications)
5. Add error scenarios if specified

### Step 6: Follow Project Conventions

- File naming: `tests/featurename.spec.ts` (lowercase)
- Use `test.describe()` for grouping related tests
- Use `test()` or `test.it()` for individual tests
- Use clear, descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- Import page objects from `../pages/`
- Use TypeScript types appropriately

### Step 7: Include Standard Elements

Every spec file should have:

- [ ] Proper imports from @playwright/test
- [ ] Page object imports
- [ ] test.describe() grouping
- [ ] test.beforeEach() setup
- [ ] Clear test descriptions
- [ ] Proper assertions
- [ ] Error handling where needed
- [ ] Comments for complex logic

### Step 8: Validation

Before completion:

- [ ] All test cases converted to tests
- [ ] File names follow convention
- [ ] Imports are correct
- [ ] No syntax errors
- [ ] All page methods referenced
- [ ] Assertions are meaningful
- [ ] Test names are descriptive

## Example Spec File

```typescript
import { DashboardPage } from '../pages/dashboardpage';
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginpage';

test.describe('Login Feature Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await page.goto('https://example.com/login');
  });

  test('should successfully login with valid credentials', async () => {
    // Arrange
    const username = 'testuser';
    const password = 'password123';

    // Act
    await loginPage.login(username, password);

    // Assert
    await expect(page).toHaveURL(/.*dashboard/);
    await dashboardPage.verifyUserGreeting(username);
  });

  test('should display error for invalid credentials', async () => {
    // Arrange
    const username = 'testuser';
    const password = 'wrongpassword';

    // Act
    await loginPage.login(username, password);

    // Assert
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Invalid credentials');
  });

  test('should show validation error for empty username', async () => {
    // Act - leave username empty
    await loginPage.passwordInput.fill('password123');
    await loginPage.loginButton.click();

    // Assert
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Username is required');
  });
});
```

## Output

- New .spec.ts files in `tests/` directory
- Summary of created test files and test count
- Ready for: Test Validator

## Notes

- Link test cases to GitHub issues in test descriptions
- Use meaningful error messages in assertions
- Consider test data management (fixtures, factories)
- Add comments for complex test scenarios
- Ensure tests are isolated and independent
- Use proper async/await patterns
