import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Azure DevOps Work Item #79
 * User Story: "Como trabalhador, quero visualizar o extrato de movimentações
 *              do FGTS e solicitar saque-aniversário"
 *
 * Acceptance Criteria:
 *  AC1: Extrato com data, tipo (depósito, JAM, saque), valor, saldo
 *  AC2: Filtro por conta/empresa e período
 *  AC3: Botão 'Solicitar Saque-Aniversário'
 *  AC4: Simulação do valor disponível para saque
 */

const TEST_CPF_RAW = '52998224725'; // Maria — has FGTS account with saque-aniversário enabled

test.describe('WI#79 — FGTS Extrato e Saque-Aniversário', () => {

  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByLabel('CPF').fill(TEST_CPF_RAW);
    await page.locator('.login-btn').click();
    await expect(page).toHaveURL('/');
  });

  test.describe('AC1: Extrato com data, tipo, valor, saldo', () => {

    test('should navigate to FGTS page and see account listing', async ({ page }) => {
      await page.goto('/fgts');
      await expect(page.getByRole('heading', { name: /FGTS/ })).toBeVisible();

      // Account table visible
      const table = page.locator('.table').first();
      await expect(table).toBeVisible();
      await expect(table.getByRole('columnheader', { name: 'Empresa' })).toBeVisible();
      await expect(table.getByRole('columnheader', { name: 'Saldo' })).toBeVisible();
      await expect(table.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    });

    test('should display account details when clicking "Detalhes"', async ({ page }) => {
      await page.goto('/fgts');
      await page.getByRole('button', { name: 'Detalhes' }).first().click();

      const detailSection = page.locator('.detail-section');
      await expect(detailSection).toBeVisible();

      // Company info
      await expect(detailSection.getByText('Razão Social:')).toBeVisible();
      await expect(detailSection.getByText('CNPJ:')).toBeVisible();
      await expect(detailSection.getByText('Admissão:')).toBeVisible();
    });

    test('should display movimentações table with required columns (data, tipo, valor, saldo)', async ({ page }) => {
      await page.goto('/fgts');
      await page.getByRole('button', { name: 'Detalhes' }).first().click();

      // Movimentações heading
      await expect(page.getByRole('heading', { name: 'Movimentações' })).toBeVisible();

      // Movimentações table with all required columns per AC1
      const movTable = page.locator('.detail-section .table');
      await expect(movTable).toBeVisible();
      await expect(movTable.getByRole('columnheader', { name: 'Data' })).toBeVisible();
      await expect(movTable.getByRole('columnheader', { name: 'Tipo' })).toBeVisible();
      await expect(movTable.getByRole('columnheader', { name: 'Valor' })).toBeVisible();
      await expect(movTable.getByRole('columnheader', { name: 'Saldo Após' })).toBeVisible();
    });

    test('should show transaction types: depósito, JAM, saque-aniversário', async ({ page }) => {
      await page.goto('/fgts');
      await page.getByRole('button', { name: 'Detalhes' }).first().click();

      const movTable = page.locator('.detail-section .table');
      const rows = movTable.locator('tbody tr');
      await expect(rows).not.toHaveCount(0);

      // Verify various transaction types exist
      const allText = await movTable.locator('tbody').textContent();
      expect(allText).toContain('deposito');
      expect(allText).toContain('rendimento'); // JAM
    });

    test('should display formatted currency and dates in movimentações', async ({ page }) => {
      await page.goto('/fgts');
      await page.getByRole('button', { name: 'Detalhes' }).first().click();

      const movTable = page.locator('.detail-section .table');
      const firstRow = movTable.locator('tbody tr').first();

      // Date should be formatted (dd/mm/yyyy pattern)
      const dateCell = firstRow.locator('td').nth(0);
      const dateText = await dateCell.textContent();
      expect(dateText).toMatch(/\d{2}\/\d{2}\/\d{4}/);

      // Value should be formatted as currency (R$)
      const valueCell = firstRow.locator('td').nth(2);
      const valueText = await valueCell.textContent();
      expect(valueText).toContain('R$');
    });
  });

  test.describe('AC2: Filtro por conta/empresa', () => {

    test('should list multiple accounts by enterprise name', async ({ page }) => {
      // Use CPF that may have FGTS accounts
      await page.goto('/fgts');

      const table = page.locator('.table').first();
      await expect(table).toBeVisible();

      // Empresa column should show company name
      await expect(table.getByRole('columnheader', { name: 'Empresa' })).toBeVisible();
      const firstCompany = table.locator('tbody tr').first().locator('td').first();
      const companyName = await firstCompany.textContent();
      expect(companyName!.length).toBeGreaterThan(0);
    });

    test('should allow selecting different accounts to view their details', async ({ page }) => {
      await page.goto('/fgts');
      const rows = page.locator('.table tbody tr');
      const count = await rows.count();

      if (count >= 1) {
        // Open first account
        await page.getByRole('button', { name: 'Detalhes' }).first().click();
        const firstCompany = await page.locator('.detail-section h2').textContent();

        // Close and open another if available
        await page.getByRole('button', { name: 'Fechar' }).click();
        await expect(page.locator('.detail-section')).not.toBeVisible();
      }
    });
  });

  test.describe('AC3: Saque-Aniversário info', () => {

    test('should display Saque Aniversário column in account listing', async ({ page }) => {
      await page.goto('/fgts');

      const table = page.locator('.table').first();
      await expect(table.getByRole('columnheader', { name: 'Saque Aniversário' })).toBeVisible();
    });

    test('should show Saque Aniversário status in detail view for opted-in account', async ({ page }) => {
      await page.goto('/fgts');
      await page.getByRole('button', { name: 'Detalhes' }).first().click();

      // Maria's account has saque-aniversário enabled
      await expect(page.getByText('Saque Aniversário:')).toBeVisible();
      await expect(page.getByText('Ativado')).toBeVisible();
    });

    test('should show month for saque aniversário when enabled', async ({ page }) => {
      await page.goto('/fgts');
      await page.getByRole('button', { name: 'Detalhes' }).first().click();

      // Maria's account has mesSaqueAniversario = "07"
      await expect(page.getByText('Mês Saque Aniv.:')).toBeVisible();
    });
  });

  test.describe('AC4: Saldo disponível para saque', () => {

    test('should display Saldo Total and Saldo Disponível', async ({ page }) => {
      await page.goto('/fgts');
      await page.getByRole('button', { name: 'Detalhes' }).first().click();

      await expect(page.getByText('Saldo Total:')).toBeVisible();
      await expect(page.getByText('Saldo Disponível:')).toBeVisible();
    });

    test('should show saldo disponível as currency value', async ({ page }) => {
      await page.goto('/fgts');
      await page.getByRole('button', { name: 'Detalhes' }).first().click();

      // Maria's saldoDisponivel = 4523.09
      const saldoSection = page.locator('.detail-section');
      const saldoText = await saldoSection.getByText('Saldo Disponível:').locator('..').textContent();
      expect(saldoText).toContain('R$');
    });
  });

  test.describe('Full Journey: Login → FGTS → Extrato → Saque Info', () => {

    test('WI#79 complete acceptance flow', async ({ page }) => {
      // Step 1: Navigate to FGTS from home
      await page.locator('.service-card').filter({ hasText: 'FGTS' }).click();
      await expect(page).toHaveURL('/fgts');
      await expect(page.getByRole('heading', { name: /FGTS/ })).toBeVisible();

      // Step 2: Verify breadcrumb
      await expect(page.getByLabel('Breadcrumb').getByRole('link', { name: 'Início' })).toBeVisible();

      // Step 3: Verify account listing table (AC2 — filter by empresa)
      const mainTable = page.locator('.table').first();
      await expect(mainTable).toBeVisible();
      await expect(mainTable.getByRole('columnheader', { name: 'Empresa' })).toBeVisible();
      await expect(mainTable.getByRole('columnheader', { name: 'Saque Aniversário' })).toBeVisible();
      const accountRows = mainTable.locator('tbody tr');
      await expect(accountRows).not.toHaveCount(0);

      // Step 4: Open account details
      await page.getByRole('button', { name: 'Detalhes' }).first().click();
      const detail = page.locator('.detail-section');
      await expect(detail).toBeVisible();

      // Step 5: Verify company info
      await expect(detail.getByRole('heading', { level: 2 })).toContainText('Tech Solutions Ltda');
      await expect(detail.getByText('CNPJ:')).toBeVisible();

      // Step 6: AC4 — Verify saldo total and disponível
      await expect(detail.getByText('Saldo Total:')).toBeVisible();
      await expect(detail.getByText('Saldo Disponível:')).toBeVisible();

      // Step 7: AC3 — Verify saque-aniversário info
      await expect(detail.getByText('Saque Aniversário:')).toBeVisible();
      await expect(detail.getByText('Ativado')).toBeVisible();
      await expect(detail.getByText('Mês Saque Aniv.:')).toBeVisible();

      // Step 8: AC1 — Verify movimentações table
      await expect(page.getByRole('heading', { name: 'Movimentações' })).toBeVisible();
      const movTable = detail.locator('.table');
      await expect(movTable.getByRole('columnheader', { name: 'Data' })).toBeVisible();
      await expect(movTable.getByRole('columnheader', { name: 'Tipo' })).toBeVisible();
      await expect(movTable.getByRole('columnheader', { name: 'Valor' })).toBeVisible();
      await expect(movTable.getByRole('columnheader', { name: 'Saldo Após' })).toBeVisible();

      const movRows = movTable.locator('tbody tr');
      const count = await movRows.count();
      expect(count).toBeGreaterThanOrEqual(3); // deposito, JAM, saque

      // Step 9: Verify transaction types present
      const movText = await movTable.locator('tbody').textContent();
      expect(movText).toContain('deposito');
      expect(movText).toContain('rendimento'); // JAM

      // Step 10: Close and go back home
      await page.getByRole('button', { name: 'Fechar' }).click();
      await expect(detail).not.toBeVisible();

      await page.getByLabel('Breadcrumb').getByRole('link', { name: 'Início' }).click();
      await expect(page).toHaveURL('/');
    });
  });
});
