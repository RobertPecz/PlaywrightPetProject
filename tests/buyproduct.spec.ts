import { generateRandomEmail } from '../support/stringOperations';
import CheckoutPage from '../pages/checkoutpage';
import { test, expect } from '@playwright/test';
import ProductPage from '../pages/productpage';
import MainPage from '../pages/mainpage';
import CartPage from '../pages/cartpage';

test.describe('Buy product tests', () => {
  test.describe.configure({ mode: 'serial' });

  // Fresh credentials per worker run — avoids shared cart/checkout conflicts in parallel browsers
  let userEmail: string;
  const userPassword = 'Password123';

  test.beforeEach(async ({ page }) => {
    // Per the test case spec: use fresh registration so tests don't share state
    test.setTimeout(process.env.CI ? 150000 : 90000);
    console.log(`Running ${test.info().title}`);

    userEmail = generateRandomEmail();

    await page.goto('/register');
    await page.waitForLoadState('domcontentloaded');
    await page.getByTestId('FirstName').fill('Test');
    await page.getByTestId('LastName').fill('Buyer');
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

    // Log out so each test starts from a clean logged-out state
    const mainPage = new MainPage(page);
    await mainPage.userLogOut();
    await page.goto('/');
  });

  test('User can add product to cart and checkout successfully', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    // Arrange: Log in to the application
    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
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
      const notification = productPage.elements.successMessage();
      await expect(notification).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
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
        email: userEmail,
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
      // Continue past billing address (opens shipping address step)
      await checkoutPage.proceedToNextStep();

      // Select the valid shipping address (billing address was just saved to address book)
      await checkoutPage.selectShippingAddressByName('John Doe');
      await checkoutPage.proceedToNextStep();

      // Select shipping method and continue
      await checkoutPage.selectShippingMethod('Ground');
      await checkoutPage.proceedToNextStep();

      // Select payment method and continue
      await checkoutPage.selectPaymentMethod('Credit Card');
      await checkoutPage.proceedToNextStep();

      // Continue past payment info step (safe no-op if not present)
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
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
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

  test('User can buy multiple different products and checkout successfully (#90)', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Books and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify first product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to Computers and add second different product to cart', async () => {
      await productPage.navigateToCategory('Computers');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify second product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to shopping cart and verify both products are present', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      const cartItemCount = await cartPage.getCartItemsCount();
      expect(cartItemCount).toBeGreaterThanOrEqual(2);
      const cartTotal = await cartPage.getTotalAmount();
      expect(cartTotal).toBeTruthy();
    });

    await test.step('Proceed to checkout', async () => {
      await cartPage.proceedToCheckout();
    });

    await test.step('Fill billing address', async () => {
      checkoutPage = new CheckoutPage(page);
      await checkoutPage.fillBillingAddress({
        firstName: 'John',
        lastName: 'Doe',
        email: userEmail,
        company: 'Test Company',
        country: 'United States',
        state: 'New York',
        city: 'New York',
        address: '123 Main Street',
        zipCode: '10001',
        phone: '+1 (212) 555-0100',
      });
    });

    await test.step('Proceed through all checkout steps', async () => {
      await checkoutPage.proceedToNextStep();
      await checkoutPage.selectShippingAddressByName('John Doe');
      await checkoutPage.proceedToNextStep();
      await checkoutPage.selectShippingMethod('Ground');
      await checkoutPage.proceedToNextStep();
      await checkoutPage.selectPaymentMethod('Credit Card');
      await checkoutPage.proceedToNextStep();
      await checkoutPage.proceedToNextStep();
    });

    await test.step('Confirm the order', async () => {
      await checkoutPage.confirmOrder();
    });

    await test.step('Verify order was successfully placed', async () => {
      const isConfirmed = await checkoutPage.isOrderConfirmed();
      expect(isConfirmed).toBeTruthy();
      const orderNumber = await checkoutPage.getOrderNumber();
      expect(orderNumber).toBeTruthy();
    });
  });

  test('User can add product to cart and remove it, cart should be empty (#91)', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;

    // Arrange: Log in to the application
    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    // Arrange: Navigate to product category and add a product to cart
    await test.step('Navigate to Computers category and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Computers');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    // Assert: Verify product was added
    await test.step('Verify product was successfully added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    // Act: Navigate to cart and verify product is present
    await test.step('Navigate to shopping cart and verify product is present', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      const itemCount = await cartPage.getCartItemsCount();
      expect(itemCount).toBeGreaterThan(0);
    });

    // Act: Remove the product from cart
    await test.step('Remove the product from cart', async () => {
      await cartPage.removeItemByIndex(0);
    });

    // Assert: Verify cart is empty
    await test.step('Verify the shopping cart is empty', async () => {
      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBeTruthy();
    });
  });

  test('User can add one product to cart and increase quantity in cart view (#93)', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Computers and add first product to cart with quantity 1', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Computers');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify product was successfully added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and verify initial quantity is 1', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      const quantityInput = cartPage.elements.itemQuantityInput(0);
      expect(await quantityInput.inputValue()).toBe('1');
    });

    await test.step('Update quantity to 3 in the cart view', async () => {
      await cartPage.updateQuantityInCartView(0, 3);
    });

    await test.step('Verify cart shows updated quantity of 3', async () => {
      const quantityInput = cartPage.elements.itemQuantityInput(0);
      expect(await quantityInput.inputValue()).toBe('3');
    });
  });

  test('User cannot set minus number as quantity in cart view (#94)', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Computers and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Computers');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify product was successfully added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and verify initial quantity is 1', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      expect(await cartPage.elements.itemQuantityInput(0).inputValue()).toBe('1');
    });

    await test.step('Try to update quantity to minus number (-1) in cart view', async () => {
      await cartPage.updateQuantityInCartView(0, -1);
    });

    await test.step('Verify user cannot buy product with minus quantity', async () => {
      const cartIsEmpty = await cartPage.isCartEmpty();
      if (!cartIsEmpty) {
        const qty = parseInt(await cartPage.elements.itemQuantityInput(0).inputValue());
        expect(qty).toBeGreaterThanOrEqual(1);
      }
    });
  });

  test('User cannot set zero as quantity in cart view (#94)', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Computers and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Computers');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify product was successfully added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and verify initial quantity is 1', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      expect(await cartPage.elements.itemQuantityInput(0).inputValue()).toBe('1');
    });

    await test.step('Try to update quantity to zero in cart view', async () => {
      await cartPage.updateQuantityInCartView(0, 0);
    });

    await test.step('Verify user cannot buy product with zero quantity', async () => {
      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBeTruthy();
    });
  });

  test('User can buy product without logging in (guest checkout) (#96)', async ({ page }) => {
    const guestEmail = generateRandomEmail();
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    await test.step('Navigate to Books category as guest (not logged in)', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
    });

    await test.step('Select first product and add to cart', async () => {
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to shopping cart and verify item is present', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
    });

    await test.step('Proceed to checkout and select guest checkout option', async () => {
      await cartPage.proceedToCheckout();
      checkoutPage = new CheckoutPage(page);
      await checkoutPage.checkoutAsGuest();
    });

    await test.step('Fill billing address as guest', async () => {
      await checkoutPage.fillBillingAddress({
        firstName: 'Guest',
        lastName: 'User',
        email: guestEmail,
        country: 'United States',
        city: 'New York',
        address: '123 Main Street',
        zipCode: '10001',
        phone: '+1 (212) 555-0100',
      });
    });

    await test.step('Proceed through all checkout steps', async () => {
      // Step 1 billing → Step 2 shipping address (guest still gets this step)
      await checkoutPage.proceedToNextStep();
      // Step 2 shipping address → Step 3 shipping method
      await checkoutPage.proceedToNextStep();
      await checkoutPage.selectShippingMethod('Ground');
      // Step 3 → Step 4 payment method
      await checkoutPage.proceedToNextStep();
      await checkoutPage.selectPaymentMethod('Credit Card');
      // Step 4 → Step 5 payment info
      await checkoutPage.proceedToNextStep();
      // Step 5 → Step 6 confirm
      await checkoutPage.proceedToNextStep();
    });

    await test.step('Confirm the order', async () => {
      await checkoutPage.confirmOrder();
    });

    await test.step('Verify order was successfully placed', async () => {
      const isConfirmed = await checkoutPage.isOrderConfirmed();
      expect(isConfirmed).toBeTruthy();
      const orderNumber = await checkoutPage.getOrderNumber();
      expect(orderNumber).toBeTruthy();
    });
  });

  test('User can add product to cart from list view (#97)', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Books category', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.addToCartFromListViewButton(0)).toBeVisible();
    });

    await test.step('Add first product to cart directly from list view without opening product page', async () => {
      await productPage.addToCartFromListView(0);
    });

    await test.step('Verify product was successfully added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and verify product is present', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      const itemCount = await cartPage.getCartItemsCount();
      expect(itemCount).toBeGreaterThan(0);
    });
  });

  test('User can add product to cart from details view (#98)', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Books category', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
    });

    await test.step('Open product detail page by clicking the first product', async () => {
      await productPage.selectProductByIndex(0);
      await expect(productPage.elements.productTitle()).toBeVisible();
    });

    await test.step('Add product to cart from the product detail page', async () => {
      await productPage.addProductToCart();
    });

    await test.step('Verify product was successfully added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and verify product is present', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      const itemCount = await cartPage.getCartItemsCount();
      expect(itemCount).toBeGreaterThan(0);
    });
  });

  test('User can proceed through checkout without explicitly selecting shipping address when no default address exists (#99)', async ({
    page,
  }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Books and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and proceed to checkout', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      await cartPage.proceedToCheckout();
    });

    await test.step('Verify billing address form is visible for new user and fill billing address', async () => {
      checkoutPage = new CheckoutPage(page);
      await expect(checkoutPage.elements.billingFirstNameInput()).toBeVisible();
      await checkoutPage.fillBillingAddress({
        firstName: 'John',
        lastName: 'Doe',
        email: userEmail,
        country: 'United States',
        city: 'New York',
        address: '123 Main Street',
        zipCode: '10001',
        phone: '+1 (212) 555-0100',
      });
    });

    await test.step('Proceed through checkout without explicitly selecting shipping address', async () => {
      // Continue past billing (saves address, opens shipping address step)
      await checkoutPage.proceedToNextStep();
      // Skip explicit shipping address selection — billing address is auto-selected as the only option
      await checkoutPage.proceedToNextStep();
      await checkoutPage.selectShippingMethod('Ground');
      await checkoutPage.proceedToNextStep();
      await checkoutPage.selectPaymentMethod('Credit Card');
      await checkoutPage.proceedToNextStep();
      await checkoutPage.proceedToNextStep();
    });

    await test.step('Confirm the order', async () => {
      await checkoutPage.confirmOrder();
    });

    await test.step('Verify order was successfully placed', async () => {
      const isConfirmed = await checkoutPage.isOrderConfirmed();
      expect(isConfirmed).toBeTruthy();
      const orderNumber = await checkoutPage.getOrderNumber();
      expect(orderNumber).toBeTruthy();
    });
  });

  test('User can proceed through checkout with existing default shipping address (#100)', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Add a default address to the account before checking out', async () => {
      checkoutPage = new CheckoutPage(page);
      await checkoutPage.addDefaultAddressToAccount({
        firstName: 'John',
        lastName: 'Doe',
        email: userEmail,
        country: 'United States',
        state: 'New York',
        city: 'New York',
        address: '123 Main Street',
        zipCode: '10001',
        phone: '+1 (212) 555-0100',
      });
    });

    await test.step('Navigate to Books and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and proceed to checkout', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      await cartPage.proceedToCheckout();
    });

    await test.step('Verify billing step shows existing address pre-selected in dropdown', async () => {
      await expect(checkoutPage.elements.billingAddressSelect()).toBeVisible();
    });

    await test.step('Proceed through checkout without explicitly selecting shipping address', async () => {
      // Step 1: billing — existing address pre-selected in dropdown, just proceed
      await checkoutPage.proceedToNextStep();
      // Step 2: shipping — default address is auto-selected, proceed without explicit selection
      await checkoutPage.proceedToNextStep();
      await checkoutPage.selectShippingMethod('Ground');
      await checkoutPage.proceedToNextStep();
      await checkoutPage.selectPaymentMethod('Credit Card');
      await checkoutPage.proceedToNextStep();
      // Step 5: payment info — continue to confirm step
      await checkoutPage.proceedToNextStep();
    });

    await test.step('Confirm the order', async () => {
      await checkoutPage.confirmOrder();
    });

    await test.step('Verify order was successfully placed', async () => {
      const isConfirmed = await checkoutPage.isOrderConfirmed();
      expect(isConfirmed).toBeTruthy();
      const orderNumber = await checkoutPage.getOrderNumber();
      expect(orderNumber).toBeTruthy();
    });
  });

  test('User can proceed through checkout with multiple saved addresses and first address is auto-selected (#101)', async ({
    page,
  }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Add first address (John Doe) to account address book', async () => {
      checkoutPage = new CheckoutPage(page);
      await checkoutPage.addDefaultAddressToAccount({
        firstName: 'John',
        lastName: 'Doe',
        email: userEmail,
        country: 'United States',
        state: 'New York',
        city: 'New York',
        address: '123 Main Street',
        zipCode: '10001',
        phone: '+1 (212) 555-0100',
      });
    });

    await test.step('Add second address (Jane Smith) to account address book', async () => {
      await checkoutPage.addDefaultAddressToAccount({
        firstName: 'Jane',
        lastName: 'Smith',
        email: userEmail,
        country: 'United States',
        state: 'California',
        city: 'Los Angeles',
        address: '456 Oak Avenue',
        zipCode: '90001',
        phone: '+1 (323) 555-0200',
      });
    });

    await test.step('Navigate to Books and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and proceed to checkout', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      await cartPage.proceedToCheckout();
    });

    await test.step('Verify billing step shows existing address pre-selected in dropdown', async () => {
      await expect(checkoutPage.elements.billingAddressSelect()).toBeVisible();
    });

    await test.step('Proceed to shipping step without changing billing address', async () => {
      await checkoutPage.proceedToNextStep();
    });

    await test.step('Verify the first address in the dropdown is auto-selected in shipping step', async () => {
      const shippingSelect = checkoutPage.elements.shippingAddressSelect();
      await expect(shippingSelect).toBeVisible();
      const firstOptionText = await shippingSelect.locator('option').first().innerText();
      const selectedOptionText = await shippingSelect.locator('option:checked').innerText();
      expect(selectedOptionText).toBe(firstOptionText);
    });

    await test.step('Proceed through remaining checkout steps without selecting a shipping address', async () => {
      await checkoutPage.proceedToNextStep();
      await checkoutPage.selectShippingMethod('Ground');
      await checkoutPage.proceedToNextStep();
      await checkoutPage.selectPaymentMethod('Credit Card');
      await checkoutPage.proceedToNextStep();
      await checkoutPage.proceedToNextStep();
    });

    await test.step('Confirm the order', async () => {
      await checkoutPage.confirmOrder();
    });

    await test.step('Verify order was successfully placed', async () => {
      const isConfirmed = await checkoutPage.isOrderConfirmed();
      expect(isConfirmed).toBeTruthy();
      const orderNumber = await checkoutPage.getOrderNumber();
      expect(orderNumber).toBeTruthy();
    });
  });

  test('User can see the provided billing address on the shipping address page (#112)', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Books and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and proceed to checkout', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      await cartPage.proceedToCheckout();
    });

    await test.step('Fill billing address with a distinct, identifiable address', async () => {
      checkoutPage = new CheckoutPage(page);
      await expect(checkoutPage.elements.billingFirstNameInput()).toBeVisible();
      await checkoutPage.fillBillingAddress({
        firstName: 'Jane',
        lastName: 'Smith',
        email: userEmail,
        country: 'United States',
        city: 'Boston',
        address: '456 Oak Avenue',
        zipCode: '02108',
        phone: '+1 (617) 555-0199',
      });
    });

    await test.step('Proceed to shipping step', async () => {
      await checkoutPage.proceedToNextStep();
    });

    await test.step('Verify the provided billing address is visible on the shipping address page', async () => {
      const shippingOption = checkoutPage.elements.shippingAddressSelect().locator('option', { hasText: 'Jane Smith' });
      await expect(shippingOption).toContainText('456 Oak Avenue');
      await expect(shippingOption).toContainText('Boston');
      await expect(shippingOption).toContainText('02108');
    });

    await test.step('Proceed through remaining checkout steps', async () => {
      await checkoutPage.proceedToNextStep();
      await checkoutPage.selectShippingMethod('Ground');
      await checkoutPage.proceedToNextStep();
      await checkoutPage.selectPaymentMethod('Credit Card');
      await checkoutPage.proceedToNextStep();
      await checkoutPage.proceedToNextStep();
    });

    await test.step('Confirm the order', async () => {
      await checkoutPage.confirmOrder();
    });

    await test.step('Verify order was successfully placed', async () => {
      const isConfirmed = await checkoutPage.isOrderConfirmed();
      expect(isConfirmed).toBeTruthy();
      const orderNumber = await checkoutPage.getOrderNumber();
      expect(orderNumber).toBeTruthy();
    });
  });

  test('User can add multiple products to cart and remove one (#92)', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;
    let firstProductName: string;
    let secondProductName: string;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Books and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      firstProductName = (await productPage.elements.productTitle().innerText()).trim();
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify first product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to Computers and add second product to cart', async () => {
      await productPage.navigateToCategory('Computers');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      secondProductName = (await productPage.elements.productTitle().innerText()).trim();
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify second product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Open cart and verify both products are present', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      const count = await cartPage.getCartItemsCount();
      expect(count).toBeGreaterThanOrEqual(2);
      await expect(cartPage.elements.itemNameInCart(firstProductName)).toBeVisible();
      await expect(cartPage.elements.itemNameInCart(secondProductName)).toBeVisible();
    });

    await test.step('Remove the second product from cart', async () => {
      await cartPage.removeItemByIndex(1);
    });

    await test.step('Verify only the removed product is missing from cart', async () => {
      const count = await cartPage.getCartItemsCount();
      expect(count).toBe(1);
      await expect(cartPage.elements.itemNameInCart(firstProductName)).toBeVisible();
      await expect(cartPage.elements.itemNameInCart(secondProductName)).not.toBeVisible();
    });
  });

  test('User cannot proceed to checkout with billing last name not filled (#104)', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Books and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and proceed to checkout', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      await cartPage.proceedToCheckout();
    });

    await test.step('Fill billing address with last name intentionally left empty', async () => {
      checkoutPage = new CheckoutPage(page);
      await expect(checkoutPage.elements.billingFirstNameInput()).toBeVisible();
      await checkoutPage.fillBillingAddress({
        firstName: 'John',
        lastName: '',
        email: userEmail,
        country: 'United States',
        city: 'New York',
        address: '123 Main Street',
        zipCode: '10001',
        phone: '+1 (212) 555-0100',
      });
    });

    await test.step('Attempt to proceed without last name and verify error message appears', async () => {
      await checkoutPage.elements.nextButton().click();
      await expect(checkoutPage.elements.billingLastNameError()).toBeVisible();
      await expect(checkoutPage.elements.billingLastNameError()).toContainText('Last name is required.');
    });

    await test.step('Verify user remains on billing step and cannot proceed', async () => {
      await expect(checkoutPage.elements.billingFirstNameInput()).toBeVisible();
    });
  });

  test('User cannot proceed to checkout with billing first name not filled (#103)', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Books and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and proceed to checkout', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      await cartPage.proceedToCheckout();
    });

    await test.step('Fill billing address with first name intentionally left empty', async () => {
      checkoutPage = new CheckoutPage(page);
      await expect(checkoutPage.elements.billingFirstNameInput()).toBeVisible();
      await checkoutPage.fillBillingAddress({
        firstName: '',
        lastName: 'Doe',
        email: userEmail,
        country: 'United States',
        city: 'New York',
        address: '123 Main Street',
        zipCode: '10001',
        phone: '+1 (212) 555-0100',
      });
    });

    await test.step('Attempt to proceed without first name and verify error message appears', async () => {
      await checkoutPage.elements.nextButton().click();
      await expect(checkoutPage.elements.billingFirstNameError()).toBeVisible();
      await expect(checkoutPage.elements.billingFirstNameError()).toContainText('First name is required.');
    });

    await test.step('Verify user remains on billing step and cannot proceed', async () => {
      await expect(checkoutPage.elements.billingFirstNameInput()).toBeVisible();
    });
  });

  test('User cannot proceed to checkout without accepting terms and conditions (#102)', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Books and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and attempt checkout without accepting terms', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      const alertMessage = await cartPage.attemptCheckoutWithoutTOS();
      expect(alertMessage).toContain('terms of service');
    });

    await test.step('Verify user remains on cart page and has not proceeded to checkout', async () => {
      await expect(page).toHaveURL(/\/cart/);
    });
  });

  test('User cannot proceed to checkout with billing city not filled (#107)', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Books and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and proceed to checkout', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      await cartPage.proceedToCheckout();
    });

    await test.step('Fill billing address with city intentionally left empty', async () => {
      checkoutPage = new CheckoutPage(page);
      await expect(checkoutPage.elements.billingFirstNameInput()).toBeVisible();
      await checkoutPage.fillBillingAddress({
        firstName: 'John',
        lastName: 'Doe',
        email: userEmail,
        country: 'United States',
        city: '',
        address: '123 Main Street',
        zipCode: '10001',
        phone: '+1 (212) 555-0100',
      });
    });

    await test.step('Attempt to proceed without city and verify error message appears', async () => {
      await checkoutPage.elements.nextButton().click();
      await expect(checkoutPage.elements.billingCityError()).toBeVisible();
      await expect(checkoutPage.elements.billingCityError()).toContainText('City is required');
    });

    await test.step('Verify user remains on billing step and cannot proceed', async () => {
      await expect(checkoutPage.elements.billingFirstNameInput()).toBeVisible();
    });
  });

  test('User cannot proceed to checkout with billing country not selected (#106)', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Books and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and proceed to checkout', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      await cartPage.proceedToCheckout();
    });

    await test.step('Fill billing address with country intentionally left unselected', async () => {
      checkoutPage = new CheckoutPage(page);
      await expect(checkoutPage.elements.billingFirstNameInput()).toBeVisible();
      await checkoutPage.fillBillingAddress({
        firstName: 'John',
        lastName: 'Doe',
        email: userEmail,
        city: 'New York',
        address: '123 Main Street',
        zipCode: '10001',
        phone: '+1 (212) 555-0100',
      });
    });

    await test.step('Attempt to proceed without country and verify error message appears', async () => {
      await checkoutPage.elements.nextButton().click();
      await expect(checkoutPage.elements.billingCountryError()).toBeVisible();
      await expect(checkoutPage.elements.billingCountryError()).toContainText('Country is required');
    });

    await test.step('Verify user remains on billing step and cannot proceed', async () => {
      await expect(checkoutPage.elements.billingFirstNameInput()).toBeVisible();
    });
  });

  test('User cannot proceed to checkout with billing address1 not filled (#108)', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Books and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and proceed to checkout', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      await cartPage.proceedToCheckout();
    });

    await test.step('Fill billing address with address1 intentionally left empty', async () => {
      checkoutPage = new CheckoutPage(page);
      await expect(checkoutPage.elements.billingFirstNameInput()).toBeVisible();
      await checkoutPage.fillBillingAddress({
        firstName: 'John',
        lastName: 'Doe',
        email: userEmail,
        country: 'United States',
        city: 'New York',
        address: '',
        zipCode: '10001',
        phone: '+1 (212) 555-0100',
      });
    });

    await test.step('Attempt to proceed without address1 and verify error message appears', async () => {
      await checkoutPage.elements.nextButton().click();
      await expect(checkoutPage.elements.billingAddress1Error()).toBeVisible();
      await expect(checkoutPage.elements.billingAddress1Error()).toContainText('Street address is required');
    });

    await test.step('Verify user remains on billing step and cannot proceed', async () => {
      await expect(checkoutPage.elements.billingFirstNameInput()).toBeVisible();
    });
  });

  test('User cannot proceed to checkout with billing address1 not filled but address2 filled (#109)', async ({
    page,
  }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Books and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and proceed to checkout', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      await cartPage.proceedToCheckout();
    });

    await test.step('Fill billing address with address1 intentionally left empty but address2 filled', async () => {
      checkoutPage = new CheckoutPage(page);
      await expect(checkoutPage.elements.billingFirstNameInput()).toBeVisible();
      await checkoutPage.fillBillingAddress({
        firstName: 'John',
        lastName: 'Doe',
        email: userEmail,
        country: 'United States',
        city: 'New York',
        address: '',
        address2: 'Apt 4B',
        zipCode: '10001',
        phone: '+1 (212) 555-0100',
      });
    });

    await test.step('Attempt to proceed without address1 and verify error message appears', async () => {
      await checkoutPage.elements.nextButton().click();
      await expect(checkoutPage.elements.billingAddress1Error()).toBeVisible();
      await expect(checkoutPage.elements.billingAddress1Error()).toContainText('Street address is required');
    });

    await test.step('Verify user remains on billing step and cannot proceed', async () => {
      await expect(checkoutPage.elements.billingFirstNameInput()).toBeVisible();
    });
  });

  test('User cannot proceed to checkout with billing email not filled (#105)', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Books and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and proceed to checkout', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      await cartPage.proceedToCheckout();
    });

    await test.step('Fill billing address with email intentionally left empty', async () => {
      checkoutPage = new CheckoutPage(page);
      await expect(checkoutPage.elements.billingFirstNameInput()).toBeVisible();
      await checkoutPage.fillBillingAddress({
        firstName: 'John',
        lastName: 'Doe',
        email: '',
        country: 'United States',
        city: 'New York',
        address: '123 Main Street',
        zipCode: '10001',
        phone: '+1 (212) 555-0100',
      });
    });

    await test.step('Attempt to proceed without email and verify error message appears', async () => {
      await checkoutPage.elements.nextButton().click();
      await expect(checkoutPage.elements.billingEmailError()).toBeVisible();
      await expect(checkoutPage.elements.billingEmailError()).toContainText('Email is required.');
    });

    await test.step('Verify user remains on billing step and cannot proceed', async () => {
      await expect(checkoutPage.elements.billingFirstNameInput()).toBeVisible();
    });
  });

  test('User cannot proceed to checkout with billing phone number not filled (#110)', async ({ page }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Books and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and proceed to checkout', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      await cartPage.proceedToCheckout();
    });

    await test.step('Fill billing address with phone number intentionally left empty', async () => {
      checkoutPage = new CheckoutPage(page);
      await expect(checkoutPage.elements.billingFirstNameInput()).toBeVisible();
      await checkoutPage.fillBillingAddress({
        firstName: 'John',
        lastName: 'Doe',
        email: userEmail,
        country: 'United States',
        city: 'New York',
        address: '123 Main Street',
        zipCode: '10001',
        phone: '',
      });
    });

    await test.step('Attempt to proceed without phone number and verify error message appears', async () => {
      await checkoutPage.elements.nextButton().click();
      await expect(checkoutPage.elements.billingPhoneError()).toBeVisible();
      await expect(checkoutPage.elements.billingPhoneError()).toContainText('Phone is required');
    });

    await test.step('Verify user remains on billing step and cannot proceed', async () => {
      await expect(checkoutPage.elements.billingFirstNameInput()).toBeVisible();
    });
  });

  test('User can checkout with Cash On Delivery (COD) payment method and see matching additional fee on confirm order page (#114)', async ({
    page,
  }) => {
    const mainPage = new MainPage(page);
    let productPage: ProductPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;
    let codFee: string | null;

    await test.step('User logs in to the application', async () => {
      await mainPage.userLogIn(userEmail, userPassword);
      await expect(mainPage.elements.loggedInUserLink(userEmail)).toBeVisible();
    });

    await test.step('Navigate to Books and add first product to cart', async () => {
      productPage = new ProductPage(page);
      await productPage.navigateToCategory('Books');
      await expect(productPage.elements.productLink(0)).toBeVisible();
      await productPage.selectProductByIndex(0);
      await productPage.addToCartWithQuantity(1);
    });

    await test.step('Verify product was added to cart', async () => {
      await expect(productPage.elements.successMessage()).toContainText('added to your shopping cart');
      await productPage.closeSuccessNotification();
    });

    await test.step('Navigate to cart and proceed to checkout', async () => {
      cartPage = new CartPage(page);
      await cartPage.openCart();
      await expect(cartPage.elements.cartItems().first()).toBeVisible();
      await cartPage.proceedToCheckout();
    });

    await test.step('Fill billing address and proceed through shipping steps', async () => {
      checkoutPage = new CheckoutPage(page);
      await checkoutPage.fillBillingAddress({
        firstName: 'John',
        lastName: 'Doe',
        email: userEmail,
        country: 'United States',
        city: 'New York',
        address: '123 Main Street',
        zipCode: '10001',
        phone: '+1 (212) 555-0100',
      });
      await checkoutPage.proceedToNextStep();
      await checkoutPage.selectShippingAddressByName('John Doe');
      await checkoutPage.proceedToNextStep();
      await checkoutPage.selectShippingMethod('Ground');
      await checkoutPage.proceedToNextStep();
    });

    await test.step('Select Cash On Delivery (COD) payment method and capture its listed fee', async () => {
      await expect(checkoutPage.elements.paymentMethodOption('Cash On Delivery')).toBeVisible();
      codFee = await checkoutPage.getPaymentMethodFee('Cash On Delivery');
      expect(codFee).toBeTruthy();
      await checkoutPage.selectPaymentMethod('Cash On Delivery');
      await checkoutPage.proceedToNextStep();
    });

    await test.step('Verify payment information step shows the COD notice', async () => {
      await expect(checkoutPage.elements.paymentInfoSection()).toContainText('You will pay by COD');
      await checkoutPage.proceedToNextStep();
    });

    await test.step('Verify confirm order page shows the payment method additional fee matching the selected COD fee', async () => {
      const confirmFee = await checkoutPage.getPaymentMethodAdditionalFee();
      expect(confirmFee).toBe(codFee);
    });

    await test.step('Confirm the order', async () => {
      await checkoutPage.confirmOrder();
    });

    await test.step('Verify order was successfully placed', async () => {
      const isConfirmed = await checkoutPage.isOrderConfirmed();
      expect(isConfirmed).toBeTruthy();
      const orderNumber = await checkoutPage.getOrderNumber();
      expect(orderNumber).toBeTruthy();
    });
  });
});
