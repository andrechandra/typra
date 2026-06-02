import { cn } from '@/lib/utils'

interface DateChipProps {
  date: string
  today: string
  className?: string
}

export function DateChip({ date, today, className }: DateChipProps) {
  const isOverdue = date < today
  const isToday = date === today

  const label = isToday
    ? 'Today'
    : isOverdue
      ? new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      : new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })

  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 text-[10px] font-jetbrains rounded-xs border',
        isOverdue
          ? 'text-red-500 bg-red-500/10 border-red-500/20'
          : isToday
            ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
            : 'text-muted-foreground bg-muted/50 border-border',
        className,
      )}
    >
      {label}
    </span>
  )
}
