export function computeHabitStreak(logDates: string[]): number {
  if (logDates.length === 0) return 0

  const sorted = [...logDates].sort((a, b) => (a > b ? -1 : 1))
  const today = new Date().toLocaleDateString('en-CA')
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA')

  const mostRecent = sorted[0]
  if (mostRecent !== today && mostRecent !== yesterday) return 0

  let streak = 0
  let expected = mostRecent

  for (const date of sorted) {
    if (date === expected) {
      streak++
      const d = new Date(date + 'T12:00:00')
      d.setDate(d.getDate() - 1)
      expected = d.toLocaleDateString('en-CA')
    } else {
      break
    }
  }

  return streak
}
