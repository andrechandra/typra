import { cn } from '@/lib/utils'

const priorityConfig: Record<string, { label: string; className: string }> = {
  urgent: { label: 'Urgent', className: 'text-red-500 bg-red-500/10 border-red-500/20' },
  high: { label: 'High', className: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  medium: { label: 'Medium', className: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  low: { label: 'Low', className: 'text-muted-foreground bg-muted/50 border-border' },
}

interface PriorityBadgeProps {
  priority: string
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority] ?? priorityConfig['medium']
  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 text-[10px] font-jetbrains font-medium rounded-xs border',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
