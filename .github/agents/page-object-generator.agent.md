---
name: Page Object Generator
description: Generate new page object models based on test case requirements
tools: ["create_file", "read_file"]
applyTo: ["page-object-generation", "test-preparation"]
---

# Page Object Generator Agent

## Purpose
Create new page object models in `pages/` directory based on test case requirements.

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
import { Page, Locator } from "@playwright/test";

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
    return this.errorMessage.textContent() || "";
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

## Notes
- Ask user for selectors if not obvious from test descriptions
- Consider accessibility selectors (`data-testid`, ARIA labels)
- Use relative selectors when possible
- Document complex selectors with comments
