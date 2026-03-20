'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { toastSuccess, toastError } from '@/lib/toast'
import { Volume2, VolumeX } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAutosave } from '@/hooks/use-autosave'
import { useTypewriterSound, type SoundType } from '@/hooks/use-typewriter-sound'
import { Button } from '@/components/ui/button'

const SaveDialog = dynamic(
  () => import('./save-dialog').then((mod) => mod.SaveDialog),
  { ssr: false }
)

interface TypewriterEditorProps {
  userId: string
  defaultIsAnonymous: boolean
}

function getDraftKey(userId: string) {
  return `typra-draft-${userId}`
}

function getWordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

function getSoundType(key: string): SoundType | null {
  if (key === 'Enter') return 'enter'
  if (key === 'Backspace') return 'backspace'
  if (key === ' ') return 'space'
  if (key.length === 1) return 'key'
  return null
}

export function TypewriterEditor({ userId, defaultIsAnonymous }: TypewriterEditorProps) {
  const [content, setContent] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)
  const { soundEnabled, setSoundEnabled, playKeystroke } = useTypewriterSound()
  const supabase = useMemo(() => createClient(), [])

  // Restore draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(getDraftKey(userId))
    if (saved) {
      setContent(saved)
    }
    setDraftRestored(true)
  }, [userId])

  // Autosave to localStorage — wrapped in useCallback to stabilize the reference
  const saveDraft = useCallback(
    (value: string) => {
      localStorage.setItem(getDraftKey(userId), value)
    },
    [userId]
  )

  useAutosave(content, saveDraft)

  async function handleSave(isPublic: boolean, isAnonymous: boolean) {
    setIsSaving(true)

    const { error } = await supabase.from('entries').insert({
      user_id: userId,
      content,
      is_public: isPublic,
      is_anonymous: isAnonymous,
    })

    setIsSaving(false)

    if (error) {
      toastError('Failed to save entry. Please try again.')
      return
    }

    localStorage.removeItem(getDraftKey(userId))
    setContent('')
    setDialogOpen(false)
    toastSuccess(
      isPublic
        ? `Entry published${isAnonymous ? ' anonymously' : ''} to forum.`
        : 'Entry saved privately.'
    )
  }

  const wordCount = getWordCount(content)

  return (
    <div className="flex flex-col gap-4">
      {/* Paper-like writing container */}
      <div className="bg-card rounded-lg shadow-md border border-border/50 px-8 md:px-12 py-10 paper-texture">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.shiftKey) {
              e.preventDefault()
              if (content.trim()) setDialogOpen(true)
              return
            }
            const soundType = getSoundType(e.key)
            if (soundType) playKeystroke(soundType)
          }}
          placeholder={draftRestored ? 'Begin your entry...' : ''}
          className="
            w-full bg-transparent resize-none border-none outline-none
            font-jetbrains text-base leading-8 tracking-wide text-foreground
            placeholder:text-muted-foreground/40
            min-h-[calc(100vh-16rem)]
            focus:outline-none focus:ring-0
            transition-none
            typewriter-caret
          "
          autoFocus
          spellCheck
        />
      </div>

      {/* Footer toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground font-jetbrains">
            {wordCount} {wordCount === 1 ? 'word' : 'words'} &middot; {content.length} chars
          </p>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label={soundEnabled ? 'Disable typewriter sound' : 'Enable typewriter sound'}
            title={soundEnabled ? 'Sound on' : 'Sound off'}
          >
            {soundEnabled ? (
              <Volume2 className="h-3.5 w-3.5" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        <Button
          size="small"
          onClick={() => setDialogOpen(true)}
          disabled={!content.trim()}
        >
          Save entry
        </Button>
      </div>

      <SaveDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        isSaving={isSaving}
        defaultIsAnonymous={defaultIsAnonymous}
      />
    </div>
  )
}
