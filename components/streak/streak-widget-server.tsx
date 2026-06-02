import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { createClient } from '@/lib/supabase/server'
import { StreakWidget } from './streak-widget'

export async function StreakWidgetServer() {
  const user = await getAuthUser()
  if (!user) return <StreakWidget />

  const supabase = await createClient()
  const { data } = await supabase
    .from('entries')
    .select('created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const dates = (data ?? []).map((e) => e.created_at)

  return <StreakWidget initialDates={dates} />
}
