'use client'

import { useState, useMemo } from 'react'
import { Flame } from 'lucide-react'
import { StreakCalendar } from '@/components/streak/streak-calendar'
import type { StreakData } from '@/lib/streak'

function buildDemoData() {
  const today = new Date()
  const activeDates = new Set<string>()
  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    activeDates.add(d.toLocaleDateString('en-CA'))
  }
  const streakData: StreakData = {
    currentStreak: 14,
    longestStreak: 21,
    lastEntryDate: today.toLocaleDateString('en-CA'),
  }
  return { activeDates, streakData, month: today.getMonth(), year: today.getFullYear() }
}

export function StreakTeaser() {
  const demo = useMemo(buildDemoData, [])
  const [month, setMonth] = useState(demo.month)
  const [year, setYear] = useState(demo.year)

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    const today = new Date()
    if (year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth())) {
      if (month === 11) {
        setMonth(0)
        setYear((y) => y + 1)
      } else {
        setMonth((m) => m + 1)
      }
    }
  }

  return (
    <section className="border-t border-border/40 px-4 py-16 md:py-20">
      <div className="max-w-xs mx-auto space-y-5">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-jetbrains text-center">
          Writing streaks
        </p>
        <div className="bg-card border border-border rounded-xs shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-500" />
              <span className="font-jetbrains text-sm font-semibold">
                {demo.streakData.currentStreak}
              </span>
              <span className="font-jetbrains text-xs text-muted-foreground">
                day streak
              </span>
            </div>
            <div className="font-jetbrains text-xs text-muted-foreground">
              best: {demo.streakData.longestStreak}
            </div>
          </div>
          <StreakCalendar
            activeDates={demo.activeDates}
            streakData={demo.streakData}
            month={month}
            year={year}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        </div>
      </div>
    </section>
  )
}
