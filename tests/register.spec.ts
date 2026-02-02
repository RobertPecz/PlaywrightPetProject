import errorMessagesData from '../fixtures/errorMessages.json';
import registerPageData from '../fixtures/registerData.json';
import RegisterPage from '../pages/registerpage';
import { test, expect } from '@playwright/test';
import MainPage from '../pages/mainpage';

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
    await registerpage.populateRegisterData({ genderInput: registerPageData.genderFemale });
  });

  await test.step('Validate that the registration was successful', async () => {
    await expect(registerpage.elements.registrationCompleteText(registerPageData.loginSuccesfulMessage)).toBeVisible();
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
    await registerpage.populateRegisterData({ genderInput: registerPageData.genderFemale, isValidEmail: false });
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
    await registerpage.populateRegisterData({ genderInput: registerPageData.genderMale, validPasswordNumber: 1 });
  });

  await test.step('Validate that the password is invalid', async () => {
    await expect(
      registerpage.elements.fieldValidationError(errorMessagesData.invalidPasswordErrorMessage),
    ).toBeVisible();
  });
});

test('Register user with valid email and empty password', async ({ page }) => {
  let registerpage: RegisterPage;
  const mainPage = new MainPage(page);

  await test.step('Navigate and populate the registration data', async () => {
    registerpage = await mainPage.navigateToRegisterPage();
  });

  await test.step('Populate register data', async () => {
    await registerpage.populateRegisterData({ genderInput: registerPageData.genderMale, validPasswordNumber: 0 });
  });

  await test.step('Validate that the password is invalid', async () => {
    await expect(registerpage.elements.passwordValidationField(registerPageData.dataValmsgForPasswordData)).toHaveText(
      errorMessagesData.missingPasswordErrorMessage,
    );
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
    await registerpage.populateRegisterData({
      genderInput: registerPageData.genderFemale,
      isValidEmail: true,
      emptyEmail: true,
    });
  });

  await test.step('Validate that the email is required', async () => {
    await expect(registerpage.elements.fieldValidationError(errorMessagesData.missingEmailErrorMessage)).toBeVisible();
  });
});

test('Register user with already registered email', async ({ page }) => {
  let registerpage: RegisterPage;
  const mainPage = new MainPage(page);

  await test.step('Navigate and populate the registration data', async () => {
    registerpage = await mainPage.navigateToRegisterPage();
  });

  await test.step('Populate register data with already registered email', async () => {
    await registerpage.populateRegisterData({
      genderInput: registerPageData.genderFemale,
      alreadyRegisteredEmail: true,
    });
  });

  await test.step('Validate that the email is already registered', async () => {
    await expect(
      registerpage.elements.liFieldValidationError(errorMessagesData.alreadyRegisteredErrorMessage),
    ).toBeVisible();
  });
});
