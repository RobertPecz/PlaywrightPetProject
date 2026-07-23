import { Page } from '@playwright/test';

class CompareProductsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  elements = {
    productNameLinks: () => this.page.locator('.compare-products-table tr.product-name a'),
    productPrices: () => this.page.locator('.compare-products-table tr.product-price td.a-center'),
    removeButton: (index: number = 0) => this.page.locator('.compare-products-table .remove-button').nth(index),
    clearListLink: () => this.page.locator('.clear-list'),
    emptyListMessage: () => this.page.getByText('You have no items to compare.'),
  };

  async getComparedProductNames(): Promise<string[]> {
    const names = await this.elements.productNameLinks().allTextContents();
    return names.map((name) => name.trim());
  }

  async getComparedProductPrices(): Promise<string[]> {
    const prices = await this.elements.productPrices().allTextContents();
    return prices.map((price) => price.trim());
  }
}

export default CompareProductsPage;
