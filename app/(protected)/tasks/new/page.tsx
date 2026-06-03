import { getTodayString } from '@/lib/get-today'
import { TaskForm } from '@/components/tasks/task-form'

export const metadata = { title: 'New Task' }

export default async function NewTaskPage() {
  const today = await getTodayString()

  return (
    <div className="max-w-xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <div>
        <h1 className="font-jetbrains text-xl font-semibold">New task</h1>
        <p className="text-xs font-jetbrains text-muted-foreground mt-0.5">
          Capture what needs to get done today.
        </p>
      </div>
      <TaskForm todayDate={today} />
    </div>
  )
}
