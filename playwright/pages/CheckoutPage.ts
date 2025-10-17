import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly backHomeButton: Locator;
  readonly errorMessage: Locator;
  readonly summaryItems: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder(/zip.*postal/i);
    this.continueButton = page.getByRole('button', { name: /continue/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.finishButton = page.getByRole('button', { name: /finish/i });
    this.backHomeButton = page.getByRole('button', { name: /back.*home|back.*products/i });
    this.errorMessage = page.locator('[data-test="error"]');
    // Structural/summary elements
    this.summaryItems = page.locator('.cart_item');
    this.itemTotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');
  }

  /**
   * Navigate to checkout step one page
   */
  async goto(): Promise<void> {
    await this.page.goto('/checkout-step-one.html');
  }

  /**
   * Fill checkout information (step one)
   */
  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  /**
   * Click continue to proceed to step two
   */
  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  /**
   * Click finish to complete the order (step two)
   */
  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  /**
   * Click back home from complete page
   */
  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Check if error is visible
   */
  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Get summary item count
   */
  async getSummaryItemCount(): Promise<number> {
    return await this.summaryItems.count();
  }

  /**
   * Check if on step two page
   */
  async isOnStepTwo(): Promise<boolean> {
    try {
      await this.finishButton.waitFor({ timeout: 5000 });
      const title = await this.pageTitle.textContent();
      return title?.includes('Checkout: Overview') || false;
    } catch {
      return false;
    }
  }

  /**
   * Check if on complete page
   */
  async isOnComplete(): Promise<boolean> {
    try {
      await this.backHomeButton.waitFor({ timeout: 5000 });
      const title = await this.pageTitle.textContent();
      return title?.includes('Checkout: Complete!') || false;
    } catch {
      return false;
    }
  }
}
