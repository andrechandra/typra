import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CreateUsernameForm } from '@/components/auth/create-username-form'

export const metadata: Metadata = {
  title: 'Choose a Username',
}

export default async function CreateUsernamePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // If user already has a profile, skip this step
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (profile) redirect('/write')

  return <CreateUsernameForm />
}
