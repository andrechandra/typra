import { cn } from '@/lib/utils'

interface DemoTask {
  title: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  label: string | null
  done: boolean
}

const DEMO_TASKS: DemoTask[] = [
  { title: 'Write chapter outline', priority: 'urgent', label: 'writing', done: false },
  { title: 'Review habit streaks', priority: 'medium', label: null, done: true },
  { title: 'Reply to forum comments', priority: 'low', label: 'community', done: false },
  { title: 'Plan weekly review', priority: 'high', label: null, done: false },
]

const priorityConfig: Record<DemoTask['priority'], { label: string; className: string }> = {
  urgent: { label: 'Urgent', className: 'text-red-500 bg-red-500/10 border-red-500/20' },
  high: { label: 'High', className: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  medium: { label: 'Medium', className: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  low: { label: 'Low', className: 'text-muted-foreground bg-muted/50 border-border' },
}

export function TasksPreview() {
  return (
    <section className="border-t border-border/40 px-4 py-16 md:py-20 animate-in fade-in duration-700 delay-300">
      <div className="max-w-xl mx-auto space-y-5">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-jetbrains text-center">
          Task management
        </p>
        <div className="bg-card border border-border rounded-xs shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
            <p className="font-jetbrains text-xs font-medium text-muted-foreground">
              Due today
            </p>
            <p className="font-jetbrains text-xs text-muted-foreground">
              3 remaining
            </p>
          </div>
          <div className="px-4">
            {DEMO_TASKS.map((task, i) => {
              const pc = priorityConfig[task.priority]
              return (
                <div
                  key={task.title}
                  className={cn(
                    'flex items-start gap-3 py-3',
                    i < DEMO_TASKS.length - 1 && 'border-b border-border',
                    task.done && 'opacity-50',
                  )}
                >
                  {/* Checkbox */}
                  <div
                    className={cn(
                      'mt-0.5 h-5 w-5 rounded-xs border-2 flex-shrink-0 flex items-center justify-center',
                      task.done
                        ? 'bg-foreground border-foreground'
                        : 'border-border',
                    )}
                  >
                    {task.done && (
                      <svg
                        viewBox="0 0 10 8"
                        className="h-2.5 w-2.5 text-background"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          d="M1 4l3 3 5-6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <p
                      className={cn(
                        'text-sm font-jetbrains font-medium',
                        task.done && 'line-through text-muted-foreground',
                      )}
                    >
                      {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={cn(
                          'inline-flex items-center px-1.5 py-0.5 text-[10px] font-jetbrains font-medium rounded-xs border',
                          pc.className,
                        )}
                      >
                        {pc.label}
                      </span>
                      {task.label && (
                        <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-jetbrains rounded-xs border border-border text-muted-foreground bg-muted/50">
                          {task.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
