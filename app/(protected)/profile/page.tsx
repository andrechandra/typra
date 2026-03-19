import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileEntries } from '@/components/entries/profile-entries'
import type { Entry } from '@/types'

export const metadata: Metadata = {
  title: 'Profile',
}

export default async function ProfilePage() {
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
      <ProfileEntries entries={(entries ?? []) as Entry[]} />
    </div>
  )
}
