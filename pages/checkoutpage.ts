import { Page } from '@playwright/test';

class CheckoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  elements = {
    // Billing address section
    billingAddressTitle: () => this.page.locator('//div[@class="section" and contains(.//h3, "Billing Address")]'),
    billingAddressSelect: () => this.page.locator('select[name="billing_address_id"]'),
    billingFirstNameInput: () => this.page.locator('#BillingNewAddress_FirstName'),
    billingLastNameInput: () => this.page.locator('#BillingNewAddress_LastName'),
    billingEmailInput: () => this.page.locator('#BillingNewAddress_Email'),
    billingCompanyInput: () => this.page.locator('#BillingNewAddress_Company'),
    billingCountrySelect: () => this.page.locator('#BillingNewAddress_CountryId'),
    billingStateSelect: () => this.page.locator('#BillingNewAddress_StateProvinceId'),
    billingCityInput: () => this.page.locator('#BillingNewAddress_City'),
    billingAddressInput: () => this.page.locator('#BillingNewAddress_Address1'),
    billingZipInput: () => this.page.locator('#BillingNewAddress_ZipPostalCode'),
    billingPhoneInput: () => this.page.locator('#BillingNewAddress_PhoneNumber'),

    // Shipping address section
    shippingAsAddressCheckbox: () => this.page.locator('//input[@id="ShippingNewAddress_IsDifferentAddress"]'),

    // Shipping method
    shippingMethodOption: (methodName: string) => this.page.locator(`//label[contains(., "${methodName}")]`),

    // Payment method
    paymentMethodOption: (methodName: string) => this.page.locator(`//label[contains(., "${methodName}")]`),
    paymentInfoSection: () => this.page.locator('//div[@class="payment-info"]'),

    // Order summary
    orderSummary: () => this.page.locator('//div[@class="order-summary"]'),
    orderTotal: () => this.page.locator('//span[@class="product-price"]'),

    // Shipping address selector (step 2 of OPC)
    shippingAddressSelect: () => this.page.locator('select[name="shipping_address_id"]'),

    // Billing address validation errors
    billingFirstNameError: () => this.page.locator('[data-valmsg-for="BillingNewAddress.FirstName"]'),
    billingLastNameError: () => this.page.locator('[data-valmsg-for="BillingNewAddress.LastName"]'),
    billingEmailError: () => this.page.locator('[data-valmsg-for="BillingNewAddress.Email"]'),
    billingCountryError: () => this.page.locator('[data-valmsg-for="BillingNewAddress.CountryId"]'),
    billingCityError: () => this.page.locator('[data-valmsg-for="BillingNewAddress.City"]'),

    // Guest checkout button (shown when not logged in)
    checkoutAsGuestButton: () => this.page.locator('input.checkout-as-guest-button, input[value="Checkout as Guest"]'),

    // Address book management (/customer/addresses)
    addressAddNewButton: () => this.page.getByRole('button', { name: 'Add new' }),
    addressFirstNameInput: () => this.page.locator('#Address_FirstName'),
    addressLastNameInput: () => this.page.locator('#Address_LastName'),
    addressEmailInput: () => this.page.locator('#Address_Email'),
    addressCountrySelect: () => this.page.locator('#Address_CountryId'),
    addressStateSelect: () => this.page.locator('#Address_StateProvinceId'),
    addressCityInput: () => this.page.locator('#Address_City'),
    addressLine1Input: () => this.page.locator('#Address_Address1'),
    addressZipInput: () => this.page.locator('#Address_ZipPostalCode'),
    addressPhoneInput: () => this.page.locator('#Address_PhoneNumber'),
    addressSaveButton: () => this.page.locator('input[value="Save"]'),

    confirmOrderButton: () => this.page.locator('//input[@value="Confirm"]'),

    // Success message — nopCommerce confirmation page shows h1 "Thank you"
    successMessage: () => this.page.getByRole('heading', { name: 'Thank you' }),
    orderNumberText: () => this.page.getByText(/Order number:/),
    orderDetailsButton: () => this.page.locator('//a[contains(text(), "Order Details")]'),

