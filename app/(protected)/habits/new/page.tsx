import { HabitForm } from '@/components/habits/habit-form'

export const metadata = { title: 'New Habit' }

export default function NewHabitPage() {
  return (
    <div className="max-w-xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <div>
        <h1 className="font-jetbrains text-xl font-semibold">New habit</h1>
        <p className="text-xs font-jetbrains text-muted-foreground mt-0.5">
          Build a positive routine one day at a time.
        </p>
      </div>
      <HabitForm />
    </div>
  )
}
