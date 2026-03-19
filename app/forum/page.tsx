import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { EntriesList } from '@/components/entries/entries-list'
import { SiteNav } from '@/components/nav/site-nav'
import type { Entry } from '@/types'

export const metadata: Metadata = {
  title: 'Forum',
}

const PAGE_SIZE = 10

export default async function ForumPage() {
  const supabase = await createClient()

  const { data: entries } = await supabase
    .from('entries')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE)

  const initialEntries: Entry[] = (entries ?? []) as Entry[]
  const cursor =
    initialEntries.length === PAGE_SIZE
      ? initialEntries[initialEntries.length - 1].created_at
      : null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNav />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
          <div className="space-y-1 mb-8">
            <h1 className="text-xl font-jetbrains font-semibold tracking-tight">
              Community entries
            </h1>
            <p className="text-sm text-muted-foreground font-jetbrains">
              Anonymous thoughts from the Typra community
            </p>
          </div>
          <EntriesList initialEntries={initialEntries} initialCursor={cursor} />
        </div>
      </main>
    </div>
  )
}
