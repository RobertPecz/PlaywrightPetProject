import { Page } from '@playwright/test';

class BooksPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  elements = {
    addToCartButton: (nthElement: number) => this.page.locator(`(//input[@value='Add to cart'])[${nthElement}]`),
  };
}

export default BooksPage;
