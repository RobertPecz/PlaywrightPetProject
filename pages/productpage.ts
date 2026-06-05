import { Page } from '@playwright/test';

class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  elements = {
    // Main categories/navigation
    categoriesMenu: () => this.page.locator('//div[@class="listbox"]//a'),
    categoryLink: (categoryName: string) => this.page.locator(`//a[contains(text(), "${categoryName}")]`).first(),

    // Product listing - More robust selectors
    productItems: () => this.page.locator('//div[@class="product-grid"]//div[@class="item-box"]'),
    productByName: (productName: string) =>
      this.page.locator(`//h2[@class="product-title"]/a[contains(text(), "${productName}")]`),
    productLink: (index: number = 0) => {
      // Try primary selector first, with flexible xpath
      return this.page.locator('//h2[contains(@class, "product-title")]/a').nth(index);
    },

    // Product details page
    productTitle: () => this.page.locator('//h1[contains(@class, "product-name")]'),
    productPrice: () => this.page.locator('//span[@class="price-tag-salePrice"]'),
    quantityInput: () => this.page.getByTestId('product-qty'),
    addToCartButton: () => this.page.locator('//input[@value="Add to cart"]'),

    // Success notification
    successMessage: () => this.page.locator('//p[@class="content"]'),
    closeSuccessButton: () => this.page.locator('//span[@class="close"]').first(),
  };

  async navigateToCategory(categoryName: string) {
    await this.elements.categoryLink(categoryName).click();
    await this.page.waitForLoadState('networkidle');
    // Additional wait for product items to be visible
    await this.elements
      .productItems()
      .first()
      .waitFor({ state: 'visible', timeout: 10000 })
      .catch(() => {
        // If items don't load, continue anyway - they might load asynchronously
      });
  }

  async selectProductByName(productName: string) {
    await this.elements.productByName(productName).click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectProductByIndex(index: number = 0) {
    const productLink = this.elements.productLink(index);
    // Wait for the link to be visible before clicking
    await productLink.waitFor({ state: 'visible', timeout: 10000 });
    await productLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async setQuantity(quantity: number) {
    await this.elements.quantityInput().clear();
    await this.elements.quantityInput().fill(quantity.toString());
  }

  async addProductToCart() {
    await this.elements.addToCartButton().click();
  }

  async addToCartWithQuantity(quantity: number) {
    await this.setQuantity(quantity);
    await this.addProductToCart();
  }

  async closeSuccessNotification() {
    const closeButton = this.elements.closeSuccessButton();
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  }
}

export default ProductPage;
