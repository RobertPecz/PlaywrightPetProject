# PlaywrightPetProject — Claude Code Reference

## What This Project Is

Playwright E2E test suite for the **Tricentis Demo Web Shop** (`https://demowebshop.tricentis.com/`), a full nopCommerce instance used purely for automation practice.

- TypeScript + Playwright Test
- Page Object Model (all selectors live inside `elements = {}` on each page class)
- 3 browsers in parallel: Chromium, Firefox, WebKit
- `playwright.config.ts` sets `baseURL` and `testIdAttribute: 'id'` — so `getByTestId('Email')` resolves to `[id="Email"]`

---

## Repository & Tooling

- **Owner/repo**: `RobertPecz/PlaywrightPetProject`, **main branch**: `master`
- **Branch naming convention**: `<issue-number>-<kebab-case-title>` (e.g. `88-buy-one-product-and-checkout`)
  — the slash commands say `add_tests_<id>`; that is outdated, use the pattern above
- **GitHub PAT**: stored in `pat.txt` — **has `repo` scope (full read/write), never commit this file**
  - Can push branches and create PRs directly via the REST API (`git push` with the PAT embedded in the HTTPS URL, then `POST /repos/.../pulls`) — no manual user action needed
  - Verify scopes anytime with: `curl -sI -H "Authorization: token $(cat pat.txt)" https://api.github.com/repos/RobertPecz/PlaywrightPetProject | grep -i x-oauth-scopes`

---

## Project Structure

```
pages/         Page Object classes (one file per page)
tests/         Playwright spec files
fixtures/      JSON test data (mainpageData.json, errorMessages.json, …)
support/       Utilities: stringOperations.ts, apiHandler.ts
testcases/     Excel test cases (automation_practice_testcases.xlsx)
.claude/commands/  Slash commands for the orchestrator workflow
```

---

## Coding Conventions

- Page objects: `class FooPage { elements = { ... }; async doThing() { ... } }`
- Tests: AAA structure, each step wrapped in `await test.step('description', async () => { ... })`
- Imports: page objects from `'../pages/foopage'` (lowercase filename)
- `beforeEach` sets `test.setTimeout(90000)` and prints `console.log(test.info().title)`
- No comments unless the WHY is non-obvious

---

## Test Account & Parallelism

**Persistent account** (login/register tests): `rob.pecz@gmail.com` / `123456`
stored in `fixtures/mainpageData.json`

**For any checkout/cart test** — use **fresh registration per test run**:

- nopCommerce stores cart and checkout state server-side per user account
- Three parallel browser workers sharing one account collide at the OPC step, causing random failures
- Pattern: register `buyer_${Date.now()}_${Math.floor(Math.random() * 9999)}@test.com` in `beforeEach`
- This matches the Excel spec note: _"Use new registration so the cache will not make tests depend on each other"_

---

## nopCommerce OPC (One-Page Checkout) — Critical

The checkout page (`/onepagecheckout`) is a 6-step accordion. All step panels and their buttons exist in the DOM simultaneously; only the active step is visible.

### The hidden-button trap

After a step completes, its `Continue` button stays in the DOM but becomes `display:none`.

```typescript
// WRONG — .first() picks the hidden completed-step button, skipping all subsequent steps
this.page.locator('input[value="Continue"]').first();

// CORRECT — :visible filters at evaluation time, .first() always gets the active button
this.page.locator('input[value="Continue"]:not([disabled]):visible').first();
```

### The 6 steps in order

| #   | Step             | What to do                                                                                 |
| --- | ---------------- | ------------------------------------------------------------------------------------------ |
| 1   | Billing Address  | `fillBillingAddress({...})` then `proceedToNextStep()`                                     |
| 2   | Shipping Address | `selectShippingAddressByName('John Doe')` then `proceedToNextStep()` — **commonly missed** |
| 3   | Shipping Method  | `selectShippingMethod('Ground')` then `proceedToNextStep()`                                |
| 4   | Payment Method   | `selectPaymentMethod('Credit Card')` then `proceedToNextStep()`                            |
| 5   | Payment Info     | `proceedToNextStep()` (safe no-op if the step auto-advances)                               |
| 6   | Confirm          | `confirmOrder()`                                                                           |

**Step 2 is the most commonly missed**: after billing Continue, nopCommerce shows a shipping address dropdown (not a new address form) pre-populated with addresses from the address book. The billing address just filled gets saved there automatically as "John Doe".

### Order confirmation page

```typescript
// WRONG — these classes don't exist in this nopCommerce version
this.page.locator('.order-completed-page');

// CORRECT — the page renders <h1>Thank you</h1>
this.page.getByRole('heading', { name: 'Thank you' });
```

After `confirmOrder()`, use `waitForLoadState('load')` not `'networkidle'` — `networkidle` can fire during a brief network gap before the page delivers, timing out the assertion.

### Cart → Checkout prerequisite

The cart page shows a Terms of Service checkbox (`#termsofservice`) that must be checked before the Checkout button becomes functional. Already handled in `cartpage.ts proceedToCheckout()`.

---

## Selector Reality vs APPLICATION.md

`APPLICATION.md` was written from nopCommerce documentation and may not match the live demo site. **Trust the code in `pages/` over `APPLICATION.md` when they conflict.**

| Element             | APPLICATION.md (may be wrong)     | Actual selector                               |
| ------------------- | --------------------------------- | --------------------------------------------- |
| Add-to-cart success | `.success-notification`           | `//p[@class="content"]`                       |
| Product title link  | `.product-title h2 a`             | `//h2[contains(@class, "product-title")]/a`   |
| Quantity input      | `#addtocart_[id]_EnteredQuantity` | `input[id*='EnteredQuantity']`                |
| Order confirmation  | `.order-completed-page`           | `getByRole('heading', { name: 'Thank you' })` |
| Order number        | —                                 | `getByText(/Order number:/)`                  |

---

## WebKit Timing

WebKit is stricter about navigation timing than Chromium/Firefox. After any click that triggers a page navigation (login, form submit), add:

```typescript
await this.page.waitForLoadState('domcontentloaded');
```

before any subsequent `goto()` or assertion. Already applied in `mainpage.ts userLogIn()`.

---

## Slash Command Workflow

The `.claude/commands/` folder contains an orchestrator workflow invoked with `/orchestrate #<issue-number>`:

1. `/fetch-tickets` — reads `pat.txt`, fetches GitHub issues via API
2. `/process-test-cases` — parses `testcases/automation_practice_testcases.xlsx`
3. `/generate-page-objects` — creates/updates `pages/*.ts`
4. `/generate-specs` — creates `tests/*.spec.ts`
5. `/validate-tests` — runs `npx playwright test`, iterates until passing
6. `/create-pr` — commits, pushes, and creates the PR automatically (PAT has `repo` scope)

---

## Running Tests

```bash
npm test                                         # full suite (all 3 browsers)
npx playwright test tests/buyproduct.spec.ts     # single spec
npx playwright test --grep "checkout"            # by test name
npx playwright test --reporter=list              # verbose output
```
