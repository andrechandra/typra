'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ColorSwatchPicker } from './color-swatch-picker'
import { IconPicker } from './icon-picker'
import { createHabit, updateHabit } from '@/actions/habits'
import { toastError, toastSuccess } from '@/lib/toast'
import type { Habit } from '@/types'

interface HabitFormProps {
  habit?: Habit
}

const FREQUENCIES = [
  { value: 'daily', label: 'Every day' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekends', label: 'Weekends' },
]

export function HabitForm({ habit }: HabitFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState(habit?.name ?? '')
  const [color, setColor] = useState(habit?.color ?? '#3b82f6')
  const [icon, setIcon] = useState(habit?.icon ?? 'circle')
  const [frequency, setFrequency] = useState(habit?.frequency ?? 'daily')
  const [promptTemplate, setPromptTemplate] = useState(habit?.prompt_template ?? '')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData()
    formData.set('name', name)
    formData.set('color', color)
    formData.set('icon', icon)
    formData.set('frequency', frequency)
    formData.set('prompt_template', promptTemplate)

    startTransition(async () => {
      const result = habit
        ? await updateHabit(habit.id, formData)
        : await createHabit(formData)

      if (result.error) {
        setError(result.error)
        toastError(result.error)
      } else {
        toastSuccess(habit ? 'Habit updated' : 'Habit created')
        router.push('/habits')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-jetbrains text-muted-foreground uppercase tracking-widest">
          Habit name
        </label>
        <Input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning run"
          maxLength={60}
          required
          className="font-jetbrains text-base"
          style={{ fontSize: '16px' }}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-jetbrains text-muted-foreground uppercase tracking-widest">
          Frequency
        </label>
        <div className="flex gap-2">
          {FREQUENCIES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFrequency(value)}
              className={`flex-1 py-2 px-3 text-xs font-jetbrains rounded-xs border transition-colors ${
                frequency === value
                  ? 'border-foreground bg-accent text-foreground'
                  : 'border-border text-muted-foreground hover:border-foreground/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-jetbrains text-muted-foreground uppercase tracking-widest">
          Color
        </label>
        <ColorSwatchPicker value={color} onChange={setColor} />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-jetbrains text-muted-foreground uppercase tracking-widest">
          Icon
        </label>
        <IconPicker value={icon} onChange={setIcon} color={color} />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-jetbrains text-muted-foreground uppercase tracking-widest">
          Journal prompt
          <span className="normal-case ml-1 opacity-50">(optional)</span>
        </label>
        <textarea
          name="prompt_template"
          value={promptTemplate}
          onChange={(e) => setPromptTemplate(e.target.value)}
          rows={8}
          placeholder={`1. What went well today?\n\n2. What am I thankful for today?\n\n3. What did I do poorly today?\n\n4. What did I learn today?\n\n5. What should I improve tomorrow?`}
          className="w-full rounded-xs border border-border bg-background px-3 py-2 text-sm font-jetbrains placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring resize-none"
          style={{ fontSize: '16px' }}
        />
        {promptTemplate && (
          <p className="text-xs font-jetbrains text-muted-foreground">
            A write button will appear on this habit to open the journal with this text pre-filled.
          </p>
        )}
      </div>

      {error && (
        <p className="text-xs font-jetbrains text-destructive">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending
            ? habit
              ? 'Saving...'
              : 'Creating...'
            : habit
              ? 'Save changes'
              : 'Create habit'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/habits')}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
