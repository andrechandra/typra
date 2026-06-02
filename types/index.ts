import type { Database } from './database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Entry = Database['public']['Tables']['entries']['Row']
export type NewEntry = Database['public']['Tables']['entries']['Insert']
export type Settings = Database['public']['Tables']['settings']['Row']
export type Habit = Database['public']['Tables']['habits']['Row']
export type HabitLog = Database['public']['Tables']['habit_logs']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']

export interface EntryWithProfile extends Entry {
  username?: string | null
}

export interface SaveEntryPayload {
  content: string
  isPublic: boolean
  isAnonymous: boolean
}

export interface HabitWithLog extends Habit {
  completedToday: boolean
  currentStreak: number
}

export interface TaskWithMeta extends Task {
  isOverdue: boolean
  isDueToday: boolean
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type Frequency = 'daily' | 'weekdays' | 'weekends'
