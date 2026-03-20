'use client'

import { useState, useEffect, useRef } from 'react'

export type AutoTypePhase =
  | 'typing'
  | 'pause-after-type'
  | 'deleting'
  | 'pause-after-delete'

interface UseAutoTypewriterOptions {
  text: string
  onCharacter?: (char: string) => void
  typeSpeedMs?: number
  deleteSpeedMs?: number
  pauseAfterTypeMs?: number
  pauseAfterDeleteMs?: number
  jitterMs?: number
}

interface UseAutoTypewriterReturn {
  displayedText: string
  phase: AutoTypePhase
}

export function useAutoTypewriter({
  text,
  onCharacter,
  typeSpeedMs = 120,
  deleteSpeedMs = 45,
  pauseAfterTypeMs = 2500,
  pauseAfterDeleteMs = 700,
  jitterMs = 40,
}: UseAutoTypewriterOptions): UseAutoTypewriterReturn {
  const [displayedText, setDisplayedText] = useState('')
  const [phase, setPhase] = useState<AutoTypePhase>('typing')

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const indexRef = useRef(0)
  // Keep latest onCharacter in a ref so the effect doesn't need it as a
  // dependency — prevents animation restarts when sound state changes
  const onCharacterRef = useRef(onCharacter)
  useEffect(() => {
    onCharacterRef.current = onCharacter
  }, [onCharacter])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    indexRef.current = 0
    setDisplayedText('')
    setPhase('typing')

    function jitter(): number {
      return (Math.random() * 2 - 1) * jitterMs
    }

    function getTypeDelay(char: string): number {
      if (char === '\n') return typeSpeedMs * 1.5 + jitter()
      if (char === ' ') return typeSpeedMs * 1.1 + jitter()
      return typeSpeedMs + jitter()
    }

    function scheduleType(): void {
      const idx = indexRef.current
      if (idx >= text.length) {
        setPhase('pause-after-type')
        timerRef.current = setTimeout(startDeleting, pauseAfterTypeMs)
        return
      }
      const char = text[idx]
      timerRef.current = setTimeout(() => {
        indexRef.current = idx + 1
        setDisplayedText(text.slice(0, idx + 1))
        onCharacterRef.current?.(char)
        scheduleType()
      }, getTypeDelay(char))
    }

    function startDeleting(): void {
      setPhase('deleting')
      scheduleDelete()
    }

    function scheduleDelete(): void {
      const len = indexRef.current
      if (len <= 0) {
        indexRef.current = 0
        setPhase('pause-after-delete')
        timerRef.current = setTimeout(startTyping, pauseAfterDeleteMs)
        return
      }
      timerRef.current = setTimeout(() => {
        indexRef.current = len - 1
        setDisplayedText((prev) => prev.slice(0, -1))
        scheduleDelete()
      }, deleteSpeedMs + Math.random() * 20)
    }

    function startTyping(): void {
      indexRef.current = 0
      setDisplayedText('')
      setPhase('typing')
      scheduleType()
    }

    // Initial delay before the first character appears
    timerRef.current = setTimeout(scheduleType, 400)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [text, typeSpeedMs, deleteSpeedMs, pauseAfterTypeMs, pauseAfterDeleteMs, jitterMs])

  return { displayedText, phase }
}
