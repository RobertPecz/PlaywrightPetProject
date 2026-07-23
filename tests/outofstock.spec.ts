import { test, expect } from '@playwright/test';
import ProductPage from '../pages/productpage';

test.describe('Out of stock product tests', () => {
  test.beforeEach(() => {
    test.setTimeout(90000);
    console.log(`Running ${test.info().title}`);
  });

  test('User cannot buy a product that is out of stock (#115)', async ({ page }) => {
    const productPage = new ProductPage(page);

    // Arrange: Navigate directly to a product known to be out of stock on the demo shop
    await test.step('Navigate to an out of stock product page', async () => {
      await page.goto('/custom-t-shirt');
      await page.waitForLoadState('domcontentloaded');
      await expect(productPage.elements.productTitle()).toBeVisible();
    });

    // Assert: Verify the availability label
    await test.step('Verify the product availability shows Out of stock', async () => {
      await expect(productPage.elements.availabilityLabel()).toHaveText('Out of stock');
    });

    // Assert: Verify the user cannot proceed with the payment
    await test.step('Verify the Add to cart button does not appear', async () => {
      await expect(productPage.elements.addToCartButton()).toHaveCount(0);
    });

    await test.step('Verify the quantity input does not appear', async () => {
      await expect(productPage.elements.quantityInput()).toHaveCount(0);
    });
  });
});
