function setupMobileMenu() {
  const toggleMobileButton = document.getElementById('toggle-nav-menu-mobile')
  const openMenuIcon = document.getElementById('open-nav-menu-icon')
  const closeMenuIcon = document.getElementById('close-nav-menu-icon')
  const drawer = document.getElementById('drawer')
  const drawerBody = document.getElementById('drawer-body')

  if (
    !toggleMobileButton ||
    !openMenuIcon ||
    !closeMenuIcon ||
    !drawer ||
    !drawerBody
  ) {
    return false
  }

  if (toggleMobileButton.dataset.mobileMenuBound === 'true') {
    return true
  }
  toggleMobileButton.dataset.mobileMenuBound = 'true'

  toggleMobileButton.addEventListener('click', () => {
    const isOpen = toggleMobileButton.getAttribute('aria-expanded') === 'true'

    if (isOpen) {
      drawerBody.classList.add('opacity-0', '-translate-y-full')
      drawerBody.classList.remove('translate-y-0')

      window.setTimeout(() => {
        drawer.classList.add('hidden')
      }, 300)

      drawer.setAttribute('aria-hidden', 'true')
      openMenuIcon.classList.add('scale-100', 'opacity-100')
      closeMenuIcon.classList.add('scale-0', 'opacity-0')
      closeMenuIcon.classList.remove('scale-100', 'opacity-100')
    } else {
      drawer.classList.remove('hidden')
      drawerBody.classList.add('translate-y-0')
      drawerBody.classList.remove('opacity-0', '-translate-y-full')

      drawer.setAttribute('aria-hidden', 'false')
      openMenuIcon.classList.add('scale-0', 'opacity-0')
      closeMenuIcon.classList.add('scale-100', 'opacity-100')
      openMenuIcon.classList.remove('scale-100', 'opacity-100')
    }

    toggleMobileButton.setAttribute('aria-expanded', (!isOpen).toString())
  })

  return true
}

function initMobileMenu() {
  if (setupMobileMenu()) return

  const observer = new MutationObserver((_, obs) => {
    if (setupMobileMenu()) {
      obs.disconnect()
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileMenu, { once: true })
} else {
  initMobileMenu()
}
