import { PenLine, CheckSquare, ListTodo, Lock, Flame, Users } from 'lucide-react'

const features = [
  {
    icon: PenLine,
    label: 'Write with focus',
    description:
      'Typewriter-inspired editor with monospace font, paper texture, autosave, and optional keystroke sounds.',
  },
  {
    icon: CheckSquare,
    label: 'Daily habits with streaks',
    description:
      'Track routines with custom icons, colors, and journal prompts. Stay consistent with streak tracking.',
  },
  {
    icon: ListTodo,
    label: 'Priority-based tasks',
    description:
      'Manage todos with priority levels, due dates, and labels. Reschedule with a single tap.',
  },
  {
    icon: Lock,
    label: 'Private by default',
    description:
      'Your entries stay private until you choose to share. Post anonymously or with your username.',
  },
  {
    icon: Flame,
    label: 'Streak calendar',
    description:
      'Visualize your writing consistency with a calendar view of active writing days.',
  },
  {
    icon: Users,
    label: 'Community forum',
    description:
      'Browse public entries from the community. Share your reflections when you feel ready.',
  },
]

export function FeatureStrip() {
  return (
    <section className="border-t border-border/40 px-4 py-16 md:py-20 animate-in fade-in duration-700 delay-200">
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
        {features.map(({ icon: Icon, label, description }) => (
          <div key={label} className="space-y-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <p className="font-jetbrains text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground leading-relaxed font-jetbrains">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
