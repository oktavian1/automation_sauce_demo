export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface SortOption {
  value: string;
  label: string;
}

// Product data based on Sauce Demo inventory
export const products: Record<string, Product> = {
  backpack: {
    id: 'sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
    price: '$29.99',
    description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.'
  },
  bikeLight: {
    id: 'sauce-labs-bike-light',
    name: 'Sauce Labs Bike Light',
    price: '$9.99',
    description: "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included."
  },
  boltTShirt: {
    id: 'sauce-labs-bolt-t-shirt',
    name: 'Sauce Labs Bolt T-Shirt',
    price: '$15.99',
    description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.'
  },
  fleeceJacket: {
    id: 'sauce-labs-fleece-jacket',
    name: 'Sauce Labs Fleece Jacket',
    price: '$49.99',
    description: "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office."
  },
  onesie: {
    id: 'sauce-labs-onesie',
    name: 'Sauce Labs Onesie',
    price: '$7.99',
    description: "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeves and bottom won't unravel."
  },
  redTShirt: {
    id: 'test.allthethings()-t-shirt-(red)',
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: '$15.99',
    description: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton blend slim fit you\'ll love what you\'re wearing.'
  }
};

// Valid checkout information
export const validCheckoutInfo: CheckoutInfo[] = [
  {
    firstName: 'John',
    lastName: 'Doe', 
    postalCode: '12345'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    postalCode: '54321'
  },
  {
    firstName: 'Michael',
    lastName: 'Johnson',
    postalCode: '98765'
  }
];

// Invalid checkout information for negative testing
export const invalidCheckoutInfo = {
  emptyFirstName: {
    firstName: '',
    lastName: 'Doe',
    postalCode: '12345'
  },
  emptyLastName: {
    firstName: 'John',
    lastName: '',
    postalCode: '12345'
  },
  emptyPostalCode: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: ''
  },
  allEmpty: {
    firstName: '',
    lastName: '',
    postalCode: ''
  }
};

// Sort options available in the product listing
export const sortOptions: SortOption[] = [
  { value: 'az', label: 'Name (A to Z)' },
  { value: 'za', label: 'Name (Z to A)' },
  { value: 'lohi', label: 'Price (low to high)' },
  { value: 'hilo', label: 'Price (high to low)' }
];

// Common test data
export const testData = {
  baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
  defaultTimeout: 10000,
  expectedProductCount: 6,
  currencies: ['$'],
  
  // Error messages
  errorMessages: {
    invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
    lockedUser: 'Epic sadface: Sorry, this user has been locked out.',
    missingUsername: 'Epic sadface: Username is required',
    missingPassword: 'Epic sadface: Password is required',
    missingFirstName: 'Error: First Name is required',
    missingLastName: 'Error: Last Name is required',
    missingPostalCode: 'Error: Postal Code is required'
  },

  // Page URLs
  urls: {
    login: '/',
    inventory: '/inventory.html',
    cart: '/cart.html',
    checkout: '/checkout-step-one.html',
    checkoutTwo: '/checkout-step-two.html',
    complete: '/checkout-complete.html'
  }
};

// Helper function to get random checkout info
export function getRandomCheckoutInfo(): CheckoutInfo {
  const randomIndex = Math.floor(Math.random() * validCheckoutInfo.length);
  return validCheckoutInfo[randomIndex];
}

// Helper function to get random product
export function getRandomProduct(): Product {
  const productKeys = Object.keys(products);
  const randomKey = productKeys[Math.floor(Math.random() * productKeys.length)];
  return products[randomKey];
}

// Helper function to get multiple random products
export function getRandomProducts(count: number): Product[] {
  const productList = Object.values(products);
  const shuffled = [...productList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, productList.length));
}