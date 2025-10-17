import { expect, Locator, Page } from '@playwright/test';

/**
 * Helper function to assert that a locator is visible
 * Uses Playwright's built-in auto-wait and retry mechanism
 */
export async function expectVisible(locator: Locator): Promise<void> {
  await expect(locator).toBeVisible();
}

/**
 * Helper function to assert that a locator is hidden
 */
export async function expectHidden(locator: Locator): Promise<void> {
  await expect(locator).toBeHidden();
}

/**
 * Helper function to assert that a locator contains specific text
 * Supports regex for flexible text matching
 */
export async function expectContainsText(locator: Locator, text: string | RegExp): Promise<void> {
  await expect(locator).toContainText(text);
}

/**
 * Helper function to assert that a locator has exact text
 */
export async function expectHasText(locator: Locator, text: string | RegExp): Promise<void> {
  await expect(locator).toHaveText(text);
}

/**
 * Helper function to assert that a locator has a specific value (for inputs)
 */
export async function expectHasValue(locator: Locator, value: string | RegExp): Promise<void> {
  await expect(locator).toHaveValue(value);
}

/**
 * Helper function to assert that page URL matches a pattern
 */
export async function expectURLMatches(page: Page, pattern: string | RegExp): Promise<void> {
  await expect(page).toHaveURL(pattern);
}

/**
 * Helper function to assert that page title contains specific text
 */
export async function expectTitleContains(page: Page, text: string | RegExp): Promise<void> {
  await expect(page).toHaveTitle(text);
}

/**
 * Helper function to assert that a locator is enabled
 */
export async function expectEnabled(locator: Locator): Promise<void> {
  await expect(locator).toBeEnabled();
}

/**
 * Helper function to assert that a locator is disabled
 */
export async function expectDisabled(locator: Locator): Promise<void> {
  await expect(locator).toBeDisabled();
}

/**
 * Helper function to assert that a locator is checked (for checkboxes/radios)
 */
export async function expectChecked(locator: Locator): Promise<void> {
  await expect(locator).toBeChecked();
}

/**
 * Helper function to assert that a locator is not checked
 */
export async function expectUnchecked(locator: Locator): Promise<void> {
  await expect(locator).not.toBeChecked();
}

/**
 * Helper function to assert element count
 */
export async function expectCount(locator: Locator, count: number): Promise<void> {
  await expect(locator).toHaveCount(count);
}

/**
 * Console error tracking utilities
 */
export interface ConsoleError {
  message: string;
  type: string;
  timestamp: Date;
}

let consoleErrors: ConsoleError[] = [];

/**
 * Attach console error listener to page
 * Call this in test.beforeEach
 */
export function attachConsoleErrorListener(page: Page, errors: ConsoleError[] = consoleErrors): void {
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push({
        message: msg.text(),
        type: msg.type(),
        timestamp: new Date()
      });
    }
  });
  
  page.on('pageerror', (error) => {
    errors.push({
      message: error.message,
      type: 'pageerror',
      timestamp: new Date()
    });
  });
}

/**
 * Assert that no console errors occurred during test
 * Call this in test.afterEach or at the end of test
 * Note: Filters out React warnings as they are expected in dev mode
 */
export function assertNoConsoleErrors(errors: ConsoleError[] = consoleErrors): void {
  const criticalErrors = errors.filter(e =>
    !e.message.includes('Warning:') && 
    !e.message.includes('React state update on an unmounted component')
  );
  
  if (criticalErrors.length > 0) {
    const errorMessages = criticalErrors.map(e => `[${e.type}] ${e.message}`).join('\n');
    throw new Error(`Console errors detected:\n${errorMessages}`);
  }
}

/**
 * Clear console errors array
 * Call this in test.beforeEach to reset for each test
 */
export function clearConsoleErrors(errors: ConsoleError[] = consoleErrors): void {
  errors.length = 0;
}