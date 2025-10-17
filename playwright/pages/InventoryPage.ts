import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly menuButton: Locator;
  readonly cartButton: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryContainer: Locator;
  readonly inventoryItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('Products');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.cartButton = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('.product_sort_container');
    this.inventoryContainer = page.locator('.inventory_container');
    this.inventoryItems = page.locator('.inventory_item');
  }

  /**
   * Navigate to inventory page
   */
  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  /**
   * Get all product cards
   */
  async getProductCards(): Promise<Locator[]> {
    await this.inventoryItems.first().waitFor();
    const count = await this.inventoryItems.count();
    const cards: Locator[] = [];
    
    for (let i = 0; i < count; i++) {
      cards.push(this.inventoryItems.nth(i));
    }
    
    return cards;
  }

  /**
   * Get product card by name
   */
  getProductCard(productName: string): Locator {
    return this.page.locator('.inventory_item', { hasText: productName });
  }

  /**
   * Add product to cart by name
   */
  async addToCart(productName: string): Promise<void> {
    const productCard = this.getProductCard(productName);
    const addButton = productCard.getByRole('button', { name: /add to cart/i });
    await addButton.click();
  }

  /**
   * Remove product from cart by name
   */
  async removeFromCart(productName: string): Promise<void> {
    const productCard = this.getProductCard(productName);
    const removeButton = productCard.getByRole('button', { name: /remove/i });
    await removeButton.click();
  }

  /**
   * Click on product name to view details
   */
  async clickProductName(productName: string): Promise<void> {
    const productCard = this.getProductCard(productName);
    const productLink = productCard.locator('.inventory_item_name');
    await productLink.click();
  }

  /**
   * Click on product image to view details
   */
  async clickProductImage(productName: string): Promise<void> {
    const productCard = this.getProductCard(productName);
    const productImage = productCard.locator('.inventory_item_img img');
    await productImage.click();
  }

  /**
   * Get product price by name
   */
  async getProductPrice(productName: string): Promise<string> {
    const productCard = this.getProductCard(productName);
    const priceElement = productCard.locator('.inventory_item_price');
    return await priceElement.textContent() || '';
  }

  /**
   * Get product description by name
   */
  async getProductDescription(productName: string): Promise<string> {
    const productCard = this.getProductCard(productName);
    const descElement = productCard.locator('.inventory_item_desc');
    return await descElement.textContent() || '';
  }

  /**
   * Check if product has 'Add to cart' button (not yet added)
   */
  async hasAddToCartButton(productName: string): Promise<boolean> {
    const productCard = this.getProductCard(productName);
    const addButton = productCard.getByRole('button', { name: /add to cart/i });
    return await addButton.isVisible();
  }

  /**
   * Check if product has 'Remove' button (already added)
   */
  async hasRemoveButton(productName: string): Promise<boolean> {
    const productCard = this.getProductCard(productName);
    const removeButton = productCard.getByRole('button', { name: /remove/i });
    return await removeButton.isVisible();
  }

  /**
   * Sort products by option
   */
  async sortBy(option: string): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  /**
   * Get cart item count from badge
   */
  async getCartItemCount(): Promise<number> {
    try {
      const badgeText = await this.cartBadge.textContent();
      return badgeText ? parseInt(badgeText, 10) : 0;
    } catch {
      return 0; // No badge visible means 0 items
    }
  }

  /**
   * Navigate to cart page
   */
  async goToCart(): Promise<void> {
    await this.cartButton.click();
  }

  /**
   * Open side menu
   */
  async openMenu(): Promise<void> {
    await this.menuButton.click();
  }

  /**
   * Logout from side menu
   */
  async logout(): Promise<void> {
    await this.openMenu();
    const logoutLink = this.page.getByRole('link', { name: /logout/i });
    await logoutLink.click();
  }

  /**
   * Get all product names currently visible
   */
  async getAllProductNames(): Promise<string[]> {
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
   * Get all product prices currently visible
   */
  async getAllProductPrices(): Promise<string[]> {
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
   * Check if inventory page is loaded
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.pageTitle.waitFor({ timeout: 5000 });
      const title = await this.pageTitle.textContent();
      return title === 'Products';
    } catch {
      return false;
    }
  }
}