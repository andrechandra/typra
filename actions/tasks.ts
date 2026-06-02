'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

interface TaskPayload {
  title: string
  notes: string | null
  priority: string
  label: string | null
}

const VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent']

function parseTaskForm(formData: FormData): TaskPayload | { error: string } {
  const title = (formData.get('title') as string | null)?.trim()
  const notes = (formData.get('notes') as string | null)?.trim() || null
  const priority = (formData.get('priority') as string | null) ?? 'medium'
  const label = (formData.get('label') as string | null)?.trim() || null

  if (!title || title.length < 1) return { error: 'Title is required' }
  if (title.length > 200) return { error: 'Title must be 200 characters or fewer' }
  if (!VALID_PRIORITIES.includes(priority)) return { error: 'Invalid priority' }

  return { title, notes, priority, label }
}

export async function createTask(
  formData: FormData,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = parseTaskForm(formData)
  if ('error' in parsed) return { error: parsed.error }

  // Default due_date to today in the user's local timezone (sent from client)
  const due_date = (formData.get('due_date') as string | null) || new Date().toLocaleDateString('en-CA')

  const { error } = await supabase.from('tasks').insert({
    user_id: user.id,
    title: parsed.title,
    notes: parsed.notes,
    priority: parsed.priority,
    label: parsed.label,
    due_date,
  })

  if (error) return { error: error.message }

  revalidatePath('/tasks')
  revalidatePath('/dashboard')
  return {}
}

export async function updateTask(
  id: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = parseTaskForm(formData)
  if ('error' in parsed) return { error: parsed.error }

  const { error } = await supabase
    .from('tasks')
    .update({
      title: parsed.title,
      notes: parsed.notes,
      priority: parsed.priority,
      label: parsed.label,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/tasks')
  revalidatePath(`/tasks/${id}/edit`)
  return {}
}

export async function rescheduleTask(
  id: string,
  due_date: string,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('tasks')
    .update({ due_date, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/tasks')
  revalidatePath('/dashboard')
  return {}
}

export async function toggleTaskComplete(
  id: string,
  isCompleted: boolean,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('tasks')
    .update({
      completed_at: isCompleted ? null : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/tasks')
  revalidatePath('/dashboard')
  return {}
}

export async function deleteTask(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/tasks')
  revalidatePath('/dashboard')
  return {}
}
