'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toLocalDateString, type StreakData } from '@/lib/streak'

interface StreakCalendarProps {
  activeDates: Set<string>
  streakData: StreakData
  month: number
  year: number
  onPrevMonth: () => void
  onNextMonth: () => void
}

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

interface CalendarCell {
  dateStr: string | null
  isToday: boolean
  hasEntry: boolean
  isStreakDay: boolean
}

function buildCells(
  year: number,
  month: number,
  activeDates: Set<string>,
  streakData: StreakData,
): CalendarCell[] {
  const today = toLocalDateString(new Date().toISOString())

  const streakDays = new Set<string>()
  if (streakData.lastEntryDate && streakData.currentStreak > 0) {
    const end = new Date(streakData.lastEntryDate + 'T12:00:00')
    for (let i = 0; i < streakData.currentStreak; i++) {
      const d = new Date(end)
      d.setDate(d.getDate() - i)
      streakDays.add(d.toLocaleDateString('en-CA'))
    }
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: CalendarCell[] = []

  for (let i = 0; i < firstDay; i++) {
    cells.push({ dateStr: null, isToday: false, hasEntry: false, isStreakDay: false })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = new Date(year, month, day).toLocaleDateString('en-CA')
    cells.push({
      dateStr,
      isToday: dateStr === today,
      hasEntry: activeDates.has(dateStr),
      isStreakDay: streakDays.has(dateStr),
    })
  }

  return cells
}

export function StreakCalendar({
  activeDates,
  streakData,
  month,
  year,
  onPrevMonth,
  onNextMonth,
}: StreakCalendarProps) {
  const today = new Date()
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth()

  const cells = buildCells(year, month, activeDates, streakData)

  return (
    <div className="select-none">
      {/* Month header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={onPrevMonth}
          className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-xs"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span className="text-[11px] text-muted-foreground font-medium tracking-wide">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          onClick={onNextMonth}
          disabled={isCurrentMonth}
          className={cn(
            'text-muted-foreground transition-colors p-0.5 rounded-xs',
            isCurrentMonth
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:text-foreground',
          )}
          aria-label="Next month"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="h-5 flex items-center justify-center text-[9px] text-muted-foreground/60 font-medium"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((cell, i) => {
          if (!cell.dateStr) {
            return <div key={`blank-${i}`} className="w-7 h-7" />
          }

          return (
            <div
              key={cell.dateStr}
              className={cn(
                'w-7 h-7 flex flex-col items-center justify-center text-[11px] rounded-xs transition-colors',
                cell.isToday && !cell.hasEntry && 'ring-1 ring-foreground/25',
                cell.isToday &&
                cell.hasEntry &&
                cell.isStreakDay &&
                'ring-1 ring-foreground/40 bg-accent/50',
                cell.isToday &&
                cell.hasEntry &&
                !cell.isStreakDay &&
                'ring-1 ring-foreground/25',
                cell.hasEntry
                  ? 'text-foreground/90'
                  : 'text-foreground/40',
              )}
            >
              <span className="leading-none">{new Date(cell.dateStr + 'T12:00:00').getDate()}</span>
              <div
                className={cn(
                  'w-1 h-0.5 rounded-xs mt-0.5',
                  cell.hasEntry && cell.isStreakDay && 'bg-foreground/60',
                  cell.hasEntry && !cell.isStreakDay && 'bg-foreground/35',
                  !cell.hasEntry && 'opacity-0',
                )}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
