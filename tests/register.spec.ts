import { generateRandomEmail } from '../support/stringOperations';
import errorMessagesData from '../fixtures/errorMessages.json';
import registerPageData from '../fixtures/registerData.json';
import RegisterPage from '../pages/registerpage';
import { test, expect } from '@playwright/test';
import MainPage from '../pages/mainpage';

test.describe('Register tests', () => {
  test.beforeEach(async ({ page }) => {
    console.log(`Running ${test.info().title}`);
    await page.goto('/');
  });

  test('Register user with valid data', async ({ page }) => {
    let registerpage: RegisterPage;
    const mainPage = new MainPage(page);

    await test.step('Navigate and populate the registration data', async () => {
      registerpage = await mainPage.navigateToRegisterPage();
    });

    await test.step('Populate register data', async () => {
      await registerpage.populateRegisterData();
    });

    await test.step('Validate that the registration was successful', async () => {
      await expect(
        registerpage.elements.registrationCompleteText(registerPageData.loginSuccesfulMessage),
      ).toBeVisible();
      await expect(registerpage.elements.continueButton()).toBeVisible();
    });
  });

  test('Register user with invalid email', async ({ page }) => {
    let registerpage: RegisterPage;
    const mainPage = new MainPage(page);

    await test.step('Navigate and populate the registration data', async () => {
      registerpage = await mainPage.navigateToRegisterPage();
    });

    await test.step('Populate register data with invalid email', async () => {
      await registerpage.populateRegisterData({ emailOptions: { isValidEmail: false } });
    });

    await test.step('Validate that the email is invalid', async () => {
      await expect(registerpage.elements.emailTextboxWrongEmail()).toBeVisible();
      await expect(
        registerpage.elements.fieldValidationError(errorMessagesData.invalidEmailRegistrationErrorMessage),
      ).toBeVisible();
    });
  });

  test('Register user with valid email and invalid password', async ({ page }) => {
    let registerpage: RegisterPage;
    const mainPage = new MainPage(page);

    await test.step('Navigate and populate the registration data', async () => {
      registerpage = await mainPage.navigateToRegisterPage();
    });

    await test.step('Populate register data', async () => {
      await registerpage.populateRegisterData({ validPasswordNumber: { validPasswordNumber: 3 } });
    });

    await test.step('Validate that the password is invalid', async () => {
      await expect(
        registerpage.elements.fieldValidationError(errorMessagesData.invalidPasswordErrorMessage),
      ).toBeVisible();
    });
  });

  test('Register user with valid email and mismatched confirm password', async ({ page }) => {
    let registerpage: RegisterPage;
    const mainPage = new MainPage(page);

    await test.step('Navigate and populate the registration data', async () => {
      registerpage = await mainPage.navigateToRegisterPage();
    });

    await test.step('Populate register data with mismatched passwords', async () => {
      await registerpage.populateRegisterData({ confirmPassword: 'Mismatch123!' });
    });

    await test.step('Validate that the confirm password mismatch error is visible', async () => {
      await expect(
        registerpage.elements.passwordValidationField(registerPageData.dataValmsgForConfirmPasswordData),
      ).toHaveText(errorMessagesData.passwordConfirmationMismatchErrorMessage);
    });
  });

  test('Register user with valid email and empty password', async ({ page }) => {
    let registerpage: RegisterPage;
    const mainPage = new MainPage(page);

    await test.step('Navigate and populate the registration data', async () => {
      registerpage = await mainPage.navigateToRegisterPage();
    });

    await test.step('Populate register data', async () => {
      await registerpage.populateRegisterData({ validPasswordNumber: { validPasswordNumber: 0 } });
    });

    await test.step('Validate that the password is invalid', async () => {
      await expect(
        registerpage.elements.passwordValidationField(registerPageData.dataValmsgForPasswordData),
      ).toHaveText(errorMessagesData.missingPasswordErrorMessage);
      await expect(
        registerpage.elements.passwordValidationField(registerPageData.dataValmsgForConfirmPasswordData),
      ).toHaveText(errorMessagesData.missingPasswordErrorMessage);
    });
  });

  test('Register user with empty email and valid password', async ({ page }) => {
    let registerpage: RegisterPage;
    const mainPage = new MainPage(page);

    await test.step('Navigate and populate the registration data', async () => {
      registerpage = await mainPage.navigateToRegisterPage();
    });

    await test.step('Populate register data with empty email', async () => {
      await registerpage.populateRegisterData({ emailOptions: { emptyEmail: true } });
    });

    await test.step('Validate that the email is required', async () => {
      await expect(
        registerpage.elements.fieldValidationError(errorMessagesData.missingEmailErrorMessage),
      ).toBeVisible();
    });
  });

  test('Register user with already registered email', async ({ page }) => {
    let registerpage: RegisterPage;
    const mainPage = new MainPage(page);

    await test.step('Navigate and populate the registration data', async () => {
      registerpage = await mainPage.navigateToRegisterPage();
    });

    await test.step('Populate register data with already registered email', async () => {
      await registerpage.populateRegisterData({ emailOptions: { alreadyRegisteredEmail: true } });
    });

    await test.step('Validate that the email is already registered', async () => {
      await expect(
        registerpage.elements.liFieldValidationError(errorMessagesData.alreadyRegisteredErrorMessage),
      ).toBeVisible();
    });
  });

  test('Register user with empty gender', async ({ page }) => {
    let registerpage: RegisterPage;
    const mainPage = new MainPage(page);

    await test.step('Navigate and populate the registration data', async () => {
      registerpage = await mainPage.navigateToRegisterPage();
    });

    await test.step('Populate register data with empty gender', async () => {
      await registerpage.populateRegisterData({ genderOptions: { genderInput: undefined } });
    });

    await test.step('Validate that the registration was successful', async () => {
      await expect(
        registerpage.elements.registrationCompleteText(registerPageData.loginSuccesfulMessage),
      ).toBeVisible();
      await expect(registerpage.elements.continueButton()).toBeVisible();
    });
  });

  test('Register user without first name', async ({ page }) => {
    let registerpage: RegisterPage;
    const mainPage = new MainPage(page);

    await test.step('Navigate to registration page', async () => {
      registerpage = await mainPage.navigateToRegisterPage();
    });

    await test.step('Submit registration without first name', async () => {
      await registerpage.populateRegisterData({ firstNameInput: { firstNameInput: '' } });
    });

    await test.step('Validate first name required error message', async () => {
      await expect(
        registerpage.elements.fieldValidationError(errorMessagesData.missingFirstNameErrorMessage),
      ).toBeVisible();
    });
  });

  test('Register user without last name', async ({ page }) => {
    let registerpage: RegisterPage;
    const mainPage = new MainPage(page);

    await test.step('Navigate to registration page', async () => {
      registerpage = await mainPage.navigateToRegisterPage();
    });

    await test.step('Submit registration without last name', async () => {
      await registerpage.populateRegisterData({ lastNameInput: { lastNameInput: '' } });
    });

    await test.step('Validate last name required error message', async () => {
      await expect(
        registerpage.elements.fieldValidationError(errorMessagesData.missingLastNameErrorMessage),
      ).toBeVisible();
    });
  });

  test('Register user with password field change after filling both password fields', async ({ page }) => {
    let registerpage: RegisterPage;
    const mainPage = new MainPage(page);

    await test.step('Navigate to registration page', async () => {
      registerpage = await mainPage.navigateToRegisterPage();
    });

    await test.step('Fill registration form fields', async () => {
      await registerpage.elements.genderMaleRadioButton().click();
      await registerpage.elements.firstnameTextbox().fill('John');
      await registerpage.elements.lastnameTextbox().fill('Doe');
      // Generate a random valid email
      const randomEmail = generateRandomEmail();
      await registerpage.elements.emailTextbox().fill(randomEmail);
    });

    await test.step('Fill password and confirm password with matching values', async () => {
      const initialPassword = 'MatchPassword123!';
      await registerpage.fillPasswordField(initialPassword);
      await registerpage.fillConfirmPasswordField(initialPassword);
    });

    await test.step('Change password field to a different value', async () => {
      await registerpage.changePasswordField('DifferentPassword123!');
      await registerpage.triggerPasswordFieldBlur();
    });

    await test.step('Validate password mismatch error message is visible', async () => {
      await expect(
        registerpage.elements.passwordValidationField(registerPageData.dataValmsgForConfirmPasswordData),
      ).toHaveText(errorMessagesData.passwordConfirmationMismatchErrorMessage);
    });
  });
});
