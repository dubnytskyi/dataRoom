import { test, expect } from '@playwright/test';

test.describe('DataRoom Authentication', () => {
  test('should display login form on initial load', async ({ page }) => {
    await page.goto('/');

    // Should show login form
    await expect(page.getByText('Welcome Back')).toBeVisible();
    await expect(page.getByText('Sign in to access your DataRoom')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show Google sign-in button', async ({ page }) => {
    await page.goto('/');

    // Check for Google sign-in button
    await expect(page.getByText('Continue with Google')).toBeVisible();
  });

  test('should switch from login to signup form', async ({ page }) => {
    await page.goto('/');

    // Initially on login form
    await expect(page.getByText('Welcome Back')).toBeVisible();

    // Click on "Sign up" link
    const signupLink = page.getByRole('button', { name: /sign up/i });
    await signupLink.click();

    // Should show signup form
    await expect(page.getByText('Create Account')).toBeVisible();
    await expect(page.getByText('Get started with DataRoom')).toBeVisible();
    await expect(page.getByPlaceholder('John Doe')).toBeVisible();
  });

  test('should switch from signup back to login form', async ({ page }) => {
    await page.goto('/');

    // Go to signup form
    await page.getByRole('button', { name: /sign up/i }).click();
    await expect(page.getByText('Create Account')).toBeVisible();

    // Click on "Sign in" link
    const signinLink = page.getByRole('button', { name: /sign in/i });
    await signinLink.click();

    // Should show login form again
    await expect(page.getByText('Welcome Back')).toBeVisible();
  });

  test('should display all login form fields', async ({ page }) => {
    await page.goto('/');

    // Check for email and password fields
    await expect(page.getByPlaceholder('your@email.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••')).toBeVisible();
    await expect(page.getByRole('button', { name: /^Sign In$/i })).toBeVisible();
  });

  test('should display all signup form fields', async ({ page }) => {
    await page.goto('/');

    // Switch to signup
    await page.getByRole('button', { name: /sign up/i }).click();

    // Check for all signup fields
    await expect(page.getByPlaceholder('John Doe')).toBeVisible();
    await expect(page.getByPlaceholder('your@email.com')).toBeVisible();

    // Should have two password fields (password and confirm)
    const passwordFields = page.getByPlaceholder('••••••••');
    await expect(passwordFields).toHaveCount(2);
  });
});
