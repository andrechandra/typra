'use client'

import { useMemo, useState, useCallback } from 'react'
import {
  computeStreak,
  buildActiveDatesSet,
  type StreakData,
} from '@/lib/streak'

interface UseStreakOptions {
  initialDates: string[]
}

interface UseStreakReturn {
  streakData: StreakData
  activeDates: Set<string>
  addEntryDate: (iso: string) => void
}

export function useStreak({ initialDates }: UseStreakOptions): UseStreakReturn {
  const [addedDates, setAddedDates] = useState<string[]>([])

  const allDates = useMemo(
    () => (addedDates.length > 0 ? [...addedDates, ...initialDates] : initialDates),
    [addedDates, initialDates],
  )

  const streakData = useMemo(() => computeStreak(allDates), [allDates])
  const activeDates = useMemo(() => buildActiveDatesSet(allDates), [allDates])

  const addEntryDate = useCallback((iso: string) => {
    setAddedDates((prev) => [iso, ...prev])
  }, [])

  return { streakData, activeDates, addEntryDate }
}
