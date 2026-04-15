import { Page } from '@playwright/test';

 
class ShoppingCartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  elements = {
    countryDropdown: () => this.page.locator("//select[@id='CountryId']"),
    stateDropdown: () => this.page.locator("//select[@id='StateProvinceId']"),
    tosCheckbox: () => this.page.locator("//input[@id='termsofservice']"),
  };
}

export default ShoppingCartPage;
