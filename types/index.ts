import type { Database } from './database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Entry = Database['public']['Tables']['entries']['Row']
export type NewEntry = Database['public']['Tables']['entries']['Insert']

export interface SaveEntryPayload {
  content: string
  isPublic: boolean
}
