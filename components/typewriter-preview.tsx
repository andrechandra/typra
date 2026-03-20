'use client'

import { useCallback, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTypewriterSound } from '@/hooks/use-typewriter-sound'
import { useAutoTypewriter } from '@/hooks/use-auto-typewriter'

const SAMPLE_TEXT = `It was a quiet Tuesday evening. I sat by the window,\nwatching the rain trace lines down the glass.\n\nThere is something about rain that makes the words\ncome easier. Like the world is finally still enough\nto hear itself think.`

export function TypewriterPreview() {
  const { soundEnabled, setSoundEnabled, playKeystroke } = useTypewriterSound()

  useEffect(() => {
    setSoundEnabled(false)
  }, [setSoundEnabled])

  const handleCharacter = useCallback(
    (char: string) => {
      if (char === '\n') {
        playKeystroke('enter')
      } else if (char === ' ') {
        playKeystroke('space')
      } else {
        playKeystroke('key')
      }
    },
    [playKeystroke],
  )

  const { displayedText, phase } = useAutoTypewriter({
    text: SAMPLE_TEXT,
    onCharacter: handleCharacter,
    typeSpeedMs: 120,
    deleteSpeedMs: 20,
    pauseAfterTypeMs: 2500,
    pauseAfterDeleteMs: 700,
    jitterMs: 40,
  })

  const cursorBlinks =
    phase === 'pause-after-type' || phase === 'pause-after-delete'

  return (
    <section className="px-4 py-16 md:py-20 animate-in fade-in duration-700 delay-300">
      <div className="max-w-xl mx-auto space-y-5">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-jetbrains text-center">
          What it feels like
        </p>
        <div className="relative bg-card paper-texture rounded-xs shadow-md border border-border/50 px-8 md:px-12 py-10">
          <button
            onClick={() => setSoundEnabled((v) => !v)}
            className="absolute top-3 right-3 p-1.5 rounded-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            aria-label={soundEnabled ? 'Mute typewriter sounds' : 'Unmute typewriter sounds'}
          >
            {soundEnabled ? (
              <Volume2 className="h-3.5 w-3.5" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
          </button>
          <p className="font-jetbrains text-sm leading-8 tracking-wide text-foreground whitespace-pre-line">
            {displayedText}
            <span className={cn('typewriter-caret', cursorBlinks ? 'cursor-blink' : '')}>
              █
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
