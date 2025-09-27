import { test, expect } from '@playwright/test';
import MainPage from '../pages/mainpage';
import RegisterPage from '../pages/registerpage';
import registerPageData from '../fixtures/registerData.json';
import errorMessagesData from '../fixtures/errorMessages.json'

test.beforeEach(async ({ page }) => {
  console.log(`Running ${test.info().title}`);
  await page.goto('/');
});

test('Register user with valid data', async ({ page }) => {
    let registerpage: RegisterPage;
    const mainPage = new MainPage(page);
    const isValidEmail = true;

    await test.step('Navigate and populate the registration data', async () => {
        registerpage = await mainPage.navigateToRegisterPage();
    });

    await test.step('Populate register data', async () => {
        await registerpage.populateRegisterData(registerPageData.genderMale, isValidEmail);
    });

    await test.step('Validate that the registration was successful', async () => {
        await expect(registerpage.elements.registrationCompleteText(registerPageData.loginSuccesfulMessage)).toBeVisible();
        await expect(registerpage.elements.continueButton()).toBeVisible();
    });    
})

test('Register user with invalid email', async ({ page }) => {
    let registerpage: RegisterPage;
    const mainPage = new MainPage(page);
    const isValidEmail = false;

    await test.step('Navigate and populate the registration data', async () => {
        registerpage = await mainPage.navigateToRegisterPage();
    });

    await test.step('Populate register data with invalid email', async () => {
        await registerpage.populateRegisterData(registerPageData.genderMale, isValidEmail);
    });

    await test.step('Validate that the email is invalid', async () => {
        await expect(registerpage.elements.emailTextboxWrongEmail()).toBeVisible();
        await expect(registerpage.elements.fieldValidationError(errorMessagesData.invalidEmailRegistrationErrorMessage)).toBeVisible();
    });    
})