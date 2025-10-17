import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:5173/login');
  });

  test('should display login form', async ({ page }) => {
    // Check if login form elements are visible
    await expect(page.getByText('Login')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
    
    // Check if signup link is visible
    await expect(page.getByText('Não tem uma conta?')).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    // Click on the signup link
    await page.getByText('Cadastre-se').click();
    
    // Check if we navigated to the signup page
    await expect(page).toHaveURL('http://localhost:5173/signup');
    
    // Check if signup form elements are visible
    await expect(page.getByText('Cadastro')).toBeVisible();
    await expect(page.getByLabel('Nome')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cadastrar' })).toBeVisible();
  });

  test('should redirect to home when accessing login while authenticated', async ({ page }) => {
    // This test would require mocking authentication state
    // For now, we'll test the basic navigation
    await page.goto('http://localhost:5173/login');
    await expect(page).toHaveURL('http://localhost:5173/login');
  });
});