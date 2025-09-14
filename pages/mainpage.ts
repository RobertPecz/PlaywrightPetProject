import { Page } from '@playwright/test';
import RegisterPage from './registerpage';



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
        credentialErrorLabel : () => this.page.locator("//div[@class='validation-summary-errors']/ul/li"),
        enterValidEmailErrorLabel : () => this.page.locator("//span[@class='field-validation-error']/span[@for='Email']"),
        registerButton : () => this.page.locator("//a[text()='Register']")
    }

    async userLogIn(email: string, password: string) {
        await this.elements.loginButton().click();
        await this.elements.emailTextBox().fill(email);
        await this.elements.passwordTextBox().fill(password);
        await this.elements.signInButton().click();
    }

    //The reason why need to press enter because email validation happening on frontend side which could trigger with a keyboard press.
    async userInvalidEmailInput(email: string) {
        await this.elements.loginButton().click();
        await this.elements.emailTextBox().fill(email);
        await this.elements.emailTextBox().press('Enter');
    }

    async navigateToRegisterPage(): Promise<RegisterPage> {
        await this.elements.registerButton().click();
        return new RegisterPage(this.page);
    }
}

export default MainPage;