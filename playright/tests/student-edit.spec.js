const { test, expect } = require('@playwright/test');
const {
  bypassStudentListCache,
  createStudentData,
  loginAsTeacher,
  openStudentRow,
  registerStudent
} = require('./support/student-workflows');

test('Teacher can edit an existing student', async ({ page }) => {
  const student = createStudentData('Edit');

  await loginAsTeacher(page);
  await registerStudent(page, student);
  await page.goto('/students');

  const studentRow = await openStudentRow(page, student);
  await studentRow.getByRole('button', { name: 'Edit' }).click();

  await expect(page).toHaveURL(/edit-student/);
  await expect(page.getByRole('heading', { name: 'Edit Student' })).toBeVisible();
  await expect(page.getByLabel('Student Name')).toHaveValue(student.name);
  await expect(page.getByLabel('Email')).toHaveValue(student.email);

  await page.getByLabel('Course').selectOption('ise');
  await page.getByRole('button', { name: 'Update Student' }).click();

  await expect(page.getByText('Student updated successfully!')).toBeVisible();
  await bypassStudentListCache(page);
  await page.goto('/students');

  const updatedRow = await openStudentRow(page, student);
  await expect(updatedRow).toContainText('ise');
});