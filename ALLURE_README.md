# Allure Report Setup

Allure Framework adalah test reporting tool yang powerful dengan UI interaktif dan informasi detail.

## 🚀 Quick Start

### **Local Development:**

```bash
# Run tests dan generate Allure report
npm run test:allure

# Atau step by step:
npm test                    # Run tests
npm run allure:generate     # Generate report
npm run allure:open         # Open report in browser

# Serve report langsung dari results (tanpa generate)
npm run allure:serve

# Clean up
npm run allure:clean
```

---

## 📊 Features Allure Report

✅ **Rich Test Details**
- Test execution timeline
- Step-by-step breakdown
- Screenshots, videos, traces
- Network logs & console errors

✅ **Trends & Analytics**
- Test duration trends
- Pass/fail rate over time
- Flaky test detection
- Categories & tags

✅ **Categorization**
- @smoke, @regression tags
- Severity levels
- Epic/Feature/Story hierarchy
- Custom labels

✅ **Attachments**
- Screenshots on failure
- Video recordings
- Trace files
- Custom attachments

---

## 🎯 Enhanced Test Annotations

```typescript
import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';

test('Login test', async ({ page }) => {
  // Add labels
  await allure.epic('Authentication');
  await allure.feature('Login');
  await allure.story('User Login');
  await allure.severity('critical');
  await allure.owner('QA Team');
  
  // Add description
  await allure.description('Verify user can login with valid credentials');
  
  // Add links
  await allure.link('https://jira.company.com/TICKET-123', 'JIRA');
  await allure.issue('BUG-456', 'https://github.com/user/repo/issues/456');
  
  // Test steps with attachments
  await allure.step('Navigate to login', async () => {
    await page.goto('/login');
  });
  
  await allure.step('Enter credentials', async () => {
    await page.fill('[name="username"]', 'user@example.com');
    await page.fill('[name="password"]', 'password123');
  });
  
  await allure.step('Submit form', async () => {
    await page.click('button[type="submit"]');
  });
  
  // Add custom attachment
  await allure.attachment('Response', JSON.stringify({ status: 'ok' }), 'application/json');
});
```

---

## 🔧 CI/CD Integration

### **GitHub Actions:**

The workflow automatically:
1. Runs tests and generates `allure-results`
2. Generates HTML report with `allure generate`
3. Uploads report as artifact
4. Deploys to GitHub Pages

**View Reports:**
- **Artifacts:** Download from Actions run
- **GitHub Pages:** https://oktavian1.github.io/automation_sauce_demo/

---

## 📂 Directory Structure

```
automation/
├── allure-results/          # Raw test results (generated after test run)
│   ├── *-result.json
│   ├── *-container.json
│   └── *-attachment.*
├── allure-report/           # Generated HTML report (after allure:generate)
│   ├── index.html
│   ├── widgets/
│   └── data/
├── playwright/
│   └── tests/
└── playwright.config.ts     # Allure reporter configured here
```

---

## 🎨 Allure Categories

Create `categories.json` in project root to group failures:

```json
[
  {
    "name": "Product defects",
    "matchedStatuses": ["failed"],
    "messageRegex": ".*AssertionError.*"
  },
  {
    "name": "Test infrastructure",
    "matchedStatuses": ["broken", "failed"],
    "messageRegex": ".*timeout.*"
  },
  {
    "name": "Flaky tests",
    "matchedStatuses": ["failed"],
    "messageRegex": ".*retry.*"
  }
]
```

---

## 🌐 Environment Info

Create `environment.properties` in `allure-results/`:

```properties
Browser=Chromium
Node.Version=20.x
OS=Ubuntu 22.04
Environment=Production
BaseURL=https://your-app.vercel.app
```

---

## 🔍 Viewing Reports

### **Local:**
```bash
npm run allure:open
# Opens http://localhost:xxxx with Allure UI
```

### **CI/CD:**
- Download `allure-report` artifact from GitHub Actions
- Extract and open `index.html` in browser
- Or visit GitHub Pages: https://oktavian1.github.io/automation_sauce_demo/

---

## 🚦 Allure vs Playwright HTML

| Feature | Playwright HTML | Allure |
|---------|----------------|--------|
| **UI** | Simple, clean | Rich, interactive |
| **Trends** | ❌ | ✅ Historical data |
| **Categorization** | Basic | Advanced (Epic/Feature/Story) |
| **Attachments** | Screenshots, traces | Custom + rich formats |
| **Flaky Detection** | ❌ | ✅ Built-in |
| **Analytics** | Basic | Advanced dashboards |
| **Setup** | Built-in | Requires plugin |

---

## 📖 Resources

- **Allure Docs:** https://docs.qameta.io/allure/
- **Playwright Integration:** https://www.npmjs.com/package/allure-playwright
- **Examples:** https://demo.qameta.io/allure/

---

## 🐛 Troubleshooting

### Issue: `allure: command not found`
**Solution:**
```bash
npm install --save-dev allure-commandline
```

### Issue: Report tidak ter-generate
**Solution:**
```bash
# Check allure-results exists
ls allure-results/

# Re-generate
npm run allure:clean
npm test
npm run allure:generate
```

### Issue: History tidak muncul
**Solution:**
Copy `history` folder dari previous report ke `allure-results/` sebelum generate:
```bash
cp -r allure-report/history allure-results/
npm run allure:generate
```

---

## ✅ Next Steps

1. ✅ Install Allure
2. ✅ Configure playwright.config.ts
3. ✅ Add npm scripts
4. ✅ Update CI/CD workflows
5. 🔄 Run tests locally: `npm run test:allure`
6. 🔄 Push changes and trigger CI/CD
7. 🔄 View report on GitHub Pages

**Happy Testing! 🎉**
