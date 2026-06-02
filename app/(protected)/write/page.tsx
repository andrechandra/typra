import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { TypewriterEditor } from '@/components/writing/typewriter-editor-client'

export const metadata: Metadata = {
  title: 'Write',
}

interface Props {
  searchParams: Promise<{ habit?: string }>
}

export default async function WritePage({ searchParams }: Props) {
  const user = await getAuthUser()
  if (!user) redirect('/login')

  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('default_is_anonymous')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/create-username')

  const { habit: habitId } = await searchParams
  let initialContent: string | undefined

  if (habitId) {
    const { data: habit } = await supabase
      .from('habits')
      .select('prompt_template')
      .eq('id', habitId)
      .eq('user_id', user.id)
      .single()

    initialContent = (habit as { prompt_template: string | null } | null)?.prompt_template ?? undefined
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      <TypewriterEditor
        userId={user.id}
        defaultIsAnonymous={profile.default_is_anonymous}
        initialContent={initialContent}
        habitId={habitId}
      />
    </div>
  )
}
