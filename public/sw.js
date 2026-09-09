const CACHE_VERSION = 'v1'
const CACHE_NAME = `moja-srbija-moj-glas-${CACHE_VERSION}`

// Core app shell: enough to open the form and generate documents offline.
const PRECACHE_URLS = [
  '/',
  '/en/',
  '/sr-cyrl/',
  '/prirucnik/',
  '/en/handbook/',
  '/sr-cyrl/prirucnik/',
  '/glasanje/',
  '/en/voting/',
  '/sr-cyrl/glasanje/',
  '/data/embassy.json',
  '/data/embassy-cyrl.json',
  '/data/zahtev-za-glasanje.docx',
  '/data/zahtev-za-upis.docx',
  '/site.webmanifest',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.all(
          PRECACHE_URLS.map((url) =>
            cache.add(url).catch(() => {
              // Ignore individual failures (e.g. a route that 404s in dev)
              // so one bad URL doesn't block the whole install.
            }),
          ),
        ),
      )
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Navigations: try the network first (fresh content), fall back to the
  // cached shell when offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(
          () => caches.match(request) || caches.match('/') || fetch(request),
        ),
    )
    return
  }

  // Everything else (JS/CSS bundles, JSON data, docx templates, images):
  // serve from cache when available, refresh the cache in the background.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => cached)

      return cached || network
    }),
  )
})
