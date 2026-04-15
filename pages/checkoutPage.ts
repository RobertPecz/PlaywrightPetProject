import { Page } from '@playwright/test';

 
class CheckoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  elements = {
    firstNameTextBox: () => this.page.locator("//input[@id='BillingNewAddress_FirstName']"),
    lastNameTextBox: () => this.page.locator("//input[@id='BillingNewAddress_LastName']"),
    emailTextBox: () => this.page.locator("//input[@id='BillingNewAddress_Email']"),
    countryDropdown: () => this.page.locator("//select[@id='BillingNewAddress_CountryId']"),
    stateDropdown: () => this.page.locator("//select[@id='BillingNewAddress_StateProvinceId']"),
    cityTextBox: () => this.page.locator("//input[@id='BillingNewAddress_City']"),
    address1TextBox: () => this.page.locator("//input[@id='BillingNewAddress_Address1']"),
    zipCodeTextBox: () => this.page.locator("//input[@id='BillingNewAddress_ZipPostalCode']"),
    phoneNumberTextBox: () => this.page.locator("//input[@id='BillingNewAddress_PhoneNumber']"),
    continueButton: () => this.page.locator("//input[@title='Continue']"),
    billingButtonContainer: () => this.page.locator("//div[@id='billing-buttons-container']"),
    shippingButtonContainer: () => this.page.locator("//div[@id='shipping-buttons-container']"),
    shippingMethodButtonContainer: () => this.page.locator("//div[@id='shipping-method-buttons-container']"),
    paymentMethodButtonContainer: () => this.page.locator("//div[@id='payment-method-buttons-container']"),
    paymentInfoButtonContainer: () => this.page.locator("//div[@id='payment-info-buttons-container']"),
  };
}

export default CheckoutPage;
