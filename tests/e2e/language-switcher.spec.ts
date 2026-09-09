import { test, expect } from '@playwright/test'

test.describe('Language switcher', () => {
  test('on the Serbian (Latin) homepage, only the other two languages are offered', async ({
    page,
  }) => {
    await page.goto('/')

    const switcher = page.locator('#language-switcher')
    await expect(switcher.getByRole('link', { name: 'Срп' })).toBeVisible()
    await expect(switcher.getByRole('link', { name: 'Eng' })).toBeVisible()
    await expect(
      switcher.getByRole('link', { name: 'Srp', exact: true }),
    ).toHaveCount(0)
  })

  test('switching to English navigates to the English homepage', async ({
    page,
  }) => {
    await page.goto('/')

    await page
      .locator('#language-switcher')
      .getByRole('link', { name: 'Eng' })
      .click()

    await expect(page).toHaveURL(/\/en\/?$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(
      page.getByRole('heading', {
        name: 'Voting from Abroad – Simple, Digital, Secure',
      }),
    ).toBeVisible()
  })

  test('switching to Cyrillic navigates to the Cyrillic homepage', async ({
    page,
  }) => {
    await page.goto('/')

    await page
      .locator('#language-switcher')
      .getByRole('link', { name: 'Срп' })
      .click()

    await expect(page).toHaveURL(/\/sr-cyrl\/?$/)
    await expect(
      page.getByRole('heading', {
        name: 'Гласање из иностранства – једноставно, дигитално, безбедно',
      }),
    ).toBeVisible()
  })

  test('from the English homepage, the switcher offers both Serbian variants', async ({
    page,
  }) => {
    await page.goto('/en')

    const switcher = page.locator('#language-switcher')
    await expect(
      switcher.getByRole('link', { name: 'Srp', exact: true }),
    ).toBeVisible()
    await expect(switcher.getByRole('link', { name: 'Срп' })).toBeVisible()
    await expect(switcher.getByRole('link', { name: 'Eng' })).toHaveCount(0)
  })

  test('switching language preserves the current page (handbook)', async ({
    page,
  }) => {
    await page.goto('/prirucnik')

    await page
      .locator('#language-switcher')
      .getByRole('link', { name: 'Eng' })
      .click()

    await expect(page).toHaveURL(/\/en\/handbook\/?$/)
  })

  test('switching language preserves the current page (voting form)', async ({
    page,
  }) => {
    await page.goto('/glasanje')

    await page
      .locator('#language-switcher')
      .getByRole('link', { name: 'Срп' })
      .click()

    await expect(page).toHaveURL(/\/sr-cyrl\/glasanje\/?$/)
  })

  test('switching from English back to Serbian (Latin) preserves the current page', async ({
    page,
  }) => {
    await page.goto('/en/handbook')

    await page
      .locator('#language-switcher')
      .getByRole('link', { name: 'Srp', exact: true })
      .click()

    await expect(page).toHaveURL(/\/prirucnik\/?$/)
  })
})
