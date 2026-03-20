export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastEntryDate: string | null // 'YYYY-MM-DD'
}

/**
 * Converts an ISO timestamp to a 'YYYY-MM-DD' string in the user's local timezone.
 * Uses 'en-CA' locale which natively produces ISO 8601 date format.
 */
export function toLocalDateString(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-CA')
}

/**
 * Deduplicates an array of ISO timestamps into unique local date strings,
 * sorted descending (most recent first).
 */
export function uniqueLocalDates(isoDates: string[]): string[] {
  const seen = new Set<string>()
  for (const iso of isoDates) {
    seen.add(toLocalDateString(iso))
  }
  return Array.from(seen).sort((a, b) => (a > b ? -1 : 1))
}

/**
 * Computes current and longest streak from an array of ISO entry timestamps.
 * A streak is consecutive calendar days (user's local timezone) with ≥1 entry.
 * Missing a day resets the current streak to 0.
 */
export function computeStreak(isoDates: string[]): StreakData {
  if (isoDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastEntryDate: null }
  }

  const dates = uniqueLocalDates(isoDates) // sorted descending
  const today = toLocalDateString(new Date().toISOString())
  const yesterday = toLocalDateString(
    new Date(Date.now() - 86400000).toISOString(),
  )

  // Current streak: walk backwards from most recent entry
  let currentStreak = 0
  const mostRecent = dates[0]

  // If latest entry is not today or yesterday, no active streak
  if (mostRecent === today || mostRecent === yesterday) {
    let expected = mostRecent
    for (const date of dates) {
      if (date === expected) {
        currentStreak++
        // Move expected back one day
        const d = new Date(date + 'T12:00:00')
        d.setDate(d.getDate() - 1)
        expected = d.toLocaleDateString('en-CA')
      } else {
        break
      }
    }
  }

  // Longest streak: second pass over dates sorted ascending
  const ascending = [...dates].sort()
  let longest = 0
  let run = 0
  let prevDate: string | null = null

  for (const date of ascending) {
    if (prevDate === null) {
      run = 1
    } else {
      const prev = new Date(prevDate + 'T12:00:00')
      const curr = new Date(date + 'T12:00:00')
      const diffDays = Math.round(
        (curr.getTime() - prev.getTime()) / 86400000,
      )
      if (diffDays === 1) {
        run++
      } else {
        run = 1
      }
    }
    if (run > longest) longest = run
    prevDate = date
  }

  return {
    currentStreak,
    longestStreak: longest,
    lastEntryDate: dates[0] ?? null,
  }
}

/**
 * Builds a Set of 'YYYY-MM-DD' strings for O(1) calendar day lookup.
 */
export function buildActiveDatesSet(isoDates: string[]): Set<string> {
  const set = new Set<string>()
  for (const iso of isoDates) {
    set.add(toLocalDateString(iso))
  }
  return set
}
