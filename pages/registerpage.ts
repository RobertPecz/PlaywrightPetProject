import mainPageData from '../fixtures/mainpageData.json';
import { Page } from '@playwright/test';

class RegisterPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  elements = {
    genderMaleRadioButton: () => this.page.getByTestId('gender-male'),
    genderFemaleRadioButton: () => this.page.getByTestId('gender-female'),
    firstnameTextbox: () => this.page.getByTestId('FirstName'),
    lastnameTextbox: () => this.page.getByTestId('LastName'),
    emailTextbox: () => this.page.getByTestId('Email'),
    emailTextboxWrongEmail: () => this.page.locator("//input[@data-val-email='Wrong email']"),
    passwordTextbox: () => this.page.getByTestId('Password'),
    confirmPasswordTextbox: () => this.page.getByTestId('ConfirmPassword'),
    registerButton: () => this.page.getByTestId('register-button'),
    registrationCompleteText: (resultText: string) => this.page.locator(`//div[contains(text(), "${resultText}")]`),
    continueButton: () => this.page.locator("//input[@value='Continue']"),
    fieldValidationError: (resultText: string) => this.page.locator(`//span[contains(text(), "${resultText}")]`),
    liFieldValidationError: (resultText: string) => this.page.locator(`//li[contains(text(), "${resultText}")]`),
    passwordValidationField: (dataValmsgFor: string) =>
      this.page.locator(`//span[@data-valmsg-for="${dataValmsgFor}"]/span`),
  };

  async populateRegisterData({
    genderInput = 'male',
    isValidEmail = true,
    validPasswordNumber = 6,
    emptyEmail = false,
    alreadyRegisteredEmail = false,
  }: {
    genderInput?: string;
    isValidEmail?: boolean;
    validPasswordNumber?: number;
    emptyEmail?: boolean;
    alreadyRegisteredEmail?: boolean;
  } = {}) {
    switch (genderInput.toLowerCase()) {
      case 'male':
        await this.elements.genderMaleRadioButton().click();
        break;
      case 'female':
        await this.elements.genderFemaleRadioButton().click();
        break;
      default:
        throw Error("Only 'male' or 'female' can choose as gender.");
    }

    await this.elements.firstnameTextbox().fill(this.createRandomString(5));
    await this.elements.lastnameTextbox().fill(this.createRandomString(5));

    switch (true) {
      case emptyEmail:
        // Empty email - no fill
        break;
      case !isValidEmail:
        await this.elements.emailTextboxWrongEmail().fill(this.createRandomEmail(isValidEmail));
        break;
      case alreadyRegisteredEmail:
        await this.elements.emailTextbox().fill(mainPageData.email);
        break;
      default:
        await this.elements.emailTextbox().fill(this.createRandomEmail(isValidEmail));
    }

    const pwd: string = this.createRandomString(validPasswordNumber);
    await this.elements.passwordTextbox().fill(pwd);
    await this.elements.confirmPasswordTextbox().fill(pwd);
    await this.elements.registerButton().click();
  }

  createRandomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let index = 0; index < length; index++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }

  createRandomEmail(isValid?: boolean) {
    let randomEmail = '';
    if (isValid === true) {
      randomEmail += this.createRandomString(5) + '@' + this.createRandomString(5) + '.com';
    } else {
      randomEmail = this.createRandomString(10);
    }
    return randomEmail;
  }
}

export default RegisterPage;
