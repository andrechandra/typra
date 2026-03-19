export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          created_at: string
          default_is_anonymous: boolean
        }
        Insert: {
          id: string
          username?: string | null
          created_at?: string
          default_is_anonymous?: boolean
        }
        Update: {
          username?: string | null
          default_is_anonymous?: boolean
        }
        Relationships: []
      }
      entries: {
        Row: {
          id: string
          user_id: string
          content: string
          is_public: boolean
          is_anonymous: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          is_public?: boolean
          is_anonymous?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          content?: string
          is_public?: boolean
          is_anonymous?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'entries_user_id_profiles_fk'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      settings: {
        Row: {
          user_id: string
          updated_at: string
          last_username_change: string | null
        }
        Insert: {
          user_id: string
          updated_at?: string
          last_username_change?: string | null
        }
        Update: {
          updated_at?: string
          last_username_change?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
