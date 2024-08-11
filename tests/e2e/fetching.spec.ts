import {expect, test} from '@playwright/test'

test.describe('fetching', () => {
    test('ok', async ({page}) => {
        page.goto('/fetching')
        await expect(page.getByText('Fetching experiments')).toBeVisible()
    })
})