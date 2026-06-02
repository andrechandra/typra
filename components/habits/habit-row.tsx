'use client'

import { useOptimistic, useTransition } from 'react'
import Link from 'next/link'
import { MoreHorizontal, Pencil, Archive, Flame, PenLine } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { HABIT_ICONS } from './icon-picker'
import { toggleHabitLog, archiveHabit } from '@/actions/habits'
import { toastError } from '@/lib/toast'
import { cn } from '@/lib/utils'
import type { HabitWithLog } from '@/types'

interface HabitRowProps {
  habit: HabitWithLog
  today: string
}

export function HabitRow({ habit, today }: HabitRowProps) {
  const [, startTransition] = useTransition()
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    habit.completedToday,
  )

  const Icon = HABIT_ICONS[habit.icon] ?? HABIT_ICONS['circle']

  const handleToggle = () => {
    startTransition(async () => {
      setOptimisticCompleted(!optimisticCompleted)
      const result = await toggleHabitLog(habit.id, today, optimisticCompleted)
      if (result.error) toastError(result.error)
    })
  }

  const handleArchive = async () => {
    const result = await archiveHabit(habit.id)
    if (result.error) toastError(result.error)
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={cn(
          'h-11 w-11 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
          optimisticCompleted
            ? 'border-transparent'
            : 'border-border hover:border-foreground/40 bg-transparent',
        )}
        style={
          optimisticCompleted
            ? { backgroundColor: habit.color, borderColor: habit.color }
            : { borderColor: habit.color }
        }
        aria-label={`Mark ${habit.name} as ${optimisticCompleted ? 'incomplete' : 'complete'}`}
      >
        <Icon
          className={cn(
            'h-5 w-5 transition-colors',
            optimisticCompleted ? 'text-white' : 'text-muted-foreground',
          )}
          style={!optimisticCompleted ? { color: habit.color } : undefined}
        />
      </button>

      {/* Name + streak */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-jetbrains font-medium truncate transition-colors',
            optimisticCompleted && 'text-muted-foreground line-through',
          )}
        >
          {habit.name}
        </p>
        {habit.currentStreak > 0 && (
          <p className="flex items-center gap-1 text-xs font-jetbrains text-muted-foreground mt-0.5">
            <Flame className="h-3 w-3 text-amber-500" />
            {habit.currentStreak}-day streak
          </p>
        )}
      </div>

      {/* Journal prompt button */}
      {habit.prompt_template && (
        <Button asChild variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" aria-label="Open journal prompt">
          <Link href={`/write?habit=${habit.id}`}>
            <PenLine className="h-4 w-4" />
          </Link>
        </Button>
      )}

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/habits/${habit.id}/edit`} className="flex items-center gap-2">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleArchive}
            className="text-destructive focus:text-destructive flex items-center gap-2"
          >
            <Archive className="h-3.5 w-3.5" />
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
