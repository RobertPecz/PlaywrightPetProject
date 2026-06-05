import mainpageData from '../fixtures/mainpageData.json';
import { test, expect } from '@playwright/test';
import MainPage from '../pages/mainpage';

test.describe('Logout tests', () => {
  test.beforeEach(async ({ page }) => {
    console.log(`Running ${test.info().title}`);
    await page.goto('/');
  });

  test('User log out successful', async ({ page }) => {
    const mainPage = new MainPage(page);

    await test.step('User log in', async () => {
      await mainPage.userLogIn(mainpageData.email, mainpageData.password);
    });

    await test.step('Validate user is logged in', async () => {
      await expect(mainPage.elements.loggedInUserLink(mainpageData.email)).toBeVisible();
    });

    await test.step('User log out', async () => {
      await mainPage.userLogOut();
    });

    await test.step('Validate user is logged out by checking login button is visible', async () => {
      await expect(mainPage.elements.loginButton()).toBeVisible();
    });
  });
});
