import {test, expect} from '@playwright/test';


test('clicking the button opens the form', async ({page}) => {
    await page.goto('/budget-visualizer');
    await page.getByRole('tab', { name: 'budget-visualizer' }).click();
    await page.getByRole('button', {name: 'Add New Transaction'}).click();
    await expect(page.getByText('Add New TransactionCreditDebitDateDescriptionMemoAmount DebitAmount Credit')).toBeVisible();
})

test('the default type is Debit and the Amount Credit field is disabled', async ({page}) => {
    await page.goto('/budget-visualizer');
    await page.getByRole('tab', { name: 'budget-visualizer' }).click();
    await page.getByRole('button', {name: 'Add New Transaction'}).click();
    await expect(page.getByLabel('Amount Credit')).toBeDisabled();
})

test('clicking the Credit radio button enables the Amount Credit input and the Amount Debit is disabled', async ({page}) => {
    await page.goto('/budget-visualizer');
    await page.getByRole('tab', { name: 'budget-visualizer' }).click();
    await page.getByRole('button', {name: 'Add New Transaction'}).click();
    await page.locator('div').filter({ hasText: /^CreditDebit$/ }).locator('div').click();
    await expect(page.getByLabel('Amount Credit')).toBeEnabled();
    await expect(page.getByLabel('Amount Debit')).toBeDisabled();
})

test('clicking the Close closes the form', async ({page}) => {
    await page.goto('/budget-visualizer');
    await page.getByRole('tab', { name: 'budget-visualizer' }).click();
    await page.getByRole('button', {name: 'Add New Transaction'}).click();
    await page.getByLabel('Close this dialog').click();
    await expect(page.getByText('Add New TransactionCreditDebitDateDescriptionMemoAmount DebitAmount Credit')).not.toBeVisible();
})

