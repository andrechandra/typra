import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/settings/settings-form'

export const metadata: Metadata = {
  title: 'Settings',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: profile }, { data: settings }] = await Promise.all([
    supabase
      .from('profiles')
      .select('username, default_is_anonymous')
      .eq('id', user.id)
      .single(),
    supabase
      .from('settings')
      .select('last_username_change')
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      <SettingsForm
        userId={user.id}
        username={profile?.username ?? ''}
        defaultIsAnonymous={profile?.default_is_anonymous ?? false}
        lastUsernameChange={settings?.last_username_change ?? null}
      />
    </div>
  )
}
