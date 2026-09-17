const { expect } = require('@playwright/test');

class StudentRegistrationPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Register Student' });
    this.registerButton = page.getByRole('button', { name: 'Register Student' });
  }

  async expectVisible() {
    await expect(this.heading).toBeVisible();
  }

  async fillStudent(student) {
    await this.page.getByLabel('Student Name').fill(student.name);
    await this.page.getByLabel('Email').fill(student.email);
    await this.page.getByLabel('Phone Number').fill(student.phone || '9876543210');
    await this.page.getByRole('radio', { name: student.genderLabel || 'Male', exact: true }).check();
    await this.page.getByLabel('Course').selectOption(student.course || 'cse');

    await this.page.getByRole('button', { name: 'Select section' }).click();
    await this.page.getByRole('option', { name: `Section ${student.section || 'A'}` }).click();

    await this.page.getByRole('checkbox', { name: student.skillLabel || 'Java' }).check();
    await this.page.getByLabel('Date of Birth').fill(student.dob || '2000-01-15');
    await this.page.getByPlaceholder('Type to search city').fill(student.city || 'Bang');
    await this.page.getByRole('option', { name: student.city || 'Bangalore' }).click();
    await this.page.getByLabel('Address').fill(student.address || '123 Playwright Avenue');
  }

  async registerSuccessfully() {
    const dialogPromise = new Promise((resolve, reject) => {
      this.page.once('dialog', async (dialog) => {
        try {
          expect(dialog.message()).toBe('Student registration successful!');
          await dialog.accept();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

    await this.registerButton.click();
    await dialogPromise;
  }

  async submitInvalidForm() {
    await this.registerButton.click();
  }

  async expectValidationMessage(message) {
    await expect(this.page.getByText(message, { exact: true })).toBeVisible();
  }

  async registerExpectingFailure(expectedMessage) {
    const dialogPromise = this.page.waitForEvent('dialog');
    await this.registerButton.click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toBe(expectedMessage);
    await dialog.dismiss();
  }
}

module.exports = { StudentRegistrationPage };
