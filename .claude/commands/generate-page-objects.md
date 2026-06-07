# Page Object Generator

Generate TypeScript page object models in the `pages/` directory. Pass a page name or feature to generate: `$ARGUMENTS`

## Instructions

### Step 1: Review Requirements

Gather requirements from:

- The test case data produced by `/process-test-cases` (if available in conversation)
- The `$ARGUMENTS` value (e.g. "CheckoutPage" or "checkout")
- Any GitHub issue context from `/fetch-tickets`

### Step 2: Inventory Existing Page Objects

Read the existing pages to understand conventions:

```bash
ls pages/
```

Read key existing files for patterns:

- `pages/mainpage.ts` — login, logout, navigation methods
- `pages/registerpage.ts` — form filling patterns

Extract:

- Import style (`import { Page } from '@playwright/test'`)
- Class naming: `ClassName` with `class ClassName { readonly page: Page; ... }`
- Elements object pattern: `elements = { name: () => this.page.locator(...) }`
- Method patterns: `async methodName() { ... }`
- Default export: `export default ClassName`

### Step 3: Check Demo Web Shop Reference

Read `.github/APPLICATION.md` for:

- All page URLs and element selectors
- Product categories and sample data

Read `.claude/nopcommerce-checkout.md` for OPC-specific selectors and patterns.

**Important**: APPLICATION.md selectors are derived from nopCommerce docs and may not match the live site exactly. Trust the code in `pages/` over APPLICATION.md when they conflict. Key verified selectors:

### Step 4: Plan Page Objects

List the page objects to create and show the user for confirmation:

```
Pages to create:
1. pages/checkoutpage.ts — CheckoutPage class
   Elements: billing address form, shipping method, payment method, confirm button
   Methods: fillBillingAddress(), selectShippingMethod(), proceedToNextStep(), confirmOrder()

2. pages/searchpage.ts — SearchPage class
   Elements: search input, search results, product links
   Methods: search(), getResults(), clickResult()
```

Ask: "Shall I create these page objects? Any changes to the plan?"

### Step 5: Generate Page Object Files

For each page, create a TypeScript file following this exact project pattern:

```typescript
import { Page } from '@playwright/test';

class PageNamePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  elements = {
    elementName: () => this.page.locator('selector'),
    elementWithParam: (param: string) => this.page.locator(`selector-${param}`),
  };

  async methodName() {
    await this.elements.elementName().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillForm(data: string) {
    await this.elements.inputField().fill(data);
  }
}

export default PageNamePage;
```

**Key conventions:**

- File: `pages/pagename.ts` (lowercase, no spaces)
- Class: `PageNamePage` (PascalCase + "Page")
- Elements: arrow functions returning locators
- Methods: async, use `await`
- Export: `export default ClassName`

### Step 6: Use Correct Selectors for demowebshop.tricentis.com

The app runs on nopCommerce. `playwright.config.ts` sets `testIdAttribute: 'id'`, so `getByTestId('Email')` maps to `[id="Email"]`.

Verified working selectors (trust these over APPLICATION.md):

- Login link: `getByRole('link', { name: 'Log in' })`
- Logout link: `getByRole('link', { name: 'Log out' })`
- Logged-in user link: `getByRole('link', { name: userEmail })`
- Product title on detail page: `.product-name h1`
- Product title in listing: `//h2[contains(@class, "product-title")]/a` (NOT `.product-title h2 a`)
- Add to cart: `input.button-1.add-to-cart-button`
- Quantity input: `input[id*='EnteredQuantity']` (product ID is embedded in the attribute)
- Add-to-cart success notification: `//p[@class="content"]` (NOT `.success-notification`)
- Cart quantity badge: `.cart-qty`
- Cart items: `//table[@class="cart"]//tbody//tr`
- Checkout button: `button#checkout, button.checkout-button, input[value="Checkout"]`
- Terms of Service: `#termsofservice`
- OPC billing form fields: `#BillingNewAddress_FirstName`, `#BillingNewAddress_LastName`, etc.
- OPC Continue buttons (visible only): `input[value="Continue"]:not([disabled]):visible`
- OPC Confirm button: `//input[@value="Confirm"]`
- Order confirmation heading: `getByRole('heading', { name: 'Thank you' })` (NOT `.order-completed-page`)

### Step 7: Helper Functions

If any utility functions are needed (random strings, emails), place them in `support/stringOperations.ts` — NOT in the page object itself. Import from there.

### Step 8: Validation Checklist

Before declaring done:

- [ ] All required pages created
- [ ] File names match convention (`pages/pagename.ts`)
- [ ] Class names match convention (`PageNamePage`)
- [ ] All elements have working selectors
- [ ] All methods have implementations
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] Follows project style (elements object, async methods, default export)

## Output

- List of created files with class names and method summaries
- Ready for: `/generate-specs`
