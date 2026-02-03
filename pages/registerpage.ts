import mainPageData from '../fixtures/mainpageData.json';
import { Page } from '@playwright/test';

export enum gender {
  male = 'male',
  female = 'female',
}

interface genderOptions {
  genderInput?: gender;
}

interface firstNameInput {
  firstNameInput?: string;
}

interface lastNameInput {
  lastNameInput?: string;
}

interface validPasswordNumber {
  validPasswordNumber?: number;
}

interface emailOptions {
  isValidEmail?: boolean;
  emptyEmail?: boolean;
  alreadyRegisteredEmail?: boolean;
}

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
    genderOptions = { genderInput: gender.male },
    firstNameInput = { firstNameInput: this.createRandomString(5) },
    lastNameInput = { lastNameInput: this.createRandomString(5) },
    emailOptions = { isValidEmail: true },
    validPasswordNumber = { validPasswordNumber: 6 },
  }: {
    genderOptions?: genderOptions;
    firstNameInput?: firstNameInput;
    lastNameInput?: lastNameInput;
    emailOptions?: emailOptions;
    validPasswordNumber?: validPasswordNumber;
  } = {}) {
    switch (genderOptions?.genderInput) {
      case gender.male:
        await this.elements.genderMaleRadioButton().click();
        break;
      case gender.female:
        await this.elements.genderFemaleRadioButton().click();
        break;
      default:
        console.log('No gender input provided');
    }

    if (firstNameInput?.firstNameInput) {
      await this.elements.firstnameTextbox().fill(firstNameInput.firstNameInput);
    } else {
      console.log('No first name input provided');
    }

    if (lastNameInput?.lastNameInput) {
      await this.elements.lastnameTextbox().fill(lastNameInput.lastNameInput);
    } else {
      console.log('No last name input provided');
    }

    switch (true) {
      case emailOptions?.emptyEmail === true:
        // Empty email - no fill
        break;
      case emailOptions?.isValidEmail === false:
        await this.elements.emailTextboxWrongEmail().fill(this.createRandomEmail(emailOptions.isValidEmail));
        break;
      case emailOptions?.alreadyRegisteredEmail === true:
        await this.elements.emailTextbox().fill(mainPageData.email);
        break;
      default:
        await this.elements.emailTextbox().fill(this.createRandomEmail(emailOptions?.isValidEmail));
    }

    if (validPasswordNumber?.validPasswordNumber !== undefined) {
      const pwd: string = this.createRandomString(validPasswordNumber.validPasswordNumber);
      await this.elements.passwordTextbox().fill(pwd);
      await this.elements.confirmPasswordTextbox().fill(pwd);
    }

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
