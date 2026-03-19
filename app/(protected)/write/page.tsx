import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TypewriterEditor } from '@/components/writing/typewriter-editor'

export const metadata: Metadata = {
  title: 'Write',
}

export default async function WritePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      <TypewriterEditor userId={user.id} />
    </div>
  )
}
