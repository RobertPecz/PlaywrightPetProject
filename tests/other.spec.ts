import { generateRandomEmail } from '../support/stringOperations';
import CompareProductsPage from '../pages/compareproductspage';
import EmailAFriendPage from '../pages/emailafriendpage';
import { test, expect } from '@playwright/test';
import ProductPage from '../pages/productpage';

test.describe('Other tests', () => {
  // Fresh credentials per worker run — avoids shared account state in parallel browsers
  let userEmail: string;
  const userPassword = 'Password123';

  test.beforeEach(async ({ page }) => {
    test.setTimeout(process.env.CI ? 150000 : 90000);
    console.log(`Running ${test.info().title}`);

    userEmail = generateRandomEmail();

    await page.goto('/register');
    await page.waitForLoadState('domcontentloaded');
    await page.getByTestId('FirstName').fill('Test');
    await page.getByTestId('LastName').fill('User');
    await page.getByTestId('Email').fill(userEmail);
    await page.getByTestId('Password').fill(userPassword);
    await page.getByTestId('ConfirmPassword').fill(userPassword);
    await page.getByTestId('register-button').click();
    await page.waitForLoadState('domcontentloaded');

    // After registration: click Continue (user is logged in at this point)
    const continueBtn = page.locator("input[value='Continue']");
    await continueBtn.waitFor({ state: 'visible', timeout: 10000 });
    await continueBtn.click();
    await page.waitForLoadState('domcontentloaded');
  });

  test('User can email a friend a product (#144)', async ({ page }) => {
    const productPage = new ProductPage(page);
    let emailAFriendPage: EmailAFriendPage;
    let productName: string;
    const friendEmail = generateRandomEmail();

    // Arrange: Navigate to a product
    await test.step('Navigate to Books and open the first product', async () => {
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await expect(productPage.elements.productTitle()).toBeVisible();
      productName = (await productPage.elements.productTitle().innerText()).trim();
    });

    // Act: Click "Email a friend"
    await test.step('Click Email a friend', async () => {
      await productPage.clickEmailAFriend();
      emailAFriendPage = new EmailAFriendPage(page);
      await expect(page).toHaveURL(/productemailafriend/);
    });

    // Assert: The email a friend page references the product that was clicked from
    await test.step('Verify the email a friend page references the same product', async () => {
      await expect(emailAFriendPage.elements.productLink()).toHaveText(productName);
    });

    // Act: Fill in and submit the email a friend form
    await test.step('Fill in the email a friend form and send', async () => {
      await emailAFriendPage.sendEmail(friendEmail, userEmail, 'Check out this product!');
    });

    // Assert: Confirmation that the email was sent
    await test.step('Verify confirmation message that the email was sent', async () => {
      await expect(emailAFriendPage.elements.resultMessage()).toHaveText('Your message has been sent.');
    });
  });

  test('User can add multiple products to the compare list (#145)', async ({ page }) => {
    const productPage = new ProductPage(page);
    const compareProductsPage = new CompareProductsPage(page);
    let firstProductName: string;
    let secondProductName: string;

    // Arrange & Act: Add the first product to the compare list
    await test.step('Navigate to Books and add the first product to the compare list', async () => {
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      firstProductName = (await productPage.elements.productTitle().innerText()).trim();
      await productPage.clickAddToCompare();
    });

    // Assert: The first product is on the compare page
    await test.step('Verify the first product appears on the compare products page', async () => {
      await expect(page).toHaveURL(/compareproducts/);
      const names = await compareProductsPage.getComparedProductNames();
      expect(names).toContain(firstProductName);
    });

    // Act: Add a second, different product to the compare list
    await test.step('Navigate to Computers and add a second product to the compare list', async () => {
      await productPage.navigateToCategory('Computers');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      secondProductName = (await productPage.elements.productTitle().innerText()).trim();
      await productPage.clickAddToCompare();
    });

    // Assert: Both products are listed side by side with their prices
    await test.step('Verify both products are listed for comparison with their prices', async () => {
      await expect(page).toHaveURL(/compareproducts/);

      const names = await compareProductsPage.getComparedProductNames();
      expect(names).toContain(firstProductName);
      expect(names).toContain(secondProductName);

      const prices = await compareProductsPage.getComparedProductPrices();
      expect(prices).toHaveLength(names.length);
      for (const price of prices) {
        expect(price).toMatch(/\d+\.\d{2}/);
      }
    });
  });
});
