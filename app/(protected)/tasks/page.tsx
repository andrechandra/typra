import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { Button } from '@/components/ui/button'
import { TaskItem } from '@/components/tasks/task-item'
import type { Task } from '@/types'

export const metadata = { title: 'Tasks' }

function formatDateHeading(date: string, today: string): string {
  if (date === today) return 'Today'
  const d = new Date(date + 'T12:00:00')
  const tomorrow = new Date(today + 'T12:00:00')
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (date === tomorrow.toLocaleDateString('en-CA')) return 'Tomorrow'
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

export default async function TasksPage() {
  const user = await getAuthUser()
  if (!user) return null

  const supabase = await createClient()

  const today = new Date().toLocaleDateString('en-CA')

  const { data: tasksData } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true })

  const allTasks: Task[] = (tasksData as Task[] | null) ?? []
  const active = allTasks.filter((t) => !t.completed_at)
  const completed = allTasks.filter((t) => t.completed_at)

  // Group active tasks by due_date
  const grouped = new Map<string, Task[]>()
  for (const task of active) {
    const key = task.due_date ?? today
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(task)
  }

  // Sort dates: overdue first, then ascending
  const sortedDates = Array.from(grouped.keys()).sort((a, b) => (a < b ? -1 : 1))

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-jetbrains text-xl font-semibold">Tasks</h1>
          <p className="text-xs font-jetbrains text-muted-foreground mt-0.5">
            {active.length} active · {completed.length} completed
          </p>
        </div>
        <Button asChild size="small">
          <Link href="/tasks/new">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            New task
          </Link>
        </Button>
      </div>

      {allTasks.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="font-jetbrains text-muted-foreground text-sm">
            No tasks yet.
          </p>
          <Button asChild variant="outline" size="small">
            <Link href="/tasks/new">Add your first task</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              <p className={`text-xs font-jetbrains uppercase tracking-widest mb-2 ${date < today ? 'text-red-500' : 'text-muted-foreground'}`}>
                {formatDateHeading(date, today)}
                {date < today && ' · Overdue'}
              </p>
              <div>
                {grouped.get(date)!.map((task) => (
                  <TaskItem key={task.id} task={task} today={today} />
                ))}
              </div>
            </div>
          ))}

          {completed.length > 0 && (
            <div>
              <p className="text-xs font-jetbrains text-muted-foreground uppercase tracking-widest mb-2">
                Completed
              </p>
              <div>
                {completed.slice(0, 10).map((task) => (
                  <TaskItem key={task.id} task={task} today={today} />
                ))}
                {completed.length > 10 && (
                  <p className="text-xs font-jetbrains text-muted-foreground py-2">
                    +{completed.length - 10} more completed
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
