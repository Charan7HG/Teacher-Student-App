const { expect } = require('@playwright/test');

class StudentListPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Students' });
    this.table = page.locator('table');
    this.searchInput = page.getByPlaceholder('Search by name or email');
    this.rows = page.locator('tbody tr');
  }

  async open() {
    await this.page.goto('/students');
    await expect(this.heading).toBeVisible();
  }

  async enableFreshListRequests() {
    await this.page.route('**/api/students', async (route) => {
      if (route.request().method() === 'GET') {
        const url = new URL(route.request().url());
        url.searchParams.set('refresh', Date.now().toString());
        await route.continue({ url: url.toString() });
        return;
      }

      await route.continue();
    });
  }

  async expectTableVisible() {
    await expect(this.table).toBeVisible();
  }

  async search(value) {
    await this.searchInput.fill(value);
  }

  rowFor(student) {
    return this.rows.filter({ hasText: student.email });
  }

  async expectRowVisible(student) {
    const row = this.rowFor(student);
    await expect(row).toContainText(student.name);
    await expect(row).toContainText(student.email);
    return row;
  }

  async expectNoResults() {
    await expect(this.page.getByText(/No students found matching/)).toBeVisible();
    await expect(this.rows).toHaveCount(0);
  }

  nameSortButton(direction) {
    return this.page.getByRole('button', {
      name: `Sort by student name ${direction}`
    });
  }

  async sortDescending() {
    await this.nameSortButton('descending').click();
  }

  async expectPage(pageNumber, totalPages) {
    await expect(this.page.getByText(`Page ${pageNumber} of ${totalPages}`)).toBeVisible();
  }

  async nextPage() {
    await this.page.getByRole('button', { name: 'Next page' }).click();
  }

  async previousPage() {
    await this.page.getByRole('button', { name: 'Previous page' }).click();
  }

  async deleteStudent(student, accept) {
    const row = await this.expectRowVisible(student);
    const dialogPromise = new Promise((resolve, reject) => {
      this.page.once('dialog', async (dialog) => {
        try {
          expect(dialog.type()).toBe('confirm');
          if (accept) {
            await dialog.accept();
          } else {
            await dialog.dismiss();
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

    await row.getByRole('button', { name: 'Delete' }).click();
    await dialogPromise;
  }

  async editStudent(student) {
    const row = await this.expectRowVisible(student);
    await row.getByRole('button', { name: 'Edit' }).click();
    await expect(this.page.getByRole('heading', { name: 'Edit Student' })).toBeVisible();
  }
}

module.exports = { StudentListPage };
