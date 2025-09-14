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
        registrationCompleteText : (resultText : string) => this.page.locator(`//div[contains(text(), ${resultText})]`),
        continueButton : () => this.page.locator("//input[@value='Continue']")
    }

    populateRegisterData(data: object) {
        if(data['gender'].toLowerCase() === 'male') {
            this.elements.genderMaleRadioButton().click();
        }
        else if(data['gender'].toLowerCase() === 'female') {
            this.elements.genderFemaleRadioButton().click();
        }
        else {
            throw Error("Only 'male' or 'female' can choose as gender.");
        }

        //Change data from object to random characters it won't reregister the same user with different email.
        this.elements.firstnameTextbox().fill(data['firstname']);
        this.elements.lastnameTextbox().fill(data['lastname']);
        this.elements.emailTextbox().fill(this.createRandomEmail());
        this.elements.passwordTextbox().fill(data['password']);
        this.elements.confirmPasswordTextbox().fill(data['password']);
        this.elements.continueButton().click();
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