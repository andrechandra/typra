import { cookies } from 'next/headers'

/**
 * Returns today's date as a 'YYYY-MM-DD' string in the user's local timezone.
 * Falls back to UTC if the tz cookie (set by TimezoneSync) hasn't been written yet
 * (e.g. the very first page load before JS runs).
 */
export async function getTodayString(): Promise<string> {
  const cookieStore = await cookies()
  const tz = decodeURIComponent(cookieStore.get('tz')?.value ?? '') || 'UTC'
  return new Date().toLocaleDateString('en-CA', { timeZone: tz })
}

/**
 * Returns the user's IANA timezone string, defaulting to 'UTC'.
 */
export async function getUserTimezone(): Promise<string> {
  const cookieStore = await cookies()
  return decodeURIComponent(cookieStore.get('tz')?.value ?? '') || 'UTC'
}
