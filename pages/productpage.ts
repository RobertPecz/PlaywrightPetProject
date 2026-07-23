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
    subCategoryLink: () => this.page.locator('.sub-category-item h2.title a').first(),

    // Product listing - More robust selectors
    productItems: () => this.page.locator('//div[@class="product-grid"]//div[@class="item-box"]'),
    productByName: (productName: string) =>
      this.page.locator(`//h2[@class="product-title"]/a[contains(text(), "${productName}")]`),
    productLink: (index: number = 0) => {
      // Try primary selector first, with flexible xpath
      return this.page.locator('//h2[contains(@class, "product-title")]/a').nth(index);
    },

    // Product details page
    productTitle: () => this.page.locator('.product-name h1'),
    productPrice: () => this.page.locator('.actual-price').first(),
    quantityInput: () => this.page.locator("input[id*='EnteredQuantity']"),
    addToCartButton: () => this.page.locator("//input[contains(@id, 'add-to-cart-button')]"),
    availabilityLabel: () => this.page.locator('.stock .value'),

    // List view add-to-cart button (on category/listing page, scoped per item index)
    addToCartFromListViewButton: (index: number = 0) =>
      this.page.locator('input.product-box-add-to-cart-button').nth(index),

    // Success notification
    successMessage: () => this.page.locator('//p[@class="content"]'),
    closeSuccessButton: () => this.page.locator('//span[@class="close"]').first(),
  };

  async navigateToCategory(categoryName: string) {
    await this.elements.categoryLink(categoryName).click();
    await this.page.waitForLoadState('domcontentloaded');

    // If no products are listed (e.g. parent category with sub-categories), drill into the first sub-category
    const hasProducts = await this.elements
      .productLink(0)
      .isVisible({ timeout: 3000 })
      .catch(() => false);
    if (!hasProducts) {
      if (
        await this.elements
          .subCategoryLink()
          .isVisible({ timeout: 3000 })
          .catch(() => false)
      ) {
        await this.elements.subCategoryLink().click();
        await this.page.waitForLoadState('domcontentloaded');
      }
    }
  }

  async selectProductByName(productName: string) {
    await this.elements.productByName(productName).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async selectProductByIndex(index: number = 0) {
    const productLink = this.elements.productLink(index);
    // Wait for the link to be visible before clicking
    await productLink.waitFor({ state: 'visible', timeout: 10000 });
    await productLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async setQuantity(quantity: number) {
    await this.elements.quantityInput().clear();
    await this.elements.quantityInput().fill(quantity.toString());
  }

  async addProductToCart() {
    await this.elements.addToCartButton().click();
    await this.elements.successMessage().waitFor({ state: 'visible', timeout: 15000 });
  }

  async addToCartWithQuantity(quantity: number) {
    await this.setQuantity(quantity);
    await this.addProductToCart();
  }

  async addToCartFromListView(index: number = 0) {
    await this.elements.addToCartFromListViewButton(index).click();
    await this.elements.successMessage().waitFor({ state: 'visible', timeout: 15000 });
  }

  async closeSuccessNotification() {
    const closeButton = this.elements.closeSuccessButton();
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  }
}

export default ProductPage;
