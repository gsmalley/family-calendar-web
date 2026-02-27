import { test, expect } from '@playwright/test';

test.describe('Family Hub Deep Dive Tests', () => {
  
  test('Capture detailed page state after login', async ({ page }) => {
    // Navigate to login page
    await page.goto('http://10.0.0.64:5173/login');
    await page.waitForLoadState('networkidle');
    
    // Fill in credentials
    await page.fill('input[type="text"], input:not([type])', 'gene');
    await page.fill('input[type="password"]', 'family123');
    
    // Click login
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForTimeout(3000);
    await page.waitForLoadState('networkidle');
    
    console.log('URL after login:', page.url());
    console.log('Page title:', await page.title());
    
    // Get all visible text content
    const bodyText = await page.locator('body').textContent();
    console.log('Body text (first 500 chars):', bodyText?.substring(0, 500));
    
    // Check for specific elements
    const h1Count = await page.locator('h1').count();
    const h2Count = await page.locator('h2').count();
    console.log('H1 count:', h1Count, 'H2 count:', h2Count);
    
    // List all visible links
    const links = page.locator('a');
    const linkCount = await links.count();
    console.log('Total links:', linkCount);
    
    for (let i = 0; i < Math.min(linkCount, 20); i++) {
      const href = await links.nth(i).getAttribute('href');
      const text = await links.nth(i).textContent();
      console.log(`Link ${i}: ${text?.trim()} -> ${href}`);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/deep-dive.png', fullPage: true });
  });

  test('Check API endpoints', async ({ page }) => {
    // First login to get token
    await page.goto('http://10.0.0.64:5173/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="text"], input:not([type])', 'gene');
    await page.fill('input[type="password"]', 'family123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Get localStorage to check for token
    const localStorage = await page.evaluate(() => {
      return {
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user')
      };
    });
    console.log('LocalStorage:', JSON.stringify(localStorage));
    
    // Get cookies
    const cookies = await page.context().cookies();
    console.log('Cookies:', cookies.map(c => c.name));
  });

  test('Coms Board detailed check', async ({ page }) => {
    await page.goto('http://10.0.0.64:5174');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    console.log('Coms Board URL:', page.url());
    console.log('Coms Board title:', await page.title());
    
    // Check if there's a user logged in
    const localStorage = await page.evaluate(() => {
      return {
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user'),
        keys: Object.keys(localStorage)
      };
    });
    console.log('Coms Board LocalStorage:', JSON.stringify(localStorage));
    
    // Check for any navigation or content
    const bodyText = await page.locator('body').textContent();
    console.log('Coms Board body (first 300 chars):', bodyText?.substring(0, 300));
  });
});
