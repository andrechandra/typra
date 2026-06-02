'use client'

import { HabitRow } from './habit-row'
import type { HabitWithLog } from '@/types'

interface HabitListProps {
  habits: HabitWithLog[]
  today: string
}

export function HabitList({ habits, today }: HabitListProps) {
  if (habits.length === 0) return null

  return (
    <div>
      {habits.map((habit) => (
        <HabitRow key={habit.id} habit={habit} today={today} />
      ))}
    </div>
  )
}
