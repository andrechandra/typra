import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { getTodayString } from '@/lib/get-today'
import { TaskForm } from '@/components/tasks/task-form'
import type { Task } from '@/types'

export const metadata = { title: 'Edit Task' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditTaskPage({ params }: Props) {
  const { id } = await params
  const user = await getAuthUser()
  if (!user) return null

  const supabase = await createClient()
  const { data: taskData } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  const task = taskData as Task | null
  if (!task) notFound()

  const today = await getTodayString()

  return (
    <div className="max-w-xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <div>
        <h1 className="font-jetbrains text-xl font-semibold">Edit task</h1>
        <p className="text-xs font-jetbrains text-muted-foreground mt-0.5">
          Update task details.
        </p>
      </div>
      <TaskForm task={task} todayDate={today} />
    </div>
  )
}
