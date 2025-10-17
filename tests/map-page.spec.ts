import { test, expect } from '@playwright/test';

test.describe('Map Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the map page
    await page.goto('http://localhost:5173/map');
  });

  test('should display map container and loading state initially', async ({ page }) => {
    // Check if the map title is visible
    await expect(page.getByText('Mapa de Tesouros')).toBeVisible();
    
    // Check if loading message is displayed initially
    await expect(page.getByText('Carregando mapa...')).toBeVisible();
  });

  test('should display map after loading', async ({ page }) => {
    // Wait for the map to load (adjust timeout as needed)
    await page.waitForTimeout(3000);
    
    // Check if the map container is visible
    const mapContainer = page.locator('.leaflet-map-wrapper');
    await expect(mapContainer).toBeVisible();
  });

  test('should display instructions panel', async ({ page }) => {
    // Wait for the page to load
    await page.waitForTimeout(1000);
    
    // Check if instructions panel is visible
    const instructionsPanel = page.locator('text=Como fazer check-in:');
    await expect(instructionsPanel).toBeVisible();
    
    // Check if all instruction steps are visible
    await expect(page.getByText('Chegue perto do tesouro (raio de 100m)')).toBeVisible();
    await expect(page.getByText('Clique no marcador no mapa')).toBeVisible();
    await expect(page.getByText('Toque em "Fazer Check-in"')).toBeVisible();
    await expect(page.getByText('Ganhe pontos e conquistas!')).toBeVisible();
  });

  test('should have back button that navigates to home', async ({ page }) => {
    // Click the back button
    await page.getByText('← Voltar').click();
    
    // Check if we navigated back to home page
    await expect(page).toHaveURL('http://localhost:5173/');
  });
});