'use client'

import { useOptimistic, useTransition, useState, useRef } from 'react'
import Link from 'next/link'
import { MoreHorizontal, Pencil, Trash2, CalendarDays, ChevronRight } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { PriorityBadge } from './priority-badge'
import { toggleTaskComplete, deleteTask, rescheduleTask } from '@/actions/tasks'
import { toastError, toastSuccess } from '@/lib/toast'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

interface TaskItemProps {
  task: Task
  today: string
}

export function TaskItem({ task, today }: TaskItemProps) {
  const [, startTransition] = useTransition()
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    !!task.completed_at,
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const dateInputRef = useRef<HTMLInputElement>(null)

  const tomorrow = new Date(today + 'T12:00:00')
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toLocaleDateString('en-CA')

  const handleToggle = () => {
    startTransition(async () => {
      setOptimisticCompleted(!optimisticCompleted)
      const result = await toggleTaskComplete(task.id, !!task.completed_at)
      if (result.error) toastError(result.error)
    })
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteTask(task.id)
    if (result.error) {
      toastError(result.error)
      setIsDeleting(false)
    }
  }

  const handleReschedule = async (date: string) => {
    const result = await rescheduleTask(task.id, date)
    if (result.error) toastError(result.error)
    else toastSuccess('Task moved')
  }

  const handlePickDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) handleReschedule(e.target.value)
  }

  if (isDeleting) return null

  const isOverdue = task.due_date && task.due_date < today && !task.completed_at

  return (
    <div className={cn('flex items-start gap-3 py-3 border-b border-border last:border-0', optimisticCompleted && 'opacity-50')}>
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={cn(
          'mt-0.5 h-5 w-5 rounded-xs border-2 flex-shrink-0 flex items-center justify-center transition-colors',
          optimisticCompleted
            ? 'bg-foreground border-foreground'
            : 'border-border hover:border-foreground/60',
        )}
        aria-label={`Mark ${task.title} as ${optimisticCompleted ? 'incomplete' : 'complete'}`}
      >
        {optimisticCompleted && (
          <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 text-background" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <p
          className={cn(
            'text-sm font-jetbrains font-medium',
            optimisticCompleted && 'line-through text-muted-foreground',
            isOverdue && !optimisticCompleted && 'text-red-500',
          )}
        >
          {task.title}
        </p>

        {task.notes && !optimisticCompleted && (
          <p className="text-xs font-jetbrains text-muted-foreground line-clamp-2">
            {task.notes}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1.5">
          <PriorityBadge priority={task.priority} />
          {task.label && (
            <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-jetbrains rounded-xs border border-border text-muted-foreground bg-muted/50">
              {task.label}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 mt-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/tasks/${task.id}/edit`} className="flex items-center gap-2">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {task.due_date !== today && (
            <DropdownMenuItem onClick={() => handleReschedule(today)} className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5" />
              Move to today
            </DropdownMenuItem>
          )}
          {task.due_date !== tomorrowStr && (
            <DropdownMenuItem onClick={() => handleReschedule(tomorrowStr)} className="flex items-center gap-2">
              <ChevronRight className="h-3.5 w-3.5" />
              Move to tomorrow
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => dateInputRef.current?.showPicker()}
            className="flex items-center gap-2"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Pick a date…
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive flex items-center gap-2"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden date input for pick-a-date */}
      <input
        ref={dateInputRef}
        type="date"
        defaultValue={task.due_date ?? today}
        onChange={handlePickDate}
        className="sr-only"
        aria-hidden
      />
    </div>
  )
}
