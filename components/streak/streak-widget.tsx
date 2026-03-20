'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { PenLine } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useStreak } from '@/hooks/use-streak'
import { StreakCalendar } from './streak-calendar'
import type { User } from '@supabase/supabase-js'

const HIDDEN_ROUTES = ['/login', '/signup', '/verify-email']

export function StreakWidget() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [dates, setDates] = useState<string[]>([])

  const [expanded, setExpanded] = useState(false)
  const [calendarDate, setCalendarDate] = useState(() => {
    const now = new Date()
    return { month: now.getMonth(), year: now.getFullYear() }
  })

  const isTouchRef = useRef(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
  }, [pathname])

  useEffect(() => {
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) {
      setDates([])
      return
    }

    const supabase = createClient()
    supabase
      .from('entries')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setDates((data ?? []).map((e) => e.created_at))
      })
  }, [user])

  useEffect(() => {
    isTouchRef.current = window.matchMedia('(hover: none)').matches
  }, [])

  useEffect(() => {
    if (!expanded || !isTouchRef.current) return

    function handleOutside(e: MouseEvent | TouchEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setExpanded(false)
      }
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [expanded])

  const handleMouseEnter = useCallback(() => {
    if (!isTouchRef.current) setExpanded(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!isTouchRef.current) setExpanded(false)
  }, [])

  const handleClick = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  function prevMonth() {
    setCalendarDate(({ month, year }) => {
      if (month === 0) return { month: 11, year: year - 1 }
      return { month: month - 1, year }
    })
  }

  function nextMonth() {
    const now = new Date()
    setCalendarDate(({ month, year }) => {
      if (year === now.getFullYear() && month === now.getMonth())
        return { month, year }
      if (month === 11) return { month: 0, year: year + 1 }
      return { month: month + 1, year }
    })
  }

  const isHiddenRoute = HIDDEN_ROUTES.some((route) =>
    pathname.startsWith(route),
  )

  const { streakData, activeDates } = useStreak({ initialDates: dates })
  const { currentStreak } = streakData

  if (isHiddenRoute || user === undefined || user === null) return null

  return (
    <div
      ref={wrapperRef}
      className="fixed bottom-6 left-6 z-40 font-jetbrains"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Expanded popover */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="streak-card"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18, ease: [0.04, 0.62, 0.23, 0.98] }}
            style={{ transformOrigin: 'bottom left' }}
            className="absolute bottom-full mb-2 left-0 w-[220px] p-3
                       bg-card border border-border rounded-xs shadow-md paper-texture"
          >
            {/* Streak header */}
            <div className="mb-2">
              {currentStreak > 0 ? (
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {currentStreak} day{currentStreak !== 1 ? 's' : ''} streak
                </p>
              ) : (
                <p className="text-sm text-muted-foreground leading-tight">
                  Start your streak
                </p>
              )}
              {streakData.longestStreak > 0 && (
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                  Best: {streakData.longestStreak} day
                  {streakData.longestStreak !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="border-t border-border/50 pt-2">
              <StreakCalendar
                activeDates={activeDates}
                streakData={streakData}
                month={calendarDate.month}
                year={calendarDate.year}
                onPrevMonth={prevMonth}
                onNextMonth={nextMonth}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed pill */}
      <motion.button
        layout
        onClick={handleClick}
        className={cn(
          'flex items-center gap-1.5 h-8 px-3 rounded-xs',
          'bg-card border border-border shadow-sm paper-texture',
          'text-sm text-foreground/80 hover:text-foreground',
          'transition-colors cursor-pointer',
        )}
        aria-label={`Writing streak: ${currentStreak} day${currentStreak !== 1 ? 's' : ''}`}
        aria-expanded={expanded}
      >
        <PenLine className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        <span className="tabular-nums">{currentStreak}</span>
        <span className="text-[10px] text-muted-foreground">
          {currentStreak !== 1 ? 'days' : 'day'}
        </span>
      </motion.button>
    </div>
  )
}
