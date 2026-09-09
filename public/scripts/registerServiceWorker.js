// Skip registration during local development so the service worker cache
// never fights with Vite's dev server / HMR.
const isLocalDev =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'

if ('serviceWorker' in navigator && !isLocalDev) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Offline support is a nice-to-have; ignore registration failures.
    })
  })
}
