import { Page } from '@playwright/test';

 
class SharedElements {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  elements = {
    h1Header: (headerName: string) => this.page.locator(`//h1[text()='${headerName}']`),
    h2Header: (headerName: string) => this.page.locator(`//h2[text()='${headerName}']`),
    strongText: (text: string) => this.page.locator(`//strong[text()='${text}']`),
    liText: (text: string) => this.page.locator(`//li[text()='${text}']`),
  };
}

export default SharedElements;
