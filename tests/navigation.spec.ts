import { test, expect } from '@playwright/test';

test.describe('Family Hub Navigation & Full UI Test', () => {
  
  test('Navigate to all sections and capture screenshots', async ({ page }) => {
    // Login first
    await page.goto('http://10.0.0.64:5173/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="text"], input:not([type])', 'gene');
    await page.fill('input[type="password"]', 'family123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Test navigation to Calendar
    console.log('Testing Calendar...');
    await page.goto('http://10.0.0.64:5173/calendar');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/nav-calendar.png', fullPage: true });
    
    // Test navigation to Tasks
    console.log('Testing Tasks...');
    await page.goto('http://10.0.0.64:5173/tasks');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/nav-tasks.png', fullPage: true });
    
    // Test navigation to Homework
    console.log('Testing Homework...');
    await page.goto('http://10.0.0.64:5173/homework');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/nav-homework.png', fullPage: true });
    
    // Test navigation to Meals
    console.log('Testing Meals...');
    await page.goto('http://10.0.0.64:5173/meals');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/nav-meals.png', fullPage: true });
    
    // Test navigation to Classes
    console.log('Testing Classes...');
    await page.goto('http://10.0.0.64:5173/classes');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/nav-classes.png', fullPage: true });
    
    // Test navigation to Family
    console.log('Testing Family...');
    await page.goto('http://10.0.0.64:5173/family');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/nav-family.png', fullPage: true });
    
    // Test navigation to Leaderboard
    console.log('Testing Leaderboard...');
    await page.goto('http://10.0.0.64:5173/leaderboard');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/nav-leaderboard.png', fullPage: true });
    
    // Test going back to Home
    console.log('Testing Home...');
    await page.goto('http://10.0.0.64:5173/');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/nav-home.png', fullPage: true });
    
    console.log('All navigation tests complete!');
  });

  test('Test logout functionality', async ({ page }) => {
    // Login first
    await page.goto('http://10.0.0.64:5173/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="text"], input:not([type])', 'gene');
    await page.fill('input[type="password"]', 'family123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Look for logout button
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")');
    const logoutCount = await logoutButton.count();
    console.log('Logout buttons found:', logoutCount);
    
    if (logoutCount > 0) {
      await logoutButton.first().click();
      await page.waitForTimeout(1000);
      console.log('URL after logout:', page.url());
      
      // Should redirect to login
      const passwordInput = page.locator('input[type="password"]');
      const isLoginVisible = await passwordInput.isVisible();
      console.log('Login form visible after logout:', isLoginVisible);
    }
  });

  test('Check for UI consistency issues', async ({ page }) => {
    // Login first
    await page.goto('http://10.0.0.64:5173/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="text"], input:not([type])', 'gene');
    await page.fill('input[type="password"]', 'family123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Check for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    page.on('pageerror', err => {
      errors.push(err.message);
    });
    
    // Visit each page
    const pages = ['/', '/calendar', '/tasks', '/homework', '/meals', '/classes', '/family', '/leaderboard'];
    
    for (const p of pages) {
      await page.goto(`http://10.0.0.64:5173${p}`);
      await page.waitForTimeout(500);
    }
    
    console.log('Console errors collected:', errors.length);
    errors.forEach(e => console.log('  -', e));
  });
});
