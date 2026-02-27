# UI Testing Setup for Family Calendar

## Overview

This project uses **Playwright** for automated browser UI testing.

## Quick Start

### Run Tests

```bash
# From family-calendar-web directory
cd /home/xoder/.openclaw/workspace/family-calendar-web

# Run all tests (headless)
npm test

# Run with visible browser
npm run test:headed

# Run with Playwright UI
npm run test:ui
```

## Test Configuration

- **Base URL:** http://10.0.0.64:5173
- **Browser:** Chromium
- **Test Location:** `tests/` directory
- **Screenshots:** `tests/screenshots/` (on failure)

## Writing Tests

Create test files in `tests/` with `.spec.ts` extension:

```typescript
import { test, expect } from '@playwright/test';

test('my test', async ({ page }) => {
  await page.goto('http://10.0.0.64:5173');
  // ... your test code
});
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (headless) |
| `npm run test:headed` | Run with visible browser |
| `npm run test:ui` | Interactive test runner UI |

## Notes

- The app must be running at http://10.0.0.64:5173 (or update `playwright.config.ts`)
- If running locally, you can start the dev server first: `npm run dev`
- Playwright will auto-start the dev server if configured
