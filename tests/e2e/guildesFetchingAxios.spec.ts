import { expect, test } from '@playwright/test'
import { createControlledPromise } from './helpers/ControlledPromise'

test.beforeEach(async ({page}) => {
    await page.goto('/fetching/guides/fetching-data-axios')
})

test.describe('fetching as per manuals - axios style', () => {
    test('ok', async ({ page }) => {

        page.route('https://swapi.dev/api/people/2/', async route => {
            await route.fulfill({
                json: {"some": "data"}
            })
        })

        await page.getByTestId('user-id-input').fill('2')

        await expect(page.getByTestId('result')).toContainText('{"some":"data"}')
    })

    test('err 404', async ({ page }) => {

        page.route('https://swapi.dev/api/people/2/', async route => {
            await route.fulfill({
                status: 404,
                json: {"not found": "http404"}
            })
        })
        await page.getByTestId('user-id-input').fill('2')

        await expect(page.getByTestId('error')).toContainText('Error: Request failed with status code 404')
    })

    test('err network', async ({ page }) => {

        page.route('https://swapi.dev/api/people/2/', async route => {
            await route.abort('timedout')
        })
        await page.getByTestId('user-id-input').fill('2')

        await expect(page.getByTestId('error')).toContainText('Error: timeout exceeded')
    })

    test('request delayed and then we do the next one', async ({ page }) => {

        const letFirstRequestPass = createControlledPromise()

        page.route('https://swapi.dev/api/people/1/', async route => {
            await letFirstRequestPass;
            await route.fulfill({
                json: {"people": "1"}
            })
        })
        page.route('https://swapi.dev/api/people/2/', async route => {
            await route.fulfill({
                json: {"people": "2"}
            })
        })

        await page.getByTestId('user-id-input').fill('1')
        await expect(page.getByTestId('loading')).toHaveText('Loading...')

        await page.getByTestId('user-id-input').fill('2')
        await expect(page.getByTestId('result')).toContainText('{"people":"2"}')

        letFirstRequestPass.resolve()
        await expect(page.getByTestId('result')).toContainText('{"people":"2"}')
    })
})