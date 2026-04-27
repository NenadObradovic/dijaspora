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
  const hoursLabel = el.dataset.hoursLabel || ''

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
      timerEl.textContent =
        `${hoursLabel} ${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`.trim()
    }
  }

  tick()
  window.setInterval(tick, 1000)
}

document
  .querySelectorAll('[data-component="election-countdown"]')
  .forEach((el) => {
    initCountdown(el)
  })
