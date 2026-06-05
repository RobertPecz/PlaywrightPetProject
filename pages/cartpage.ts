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
    itemNameInCart: (productName: string) => this.page.locator(`//a[contains(text(), "${productName}")]`),
    itemQuantityInput: (index: number = 0) => this.page.locator('//input[@class="qty-input"]').nth(index),
    itemRemoveButton: (index: number = 0) => this.page.locator('//button[contains(text(), "Remove")]').nth(index),

    // Cart summary
    subTotal: () => this.page.locator('//tr[@class="order-subtotal"]//td[@class="order-total-value"]'),
    tax: () => this.page.locator('//tr[@class="tax-total"]//td[@class="order-total-value"]'),
    shipping: () => this.page.locator('//tr[@class="shipping-total"]//td[@class="order-total-value"]'),
    totalAmount: () => this.page.locator('//tr[@class="order-total"]//td[@class="order-total-value"]'),

    // Cart actions
    continueShopping: () => this.page.locator('//input[@value="Continue Shopping"]'),
    checkoutButton: () => this.page.locator('//input[@value="Checkout"]'),

    // Empty cart message
    emptyCartMessage: () => this.page.locator('//p[contains(text(), "Your Shopping Cart is empty")]'),
  };

  async openCart() {
    await this.elements.cartLink().click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCartItemsCount(): Promise<number> {
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
    await this.elements.checkoutButton().click();
    await this.page.waitForLoadState('networkidle');
  }

  async isCartEmpty(): Promise<boolean> {
    return await this.elements.emptyCartMessage().isVisible();
  }

  async continueShopping() {
    await this.elements.continueShopping().click();
  }
}

export default CartPage;
