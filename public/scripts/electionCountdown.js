function sameLocalDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function pad2(n) {
  return String(n).padStart(2, '0')
}

function initCountdown(el) {
  const iso = el.dataset.electionDate
  if (!iso) return

  const target = new Date(iso)
  if (Number.isNaN(target.getTime())) return

  const titleEl = el.querySelector('[data-role="title"]')
  const daysEl = el.querySelector('[data-role="days"]')
  const timerEl = el.querySelector('[data-role="timer"]')

  const title = el.dataset.title || ''
  const daysLabel = el.dataset.daysLabel || ''
  const dayWord = el.dataset.dayWord || ''
  const daysWord = el.dataset.daysWord || ''

  if (titleEl) titleEl.textContent = title

  const tick = () => {
    const now = new Date()

    // Hide on election day (local date) and after it.
    if (sameLocalDate(now, target) || now.getTime() > target.getTime()) {
      el.classList.add('hidden')
      return
    }

    const diffMs = target.getTime() - now.getTime()
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000))

    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (daysEl) {
      const word = days === 1 ? dayWord : daysWord
      daysEl.textContent = `${daysLabel} ${days} ${word}`.trim()
    }

    if (timerEl) {
      const word = days === 1 ? dayWord : daysWord
      const time = `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`
      timerEl.textContent = `${days} ${word} • ${time}`.trim()
    }
  }

  tick()
  window.setInterval(tick, 1000)
}

function initAll() {
  document
    .querySelectorAll('[data-component="election-countdown"]')
    .forEach((el) => {
      if (el.dataset.countdownInitialized === 'true') return
      el.dataset.countdownInitialized = 'true'
      initCountdown(el)
    })
}

// Initial run
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll, { once: true })
} else {
  initAll()
}

// Astro islands / client navigation
// Note: `astro:hydrate` is dispatched on the island element (non-bubbling by default),
// so we listen in the capture phase on `document`.
document.addEventListener('astro:hydrate', initAll, true)
window.addEventListener('astro:load', initAll)
document.addEventListener('astro:after-swap', initAll)

// Fallback: observe DOM insertions (islands render later)
const observer = new MutationObserver(() => initAll())
observer.observe(document.documentElement, { childList: true, subtree: true })

