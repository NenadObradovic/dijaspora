import fileSaver from 'file-saver'
import { ELECTION_DATE_ISO } from '../config/election'

const MS_PER_DAY = 24 * 60 * 60 * 1000

// The unified voters' register closes 15 days before election day, and the
// request to vote abroad must be submitted at least 5 days before that.
const DAYS_BEFORE_ELECTION_DEADLINE = 20

const toIcsDate = (date) => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

const escapeIcsText = (text) =>
  text.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;')

export const getRequestDeadlineDate = () => {
  if (!ELECTION_DATE_ISO) return null
  const electionDate = new Date(ELECTION_DATE_ISO)
  return new Date(
    electionDate.getTime() - DAYS_BEFORE_ELECTION_DEADLINE * MS_PER_DAY,
  )
}

export const generateIcsReminder = ({ title, description }) => {
  const deadline = getRequestDeadlineDate()
  if (!deadline) return

  const start = toIcsDate(deadline)
  const end = toIcsDate(new Date(deadline.getTime() + 60 * 60 * 1000))
  const stamp = toIcsDate(new Date())

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Moja Srbija - Moj Glas//Rok za prijavu glasanja//SR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:vote-deadline-${deadline.getTime()}@moja-srbija-moj-glas`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'TRIGGER:-P1D',
    `DESCRIPTION:${escapeIcsText(title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  const blob = new Blob([lines.join('\r\n')], {
    type: 'text/calendar;charset=utf-8',
  })
  fileSaver.saveAs(blob, 'rok-za-prijavu-glasanja.ics')
}
