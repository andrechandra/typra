'use client'

import Link from 'next/link'
import { CheckSquare, ListTodo, PenLine, Flame, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { computeStreak } from '@/lib/streak'
import { cn } from '@/lib/utils'

interface Habit {
  id: string
  name: string
  color: string
  icon: string
}

interface TaskSummary {
  id: string
  title: string
  priority: string
  due_date: string | null
  completed_at: string | null
}

interface DashboardOverviewProps {
  habits: Habit[]
  completedToday: string[]
  tasksDueToday: TaskSummary[]
  entryDates: string[]
  today: string
}

export function DashboardOverview({
  habits,
  completedToday,
  tasksDueToday,
  entryDates,
  today,
}: DashboardOverviewProps) {
  const streak = computeStreak(entryDates)
  const completedSet = new Set(completedToday)
  const habitsCompleted = habits.filter((h) => completedSet.has(h.id)).length
  const hasEntryToday = entryDates.some(
    (d) => new Date(d).toLocaleDateString('en-CA') === today,
  )

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <div className="space-y-1">
        <p className="text-xs font-jetbrains text-muted-foreground tracking-widest uppercase">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <h1 className="font-jetbrains text-2xl font-semibold">{greeting()}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Habits card */}
        <Link
          href="/habits"
          className="group block border border-border rounded-xs bg-card hover:bg-accent transition-colors p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckSquare className="h-4 w-4" />
              <span className="text-xs font-jetbrains uppercase tracking-widest">
                Habits
              </span>
            </div>
            <span className="text-xs font-jetbrains text-muted-foreground">
              {habitsCompleted}/{habits.length}
            </span>
          </div>

          {habits.length === 0 ? (
            <p className="text-sm font-jetbrains text-muted-foreground">
              No habits yet
            </p>
          ) : (
            <>
              <div className="flex gap-1.5 flex-wrap">
                {habits.map((h) => (
                  <span
                    key={h.id}
                    className={cn(
                      'h-2.5 w-2.5 rounded-full border-2',
                      completedSet.has(h.id)
                        ? 'border-transparent'
                        : 'border-border bg-transparent',
                    )}
                    style={
                      completedSet.has(h.id)
                        ? { backgroundColor: h.color }
                        : { borderColor: h.color }
                    }
                    title={h.name}
                  />
                ))}
              </div>
              <p className="text-xs font-jetbrains text-muted-foreground">
                {habitsCompleted === habits.length && habits.length > 0
                  ? 'All done!'
                  : `${habits.length - habitsCompleted} remaining`}
              </p>
            </>
          )}
        </Link>

        {/* Tasks card */}
        <Link
          href="/tasks"
          className="group block border border-border rounded-xs bg-card hover:bg-accent transition-colors p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ListTodo className="h-4 w-4" />
              <span className="text-xs font-jetbrains uppercase tracking-widest">
                Tasks
              </span>
            </div>
            <span className="text-xs font-jetbrains text-muted-foreground">
              {tasksDueToday.length} due
            </span>
          </div>

          {tasksDueToday.length === 0 ? (
            <p className="text-sm font-jetbrains text-muted-foreground">
              All clear today
            </p>
          ) : (
            <ul className="space-y-1">
              {tasksDueToday.slice(0, 3).map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-2 text-sm font-jetbrains"
                >
                  <span
                    className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', {
                      'bg-red-500': t.priority === 'urgent',
                      'bg-amber-500': t.priority === 'high',
                      'bg-blue-500': t.priority === 'medium',
                      'bg-muted-foreground': t.priority === 'low',
                    })}
                  />
                  <span className="truncate">{t.title}</span>
                </li>
              ))}
              {tasksDueToday.length > 3 && (
                <li className="text-xs text-muted-foreground font-jetbrains pl-3.5">
                  +{tasksDueToday.length - 3} more
                </li>
              )}
            </ul>
          )}
        </Link>

        {/* Journal / streak card */}
        <Link
          href="/write"
          className="group block border border-border rounded-xs bg-card hover:bg-accent transition-colors p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <PenLine className="h-4 w-4" />
              <span className="text-xs font-jetbrains uppercase tracking-widest">
                Journal
              </span>
            </div>
            {streak.currentStreak > 0 && (
              <span className="flex items-center gap-1 text-xs font-jetbrains text-amber-500">
                <Flame className="h-3 w-3" />
                {streak.currentStreak}
              </span>
            )}
          </div>

          {hasEntryToday ? (
            <p className="text-sm font-jetbrains text-muted-foreground">
              Entry written today
            </p>
          ) : (
            <p className="text-sm font-jetbrains text-muted-foreground">
              No entry yet today
            </p>
          )}

          <p className="text-xs font-jetbrains text-muted-foreground">
            {streak.currentStreak > 0
              ? `${streak.currentStreak}-day streak`
              : 'Start your streak'}
          </p>
        </Link>
      </div>

      {/* Quick actions */}
      <div className="space-y-3">
        <p className="text-xs font-jetbrains text-muted-foreground uppercase tracking-widest">
          Quick actions
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="small" variant="outline">
            <Link href="/write">
              <PenLine className="h-3.5 w-3.5 mr-1.5" />
              Write entry
            </Link>
          </Button>
          <Button asChild size="small" variant="outline">
            <Link href="/tasks/new">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add task
            </Link>
          </Button>
          <Button asChild size="small" variant="outline">
            <Link href="/habits/new">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add habit
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
