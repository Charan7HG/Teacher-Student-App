const { test, expect } = require('@playwright/test');
const {
  bypassStudentListCache,
  createStudentData,
  loginAsTeacher,
  openStudentRow,
  registerStudent
} = require('./support/student-workflows');

test('Teacher can complete the complete student CRUD workflow', async ({ page }) => {
  const student = createStudentData('Crud');

  await loginAsTeacher(page);

  await registerStudent(page, student);
  await page.goto('/students');
  await expect(page.getByRole('heading', { name: 'Students' })).toBeVisible();
  await expect(await openStudentRow(page, student)).toBeVisible();

  await page.getByPlaceholder('Search by name or email').fill(student.name);
  const searchedRow = await openStudentRow(page, student);
  await expect(searchedRow).toContainText(student.email);
  await expect(page.locator('tbody tr')).toHaveCount(1);

  await searchedRow.getByRole('button', { name: 'Edit' }).click();
  await expect(page.getByRole('heading', { name: 'Edit Student' })).toBeVisible();
  await expect(page.getByLabel('Student Name')).toHaveValue(student.name);
  await page.getByLabel('Course').selectOption('ise');
  const updateResponse = page.waitForResponse((response) =>
    response.url().includes('/api/students/') &&
    response.request().method() === 'PUT' &&
    response.ok()
  );
  await page.getByRole('button', { name: 'Update Student' }).click();
  await expect((await updateResponse).json()).resolves.toMatchObject({ course: 'ise' });
  await expect(page.getByText('Student updated successfully!')).toBeVisible();

  await bypassStudentListCache(page);
  await page.goto('/students');
  const updatedRow = await openStudentRow(page, student);
  await expect(updatedRow).toContainText('ise');

  page.once('dialog', async (dialog) => {
    expect(dialog.type()).toBe('confirm');
    await dialog.accept();
  });
  await updatedRow.getByRole('button', { name: 'Delete' }).click();

  await expect(page.locator('tbody tr').filter({ hasText: student.email })).toHaveCount(0);
});