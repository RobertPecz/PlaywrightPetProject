import { test, expect } from '@playwright/test';
import MainPage from '../pages/mainpage';
import RegisterPage from '../pages/registerpage';

test.beforeEach(async ({ page }) => {
  console.log(`Running ${test.info().title}`);
  await page.goto('/');
});

test('Register user with valid data', async ({ page }) => {
    let registerpage: RegisterPage;
    const mainPage = new MainPage(page);

    await test.step('Navigate and populate the registration data', async () => {
        registerpage = await mainPage.navigateToRegisterPage();
    })

    await test.step('Populate register data', async () => {
        
    })
})