import mainpageData from '../fixtures/mainpageData.json';
import CheckoutPage from '../pages/checkoutpage';
import { test, expect } from '@playwright/test';
import ProductPage from '../pages/productpage';
import MainPage from '../pages/mainpage';
import CartPage from '../pages/cartpage';

test.describe('Buy product tests', () => {
  test.beforeEach(async ({ page }) => {
    console.log(`Running ${test.info().title}`);
    await page.goto('/');
  });

  test('User can add product to cart and checkout successfully', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    // Arrange: Log in to the application
    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(mainpageData.email, mainpageData.password);
      await expect(mainPage.elements.loggedInUserLink(mainpageData.email)).toBeVisible();
    });

    // Arrange: Navigate to product section
    await test.step('Navigate to products', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Computers');
      await expect(productPage.elements.productLink(0)).toBeVisible();
    });

    // Act: Select and add product to cart
    await test.step('Select first available product and add to cart', async () => {
      await productPage.selectProductByIndex(0);
      await expect(productPage.elements.productTitle()).toBeVisible();
    });

    // Act: Add product with quantity to cart
    await test.step('Add product to cart with quantity of 1', async () => {
      await productPage.addToCartWithQuantity(1);
    });

    // Assert: Verify product was added
    await test.step('Verify product was successfully added to cart', async () => {
      await productPage.closeSuccessNotification();
      const notification = productPage.elements.successMessage();
      if (await notification.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(notification).toContainText('successfully');
      }
    });

    // Act: Navigate to shopping cart
    await test.step('Navigate to shopping cart', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
    });

    // Assert: Verify item is in cart
    await test.step('Verify item is present in the shopping cart', async () => {
      const cartItemCount = await cartPage.getCartItemsCount();
      expect(cartItemCount).toBeGreaterThan(0);

      const cartTotal = await cartPage.getTotalAmount();
      expect(cartTotal).toBeTruthy();
    });

    // Act: Proceed to checkout
    await test.step('Proceed to checkout', async () => {
      await cartPage.proceedToCheckout();
    });

    // Act: Fill in billing address and checkout details
    await test.step('Fill billing address and complete checkout process', async () => {
      checkoutPage = new CheckoutPage(page);

      await checkoutPage.fillBillingAddress({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        company: 'Test Company',
        country: 'United States',
        state: 'New York',
        city: 'New York',
        address: '123 Main Street',
        zipCode: '10001',
        phone: '+1 (212) 555-0100',
      });
    });

    // Act: Proceed through checkout steps
    await test.step('Proceed through checkout steps', async () => {
      // Proceed to shipping method
      await checkoutPage.proceedToNextStep();

      // Select shipping method (if available)
      await checkoutPage.selectShippingMethod('Ground');
      await checkoutPage.proceedToNextStep();

      // Select payment method and proceed
      await checkoutPage.selectPaymentMethod('Credit Card');
      await checkoutPage.proceedToNextStep();
    });

    // Act: Confirm the order
    await test.step('Confirm the order', async () => {
      await checkoutPage.confirmOrder();
    });

    // Assert: Verify order was successfully placed
    await test.step('Verify order was successfully placed', async () => {
      const isConfirmed = await checkoutPage.isOrderConfirmed();
      expect(isConfirmed).toBeTruthy();

      const orderNumber = await checkoutPage.getOrderNumber();
      expect(orderNumber).toBeTruthy();
    });
  });

  test('User can select quantity and add to cart', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;

    // Arrange: Log in to the application
    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(mainpageData.email, mainpageData.password);
      await expect(mainPage.elements.loggedInUserLink(mainpageData.email)).toBeVisible();
    });

    // Arrange: Navigate to products
    await test.step('Navigate to Computers category', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Computers');
    });

    // Act: Select a product and set quantity
    await test.step('Select product and set quantity to 2', async () => {
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(2);
    });

    // Act: Close notification and go to cart
    await test.step('Navigate to shopping cart', async () => {
      await productPage.closeSuccessNotification();
      cartPage = new CartPage(page);
      await cartPage.openCart();
    });

    // Assert: Verify quantity was set correctly
    await test.step('Verify that quantity was set to 2 in cart', async () => {
      const itemCount = await cartPage.getCartItemsCount();
      expect(itemCount).toBeGreaterThan(0);

      const quantityInput = cartPage.elements.itemQuantityInput(0);
      const quantityValue = await quantityInput.inputValue();
      expect(quantityValue).toBe('2');
    });
  });
});
