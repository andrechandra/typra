'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

interface HabitPayload {
  name: string
  color: string
  icon: string
  frequency: string
}

function parseHabitForm(formData: FormData): HabitPayload | { error: string } {
  const name = (formData.get('name') as string | null)?.trim()
  const color = (formData.get('color') as string | null) ?? '#6b7280'
  const icon = (formData.get('icon') as string | null) ?? 'circle'
  const frequency = (formData.get('frequency') as string | null) ?? 'daily'

  if (!name || name.length < 1) return { error: 'Name is required' }
  if (name.length > 60) return { error: 'Name must be 60 characters or fewer' }

  const validFrequencies = ['daily', 'weekdays', 'weekends']
  if (!validFrequencies.includes(frequency))
    return { error: 'Invalid frequency' }

  return { name, color, icon, frequency }
}

export async function createHabit(
  formData: FormData,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = parseHabitForm(formData)
  if ('error' in parsed) return { error: parsed.error }

  const prompt_template =
    (formData.get('prompt_template') as string | null)?.trim() || null

  const { error } = await supabase.from('habits').insert({
    user_id: user.id,
    name: parsed.name,
    color: parsed.color,
    icon: parsed.icon,
    frequency: parsed.frequency,
    prompt_template,
  })

  if (error) return { error: error.message }

  revalidatePath('/habits')
  revalidatePath('/dashboard')
  return {}
}

export async function updateHabit(
  id: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = parseHabitForm(formData)
  if ('error' in parsed) return { error: parsed.error }

  const prompt_template =
    (formData.get('prompt_template') as string | null)?.trim() || null

  const { error } = await supabase
    .from('habits')
    .update({
      name: parsed.name,
      color: parsed.color,
      icon: parsed.icon,
      frequency: parsed.frequency,
      prompt_template,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/habits')
  revalidatePath(`/habits/${id}/edit`)
  return {}
}

export async function archiveHabit(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('habits')
    .update({ is_archived: true })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/habits')
  revalidatePath('/dashboard')
  return {}
}

export async function toggleHabitLog(
  habitId: string,
  date: string,
  isCompleted: boolean,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  if (isCompleted) {
    const { error } = await supabase
      .from('habit_logs')
      .delete()
      .eq('habit_id', habitId)
      .eq('user_id', user.id)
      .eq('logged_on', date)

    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from('habit_logs').upsert(
      { habit_id: habitId, user_id: user.id, logged_on: date },
      { onConflict: 'habit_id,logged_on' },
    )

    if (error) return { error: error.message }
  }

  revalidatePath('/habits')
  revalidatePath('/dashboard')
  return {}
}
