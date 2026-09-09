const STORAGE_KEY = 'theme'

function storeTheme(theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // ignore write errors (private browsing, disabled storage, etc.)
  }
}

function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light'
}

function setAriaPressed() {
  const button = document.getElementById('theme-toggle')
  if (button) {
    button.setAttribute('aria-pressed', String(currentTheme() === 'dark'))
  }
}

// Event delegation: survives the header DOM being replaced when the
// React island (I18nRouterProvider, client:load) hydrates. The icons
// themselves are shown/hidden via the Tailwind `dark:` variant, which
// reads the `data-theme` attribute directly, so no JS is needed to keep
// them in sync.
document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return
  if (!event.target.closest('#theme-toggle')) return

  const nextTheme = currentTheme() === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', nextTheme)
  storeTheme(nextTheme)
  setAriaPressed()
})

setAriaPressed()
document.addEventListener('astro:page-load', setAriaPressed)
