# Repository Reference

This document describes the current project layout and coding conventions so generated agent code matches the existing repository style.

## Project Structure

```
.
├── .github/
│   ├── AGENTS.md
│   ├── APPLICATION.md
│   ├── DEMO-WEB-SHOP-INTEGRATION.md
│   ├── README-AGENTS.md
│   └── agents/
│       ├── orchestrator.agent.md
│       ├── github-ticket-fetcher.agent.md
│       ├── test-case-processor.agent.md
│       ├── page-object-generator.agent.md
│       ├── spec-generator.agent.md
│       ├── test-validator.agent.md
│       ├── merge-request-creator.agent.md
│       └── demo-web-shop-pagobjects.agent.md
├── fixtures/
│   ├── errorMessages.json
│   ├── githubAPIData.json
│   ├── mainpageData.json
│   └── registerData.json
├── pages/
│   ├── mainpage.ts
│   └── registerpage.ts
├── support/
│   ├── apiHandler.ts
│   ├── filereader.ts
│   ├── stringOperations.ts
│   └── testcasesFilter.ts
├── testcases/
│   └── automation_practice_testcases.xlsx
├── tests/
│   ├── login.spec.ts
│   ├── openGithubIssue.spec.ts
│   └── register.spec.ts
├── test-results/
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
├── tsconfig.eslint.json
├── eslint.config.mts
└── README.md
```

## Existing Code Style and Conventions

### Page Objects

The current repository uses page objects that follow this pattern:

- Default export class per file
- `readonly page: Page` property
- `elements = { ... }` object containing locator functions
- Methods use `async` and `await`
- Comments are provided for important behavior and form field logic
- Selectors often use `getByTestId`, `getByRole`, and XPath locators

Example from `pages/mainpage.ts`:

```ts
import RegisterPage from './registerpage';
import { Page } from '@playwright/test';

class MainPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  elements = {
    loginButton: () => this.page.getByRole('link', { name: 'Log in' }),
    emailTextBox: () => this.page.getByTestId('Email'),
    passwordTextBox: () => this.page.getByTestId('Password'),
    signInButton: () => this.page.locator('//input[@value="Log in"]'),
  };

  async userLogIn(email: string, password: string) {
    await this.elements.loginButton().click();
    await this.elements.emailTextBox().fill(email);
    await this.elements.passwordTextBox().fill(password);
    await this.elements.signInButton().click();
  }
}

export default MainPage;
```

### Data and Fixture Usage

Fixtures are stored in `fixtures/` and imported from tests. Example:

- `mainpageData.json`
- `errorMessages.json`
- `registerData.json`

Tests use these data objects directly in assertions and form filling.

### Tests

The existing tests use Playwright test syntax with:

- `test.describe`
- `test.beforeEach` to navigate to `/`
- `test.step` for logical substeps
- `expect` assertions against page object locators

Example style from `tests/login.spec.ts`:

```ts
import errorMessage from '../fixtures/errorMessages.json';
import mainpageData from '../fixtures/mainpageData.json';
import { test, expect } from '@playwright/test';
import MainPage from '../pages/mainpage';

test.describe('Login tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('User log in successful', async ({ page }) => {
    const mainPage = new MainPage(page);

    await test.step('User log in', async () => {
      await mainPage.userLogIn(mainpageData.email, mainpageData.password);
    });

    await test.step('Validate user is logged in', async () => {
      await expect(mainPage.elements.loggedInUserLink(mainpageData.email)).toBeVisible();
    });
  });
});
```

## Naming and Export Rules

- Page object files are lowercase (`mainpage.ts`, `registerpage.ts`)
- Classes are PascalCase (`MainPage`, `RegisterPage`)
- Default export the page object class
- Fixtures are imported as default JSON objects
- Use `const` for imports and `async` functions for page actions

## Recommended Agent Output Style

When agents generate code, follow these conventions:

- Use `import { Page } from '@playwright/test'` in page object files
- Use `async`/`await` consistently
- Keep locators inside an `elements` object
- Use explicit helper functions for repeated actions
- Use descriptive method names like `userLogIn`, `populateRegisterData`, `navigateToRegisterPage`
- Keep page object methods simple and focused
- Use Playwright `getByTestId`, `getByRole`, `locator()` and XPath selectors as in existing code
- Keep test files written in Playwright `test.describe` style with `test.step`

## Agent Usage Notes

- Agents should generate page object classes consistent with existing repository files
- When creating tests, use fixture JSON files for data and error messages
- Follow current file naming and export patterns
- Place new page objects in `pages/`
- Place new specs in `tests/`

## Files to Reference

- `pages/mainpage.ts`
- `pages/registerpage.ts`
- `tests/login.spec.ts`
- `fixtures/mainpageData.json`
- `fixtures/errorMessages.json`
- `README.md`

## Summary

This repository is a Playwright TypeScript automation project with a page object model. Generated code should follow the existing file and naming structure, use the same Playwright patterns, and integrate with fixture-based test data.
