import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('http://localhost:5173/');
  });

  test('should display welcome message and navigation cards', async ({ page }) => {
    // Check if the main title is visible
    await expect(page.getByText('Capao do Tesouro')).toBeVisible();
    
    // Check if the subtitle is visible
    await expect(page.getByText('Explore, descubra e conquiste tesouros escondidos pela cidade!')).toBeVisible();
    
    // Check if feature cards are visible
    await expect(page.getByText('Explorar Mapa')).toBeVisible();
    await expect(page.getByText('Missões')).toBeVisible();
    await expect(page.getByText('Ranking')).toBeVisible();
    await expect(page.getByText('Demo 3D')).toBeVisible();
  });

  test('should navigate to map page when clicking Explorar Mapa card', async ({ page }) => {
    // Click on the Explorar Mapa card
    await page.getByText('Explorar Mapa').click();
    
    // Check if we navigated to the map page
    await expect(page).toHaveURL('http://localhost:5173/map');
  });

  test('should navigate to quests page when clicking Missões card', async ({ page }) => {
    // Click on the Missões card
    await page.getByText('Missões').click();
    
    // Check if we navigated to the quests page
    await expect(page).toHaveURL('http://localhost:5173/quests');
    
    // Check if the coming soon message is displayed
    await expect(page.getByText('Em breve...')).toBeVisible();
  });

  test('should navigate to leaderboard page when clicking Ranking card', async ({ page }) => {
    // Click on the Ranking card
    await page.getByText('Ranking').click();
    
    // Check if we navigated to the leaderboard page
    await expect(page).toHaveURL('http://localhost:5173/leaderboard');
    
    // Check if the coming soon message is displayed
    await expect(page.getByText('Em breve...')).toBeVisible();
  });

  test('should navigate to 3D demo page when clicking Demo 3D card', async ({ page }) => {
    // Click on the Demo 3D card
    await page.getByText('Demo 3D').click();
    
    // Check if we navigated to the 3D demo page
    await expect(page).toHaveURL('http://localhost:5173/three-demo');
  });

  test('should display how it works section', async ({ page }) => {
    // Check if the How It Works section is visible
    await expect(page.getByText('Como Funciona')).toBeVisible();
    
    // Check if all three steps are visible
    await expect(page.getByText('Explore o Mapa')).toBeVisible();
    await expect(page.getByText('Faça Check-in')).toBeVisible();
    await expect(page.getByText('Ganhe Recompensas')).toBeVisible();
  });
});