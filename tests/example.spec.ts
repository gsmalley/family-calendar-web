import { test, expect } from '@playwright/test';

test.describe('Family Calendar UI Tests', () => {
  test('should load the main page', async ({ page }) => {
    // Navigate to the Family Calendar app
    await page.goto('http://10.0.0.64:5173');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the page title or main content is visible
    // This is a basic test - can be customized based on actual app content
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'tests/screenshots/main-page.png', fullPage: true });
  });

  test('should show login page or dashboard', async ({ page }) => {
    await page.goto('http://10.0.0.64:5173');
    await page.waitForLoadState('networkidle');
    
    // Check for common elements - either login form or dashboard
    const hasLogin = await page.locator('input[type="password"]').count() > 0;
    const hasDashboard = await page.locator('text=Calendar').count() > 0 || 
                         await page.locator('text=Task').count() > 0;
    
    console.log('Login present:', hasLogin, '| Dashboard present:', hasDashboard);
    
    // At least one should be visible
    expect(hasLogin || hasDashboard).toBeTruthy();
  });
});
