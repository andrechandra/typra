import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { createClient } from '@/lib/supabase/server'
import { SiteNav } from '@/components/nav/site-nav'
import { FeatureTabs } from '@/components/nav/feature-tabs'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const pathname = headersList.get('x-invoke-pathname') ?? ''

  if (!pathname.startsWith('/create-username')) {
    const supabase = await createClient()
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
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
    </div>
  )
}
