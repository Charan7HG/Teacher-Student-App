const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Teacher Dashboard' });
  }

  async expectVisible() {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.heading).toBeVisible();
  }

  async openRegistration() {
    await this.page.getByRole('button', { name: 'Register Student' }).click();
  }

  async openStudentList() {
    await this.page.getByRole('button', { name: 'View Students' }).click();
  }

  async logout() {
    await this.page.getByRole('button', { name: 'Logout' }).click();
    await expect(this.page).toHaveURL(/\/login$/);
  }
}

module.exports = { DashboardPage };
