'use client'

import {
  Circle,
  Star,
  Heart,
  Zap,
  Dumbbell,
  BookOpen,
  Coffee,
  Moon,
  Sun,
  Droplets,
  Apple,
  Music,
  Bike,
  Pen,
  Smile,
  Leaf,
  Target,
  Flame,
  Wind,
  Brain,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const HABIT_ICONS: Record<string, React.ElementType> = {
  circle: Circle,
  star: Star,
  heart: Heart,
  zap: Zap,
  dumbbell: Dumbbell,
  'book-open': BookOpen,
  coffee: Coffee,
  moon: Moon,
  sun: Sun,
  droplets: Droplets,
  apple: Apple,
  music: Music,
  bike: Bike,
  pen: Pen,
  smile: Smile,
  leaf: Leaf,
  target: Target,
  flame: Flame,
  wind: Wind,
  brain: Brain,
}

interface IconPickerProps {
  value: string
  onChange: (icon: string) => void
  color: string
}

export function IconPicker({ value, onChange, color }: IconPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(HABIT_ICONS).map(([key, Icon]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            'h-9 w-9 rounded-xs border flex items-center justify-center transition-colors',
            value === key
              ? 'border-foreground bg-accent'
              : 'border-border hover:border-foreground/40 hover:bg-accent',
          )}
          aria-label={key}
        >
          <Icon
            className="h-4 w-4"
            style={{ color: value === key ? color : undefined }}
          />
        </button>
      ))}
    </div>
  )
}
