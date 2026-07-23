import { Page } from '@playwright/test';

class EmailAFriendPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  elements = {
    productLink: () => this.page.locator('.email-a-friend-page .title h2 a.product'),
    friendEmailInput: () => this.page.locator('#FriendEmail'),
    yourEmailInput: () => this.page.locator('#YourEmailAddress'),
    personalMessageInput: () => this.page.locator('#PersonalMessage'),
    sendEmailButton: () => this.page.locator('input[value="Send email"]'),
    resultMessage: () => this.page.locator('.email-a-friend-page .result'),
    validationErrors: () => this.page.locator('.email-a-friend-page .message-error .validation-summary-errors'),
  };

  async sendEmail(friendEmail: string, yourEmail: string, personalMessage: string = '') {
    await this.elements.friendEmailInput().fill(friendEmail);
    await this.elements.yourEmailInput().fill(yourEmail);
    if (personalMessage) {
      await this.elements.personalMessageInput().fill(personalMessage);
    }
    await this.elements.sendEmailButton().click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

export default EmailAFriendPage;
