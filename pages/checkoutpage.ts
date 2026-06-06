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

    confirmOrderButton: () => this.page.locator('//input[@value="Confirm"]'),

    // Success message — nopCommerce confirmation page shows h1 "Thank you"
    successMessage: () => this.page.getByRole('heading', { name: 'Thank you' }),
    orderNumberText: () => this.page.getByText(/Order number:/),
    orderDetailsButton: () => this.page.locator('//a[contains(text(), "Order Details")]'),
  };

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
    country: string;
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
      await this.page.waitForTimeout(1500);
    }

    await this.elements.billingFirstNameInput().waitFor({ state: 'visible', timeout: 10000 });
    await this.elements.billingFirstNameInput().fill(firstName);
    await this.elements.billingLastNameInput().fill(lastName);
    await this.elements.billingEmailInput().fill(email);

    if (company) {
      await this.elements.billingCompanyInput().fill(company);
    }

    const countrySelect = this.elements.billingCountrySelect();
    await countrySelect.selectOption({ label: country });

    if (state) {
      await this.page.waitForTimeout(500); // Wait for state dropdown to populate
      const stateSelect = this.elements.billingStateSelect();
      const stateOptions = await stateSelect.locator('option').allTextContents();
      if (stateOptions.includes(state)) {
        await stateSelect.selectOption({ label: state });
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
    // Use :visible so .first() only resolves to a visible Continue button;
    // hidden buttons from completed OPC steps are excluded by the pseudo-class
    const nextButton = this.page
      .locator('input[value="Continue"]:not([disabled]):visible, button:has-text("Continue"):visible')
      .first();
    await nextButton.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    if (await nextButton.isVisible({ timeout: 500 }).catch(() => false)) {
      await nextButton.click();
      await this.page.waitForLoadState('networkidle');
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
