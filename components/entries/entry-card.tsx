'use client'

import { useState } from 'react'
import { Globe, Lock, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Entry } from '@/types'

const TRUNCATE_LENGTH = 300

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
  username?: string | null
  showVisibilityBadge?: boolean
  onDelete?: () => void
  onToggleVisibility?: () => void
}

export function EntryCard({
  entry,
  username,
  showVisibilityBadge = false,
  onDelete,
  onToggleVisibility,
}: EntryCardProps) {
  const [expanded, setExpanded] = useState(false)

  const isLong = entry.content.length > TRUNCATE_LENGTH
  const displayContent =
    isLong && !expanded
      ? entry.content.slice(0, TRUNCATE_LENGTH).trimEnd() + '...'
      : entry.content

  return (
    <Card className="hover:bg-accent/30 transition-colors">
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-muted-foreground font-jetbrains">
            {formatRelativeTime(entry.created_at)}
          </p>
          {username && (
            <p className="text-xs font-jetbrains text-foreground/70">{username}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showVisibilityBadge && (
            <>
              <Badge
                variant={entry.is_public ? 'default' : 'secondary'}
                className="text-xs font-jetbrains"
              >
                {entry.is_public ? 'Public' : 'Private'}
              </Badge>
              {entry.is_public && (
                <Badge variant="outline" className="text-xs font-jetbrains">
                  {entry.is_anonymous ? 'Anonymous' : 'Named'}
                </Badge>
              )}
            </>
          )}
          {onToggleVisibility && (
            <button
              onClick={onToggleVisibility}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle visibility"
              title={entry.is_public ? 'Make private' : 'Make public'}
            >
              {entry.is_public ? (
                <Globe className="h-3.5 w-3.5" />
              ) : (
                <Lock className="h-3.5 w-3.5" />
              )}
            </button>
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
          {displayContent}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-xs text-muted-foreground hover:text-foreground font-jetbrains transition-colors"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </CardContent>
    </Card>
  )
}
