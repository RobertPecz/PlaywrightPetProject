import { Page } from '@playwright/test';

class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  elements = {
    // Cart navigation
    cartLink: () => this.page.locator('//a[contains(@href, "cart")]').first(),

    // Cart items
    cartItems: () => this.page.locator('//table[@class="cart"]//tbody//tr'),
    cartItemCount: () => this.page.locator('//span[@class="cart-qty"]'),

    // Item details in cart
    itemNameInCart: (productName: string) =>
      this.page.locator(`//table[@class="cart"]//a[contains(text(), "${productName}")]`),
    itemQuantityInput: (index: number = 0) => this.page.locator('//input[@class="qty-input"]').nth(index),
    itemRemoveButton: (index: number = 0) => this.page.locator('//button[contains(text(), "Remove")]').nth(index),

    // Cart summary
    subTotal: () => this.page.locator('.totals').first(),
    tax: () => this.page.locator('.cart-total-right').nth(2),
    shipping: () => this.page.locator('.cart-total-right').nth(1),
    totalAmount: () => this.page.locator('.order-total'),

    // Cart actions
    continueShopping: () => this.page.locator('//input[@value="Continue Shopping"]'),
    checkoutButton: () => this.page.locator('button#checkout, button.checkout-button, input[value="Checkout"]'),
    removeItemCheckboxes: () => this.page.locator('input[name="removefromcart"]'),
    updateCartButton: () => this.page.locator('input[name="updatecart"], button[name="updatecart"]'),

    // Empty cart message
    emptyCartMessage: () => this.page.getByText('Your Shopping Cart is empty!'),

    // tos checkbox
    tosCheckbox: () => this.page.locator('#termsofservice'),
  };

  async openCart() {
    await this.elements.cartLink().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getCartItemsCount(): Promise<number> {
    await this.elements.cartItems().first().waitFor({ state: 'visible', timeout: 30000 });
    const items = await this.elements.cartItems().count();
    return items;
  }

  async updateItemQuantity(index: number, quantity: number) {
    const quantityInput = this.elements.itemQuantityInput(index);
    await quantityInput.clear();
    await quantityInput.fill(quantity.toString());
  }

  async removeItemFromCart(index: number) {
    await this.elements.itemRemoveButton(index).click();
  }

  async getSubTotal(): Promise<string> {
    return await this.elements.subTotal().innerText();
  }

  async getTotalAmount(): Promise<string> {
    return await this.elements.totalAmount().innerText();
  }

  async proceedToCheckout() {
    // Accept Terms of Service if required before checkout
    await this.elements.tosCheckbox().check();
    await this.elements.checkoutButton().click();
    await this.page.waitForURL(/checkout|onepagecheckout/, { timeout: 10000 }).catch(() => {});
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isCartEmpty(): Promise<boolean> {
    return await this.elements
      .emptyCartMessage()
      .waitFor({ state: 'visible', timeout: 10000 })
      .then(() => true)
      .catch(() => false);
  }

  async clearCart() {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('domcontentloaded');
    const checkboxes = this.elements.removeItemCheckboxes();
    const count = await checkboxes.count();
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        await checkboxes.nth(i).check();
      }
      await this.elements.updateCartButton().click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async removeItemByIndex(index: number) {
    await this.elements.removeItemCheckboxes().nth(index).check();
    await this.elements.updateCartButton().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async continueShopping() {
    await this.elements.continueShopping().click();
  }
}

export default CartPage;
