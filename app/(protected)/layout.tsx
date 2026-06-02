import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SiteNav } from '@/components/nav/site-nav'
import { FeatureTabs } from '@/components/nav/feature-tabs'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const pathname = headersList.get('x-invoke-pathname') ?? ''

  if (!pathname.startsWith('/create-username')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!profile) redirect('/create-username')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNav />
      <FeatureTabs />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
    </div>
  )
}
