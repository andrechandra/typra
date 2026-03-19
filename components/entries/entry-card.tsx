'use client'

import { Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Entry } from '@/types'

const TRUNCATE_LENGTH = 150

function formatRelativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

interface EntryCardProps {
  entry: Entry
  showVisibilityBadge?: boolean
  onDelete?: () => void
}

export function EntryCard({
  entry,
  showVisibilityBadge = false,
  onDelete,
}: EntryCardProps) {
  const isLong = entry.content.length > TRUNCATE_LENGTH
  const preview = isLong
    ? entry.content.slice(0, TRUNCATE_LENGTH).trimEnd() + '...'
    : entry.content

  return (
    <Card className="hover:bg-accent/30 transition-colors">
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground font-jetbrains">
          {formatRelativeTime(entry.created_at)}
        </p>
        <div className="flex items-center gap-2">
          {showVisibilityBadge && (
            <Badge
              variant={entry.is_public ? 'default' : 'secondary'}
              className="text-xs font-jetbrains"
            >
              {entry.is_public ? 'Public' : 'Private'}
            </Badge>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Delete entry"
              title="Delete entry"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-jetbrains text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
          {preview}
        </p>
      </CardContent>
    </Card>
  )
}
