import { test, expect } from '@playwright/test'

test.describe('Desktop navigation', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('nav links are visible directly in the header, without opening a menu', async ({
    page,
  }) => {
    await page.goto('/')

    const nav = page.locator('#main-navigation-menu')
    await expect(nav.getByRole('link', { name: 'Početna' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Priručnik' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Glasanje' })).toBeVisible()
  })

  test('the mobile menu toggle is not shown on desktop', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('#toggle-nav-menu-mobile')).toBeHidden()
  })

  test('clicking a nav link navigates to the right page', async ({ page }) => {
    await page.goto('/')

    await page
      .locator('#main-navigation-menu')
      .getByRole('link', { name: 'Priručnik' })
      .click()

    await expect(page).toHaveURL(/\/prirucnik\/?$/)
    await expect(
      page.getByRole('heading', {
        name: 'Glasanje u inostranstvu',
        exact: true,
      }),
    ).toBeVisible()
  })

  test('the link for the current page is marked active', async ({ page }) => {
    await page.goto('/glasanje')

    // Every link carries `hover:underline`; only the active one also gets
    // the plain `underline` class, so match it as a standalone class token.
    const activeClass = /(^|\s)underline(\s|$)/
    const nav = page.locator('#main-navigation-menu')
    await expect(nav.getByRole('link', { name: 'Glasanje' })).toHaveClass(
      activeClass,
    )
    await expect(nav.getByRole('link', { name: 'Početna' })).not.toHaveClass(
      activeClass,
    )
  })
})

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('nav links are not directly visible; the menu toggle is shown instead', async ({
    page,
  }) => {
    await page.goto('/')

    await expect(page.locator('#main-navigation-menu')).toBeHidden()
    await expect(page.locator('#toggle-nav-menu-mobile')).toBeVisible()
  })

  test('opening the menu reveals the nav links and toggles aria-expanded', async ({
    page,
  }) => {
    await page.goto('/')

    const toggle = page.locator('#toggle-nav-menu-mobile')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await toggle.click()

    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const mobileNav = page.locator('#nav-menu-mobile')
    await expect(mobileNav.getByRole('link', { name: 'Početna' })).toBeVisible()
    await expect(
      mobileNav.getByRole('link', { name: 'Priručnik' }),
    ).toBeVisible()
    await expect(
      mobileNav.getByRole('link', { name: 'Glasanje' }),
    ).toBeVisible()
  })

  test('closing the menu hides it again', async ({ page }) => {
    await page.goto('/')

    const toggle = page.locator('#toggle-nav-menu-mobile')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await toggle.click()

    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  test('tapping a link in the mobile menu navigates to the right page', async ({
    page,
  }) => {
    await page.goto('/')

    await page.locator('#toggle-nav-menu-mobile').click()
    await page
      .locator('#nav-menu-mobile')
      .getByRole('link', { name: 'Glasanje' })
      .click()

    await expect(page).toHaveURL(/\/glasanje\/?$/)
  })
})
