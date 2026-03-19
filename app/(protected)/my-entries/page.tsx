import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MyEntries } from '@/components/entries/my-entries'
import type { Entry } from '@/types'

export const metadata: Metadata = {
  title: 'My Entries',
}

export default async function MyEntriesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: entries } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      <MyEntries entries={(entries ?? []) as Entry[]} />
    </div>
  )
}
