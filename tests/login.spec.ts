import { test, expect } from '@playwright/test';
import MainPage from '../pages/mainpage';
import mainpageData from '../fixtures/mainpageData.json'

test.beforeEach(async ({ page }) => {
  console.log(`Running ${test.info().title}`);
  await page.goto('https://demowebshop.tricentis.com/');
});

test('has title', async ({ page }) => {

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Demo Web Shop');
});

test('user log in successful', async ({ page }) => {
  const mainPage = new MainPage(page);

  await mainPage.userLogIn(mainpageData.email, mainpageData.password);
  await expect(mainPage.elements.loggedInUserLink(mainpageData.email)).toBeVisible();
});
