# Test Validator

Run the Playwright test suite and fix failures until all tests pass. Optionally pass a specific spec file to test: `$ARGUMENTS`

## Instructions

### Step 1: Pre-Validation Checks

Before running:

1. Check TypeScript compiles:
   ```bash
   npx tsc --noEmit
   ```
2. Verify imports in spec files reference existing page objects:
   ```bash
   ls pages/
   ```
3. Confirm dependencies are installed:
   ```bash
   ls node_modules/.bin/playwright 2>/dev/null || npm install
   ```

### Step 2: Run Tests

If `$ARGUMENTS` specifies a file, run just that file:

```bash
npx playwright test $ARGUMENTS --reporter=list
```

Otherwise run the full suite:

```bash
npm test
```

Or with verbose output for debugging:

```bash
npx playwright test --reporter=list
```

### Step 3: Analyze Results

After the run completes:

- Count: total, passed, failed, skipped
- For each failed test: capture the error message, stack trace, and the line that failed
- Check `test-results/` for error context files if available:
  ```bash
  find test-results/ -name "error-context.md" 2>/dev/null | head -5
  ```

### Step 4: Diagnose and Fix Failures

For each failure, diagnose the root cause:

**Selector not found / Timeout:**

- The element selector is wrong or the element isn't visible yet
- Read the page object (`pages/*.ts`) and check the selector
- Fix: update the selector in the page object

**Element disabled:**

- Trying to click a disabled element
- Fix: wait for it to be enabled, or use `:not([disabled])` in the selector

**Wrong URL / Navigation failure:**

- Test navigated to wrong page
- Fix: check `baseURL` in `playwright.config.ts`, check the navigation method

**Cart/account state pollution:**

- Cart has items from a previous run
- Fix: add `clearCart()` in `beforeEach` with login→clearCart→logout pattern

**Timing / Race condition:**

- Page hasn't loaded before interaction
- Fix: add `waitFor({ state: 'visible' })` before interactions, or use `waitForLoadState('domcontentloaded')`

**nopCommerce OPC (checkout) specific issues:**
See `.claude/nopcommerce-checkout.md` for the full reference. Key points:

- **Hidden-button trap**: after each OPC step completes, its `Continue` button stays in the DOM but becomes invisible. Use `:visible` in the selector — `input[value="Continue"]:not([disabled]):visible` — so `.first()` resolves to the active step's button, not a hidden completed one
- Billing Continue saves the address to the address book. Step 2 then shows a **shipping address dropdown** (`select[name="shipping_address_id"]`) — this step is commonly missed and causes all subsequent `proceedToNextStep()` calls to go to the wrong step
- Terms of Service checkbox `#termsofservice` must be checked before clicking Checkout (already handled in `cartpage.ts`)
- "New Address" option in OPC billing dropdown has `value=""` (empty string, not "0")
- After `confirmOrder()`, use `waitForLoadState('domcontentloaded')`; success heading is `getByRole('heading', { name: 'Thank you' })`

**Parallel worker account conflicts (checkout/cart tests):**

- Three browser workers sharing the same nopCommerce account collide at the OPC step (server-side cart state is shared)
- Fix: use fresh registration per `beforeEach` with a unique timestamped email — see the pattern in `tests/buyproduct.spec.ts`

### Step 5: Apply Fixes

For each identified issue:

1. Read the relevant page object or spec file
2. Make the targeted fix (selector, wait, assertion)
3. Re-run the specific failing test to confirm fix:
   ```bash
   npx playwright test --grep "test name here" --reporter=list
   ```

Repeat until the specific test passes, then run the full suite again.

### Step 6: Generate Report

Present a summary:

```
Test Execution Report
====================
Total: 12
Passed: 12 ✓
Failed: 0
Skipped: 0

Status: ALL TESTS PASSED ✓
Ready for: /create-pr
```

If tests still fail after reasonable attempts, list the failures with details and ask the user for guidance.

### Step 7: Performance Check

- Flag any tests taking > 60 seconds
- Flag any tests that are intermittently flaky (run twice if needed)
- Ensure tests leave the environment in a clean state

## Output

- Test execution report with pass/fail counts
- List of any fixes applied
- Confirmation that all tests pass, ready for `/create-pr`
