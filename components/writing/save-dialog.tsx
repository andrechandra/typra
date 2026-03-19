'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Globe, Lock } from 'lucide-react'

interface SaveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (isPublic: boolean, isAnonymous: boolean) => Promise<void>
  isSaving: boolean
  defaultIsAnonymous: boolean
}

export function SaveDialog({
  open,
  onOpenChange,
  onSave,
  isSaving,
  defaultIsAnonymous,
}: SaveDialogProps) {
  const [isAnonymous, setIsAnonymous] = useState(defaultIsAnonymous)

  // Reset to profile default each time the dialog opens
  useEffect(() => {
    if (open) setIsAnonymous(defaultIsAnonymous)
  }, [open, defaultIsAnonymous])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm font-jetbrains">
        <DialogHeader>
          <DialogTitle>Save entry</DialogTitle>
          <DialogDescription>
            Who can read this entry?
          </DialogDescription>
        </DialogHeader>

        {/* Anonymous toggle */}
        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
          <div className="flex items-center gap-2">
            {isAnonymous ? (
              <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span className="text-sm">
              {isAnonymous ? 'Posting anonymously' : 'Posting with username'}
            </span>
          </div>
          <button
            onClick={() => setIsAnonymous(!isAnonymous)}
            disabled={isSaving}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
              isAnonymous ? 'bg-foreground' : 'bg-input'
            }`}
            role="switch"
            aria-checked={isAnonymous}
            aria-label="Toggle anonymous posting"
          >
            <span
              className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                isAnonymous ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="justify-start gap-3 h-14"
            onClick={() => onSave(true, isAnonymous)}
            state={isSaving ? 'loading' : 'default'}
            disabled={isSaving}
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
            onClick={() => onSave(false, isAnonymous)}
            state={isSaving ? 'loading' : 'default'}
            disabled={isSaving}
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
  )
}
