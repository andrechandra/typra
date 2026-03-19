'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { EntryCard } from './entry-card'
import { Button } from '@/components/ui/button'
import type { EntryWithProfile } from '@/types'

const PAGE_SIZE = 10

interface EntriesListProps {
  initialEntries: EntryWithProfile[]
  initialCursor: string | null
}

export function EntriesList({ initialEntries, initialCursor }: EntriesListProps) {
  const [entries, setEntries] = useState<EntryWithProfile[]>(initialEntries)
  const [cursor, setCursor] = useState<string | null>(initialCursor)
  const [isLoading, setIsLoading] = useState(false)
  const hasMore = cursor !== null && entries.length >= PAGE_SIZE

  async function loadMore() {
    if (!cursor || isLoading) return
    setIsLoading(true)

    const supabase = createClient()
    const { data } = await supabase
      .from('entries')
      .select('*, profiles!entries_user_id_profiles_fk(username)')
      .eq('is_public', true)
      .lt('created_at', cursor)
      .order('created_at', { ascending: false })
      .limit(PAGE_SIZE)

    setIsLoading(false)

    type RawEntry = EntryWithProfile & { profiles: { username: string | null } | null }
    const rows: EntryWithProfile[] = ((data ?? []) as unknown as RawEntry[]).map(
      ({ profiles, ...entry }) => ({ ...entry, username: profiles?.username ?? null })
    )

    if (rows.length === 0) {
      setCursor(null)
      return
    }

    setEntries((prev) => [...prev, ...rows])
    setCursor(rows.length === PAGE_SIZE ? rows[rows.length - 1].created_at : null)
  }

  if (entries.length === 0) {
    return (
      <p className="text-center text-muted-foreground font-jetbrains text-sm py-16">
        No entries yet. Be the first to share.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <EntryCard
          key={entry.id}
          entry={entry}
          username={entry.is_anonymous ? null : entry.username}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            size="small"
            onClick={loadMore}
            state={isLoading ? 'loading' : 'default'}
            disabled={isLoading}
            className="font-jetbrains"
          >
            {isLoading ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  )
}
