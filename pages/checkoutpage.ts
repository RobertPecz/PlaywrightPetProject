import { Page } from '@playwright/test';

class CheckoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  elements = {
    // Billing address section
    billingAddressTitle: () => this.page.locator('//div[@class="section" and contains(.//h3, "Billing Address")]'),
    billingFirstNameInput: () => this.page.getByTestId('BillingNewAddress.FirstName'),
    billingLastNameInput: () => this.page.getByTestId('BillingNewAddress.LastName'),
    billingEmailInput: () => this.page.getByTestId('BillingNewAddress.Email'),
    billingCompanyInput: () => this.page.getByTestId('BillingNewAddress.Company'),
    billingCountrySelect: () => this.page.getByTestId('BillingNewAddress.CountryId'),
    billingStateSelect: () => this.page.getByTestId('BillingNewAddress.StateProvinceId'),
    billingCityInput: () => this.page.getByTestId('BillingNewAddress.City'),
    billingAddressInput: () => this.page.getByTestId('BillingNewAddress.Address1'),
    billingZipInput: () => this.page.getByTestId('BillingNewAddress.ZipPostalCode'),
    billingPhoneInput: () => this.page.getByTestId('BillingNewAddress.PhoneNumber'),

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

    // Navigation buttons
    nextStepButtons: () => this.page.locator('//input[@name="nextstep"]'),
    confirmOrderButton: () => this.page.locator('//input[@value="Confirm"]'),

    // Success message
    successMessage: () => this.page.locator('//div[@class="page-title"]/h1[contains(text(), "Thank")]'),
    orderNumberText: () => this.page.locator('//strong[contains(text(), "Order number:")]'),
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
    const nextButton = this.elements.nextStepButtons();
    if (await nextButton.first().isVisible()) {
      await nextButton.first().click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async confirmOrder() {
    await this.elements.confirmOrderButton().click();
    await this.page.waitForLoadState('networkidle');
  }

  async isOrderConfirmed(): Promise<boolean> {
    return await this.elements.successMessage().isVisible();
  }

  async getOrderNumber(): Promise<string | null> {
    const orderText = await this.elements.orderNumberText().innerText();
    const match = orderText.match(/Order number: (\d+)/);
    return match ? match[1] : null;
  }
}

export default CheckoutPage;