    // next button
    nextButton: () =>
      this.page.locator('input[value="Continue"]:not([disabled]):visible, button:has-text("Continue"):visible').first(),
  };

  async addDefaultAddressToAccount({
    firstName,
    lastName,
    email,
    country,
    state,
    city,
    address,
    zipCode,
    phone,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    state?: string;
    city: string;
    address: string;
    zipCode: string;
    phone: string;
  }) {
    await this.page.goto('/customer/addresses');
    await this.page.waitForLoadState('domcontentloaded');
    await this.elements.addressAddNewButton().click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.elements.addressFirstNameInput().fill(firstName);
    await this.elements.addressLastNameInput().fill(lastName);
    await this.elements.addressEmailInput().fill(email);
    await this.elements.addressCountrySelect().selectOption({ label: country });
    if (state) {
      const stateSelect = this.elements.addressStateSelect();
      const stateOptions = await stateSelect.locator('option').allTextContents();
      if (stateOptions.includes(state)) {
        await stateSelect.selectOption({ label: state });
      }
    }
    await this.elements.addressCityInput().fill(city);
    await this.elements.addressLine1Input().fill(address);
    await this.elements.addressZipInput().fill(zipCode);
    await this.elements.addressPhoneInput().fill(phone);
    await this.elements.addressSaveButton().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async checkoutAsGuest() {
    const btn = this.elements.checkoutAsGuestButton();
    if (await btn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await btn.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async fillBillingAddress({
    firstName,
    lastName,
    email,
    company,
    country,
    state,
    city,
    address,
    zipCode,
    phone,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
    country?: string;
    state?: string;
    city: string;
    address: string;
    zipCode: string;
    phone: string;
  }) {
    // If existing addresses are saved, select "New Address" to show the form fields
    const addressSelect = this.elements.billingAddressSelect();
    if (await addressSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      // nopCommerce OPC uses empty string for "New Address" option
      await addressSelect.selectOption({ value: '' }).catch(() => addressSelect.selectOption({ index: 0 }));
    }

    await this.elements.billingFirstNameInput().waitFor({ state: 'visible', timeout: 10000 });
    await this.elements.billingFirstNameInput().fill(firstName);
    await this.elements.billingLastNameInput().fill(lastName);
    await this.elements.billingEmailInput().fill(email);

    if (company) {
      await this.elements.billingCompanyInput().fill(company);
    }

    if (country) {
      const countrySelect = this.elements.billingCountrySelect();
      await countrySelect.selectOption({ label: country });

      if (state) {
        const stateSelect = this.elements.billingStateSelect();
        const stateOptions = await stateSelect.locator('option').allTextContents();
        if (stateOptions.includes(state)) {
          await stateSelect.selectOption({ label: state });
        }
      }
    }

    await this.elements.billingCityInput().fill(city);
    await this.elements.billingAddressInput().fill(address);
    await this.elements.billingZipInput().fill(zipCode);
    await this.elements.billingPhoneInput().fill(phone);
  }

  async selectShippingMethod(methodName: string) {
    const shippingOption = this.elements.shippingMethodOption(methodName);
    if (await shippingOption.isVisible()) {
      await shippingOption.click();
    }
  }

  async selectPaymentMethod(methodName: string) {
    const paymentOption = this.elements.paymentMethodOption(methodName);
    if (await paymentOption.isVisible()) {
      await paymentOption.click();
    }
  }

  async proceedToNextStep() {
    await this.elements
      .nextButton()
      .waitFor({ state: 'visible', timeout: 10000 })
      .catch(() => {});
    if (
      await this.elements
        .nextButton()
        .isVisible({ timeout: 500 })
        .catch(() => false)
    ) {
      await this.elements.nextButton().click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async selectShippingAddressByName(name: string) {
    const select = this.elements.shippingAddressSelect();
    if (await select.isVisible({ timeout: 3000 }).catch(() => false)) {
      const options = await select.locator('option').allTextContents();
      const match = options.find((opt) => opt.includes(name));
      if (match) {
        await select.selectOption({ label: match });
        await this.page.waitForTimeout(500);
      }
    }
  }

  async confirmOrder() {
    await this.elements.confirmOrderButton().click();
    await this.page.waitForLoadState('load', { timeout: 30000 });
  }

  async isOrderConfirmed(): Promise<boolean> {
    return await this.elements
      .successMessage()
      .waitFor({ state: 'visible', timeout: 10000 })
      .then(() => true)
      .catch(() => false);
  }

  async getOrderNumber(): Promise<string | null> {
    const el = this.elements.orderNumberText();
    if (!(await el.isVisible({ timeout: 3000 }).catch(() => false))) return null;
    const orderText = await el.innerText().catch(() => '');
    const match = orderText.match(/(\d+)/);
    return match ? match[1] : null;
  }
}

export default CheckoutPage;
