'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Globe, Lock } from 'lucide-react'

interface SaveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (isPublic: boolean) => Promise<void>
  isSaving: boolean
}

export function SaveDialog({
  open,
  onOpenChange,
  onSave,
  isSaving,
}: SaveDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm font-jetbrains">
        <DialogHeader>
          <DialogTitle>Save entry</DialogTitle>
          <DialogDescription>
            Who can read this entry?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-2">
          <Button
            variant="outline"
            className="justify-start gap-3 h-14"
            onClick={() => onSave(true)}
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
            onClick={() => onSave(false)}
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
