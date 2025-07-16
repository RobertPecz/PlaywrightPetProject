import { Page } from '@playwright/test';


class MainPage {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        
    }

    elements = {
        loginButton : () => this.page.getByRole('link', { name: 'Log in' }),
        emailTextBox : () => this.page.getByTestId('Email'),
        passwordTextBox : () => this.page.getByTestId('Password'),
        signInButton : () => this.page.locator('//input[@value="Log in"]'),
        loggedInUserLink : (loggedInName: string) => this.page.getByRole('link', {name: loggedInName}),
        loginUnsuccesfulErrorLabel : () => this.page.locator("//div[@class='validation-summary-errors']/span"),
        credentialErrorLabel : () => this.page.locator("//div[@class='validation-summary-errors']/ul/li")

    }

    async userLogIn(email: string, password: string) {
        await this.elements.loginButton().click();
        await this.elements.emailTextBox().fill(email);
        await this.elements.passwordTextBox().fill(password);
        await this.elements.signInButton().click();
    }
}

export default MainPage;