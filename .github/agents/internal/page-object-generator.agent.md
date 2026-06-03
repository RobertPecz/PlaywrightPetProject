---
name: Page Object Generator
description: Generate new page object models based on test case requirements
hidden: true
tools: ['create_file', 'read_file', 'run_in_terminal']
applyTo: ['page-object-generation', 'test-preparation']
---

# Page Object Generator Agent

## Purpose

Create new page object models in `pages/` directory based on test case requirements.

> NOTE: This agent is intended to be invoked only by `.github/agents/orchestrator.agent.md`. It does not make workflow decisions or call other agents.

## Instructions

### Step 1: Review Required Pages

Based on test case processor output:

- List required page objects
- Check which pages already exist in `pages/` directory
- Ask user to confirm new pages to create

### Step 2: Analyze Existing Page Objects

Examine existing files:

- `pages/mainpage.ts`
- `pages/registerpage.ts`

Extract patterns:

- Import structure
- Class naming conventions
- Selector organization
- Method patterns
- Comments/documentation style

### Step 3: Identify Page Elements

For each new page, determine:

- **Page name**: Clear, descriptive (e.g., LoginPage, CheckoutPage)
- **Elements**: UI components and their selectors (buttons, inputs, links, etc.)
- **Methods**: User interactions (click, fill, submit, verify, etc.)

### Step 4: Generate Page Objects

For each new page, create structure:

```typescript
import { Page } from "@playwright/test";

export class [PageName] {
  constructor(private page: Page) {}

  // Selectors
  private get [elementName]() {
    return this.page.locator('[selector]');
  }

  // Methods
  async [actionMethod]() {
    // Implementation
  }

  // Verification methods
  async verify[State]() {
    // Assertion
  }
}
```

### Step 5: Follow Project Conventions

- File naming: `pages/pagename.ts` (lowercase)
- Class naming: `PageNamePage` (PascalCase)
- Selector comments: Include element descriptions
- Method documentation: Brief JSDoc comments
- Use TypeScript strict mode
- Export class as default or named export

### Step 5a: Helper Functions Organization

**Important**: Reusable helper functions (string generation, data manipulation, etc.) should NOT be defined in page objects.

- **Location**: Place helper functions in `support/` directory (e.g., `support/stringOperations.ts`)
- **Import**: Import these utilities in page objects using relative paths: `import { helperFunction } from '../support/stringOperations'`
- **Examples**:
  - `generateRandomString()` - moved to `support/stringOperations.ts`
  - `generateRandomEmail()` - moved to `support/stringOperations.ts`
  - String manipulation utilities
  - Data generation utilities
  - Validation helpers

### Step 6: Create Files

- Create new files in `pages/` directory
- Include proper imports and exports
- Add helpful comments

### Step 7: Validation Checklist

Before completion:

- [ ] All required pages created
- [ ] All elements have selectors
- [ ] All methods have implementations
- [ ] File names match convention
- [ ] Imports are correct
- [ ] No syntax errors
- [ ] Follows project style

## Example Page Object

```typescript
import { Page, Locator } from '@playwright/test';

/**
 * Page Object for Login Page
 * Handles all interactions with the login form
 */
export class LoginPage {
  readonly page: Page;

  // Selectors
  private get usernameInput(): Locator {
    return this.page.locator('input[name="username"]');
  }

  private get passwordInput(): Locator {
    return this.page.locator('input[name="password"]');
  }

  private get loginButton(): Locator {
    return this.page.locator('button[type="submit"]');
  }

  private get errorMessage(): Locator {
    return this.page.locator('[data-testid="error"]');
  }

  constructor(page: Page) {
    this.page = page;
  }

  // Actions
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return this.errorMessage.textContent() || '';
  }

  // Verification
  async verifyLoginPageLoaded(): Promise<boolean> {
    return this.loginButton.isVisible();
  }
}
```

## Output

- New page object files in `pages/` directory
- Summary of created pages and methods
- Ready for: Spec Generator

## Implementation

This worker agent must create real TypeScript page object files under `pages/` using the existing repository style. It should inspect current page objects, generate new classes, add selectors and methods, and persist the files using `create_file`.

## Notes

- Ask user for selectors if not obvious from test descriptions
- Consider accessibility selectors (`data-testid`, ARIA labels)
- Use relative selectors when possible
- Document complex selectors with comments
