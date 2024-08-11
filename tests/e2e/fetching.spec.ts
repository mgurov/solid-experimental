import { expect, test } from '@playwright/test'
import { createControlledPromise as createControlledPromise } from './helpers/ControlledPromise'

test.describe('fetching', () => {
    test('ok simple', async ({ page }) => {

        page.route('/api/call1', async route => {
            await route.fulfill({
                json: {
                    action: 'redirect',
                    value: 'call2'
                }
            })
        })

        page.route('/api/call2', async route => {
            await route.fulfill({ json: { 
                action: 'result',
                value: '🏆' 
            } })
        })

        page.goto('/fetching')
        await expect(page.getByText('Fetching experiments')).toBeVisible()

        await expect(page.getByTestId('call1-result')).toContainText('redirect: call2')

        await expect(page.getByTestId('call2-result')).toContainText('result: 🏆')
    })

    test('ok delayed logging', async ({ page }) => {

        const firstPromise = createControlledPromise()

        page.route('/api/call1', async route => {
            await firstPromise;
            await route.fulfill({
                json: {
                    action: 'redirect',
                    value: 'call2'
                }
            })
        })

        const secondPromise = createControlledPromise()
        page.route('/api/call2', async route => {
            await secondPromise;
            await route.fulfill({ json: { 
                action: 'result',
                value: '🏆' 
            } })
        })

        page.goto('/fetching')

        await expect(page.getByTestId('call1-pending')).toContainText('call1 Loading...')

        await page.waitForTimeout(1000)
        firstPromise.resolve()

        await expect(page.getByTestId('call1-result')).toContainText('redirect: call2')

        await expect(page.getByTestId('call2-pending')).toContainText('call2 Loading...')

        await page.waitForTimeout(1000)
        secondPromise.resolve()

        await expect(page.getByTestId('call2-result')).toContainText('result: 🏆')
    })

    test('first 404', async ({ page }) => {

        page.route('/api/call1', async route => {
            await route.fulfill({
                status: 404,
                json: {
                    message: 'Page doesnt exist'
                }
            })
        })

        page.route('/api/call2', async route => {
            await route.fulfill({ json: { 
                action: 'result',
                value: '🏆' 
            } })
        })

        page.goto('/fetching')
        await expect(page.getByText('Fetching experiments')).toBeVisible()

        await expect(page.getByTestId('call1-err')).toContainText('Error: Request failed with status code 404')
    })
})