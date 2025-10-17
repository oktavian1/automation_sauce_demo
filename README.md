# Automation Sauce Demo

Automated testing suite for [Sauce Demo](https://www.saucedemo.com/) e-commerce application using Playwright and TypeScript.

## Tech Stack

- **Playwright** - Modern end-to-end testing framework
- **TypeScript** - Type-safe JavaScript
- **Node.js** - JavaScript runtime
- **ESLint & Prettier** - Code quality and formatting

## Project Structure

```
playwright/
├── pages/              # Page Object Models
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/              # Test specifications
│   ├── login.spec.ts
│   ├── cart.spec.ts
│   └── checkout.spec.ts
├── helpers/            # Utility functions
│   ├── assert.ts       # Custom assertions
│   ├── testStep.ts     # Test step utilities with evidence capture
│   └── forms.ts        # Form helpers
├── fixtures/           # Test data
│   ├── users.json
│   └── testData.ts
├── common/             # Common utilities
│   ├── logger.ts       # Structured logging
│   └── utils.ts        # Shared utilities
└── auth.setup.ts       # Authentication setup
```

## Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- Git

## Installation

```bash
# Clone repository
git clone https://github.com/oktavian1/automation_sauce_demo.git

# Navigate to project directory
cd automation_sauce_demo

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

##  Running Tests

### Run all tests
```bash
npm test
```

### Run specific test file
```bash
npx playwright test login.spec.ts
```

### Run tests by tag
```bash
# Run smoke tests only
npx playwright test --grep @smoke

# Run regression tests only
npx playwright test --grep @regression
```

### Run in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Debug mode
```bash
npx playwright test --debug
```

### Generate HTML report
```bash
npx playwright show-report
```

## Test Coverage

### Login Tests (`login.spec.ts`)
- ✅ Valid user login
- ✅ Invalid password handling
- ✅ Invalid username handling
- ✅ Empty field validations
- ✅ Locked user handling
- ✅ Logout functionality
- ✅ Error message handling

### Cart Tests (`cart.spec.ts`)
- ✅ Add product to cart
- ✅ Remove product from cart
- ✅ Add multiple products
- ✅ View cart contents
- ✅ Cart persistence across pages
- ✅ Product sorting

### Checkout Tests (`checkout.spec.ts`)
- ✅ Complete checkout flow
- ✅ Form validation (first name, last name, postal code)
- ✅ Multiple products checkout
- ✅ Cancel checkout
- ✅ Order completion
- ✅ Cart badge clearing after checkout

### Evidence Capture
- Automatic screenshot on failure
- Page source attachment on error
- Console error tracking
- Structured logging with Winston

### Console Error Monitoring
- Automatic console error listener
- Filters out expected warnings (React dev mode)
- Fails tests on critical errors

### Test Organization
- **@smoke** - Critical path tests, run on every build
- **@regression** - Full regression suite

## Configuration

Configuration is managed in `playwright.config.ts`:
- Parallel execution enabled
- Retries on CI: 2
- Trace on first retry
- Video and screenshots on failure
- Multiple browser support (Chromium, Firefox, WebKit)

## Reporting

After test execution, view detailed HTML report:
```bash
npx playwright show-report
```

Reports include:
- Test results with pass/fail status
- Screenshots and videos for failures
- Traces for debugging
- Console logs
- Network activity

## License

This project is for portfolio demonstration purposes.

## Author

**Ilham Oktavian**
- GitHub: [@oktavian1](https://github.com/oktavian1)

## Links

- [Playwright Documentation](https://playwright.dev/)
- [Sauce Demo App](https://www.saucedemo.com/)
