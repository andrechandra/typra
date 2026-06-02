'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#6b7280', // gray
  '#78716c', // stone
  '#0ea5e9', // sky
  '#a855f7', // purple
]

interface ColorSwatchPickerProps {
  value: string
  onChange: (color: string) => void
}

export function ColorSwatchPicker({ value, onChange }: ColorSwatchPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            'h-7 w-7 rounded-full transition-transform flex items-center justify-center',
            value === color ? 'scale-110 ring-2 ring-offset-2 ring-foreground' : 'hover:scale-105',
          )}
          style={{ backgroundColor: color }}
          aria-label={color}
        >
          {value === color && <Check className="h-3.5 w-3.5 text-white drop-shadow" />}
        </button>
      ))}
    </div>
  )
}
