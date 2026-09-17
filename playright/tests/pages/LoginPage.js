const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async open() {
    await this.page.goto('/login');
    await expect(this.page.getByRole('heading', { name: 'Teacher Login' })).toBeVisible();
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectInvalidCredentialsMessage() {
    await expect(this.page.getByText('Invalid email or password', { exact: true })).toBeVisible();
  }
}

module.exports = { LoginPage };
