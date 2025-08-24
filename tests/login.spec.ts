import { test, expect } from '@playwright/test';
import MainPage from '../pages/mainpage';
import mainpageData from '../fixtures/mainpageData.json'
import errorMessage from '../fixtures/errorMessages.json'

test.beforeEach(async ({ page }) => {
  console.log(`Running ${test.info().title}`);
  await page.goto('/');
});

test('has title', async ({ page }) => {
  await test.step('Validate that page title is what expected', async() => {
    await expect(page).toHaveTitle('Demo Web Shop');
  });
});

test('user log in successful', async ({ page }) => {
  const mainPage = new MainPage(page);

  await test.step('User log in', async() =>{
    await mainPage.userLogIn(mainpageData.email, mainpageData.password);
  });

  await test.step('Validate user is logged in', async() =>{
    await expect(mainPage.elements.loggedInUserLink(mainpageData.email)).toBeVisible();
  });
});

test('user log in invalid password', async({ page }) => {
  const mainPage = new MainPage(page);

  await test.step('User log in', async() =>{
    await mainPage.userLogIn(mainpageData.email, mainpageData.invalidPassword);
  });

  await test.step('Validate that correct error messages appear', async() => {
    await expect(mainPage.elements.loginUnsuccesfulErrorLabel()).toHaveText(errorMessage.loginUnsuccesfulErrorMessage);
    await expect(mainPage.elements.credentialErrorLabel()).toHaveText(errorMessage.credentialsIncorrectErrorMessage);
  });
});

test('user log in invalid email', async({ page }) => {
  const mainPage = new MainPage(page);

  await test.step('User log in with invalid email', async() => {
    await mainPage.userInvalidEmailInput(mainpageData.invalidEmail);
  });

  await test.step('Validate that correct error messages appear', async() => {
    await expect(mainPage.elements.enterValidEmailErrorLabel()).toHaveText(errorMessage.invalidEmailErrorMessage);
  });
});

test('user log in empty password', async({ page }) => {
  const mainPage = new MainPage(page);

  await test.step('User log in', async() => {
    await mainPage.userLogIn(mainpageData.email, '');
  });

  await test.step('Validate that correct error messages appear', async() => {
    await expect(mainPage.elements.loginUnsuccesfulErrorLabel()).toHaveText(errorMessage.loginUnsuccesfulErrorMessage);
    await expect(mainPage.elements.credentialErrorLabel()).toHaveText(errorMessage.credentialsIncorrectErrorMessage);
  });
});