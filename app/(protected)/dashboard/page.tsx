import { createClient } from '@/lib/supabase/server'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
import type { Habit, Task } from '@/types'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const today = new Date().toLocaleDateString('en-CA')

  const [habitsResult, tasksResult, entriesResult] = await Promise.all([
    supabase
      .from('habits')
      .select('id, name, color, icon')
      .eq('user_id', user.id)
      .eq('is_archived', false)
      .order('sort_order'),
    supabase
      .from('tasks')
      .select('id, title, priority, due_date, completed_at')
      .eq('user_id', user.id)
      .is('completed_at', null)
      .lte('due_date', today)
      .order('due_date'),
    supabase
      .from('entries')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  const habits = (habitsResult.data as Pick<Habit, 'id' | 'name' | 'color' | 'icon'>[] | null) ?? []
  const tasksDueToday = (tasksResult.data as Pick<Task, 'id' | 'title' | 'priority' | 'due_date' | 'completed_at'>[] | null) ?? []
  const entryDates = ((entriesResult.data ?? []) as Array<{ created_at: string }>).map((e) => e.created_at)

  const habitIds = habits.map((h) => h.id)
  let completedToday: string[] = []

  if (habitIds.length > 0) {
    const logsResult = await supabase
      .from('habit_logs')
      .select('habit_id')
      .eq('user_id', user.id)
      .eq('logged_on', today)
      .in('habit_id', habitIds)

    completedToday = ((logsResult.data ?? []) as Array<{ habit_id: string }>).map((l) => l.habit_id)
  }

  return (
    <DashboardOverview
      habits={habits}
      completedToday={completedToday}
      tasksDueToday={tasksDueToday}
      entryDates={entryDates}
      today={today}
    />
  )
}
