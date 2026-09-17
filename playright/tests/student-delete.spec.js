const { test, expect } = require('@playwright/test');
const {
  createStudentData,
  loginAsTeacher,
  openStudentRow,
  registerStudent
} = require('./support/student-workflows');

test('Teacher can delete an existing student', async ({ page }) => {
  const student = createStudentData('Delete');

  await loginAsTeacher(page);
  await registerStudent(page, student);
  await page.goto('/students');

  const studentRow = await openStudentRow(page, student);
  page.once('dialog', async (dialog) => {
    expect(dialog.type()).toBe('confirm');
    expect(dialog.message()).toBe('Are you sure you want to delete this student?');
    await dialog.accept();
  });
  await studentRow.getByRole('button', { name: 'Delete' }).click();

  await expect(page.locator('tbody tr').filter({ hasText: student.email })).toHaveCount(0);
});

test('Teacher can cancel student deletion', async ({ page }) => {
  const student = createStudentData('CancelDelete');

  await loginAsTeacher(page);
  await registerStudent(page, student);
  await page.goto('/students');

  const studentRow = await openStudentRow(page, student);
  page.once('dialog', async (dialog) => {
    expect(dialog.type()).toBe('confirm');
    await dialog.dismiss();
  });
  await studentRow.getByRole('button', { name: 'Delete' }).click();

  await expect(await openStudentRow(page, student)).toBeVisible();
});