import { Page, Locator } from '@playwright/test';

/**
 * Fill an input field by its placeholder text
 */
export async function fillByPlaceholder(page: Page, placeholder: string, value: string): Promise<void> {
  await page.getByPlaceholder(placeholder).fill(value);
}

/**
 * Fill an input field by its label text
 */
export async function fillByLabel(page: Page, label: string | RegExp, value: string): Promise<void> {
  await page.getByLabel(label).fill(value);
}

/**
 * Fill an input field by test ID
 */
export async function fillByTestId(page: Page, testId: string, value: string): Promise<void> {
  await page.getByTestId(testId).fill(value);
}

/**
 * Select a radio button by its label
 */
export async function selectRadioByLabel(page: Page, groupName: string, value: string): Promise<void> {
  await page.getByRole('radio', { name: value }).check();
}

/**
 * Set checkbox state by label
 */
export async function setCheckboxByLabel(page: Page, label: string | RegExp, checked: boolean): Promise<void> {
  const checkbox = page.getByLabel(label);
  if (checked) {
    await checkbox.check();
  } else {
    await checkbox.uncheck();
  }
}

/**
 * Select option from native dropdown by label
 */
export async function selectNativeDropdownByLabel(page: Page, label: string | RegExp, value: string): Promise<void> {
  await page.getByLabel(label).selectOption(value);
}

/**
 * Select option from native dropdown by test ID
 */
export async function selectNativeDropdownByTestId(page: Page, testId: string, value: string): Promise<void> {
  await page.getByTestId(testId).selectOption(value);
}

/**
 * Choose from autocomplete/combobox
 */
export async function chooseFromAutocomplete(
  page: Page, 
  inputLocator: string | Locator, 
  searchText: string, 
  optionText: string
): Promise<void> {
  const input = typeof inputLocator === 'string' ? page.locator(inputLocator) : inputLocator;
  
  // Type to trigger autocomplete
  await input.fill(searchText);
  
  // Wait for options to appear and select the desired one
  await page.getByRole('option', { name: optionText }).click();
}

/**
 * Fill date input by label (for date picker inputs)
 */
export async function fillDateInputByLabel(page: Page, label: string | RegExp, date: string): Promise<void> {
  await page.getByLabel(label).fill(date);
}

/**
 * Clear input field by placeholder
 */
export async function clearByPlaceholder(page: Page, placeholder: string): Promise<void> {
  await page.getByPlaceholder(placeholder).clear();
}

/**
 * Clear input field by label
 */
export async function clearByLabel(page: Page, label: string | RegExp): Promise<void> {
  await page.getByLabel(label).clear();
}

/**
 * Upload file by input selector
 */
export async function uploadFile(page: Page, inputSelector: string, filePath: string | string[]): Promise<void> {
  await page.setInputFiles(inputSelector, filePath);
}

/**
 * Submit form by role
 */
export async function submitForm(page: Page, submitButtonName?: string): Promise<void> {
  const buttonName = submitButtonName || /submit|save|send|create|update/i;
  await page.getByRole('button', { name: buttonName }).click();
}

/**
 * Reset form by role  
 */
export async function resetForm(page: Page): Promise<void> {
  await page.getByRole('button', { name: /reset|clear|cancel/i }).click();
}