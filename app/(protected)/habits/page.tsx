import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { getTodayString, getUserTimezone } from '@/lib/get-today'
import { Button } from '@/components/ui/button'
import { HabitList } from '@/components/habits/habit-list'
import { computeHabitStreak } from '@/lib/habit-streak'
import type { Habit, HabitWithLog } from '@/types'

export const metadata = { title: 'Habits' }

export default async function HabitsPage() {
  const user = await getAuthUser()
  if (!user) return null

  const supabase = await createClient()

  const [today, timezone] = await Promise.all([getTodayString(), getUserTimezone()])

  const { data: habitsData } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_archived', false)
    .order('sort_order')
    .order('created_at')

  const habitList: Habit[] = (habitsData as Habit[] | null) ?? []

  let completedToday: string[] = []
  let allLogs: Array<{ habit_id: string; logged_on: string }> = []

  if (habitList.length > 0) {
    const ids = habitList.map((h) => h.id)
    const { data: logs } = await supabase
      .from('habit_logs')
      .select('habit_id, logged_on')
      .eq('user_id', user.id)
      .in('habit_id', ids)
      .order('logged_on', { ascending: false })

    allLogs = (logs as Array<{ habit_id: string; logged_on: string }> | null) ?? []
    completedToday = allLogs
      .filter((l) => l.logged_on === today)
      .map((l) => l.habit_id)
  }

  const completedSet = new Set(completedToday)

  const habitsWithLog: HabitWithLog[] = habitList.map((h) => {
    const logDates = allLogs
      .filter((l) => l.habit_id === h.id)
      .map((l) => l.logged_on)
    return {
      ...h,
      completedToday: completedSet.has(h.id),
      currentStreak: computeHabitStreak(logDates, timezone),
    }
  })

  const done = habitsWithLog.filter((h) => h.completedToday)
  const pending = habitsWithLog.filter((h) => !h.completedToday)

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-jetbrains text-xl font-semibold">Habits</h1>
          <p className="text-xs font-jetbrains text-muted-foreground mt-0.5">
            {done.length}/{habitsWithLog.length} completed today
          </p>
        </div>
        <Button asChild size="small">
          <Link href="/habits/new">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            New habit
          </Link>
        </Button>
      </div>

      {habitsWithLog.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="font-jetbrains text-muted-foreground text-sm">
            No habits yet.
          </p>
          <Button asChild variant="outline" size="small">
            <Link href="/habits/new">Create your first habit</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div>
              <p className="text-xs font-jetbrains text-muted-foreground uppercase tracking-widest mb-2">
                Remaining
              </p>
              <HabitList habits={pending} today={today} />
            </div>
          )}

          {done.length > 0 && (
            <div>
              <p className="text-xs font-jetbrains text-muted-foreground uppercase tracking-widest mb-2">
                Completed
              </p>
              <HabitList habits={done} today={today} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
