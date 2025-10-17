import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('Your Cart');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.getByRole('button', { name: /checkout/i });
    this.continueShoppingButton = page.getByRole('button', { name: /continue shopping/i });
  }

  /**
   * Navigate to the cart page
   */
  async goto(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  /**
   * Get all cart item names
   */
  async getCartItemNames(): Promise<string[]> {
    const nameElements = this.page.locator('.inventory_item_name');
    const count = await nameElements.count();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      const name = await nameElements.nth(i).textContent();
      if (name) names.push(name);
    }

    return names;
  }

  /**
   * Get all cart item prices
   */
  async getCartItemPrices(): Promise<string[]> {
    const priceElements = this.page.locator('.inventory_item_price');
    const count = await priceElements.count();
    const prices: string[] = [];

    for (let i = 0; i < count; i++) {
      const price = await priceElements.nth(i).textContent();
      if (price) prices.push(price);
    }

    return prices;
  }

  /**
   * Remove an item from the cart by name
   */
  async removeItem(productName: string): Promise<void> {
    const cartItem = this.page.locator('.cart_item', { hasText: productName });
    const removeButton = cartItem.getByRole('button', { name: /remove/i });
    await removeButton.click();
  }

  /**
   * Click the checkout button to start checkout process
   */
  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Continue shopping (go back to inventory)
   */
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
