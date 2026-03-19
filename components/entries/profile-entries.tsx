'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import { EntryCard } from './entry-card'
import type { Entry } from '@/types'

type FilterTab = 'all' | 'public' | 'private'

interface ProfileEntriesProps {
  entries: Entry[]
}

export function ProfileEntries({ entries: initialEntries }: ProfileEntriesProps) {
  const [entries, setEntries] = useState<Entry[]>(initialEntries)
  const [tab, setTab] = useState<FilterTab>('all')

  async function handleDelete(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('entries').delete().eq('id', id)

    if (error) {
      toast.error('Failed to delete entry.')
      return
    }

    setEntries((prev) => prev.filter((e) => e.id !== id))
    toast.success('Entry deleted.')
  }

  const filtered = useMemo(() => {
    if (tab === 'public') return entries.filter((e) => e.is_public)
    if (tab === 'private') return entries.filter((e) => !e.is_public)
    return entries
  }, [entries, tab])

  const publicCount = entries.filter((e) => e.is_public).length
  const privateCount = entries.filter((e) => !e.is_public).length

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-jetbrains font-semibold tracking-tight">
          Your entries
        </h1>
        <p className="text-sm text-muted-foreground font-jetbrains">
          {entries.length} total &middot; {publicCount} public &middot;{' '}
          {privateCount} private
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
        <TabsList className="font-jetbrains">
          <TabsTrigger value="all">All ({entries.length})</TabsTrigger>
          <TabsTrigger value="public">Public ({publicCount})</TabsTrigger>
          <TabsTrigger value="private">Private ({privateCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-6">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground font-jetbrains text-sm py-16">
              No entries here yet.
            </p>
          ) : (
            <div className="space-y-4">
              {filtered.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  showVisibilityBadge
                  onDelete={() => handleDelete(entry.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
