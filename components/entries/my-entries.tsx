'use client'

import { useMemo, useState } from 'react'
import { toastSuccess, toastError } from '@/lib/toast'
import { Eye, EyeOff, Globe, Lock } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { EntryCard } from './entry-card'
import type { Entry } from '@/types'

type FilterTab = 'all' | 'public' | 'private'

interface MyEntriesProps {
  entries: Entry[]
}

export function MyEntries({ entries: initialEntries }: MyEntriesProps) {
  const [entries, setEntries] = useState<Entry[]>(initialEntries)
  const [tab, setTab] = useState<FilterTab>('all')
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [entryToToggle, setEntryToToggle] = useState<Entry | null>(null)
  const [isToggling, setIsToggling] = useState(false)
  const [isToggleAnonymous, setIsToggleAnonymous] = useState(false)

  function openToggleDialog(entry: Entry) {
    setEntryToToggle(entry)
    setIsToggleAnonymous(entry.is_anonymous)
  }

  async function confirmDelete() {
    if (!entryToDelete) return
    setIsDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('entries').delete().eq('id', entryToDelete)

    if (error) {
      toastError('Failed to delete entry.')
      setIsDeleting(false)
      return
    }

    setEntries((prev) => prev.filter((e) => e.id !== entryToDelete))
    toastSuccess('Entry deleted.')
    setIsDeleting(false)
    setEntryToDelete(null)
  }

  async function confirmToggleVisibility(targetIsPublic: boolean) {
    if (!entryToToggle) return
    setIsToggling(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('entries')
      .update({ is_public: targetIsPublic, is_anonymous: isToggleAnonymous })
      .eq('id', entryToToggle.id)

    if (error) {
      toastError('Failed to update visibility.')
      setIsToggling(false)
      return
    }

    setEntries((prev) =>
      prev.map((e) =>
        e.id === entryToToggle.id
          ? { ...e, is_public: targetIsPublic, is_anonymous: isToggleAnonymous }
          : e
      ),
    )

    const wasPublic = entryToToggle.is_public
    if (targetIsPublic && wasPublic) {
      toastSuccess(isToggleAnonymous ? 'Entry is now anonymous.' : 'Entry now shows your username.')
    } else {
      toastSuccess(
        targetIsPublic
          ? `Entry is now public${isToggleAnonymous ? ' (anonymous)' : ''}.`
          : 'Entry is now private.'
      )
    }
    setIsToggling(false)
    setEntryToToggle(null)
  }

  const filtered = useMemo(() => {
    if (tab === 'public') return entries.filter((e) => e.is_public)
    if (tab === 'private') return entries.filter((e) => !e.is_public)
    return entries
  }, [entries, tab])

  const publicCount = entries.filter((e) => e.is_public).length
  const privateCount = entries.filter((e) => !e.is_public).length

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-jetbrains font-semibold tracking-tight">
          My Entries
        </h1>
        <p className="text-sm text-muted-foreground font-jetbrains">
          {entries.length} total &middot; {publicCount} public &middot;{' '}
          {privateCount} private
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
        <TabsList className="font-jetbrains">
          <TabsTrigger value="all">All ({entries.length})</TabsTrigger>
          <TabsTrigger value="public">Public ({publicCount})</TabsTrigger>
          <TabsTrigger value="private">Private ({privateCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-6">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground font-jetbrains text-sm py-16">
              No entries here yet.
            </p>
          ) : (
            <div className="space-y-4">
              {filtered.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  showVisibilityBadge
                  onToggleVisibility={() => openToggleDialog(entry)}
                  onDelete={() => setEntryToDelete(entry.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete confirmation dialog */}
      <Dialog
        open={entryToDelete !== null}
        onOpenChange={(open) => { if (!open) setEntryToDelete(null) }}
      >
        <DialogContent className="sm:max-w-sm font-jetbrains">
          <DialogHeader>
            <DialogTitle>Delete entry</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setEntryToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              state={isDeleting ? 'loading' : 'default'}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Visibility toggle dialog */}
      <Dialog
        open={entryToToggle !== null}
        onOpenChange={(open) => { if (!open) setEntryToToggle(null) }}
      >
        <DialogContent className="sm:max-w-sm font-jetbrains">
          <DialogHeader>
            <DialogTitle>Change visibility</DialogTitle>
            <DialogDescription>
              Who can read this entry?
            </DialogDescription>
          </DialogHeader>

          {/* Anonymous toggle — shown for all public entries and when switching to public */}
          {entryToToggle && (
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
              <div className="flex items-center gap-2">
                {isToggleAnonymous ? (
                  <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span className="text-sm font-jetbrains">
                  {isToggleAnonymous ? 'Post anonymously' : 'Show my username'}
                </span>
              </div>
              <button
                onClick={() => setIsToggleAnonymous(!isToggleAnonymous)}
                disabled={isToggling}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors disabled:opacity-50 ${
                  isToggleAnonymous ? 'bg-foreground' : 'bg-input'
                }`}
                role="switch"
                aria-checked={isToggleAnonymous}
                aria-label="Toggle anonymous posting"
              >
                <span
                  className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                    isToggleAnonymous ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <Button
              variant="outline"
              className="justify-start gap-3 h-14"
              onClick={() => confirmToggleVisibility(true)}
              state={isToggling ? 'loading' : 'default'}
              disabled={isToggling}
            >
              <Globe className="h-4 w-4 shrink-0" />
              <div className="text-left">
                <p className="font-medium text-sm">Public</p>
                <p className="text-xs text-muted-foreground font-normal">
                  Visible to everyone on the forum
                </p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-3 h-14"
              onClick={() => confirmToggleVisibility(false)}
              state={isToggling ? 'loading' : 'default'}
              disabled={isToggling}
            >
              <Lock className="h-4 w-4 shrink-0" />
              <div className="text-left">
                <p className="font-medium text-sm">Private</p>
                <p className="text-xs text-muted-foreground font-normal">
                  Only visible to you
                </p>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
