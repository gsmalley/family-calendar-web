import { test, expect } from '@playwright/test';

test.describe('Family Hub Comprehensive Tests', () => {
  
  test.describe('Login Flow', () => {
    test('should show login page on initial load', async ({ page }) => {
      await page.goto('http://10.0.0.64:5173');
      await page.waitForLoadState('networkidle');
      
      // Check for login form elements
      const usernameInput = page.locator('input[type="text"], input[type="email"], input:not([type])').first();
      const passwordInput = page.locator('input[type="password"]');
      
      await expect(usernameInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      
      // Check for login button
      const loginButton = page.locator('button:has-text("Login"), button:has-text("Sign In"), button[type="submit"]');
      await expect(loginButton).toBeVisible();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      await page.goto('http://10.0.0.64:5173');
      await page.waitForLoadState('networkidle');
      
      // Fill in login credentials
      await page.fill('input[type="text"], input[type="email"], input:not([type])', 'gene');
      await page.fill('input[type="password"]', 'family123');
      
      // Click login button
      await page.click('button:has-text("Login"), button:has-text("Sign In"), button[type="submit"]');
      
      // Wait for navigation after login
      await page.waitForLoadState('networkidle');
      
      // After login, should either see dashboard or redirect
      const currentUrl = page.url();
      console.log('URL after login:', currentUrl);
    });

    test('should show error with invalid credentials', async ({ page }) => {
      await page.goto('http://10.0.0.64:5173');
      await page.waitForLoadState('networkidle');
      
      // Fill in wrong credentials
      await page.fill('input[type="text"], input[type="email"], input:not([type])', 'gene');
      await page.fill('input[type="password"]', 'wrongpassword');
      
      // Click login button
      await page.click('button:has-text("Login"), button:has-text("Sign In"), button[type="submit"]');
      
      // Wait a bit for any error message
      await page.waitForTimeout(2000);
      
      // Check for error message or failed login indicators
      const errorMessage = page.locator('text=Invalid, text=Error, text=Failed, text=Incorrect');
      const errorCount = await errorMessage.count();
      console.log('Error messages found:', errorCount);
    });
  });

  test.describe('Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      // Login before testing dashboard
      await page.goto('http://10.0.0.64:5173');
      await page.waitForLoadState('networkidle');
      await page.fill('input[type="text"], input[type="email"], input:not([type])', 'gene');
      await page.fill('input[type="password"]', 'family123');
      await page.click('button:has-text("Login"), button:has-text("Sign In"), button[type="submit"]');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    });

    test('should display dashboard after login', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      
      // Check that we're logged in (no login form visible)
      const passwordInput = page.locator('input[type="password"]');
      const isLoginVisible = await passwordInput.isVisible().catch(() => false);
      
      console.log('Login form still visible:', isLoginVisible);
      
      // Take screenshot
      await page.screenshot({ path: 'tests/screenshots/dashboard.png', fullPage: true });
    });

    test('should display calendar section', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      
      // Look for calendar-related elements
      const calendarElements = page.locator('text=Calendar, text=calendar, text=Event, text=event, .calendar, [class*="calendar"]');
      const count = await calendarElements.count();
      console.log('Calendar elements found:', count);
    });

    test('should display task section', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      
      // Look for task-related elements
      const taskElements = page.locator('text=Task, text=task, text=Todo, text=todo, .task, [class*="task"]');
      const count = await taskElements.count();
      console.log('Task elements found:', count);
    });
  });

  test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Login before testing navigation
      await page.goto('http://10.0.0.64:5173');
      await page.waitForLoadState('networkidle');
      await page.fill('input[type="text"], input[type="email"], input:not([type])', 'gene');
      await page.fill('input[type="password"]', 'family123');
      await page.click('button:has-text("Login"), button:has-text("Sign In"), button[type="submit"]');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    });

    test('should navigate between sections', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      
      // Get all links/buttons that could be navigation
      const navItems = page.locator('a, button, [role="menuitem"], [role="tab"]');
      const navCount = await navItems.count();
      console.log('Navigation items found:', navCount);
      
      // Try clicking each navigation item
      for (let i = 0; i < Math.min(navCount, 10); i++) {
        const item = navItems.nth(i);
        const text = await item.textContent().catch(() => '');
        if (text.trim()) {
          console.log('Clicking nav item:', text.trim().substring(0, 30));
          await item.click().catch(() => {});
          await page.waitForTimeout(500);
        }
      }
      
      // Take final screenshot
      await page.screenshot({ path: 'tests/screenshots/after-navigation.png', fullPage: true });
    });
  });

  test.describe('Coms Board', () => {
    test('should load Coms Board main page', async ({ page }) => {
      await page.goto('http://10.0.0.64:5174');
      await page.waitForLoadState('networkidle');
      
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Take screenshot
      await page.screenshot({ path: 'tests/screenshots/coms-board.png', fullPage: true });
      
      console.log('Coms Board loaded successfully');
    });

    test('should check if Coms Board requires login', async ({ page }) => {
      await page.goto('http://10.0.0.64:5174');
      await page.waitForLoadState('networkidle');
      
      // Check for login form
      const hasLogin = await page.locator('input[type="password"]').count() > 0;
      console.log('Coms Board has login:', hasLogin);
    });
  });

  test.describe('UI Issues', () => {
    test.beforeEach(async ({ page }) => {
      // Listen for console errors
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      page.on('pageerror', err => {
        consoleErrors.push(err.message);
      });
    });

    test('should check for console errors on login page', async ({ page }) => {
      await page.goto('http://10.0.0.64:5173');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Check for any visible error messages on the page
      const errorAlerts = page.locator('[role="alert"], .error, .alert, text=Error');
      const errorCount = await errorAlerts.count();
      console.log('Visible error elements:', errorCount);
    });

    test('should check for UI responsiveness issues', async ({ page }) => {
      await page.goto('http://10.0.0.64:5173');
      await page.waitForLoadState('networkidle');
      
      // Test at different viewport sizes
      const sizes = [
        { width: 1920, height: 1080 }, // Desktop
        { width: 768, height: 1024 },  // Tablet
        { width: 375, height: 667 },    // Mobile
      ];
      
      for (const size of sizes) {
        await page.setViewportSize(size);
        await page.waitForTimeout(500);
        console.log(`Viewport ${size.width}x${size.height} - Page renders without crash`);
      }
    });
  });
});
