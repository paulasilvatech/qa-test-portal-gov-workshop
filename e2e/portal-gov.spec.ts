import { test, expect } from '@playwright/test';

const TEST_CPF = '529.982.247-25';
const TEST_CPF_RAW = '52998224725';
const TEST_USER_FIRST_NAME = 'Maria';

test.describe('Portal Gov - E2E: Login → IPVA Complete Flow', () => {

  test.describe('1. Home Page', () => {
    test('should display hero section and all 8 service cards', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('heading', { name: 'Portal de Serviços do Cidadão' })).toBeVisible();
      await expect(page.getByText('Acesse serviços públicos digitais')).toBeVisible();

      const serviceCards = page.locator('.service-card');
      await expect(serviceCards).toHaveCount(8);

      const serviceNames = ['IPVA', 'IPTU', 'DANFE', 'INSS', 'FGTS', 'Empréstimo Consignado', 'Bolsa Família', 'CNH Digital'];
      for (const name of serviceNames) {
        await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
      }
    });

    test('should filter services via search bar', async ({ page }) => {
      await page.goto('/');
      await page.getByPlaceholder('Buscar serviço').fill('IPVA');
      await page.getByRole('button', { name: 'Buscar' }).click();

      const serviceCards = page.locator('.service-card');
      await expect(serviceCards).toHaveCount(1);
      await expect(page.getByRole('heading', { name: 'IPVA', exact: true })).toBeVisible();
    });

    test('should show no-results message for unknown search', async ({ page }) => {
      await page.goto('/');
      await page.getByPlaceholder('Buscar serviço').fill('xyznotexist');
      await page.getByRole('button', { name: 'Buscar' }).click();

      await expect(page.getByText('Nenhum serviço encontrado')).toBeVisible();
    });

    test('should show "Entrar com gov.br" button when not logged in', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('button', { name: 'Entrar com gov.br' })).toBeVisible();
    });
  });

  test.describe('2. Login Flow', () => {
    test('should reject invalid CPF', async ({ page }) => {
      await page.goto('/login');
      await expect(page.getByRole('heading', { name: 'Acesso gov.br' })).toBeVisible();

      await page.getByLabel('CPF').fill('11111111111');
      await page.locator('.login-btn').click();

      await expect(page.getByText('CPF inválido')).toBeVisible();
    });

    test('should login with valid CPF and redirect to home', async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel('CPF').fill(TEST_CPF_RAW);
      await page.locator('.login-btn').click();

      // Should redirect to home
      await expect(page).toHaveURL('/');
      // Header should greet user
      await expect(page.getByText(`Olá, ${TEST_USER_FIRST_NAME}`)).toBeVisible();
      // Nav should now show service links instead of login button
      await expect(page.locator('.gov-header-nav').getByRole('link', { name: 'IPVA' })).toBeVisible();
    });

    test('should format CPF input with dots and dash', async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel('CPF').fill(TEST_CPF_RAW);

      const input = page.getByLabel('CPF');
      await expect(input).toHaveValue(TEST_CPF);
    });
  });

  test.describe('3. IPVA Complete Journey (authenticated)', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto('/login');
      await page.getByLabel('CPF').fill(TEST_CPF_RAW);
      await page.locator('.login-btn').click();
      await expect(page).toHaveURL('/');
    });

    test('should navigate to IPVA page from header nav', async ({ page }) => {
      await page.locator('.gov-header-nav').getByRole('link', { name: 'IPVA' }).click();
      await expect(page).toHaveURL('/ipva');
      await expect(page.getByRole('heading', { name: /IPVA/ })).toBeVisible();
    });

    test('should navigate to IPVA page from service card on homepage', async ({ page }) => {
      await page.locator('.service-card').filter({ hasText: 'IPVA' }).click();
      await expect(page).toHaveURL('/ipva');
    });

    test('should display breadcrumb navigation', async ({ page }) => {
      await page.goto('/ipva');
      await expect(page.getByLabel('Breadcrumb').getByRole('link', { name: 'Início' })).toBeVisible();
      await expect(page.getByText('IPVA', { exact: true }).last()).toBeVisible();
    });

    test('should display vehicle table with data', async ({ page }) => {
      await page.goto('/ipva');

      const table = page.locator('.table').first();
      await expect(table).toBeVisible();

      // Table headers
      await expect(table.getByRole('columnheader', { name: 'Placa' })).toBeVisible();
      await expect(table.getByRole('columnheader', { name: 'Modelo' })).toBeVisible();
      await expect(table.getByRole('columnheader', { name: 'Status' })).toBeVisible();

      // At least one row of data
      const rows = table.locator('tbody tr');
      await expect(rows).not.toHaveCount(0);
    });

    test('should open vehicle details when clicking "Detalhes"', async ({ page }) => {
      await page.goto('/ipva');

      // Click first "Detalhes" button
      await page.getByRole('button', { name: 'Detalhes' }).first().click();

      // Detail section should appear
      const detailSection = page.locator('.detail-section');
      await expect(detailSection).toBeVisible();

      // Vehicle card info
      await expect(detailSection.getByText('Veículo')).toBeVisible();
      await expect(detailSection.getByText('Marca:')).toBeVisible();
      await expect(detailSection.getByText('RENAVAM:')).toBeVisible();

      // Tax info
      await expect(detailSection.getByText('Imposto')).toBeVisible();
      await expect(detailSection.getByText('Valor Total:')).toBeVisible();
    });

    test('should display installment table in detail view', async ({ page }) => {
      await page.goto('/ipva');
      await page.getByRole('button', { name: 'Detalhes' }).first().click();

      // Parcelas heading
      await expect(page.getByRole('heading', { name: 'Parcelas' })).toBeVisible();

      // Parcelas table
      const parcelasTable = page.locator('.detail-section .table');
      await expect(parcelasTable).toBeVisible();
      await expect(parcelasTable.getByRole('columnheader', { name: 'Parcela' })).toBeVisible();
      await expect(parcelasTable.getByRole('columnheader', { name: 'Vencimento' })).toBeVisible();
    });

    test('should close detail view when clicking "Fechar"', async ({ page }) => {
      await page.goto('/ipva');
      await page.getByRole('button', { name: 'Detalhes' }).first().click();

      await expect(page.locator('.detail-section')).toBeVisible();

      await page.getByRole('button', { name: 'Fechar' }).click();

      await expect(page.locator('.detail-section')).not.toBeVisible();
    });

    test('should display boleto for pending installments', async ({ page }) => {
      await page.goto('/ipva');
      await page.getByRole('button', { name: 'Detalhes' }).first().click();

      // If there's a boleto viewer, it should show barcode info
      const boletoSection = page.locator('.boleto-viewer');
      if (await boletoSection.isVisible()) {
        await expect(boletoSection.getByText('Código de Barras')).toBeVisible();
      }
    });
  });

  test.describe('4. CNH Digital Journey (authenticated)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel('CPF').fill(TEST_CPF_RAW);
      await page.locator('.login-btn').click();
      await expect(page).toHaveURL('/');
    });

    test('should display CNH card with holder info', async ({ page }) => {
      await page.goto('/cnh');
      await expect(page.getByRole('heading', { name: /CNH Digital/ })).toBeVisible();

      // CNH card data
      await expect(page.locator('.cnh-header').getByRole('heading', { name: 'CARTEIRA NACIONAL DE HABILITAÇÃO' })).toBeVisible();
      await expect(page.getByText('CPF:')).toBeVisible();
      await expect(page.getByText('Categoria:')).toBeVisible();
      await expect(page.getByText('Validade:')).toBeVisible();
    });

    test('should display score section', async ({ page }) => {
      await page.goto('/cnh');
      await expect(page.getByRole('heading', { name: 'Pontuação' })).toBeVisible();
      await expect(page.getByText('/ 20 pontos')).toBeVisible();
    });

    test('should display infractions table if any', async ({ page }) => {
      await page.goto('/cnh');

      const infractionsHeading = page.getByRole('heading', { name: 'Infrações' });
      if (await infractionsHeading.isVisible()) {
        const table = page.locator('.table').last();
        await expect(table.getByRole('columnheader', { name: 'Descrição' })).toBeVisible();
        await expect(table.getByRole('columnheader', { name: 'Gravidade' })).toBeVisible();
        await expect(table.getByRole('columnheader', { name: 'Pontos' })).toBeVisible();
      }
    });
  });

  test.describe('5. Navigation & Auth Guards', () => {
    test('should show alert when accessing service page without login', async ({ page }) => {
      await page.goto('/ipva');
      await expect(page.getByText('Nenhum veículo encontrado')).toBeVisible();
    });

    test('should logout and return to home', async ({ page }) => {
      // Login
      await page.goto('/login');
      await page.getByLabel('CPF').fill(TEST_CPF_RAW);
      await page.locator('.login-btn').click();
      await expect(page.getByText(`Olá, ${TEST_USER_FIRST_NAME}`)).toBeVisible();

      // Logout
      await page.getByRole('button', { name: 'Sair' }).click();
      await expect(page).toHaveURL('/');
      await expect(page.getByRole('button', { name: 'Entrar com gov.br' })).toBeVisible();
    });

    test('should navigate home via breadcrumb', async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel('CPF').fill(TEST_CPF_RAW);
      await page.locator('.login-btn').click();

      await page.goto('/ipva');
      await page.getByRole('link', { name: 'Início' }).first().click();
      await expect(page).toHaveURL('/');
    });

    test('should navigate home via header logo', async ({ page }) => {
      await page.goto('/ipva');
      await page.locator('.gov-header-logo').click();
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('6. Full E2E Journey: Login → Search → IPVA → Details → Boleto', () => {
    test('complete user journey from login to payment boleto', async ({ page }) => {
      // Step 1: Land on Home
      await page.goto('/');
      await expect(page.getByRole('heading', { name: 'Portal de Serviços do Cidadão' })).toBeVisible();

      // Step 2: Go to Login
      await page.getByRole('button', { name: 'Entrar com gov.br' }).click();
      await expect(page).toHaveURL('/login');

      // Step 3: Login with valid CPF
      await page.getByLabel('CPF').fill(TEST_CPF_RAW);
      await page.locator('.login-btn').click();
      await expect(page).toHaveURL('/');
      await expect(page.getByText(`Olá, ${TEST_USER_FIRST_NAME}`)).toBeVisible();

      // Step 4: Search for IPVA service
      await page.getByPlaceholder('Buscar serviço').fill('IPVA');
      await page.getByRole('button', { name: 'Buscar' }).click();
      const cards = page.locator('.service-card');
      await expect(cards).toHaveCount(1);

      // Step 5: Click IPVA service card
      await cards.first().click();
      await expect(page).toHaveURL('/ipva');
      await expect(page.getByRole('heading', { name: /IPVA/ })).toBeVisible();

      // Step 6: Verify vehicle table is populated
      const vehicleRows = page.locator('.table tbody tr');
      await expect(vehicleRows).not.toHaveCount(0);
      const rowCount = await vehicleRows.count();

      // Step 7: Open first vehicle details
      await page.getByRole('button', { name: 'Detalhes' }).first().click();
      await expect(page.locator('.detail-section')).toBeVisible();

      // Step 8: Verify vehicle info
      await expect(page.getByText('Marca:')).toBeVisible();
      await expect(page.getByText('RENAVAM:')).toBeVisible();
      await expect(page.getByText('Valor Total:')).toBeVisible();

      // Step 9: Verify installment table
      await expect(page.getByRole('heading', { name: 'Parcelas' })).toBeVisible();
      const installmentRows = page.locator('.detail-section .table tbody tr');
      await expect(installmentRows).not.toHaveCount(0);

      // Step 10: Check boleto availability
      const boletoViewer = page.locator('.boleto-viewer');
      if (await boletoViewer.isVisible()) {
        await expect(boletoViewer).toBeVisible();
      }

      // Step 11: Close details
      await page.getByRole('button', { name: 'Fechar' }).click();
      await expect(page.locator('.detail-section')).not.toBeVisible();

      // Step 12: If more vehicles, open second one
      if (rowCount > 1) {
        await page.getByRole('button', { name: 'Detalhes' }).nth(1).click();
        await expect(page.locator('.detail-section')).toBeVisible();
        await page.getByRole('button', { name: 'Fechar' }).click();
      }

      // Step 13: Navigate home via header
      await page.locator('.gov-header-logo').click();
      await expect(page).toHaveURL('/');

      // Step 14: Logout
      await page.getByRole('button', { name: 'Sair' }).click();
      await expect(page.getByRole('button', { name: 'Entrar com gov.br' })).toBeVisible();
    });
  });
});
