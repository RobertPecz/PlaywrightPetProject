import { Page } from '@playwright/test';

class RegisterPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        
    }

    elements = {
        genderMaleRadioButton : () => this.page.getByTestId('gender-male'),
        genderFemaleRadioButton : () => this.page.getByTestId('gender-female'),
        firstnameTextbox : () => this.page.getByTestId('FirstName'),
        lastnameTextbox : () => this.page.getByTestId('LastName'),
        emailTextbox : () => this.page.getByTestId('Email'),
        passwordTextbox : () => this.page.getByTestId('Password'),
        confirmPasswordTextbox : () => this.page.getByTestId('ConfirmPassword'),
        registerButton : () => this.page.getByTestId('register-button'),
        registrationCompleteText : (resultText : string) => this.page.locator(`//div[contains(text(), "${resultText}")]`),
        continueButton : () => this.page.locator("//input[@value='Continue']")
    }

    async populateRegisterData(genderInput: string) {
        if(genderInput.toLowerCase() === 'male') {
            await this.elements.genderMaleRadioButton().click();
        }
        else if(genderInput.toLowerCase() === 'female') {
            await this.elements.genderFemaleRadioButton().click();
        }
        else {
            throw Error("Only 'male' or 'female' can choose as gender.");
        }

        await this.elements.firstnameTextbox().fill(this.createRandomString(5));
        await this.elements.lastnameTextbox().fill(this.createRandomString(5));
        await this.elements.emailTextbox().fill(this.createRandomEmail());

        const pwd: string = this.createRandomString(6);
        await this.elements.passwordTextbox().fill(pwd);
        await this.elements.confirmPasswordTextbox().fill(pwd);
        await this.elements.registerButton().click();
    }

    createRandomString(length: number) {
        let result = '';
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let index = 0; index < length; index++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));           
        }

        return result;
    }

    createRandomEmail() {
        let randomEmail = '';
        randomEmail += this.createRandomString(5) + "@" + this.createRandomString(5) + ".com"
        
        return randomEmail;
    }
}

export default RegisterPage;