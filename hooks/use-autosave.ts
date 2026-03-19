import { useEffect, useRef } from 'react'

/**
 * Debounced autosave hook. Calls `onSave` after `delay` ms of inactivity.
 *
 * IMPORTANT: Wrap `onSave` in `useCallback` at the call site to avoid
 * re-triggering the effect on every render.
 */
export function useAutosave(
  value: string,
  onSave: (value: string) => void,
  delay = 1500
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!value.trim()) return

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      onSave(value)
    }, delay)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [value, onSave, delay])
}
