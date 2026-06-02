import { PenLine, Dumbbell, BookOpen, Wind, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface DemoHabit {
  name: string
  Icon: LucideIcon
  color: string
  streak: number
  done: boolean
}

const DEMO_HABITS: DemoHabit[] = [
  { name: 'Morning pages', Icon: PenLine, color: '#8b7355', streak: 12, done: true },
  { name: 'Exercise', Icon: Dumbbell, color: '#5b8a6e', streak: 7, done: true },
  { name: 'Read 20 min', Icon: BookOpen, color: '#6b7fb5', streak: 3, done: false },
  { name: 'Meditate', Icon: Wind, color: '#a07a9e', streak: 5, done: false },
]

export function HabitsPreview() {
  return (
    <section className="border-t border-border/40 px-4 py-16 md:py-20 animate-in fade-in duration-700 delay-200">
      <div className="max-w-xl mx-auto space-y-5">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-jetbrains text-center">
          Habit tracking
        </p>
        <div className="bg-card border border-border rounded-xs shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
            <p className="font-jetbrains text-xs font-medium text-muted-foreground">
              Today&#39;s habits
            </p>
            <p className="font-jetbrains text-xs text-muted-foreground">
              2 of 4 done
            </p>
          </div>
          <div className="px-4">
            {DEMO_HABITS.map((habit, i) => (
              <div
                key={habit.name}
                className={cn(
                  'flex items-center gap-3 py-3',
                  i < DEMO_HABITS.length - 1 && 'border-b border-border',
                )}
              >
                {/* Icon circle */}
                <div
                  className="h-9 w-9 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={
                    habit.done
                      ? { backgroundColor: habit.color }
                      : { border: `2px solid ${habit.color}` }
                  }
                >
                  <habit.Icon
                    className="h-4 w-4"
                    style={{ color: habit.done ? 'white' : habit.color }}
                  />
                </div>

                {/* Name + streak */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm font-jetbrains font-medium truncate',
                      habit.done && 'text-muted-foreground line-through',
                    )}
                  >
                    {habit.name}
                  </p>
                  {habit.streak > 0 && (
                    <p className="flex items-center gap-1 text-xs font-jetbrains text-muted-foreground mt-0.5">
                      <Flame className="h-3 w-3 text-amber-500" />
                      {habit.streak}-day streak
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
