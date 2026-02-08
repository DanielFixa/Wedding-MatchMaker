
import { test, expect } from '@playwright/test';

test.describe('Wedding Matchmaker Critical Flows', () => {

    test('TC001: User Registration with Dynamic Email', async ({ page }) => {
        const email = `test-${Date.now()}@example.com`;
        await page.goto('/login');
        await page.click('text=Create an account');
        await page.fill('input[name="fullName"]', 'Test User');
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', 'Password123!');
        await page.click('button:has-text("Create Account")');

        // Expect redirection to dashboard
        await expect(page).toHaveURL('/dashboard', { timeout: 15000 });
    });

    test('TC005: Create Room and Verify Active Rooms on Dashboard', async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.fill('input[name="email"]', 'you@teste.com');
        await page.fill('input[name="password"]', 'Danielfixa@2');
        await page.click('button:has-text("Sign In")');
        await expect(page).toHaveURL('/dashboard');

        // Create a room
        await page.click('text=Dresses'); // Select category
        await page.click('button:has-text("Create & Host")');

        // Should be in lobby
        await expect(page).toHaveURL(/\/room\/.*\/lobby/);
        const roomUrl = await page.url();

        // Go back to dashboard
        await page.goto('/dashboard');

        // Verify "Active Rooms" section exists
        await expect(page.locator('h2:has-text("Active Rooms")')).toBeVisible();
        // Verify at least one room card is present
        await expect(page.locator('.grid > a').first()).toBeVisible();
    });

    test('TC011/TC015: Verify Supplier Image URLs Breakdown', async ({ page }) => {
        // Login
        await page.goto('/login');
        await page.fill('input[name="email"]', 'you@teste.com');
        await page.fill('input[name="password"]', 'Danielfixa@2');
        await page.click('button:has-text("Sign In")');

        // Go to search
        await page.goto('/search');

        // Wait for results
        await expect(page.locator('text=Find Suppliers')).toBeVisible();

        // Check images
        const images = page.locator('img[alt="Supplier"]');
        const count = await images.count();
        console.log(`Found ${count} supplier images`);

        for (let i = 0; i < count; ++i) {
            const src = await images.nth(i).getAttribute('src');
            console.log(`Image ${i}: ${src}`);
            expect(src).toBeTruthy();
            if (src) {
                // Next.js image optimization might prefix /_next/image?url=...
                // If it's a direct external link, it should be https
                // We want to verify that the *underlying* url (if passed to next/image) or the src itself is valid.
                // NextJS images often look like: /_next/image?url=https%3A%2F%2Fimages.unsplash.com...

                const decodedSrc = decodeURIComponent(src);
                const isValid = decodedSrc.includes('https://') || src.startsWith('https://') || src.startsWith('/_next/image');
                expect(isValid, `Image URL should be valid: ${src}`).toBeTruthy();

                if (src.startsWith('/_next/image')) {
                    // Check the 'url' param inside
                    const urlParam = new URL(src, 'http://localhost:3000').searchParams.get('url');
                    if (urlParam?.includes('unsplash.com')) {
                        expect(urlParam).toMatch(/^https:\/\//);
                    }
                } else if (src.includes('unsplash.com')) {
                    expect(src).toMatch(/^https:\/\//);
                }
            }
        }
    });

});
