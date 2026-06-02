import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HabitForm } from '@/components/habits/habit-form'
import type { Habit } from '@/types'

export const metadata = { title: 'Edit Habit' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditHabitPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: habitData } = await supabase
    .from('habits')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  const habit = habitData as Habit | null
  if (!habit) notFound()

  return (
    <div className="max-w-xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <div>
        <h1 className="font-jetbrains text-xl font-semibold">Edit habit</h1>
        <p className="text-xs font-jetbrains text-muted-foreground mt-0.5">
          Update your habit details.
        </p>
      </div>
      <HabitForm habit={habit} />
    </div>
  )
}
