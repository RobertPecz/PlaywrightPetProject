# nopCommerce OPC Checkout — Deep Reference

This document captures runtime behaviour of the One-Page Checkout on `demowebshop.tricentis.com` that is not obvious from the nopCommerce documentation.

---

## Page URL

`/onepagecheckout` — reached after clicking Checkout on the cart page.

## DOM Structure

All 6 step panels are **always present in the DOM**. Each panel has its own `Continue` / `Confirm` button. Only the active panel is visible (`display:block`); completed panels collapse (`display:none`) but their buttons remain in the DOM.

```html
<!-- After step 1 completes, this button is HIDDEN but still in DOM -->
<input value="Continue" name="save" type="button" id="billing-buttons-container" style="display:none" />

<!-- Step 2's button is the one currently VISIBLE -->
<input value="Continue" name="save" type="button" id="shipping-buttons-container" style="display:block" />
```

## proceedToNextStep() — correct implementation

```typescript
async proceedToNextStep() {
  const nextButton = this.page
    .locator('input[value="Continue"]:not([disabled]):visible, button:has-text("Continue"):visible')
    .first();
  await nextButton.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  if (await nextButton.isVisible({ timeout: 500 }).catch(() => false)) {
    await nextButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
```

The `:visible` CSS pseudo-class is evaluated at query time by Playwright's engine — it filters the matched set to only elements currently visible in the viewport. Without it, `.first()` always resolves to step 1's hidden button after step 1 completes.

---

## Step-by-step Sequence

### Step 1 — Billing Address

The billing address form is shown directly for new accounts (no saved addresses).
For accounts with saved addresses, a `select[name="billing_address_id"]` dropdown appears first — select the empty-string value (`""`) to reveal the new-address form.

```typescript
const sel = this.elements.billingAddressSelect();
if (await sel.isVisible({ timeout: 3000 }).catch(() => false)) {
  await sel.selectOption({ value: '' }).catch(() => sel.selectOption({ index: 0 }));
  await this.page.waitForTimeout(1500); // form fields animate in
}
```

After filling, call `proceedToNextStep()`.

**Side effect**: the address just entered is automatically saved to the user's address book. This matters for step 2.

### Step 2 — Shipping Address (commonly missed)

After billing Continue, the shipping address panel becomes active. It shows a `select[name="shipping_address_id"]` dropdown pre-populated with the billing address just saved.

The dropdown option text includes the full name (e.g. `"John Doe, 123 Main Street, ..."`). Use `selectShippingAddressByName('John Doe')` to pick it by partial match, then `proceedToNextStep()`.

If this step is skipped, `proceedToNextStep()` will click the shipping address Continue before the user has selected a valid address, and nopCommerce may fail silently or navigate to an error state.

### Step 3 — Shipping Method

Radio-button list. "Ground" and "Next Day Air" are always available.

```typescript
await checkoutPage.selectShippingMethod('Ground');
await checkoutPage.proceedToNextStep();
```

### Step 4 — Payment Method

Radio-button list. Available methods depend on order total. "Credit Card" and "Check / Money Order" are typical.

```typescript
await checkoutPage.selectPaymentMethod('Credit Card');
await checkoutPage.proceedToNextStep();
```

### Step 5 — Payment Info

For "Check / Money Order" this step is empty (just a Continue button). For "Credit Card" it shows card fields. Call `proceedToNextStep()` — it is a safe no-op if the step auto-advances.

### Step 6 — Confirm Order

The order summary panel appears with a single `input[value="Confirm"]` button.

```typescript
async confirmOrder() {
  await this.elements.confirmOrderButton().click();
  await this.page.waitForLoadState('load', { timeout: 30000 });
  // Use 'load', not 'networkidle' — networkidle can fire before the page delivers
}
```

---

## Order Confirmation Page

After `confirmOrder()` the browser navigates to `/checkout/completed/<orderId>`.

```html
<h1 class="page-title">Thank you</h1>
<div class="section">
  <div class="title"><strong>Your order has been successfully processed!</strong></div>
  <ul>
    <li>Order number: 12345</li>
    ...
  </ul>
</div>
```

Correct locators:

```typescript
successMessage: () => this.page.getByRole('heading', { name: 'Thank you' }),
orderNumberText: () => this.page.getByText(/Order number:/),
```

For `isOrderConfirmed()`, use `waitFor({ state: 'visible' })` rather than `isVisible()` — the page may not have delivered yet when the assertion runs:

```typescript
async isOrderConfirmed(): Promise<boolean> {
  return await this.elements.successMessage()
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);
}
```

---

## Parallel Workers & Account Isolation

nopCommerce stores cart and checkout state **server-side per user session**. When three Playwright workers run concurrently and all log in as the same account, their cart and OPC state interfere with each other.

**Solution**: register a unique account in `beforeEach`:

```typescript
userEmail = `buyer_${Date.now()}_${Math.floor(Math.random() * 9999)}@test.com`;
// ... fill registration form, click Continue, log out ...
```

The Excel test case notes confirm this is the intended approach: _"Use new registration so the cache will not make the testcase depend on each other."_

---

## Quick Selector Reference

| Element                          | Locator                                           |
| -------------------------------- | ------------------------------------------------- |
| Billing address dropdown         | `select[name="billing_address_id"]`               |
| Billing first name               | `#BillingNewAddress_FirstName`                    |
| Billing country                  | `#BillingNewAddress_CountryId`                    |
| Billing state                    | `#BillingNewAddress_StateProvinceId`              |
| Shipping address dropdown        | `select[name="shipping_address_id"]`              |
| Any visible Continue button      | `input[value="Continue"]:not([disabled]):visible` |
| Confirm order button             | `input[value="Confirm"]`                          |
| Success heading                  | `getByRole('heading', { name: 'Thank you' })`     |
| Order number text                | `getByText(/Order number:/)`                      |
| Terms of Service checkbox (cart) | `#termsofservice`                                 |
