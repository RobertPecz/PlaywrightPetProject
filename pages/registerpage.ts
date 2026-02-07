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

// Email handler strategy type
type EmailHandler = (page: Page, options: emailOptions) => Promise<void>;

// Default email handlers
const defaultEmailHandlers: Record<string, EmailHandler> = {
  validEmail: async (page: Page) => {
    const emailInput = page.getByTestId('Email');
    const randomEmail = generateRandomEmail(true);
    await emailInput.fill(randomEmail);
  },
  invalidEmail: async (page: Page) => {
    const emailInput = page.locator("//input[@data-val-email='Wrong email']");
    const randomEmail = generateRandomEmail(false);
    await emailInput.fill(randomEmail);
  },
  alreadyRegisteredEmail: async (page: Page) => {
    const emailInput = page.getByTestId('Email');
    await emailInput.fill(mainPageData.email);
  },
  emptyEmail: async () => {
    // Do nothing - leave email empty
  },
};

// Helper functions
function generateRandomString(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let index = 0; index < length; index++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

function generateRandomEmail(isValid: boolean = true): string {
  if (isValid) {
    return generateRandomString(5) + '@' + generateRandomString(5) + '.com';
  }
  return generateRandomString(10);
}

class RegisterPage {
  readonly page: Page;
  private emailHandlers: Record<string, EmailHandler>;

  constructor(page: Page, emailHandlers: Record<string, EmailHandler> = defaultEmailHandlers) {
    this.page = page;
    this.emailHandlers = emailHandlers;
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

  /**
   * Main method to populate and submit registration form.
   * Simplified to orchestrate the process without embedding logic.
   * New email behaviors can be added by providing custom emailHandlers in the constructor.
   */
  async populateRegisterData({
    genderOptions = { genderInput: gender.male },
    firstNameInput = { firstNameInput: generateRandomString(5) },
    lastNameInput = { lastNameInput: generateRandomString(5) },
    emailOptions = { isValidEmail: true },
    validPasswordNumber = { validPasswordNumber: 6 },
  }: {
    genderOptions?: genderOptions;
    firstNameInput?: firstNameInput;
    lastNameInput?: lastNameInput;
    emailOptions?: emailOptions;
    validPasswordNumber?: validPasswordNumber;
  } = {}) {
    await this.fillGender(genderOptions?.genderInput);
    await this.fillFirstName(firstNameInput?.firstNameInput);
    await this.fillLastName(lastNameInput?.lastNameInput);
    await this.fillEmail(emailOptions);
    await this.fillPassword(validPasswordNumber?.validPasswordNumber);
    await this.submit();
  }

  /**
   * Fill gender field with selected option.
   */
  private async fillGender(selectedGender?: gender): Promise<void> {
    if (!selectedGender) {
      console.log('No gender input provided');
      return;
    }

    switch (selectedGender) {
      case gender.male:
        await this.elements.genderMaleRadioButton().click();
        break;
      case gender.female:
        await this.elements.genderFemaleRadioButton().click();
        break;
      default:
        console.log('Unknown gender provided');
    }
  }

  /**
   * Fill first name field.
   */
  private async fillFirstName(firstName?: string): Promise<void> {
    if (!firstName) {
      console.log('No first name input provided');
      return;
    }
    await this.elements.firstnameTextbox().fill(firstName);
  }

  /**
   * Fill last name field.
   */
  private async fillLastName(lastName?: string): Promise<void> {
    if (!lastName) {
      console.log('No last name input provided');
      return;
    }
    await this.elements.lastnameTextbox().fill(lastName);
  }

  /**
   * Fill email using the appropriate handler strategy.
   * To add new email behaviors, inject custom handlers via constructor.
   */
  private async fillEmail(emailOptions: emailOptions): Promise<void> {
    let handlerKey = 'validEmail';

    if (emailOptions?.emptyEmail === true) {
      handlerKey = 'emptyEmail';
    } else if (emailOptions?.isValidEmail === false) {
      handlerKey = 'invalidEmail';
    } else if (emailOptions?.alreadyRegisteredEmail === true) {
      handlerKey = 'alreadyRegisteredEmail';
    }

    const handler = this.emailHandlers[handlerKey];
    if (!handler) {
      throw new Error(`Email handler for '${handlerKey}' not found`);
    }

    await handler(this.page, emailOptions);
  }

  /**
   * Fill password and confirm password fields.
   */
  private async fillPassword(passwordLength: number = 6): Promise<void> {
    if (passwordLength === 0) {
      return; // Leave password empty for empty password test case
    }

    const pwd: string = generateRandomString(passwordLength);
    await this.elements.passwordTextbox().fill(pwd);
    await this.elements.confirmPasswordTextbox().fill(pwd);
  }

  /**
   * Submit the registration form.
   */
  private async submit(): Promise<void> {
    await this.elements.registerButton().click();
  }

  /**
   * Allows injection of custom email handlers (for extension without modification).
   */
  setEmailHandlers(handlers: Record<string, EmailHandler>): void {
    this.emailHandlers = { ...this.emailHandlers, ...handlers };
  }
}

export default RegisterPage;
