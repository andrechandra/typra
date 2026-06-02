'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createTask, updateTask } from '@/actions/tasks'
import { toastError, toastSuccess } from '@/lib/toast'
import type { Task } from '@/types'

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

const priorityButtonClass: Record<string, string> = {
  low: 'border-border text-muted-foreground data-[active=true]:border-foreground data-[active=true]:bg-accent data-[active=true]:text-foreground',
  medium: 'border-blue-500/30 text-blue-500 data-[active=true]:border-blue-500 data-[active=true]:bg-blue-500/10',
  high: 'border-amber-500/30 text-amber-500 data-[active=true]:border-amber-500 data-[active=true]:bg-amber-500/10',
  urgent: 'border-red-500/30 text-red-500 data-[active=true]:border-red-500 data-[active=true]:bg-red-500/10',
}

interface TaskFormProps {
  task?: Task
  todayDate: string
}

export function TaskForm({ task, todayDate }: TaskFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState(task?.title ?? '')
  const [notes, setNotes] = useState(task?.notes ?? '')
  const [priority, setPriority] = useState(task?.priority ?? 'medium')
  const [label, setLabel] = useState(task?.label ?? '')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData()
    formData.set('title', title)
    formData.set('notes', notes)
    formData.set('priority', priority)
    formData.set('label', label)
    // Pass today so the server action can default due_date correctly
    formData.set('due_date', task?.due_date ?? todayDate)

    startTransition(async () => {
      const result = task
        ? await updateTask(task.id, formData)
        : await createTask(formData)

      if (result.error) {
        setError(result.error)
        toastError(result.error)
      } else {
        toastSuccess(task ? 'Task updated' : 'Task created')
        router.push('/tasks')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-xs font-jetbrains text-muted-foreground uppercase tracking-widest">
          Task title
        </label>
        <Input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          maxLength={200}
          required
          className="font-jetbrains text-base"
          style={{ fontSize: '16px' }}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-jetbrains text-muted-foreground uppercase tracking-widest">
          Notes
          <span className="normal-case ml-1 opacity-50">(optional)</span>
        </label>
        <textarea
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional details..."
          rows={3}
          className="w-full rounded-xs border border-border bg-background px-3 py-2 text-sm font-jetbrains placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
          style={{ fontSize: '16px' }}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-jetbrains text-muted-foreground uppercase tracking-widest">
          Priority
        </label>
        <div className="flex gap-2">
          {PRIORITIES.map(({ value, label: pLabel }) => (
            <button
              key={value}
              type="button"
              data-active={priority === value}
              onClick={() => setPriority(value)}
              className={`flex-1 py-2 px-2 text-xs font-jetbrains rounded-xs border transition-colors ${priorityButtonClass[value]}`}
            >
              {pLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-jetbrains text-muted-foreground uppercase tracking-widest">
          Label
          <span className="normal-case ml-1 opacity-50">(optional)</span>
        </label>
        <Input
          name="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Work"
          maxLength={40}
          className="font-jetbrains text-sm"
          style={{ fontSize: '16px' }}
        />
      </div>

      {error && (
        <p className="text-xs font-jetbrains text-destructive">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending
            ? task
              ? 'Saving...'
              : 'Creating...'
            : task
              ? 'Save changes'
              : 'Create task'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/tasks')}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
