'use client'

import { useRef, useCallback, useState, useEffect } from 'react'

export type SoundType = 'key' | 'space' | 'enter' | 'backspace'

const THROTTLE_MS: Record<SoundType, number> = {
  key: 30,
  space: 30,
  backspace: 30,
  enter: 0,
}

interface LoadedBuffers {
  key: AudioBuffer
  enter: AudioBuffer
}

async function loadBuffers(ctx: AudioContext): Promise<LoadedBuffers | null> {
  try {
    const [keyBuf, enterBuf] = await Promise.all([
      fetch('/sounds/keypress.mp3').then((r) => r.arrayBuffer()).then((b) => ctx.decodeAudioData(b)),
      fetch('/sounds/return.mp3').then((r) => r.arrayBuffer()).then((b) => ctx.decodeAudioData(b)),
    ])
    return { key: keyBuf, enter: enterBuf }
  } catch {
    return null
  }
}

function playBuffer(
  ctx: AudioContext,
  buffer: AudioBuffer,
  playbackRate: number,
  gain: number,
): void {
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.playbackRate.value = playbackRate

  const gainNode = ctx.createGain()
  gainNode.gain.value = gain

  source.connect(gainNode)
  gainNode.connect(ctx.destination)
  source.start()
}

export function useTypewriterSound() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const loadedBuffersRef = useRef<LoadedBuffers | null>(null)
  const lastSoundTimeRef = useRef<Record<SoundType, number>>({
    key: 0,
    space: 0,
    enter: 0,
    backspace: 0,
  })

  useEffect(() => {
    const ctx = new AudioContext()
    audioCtxRef.current = ctx
    void loadBuffers(ctx).then((b) => {
      loadedBuffersRef.current = b
    })
    return () => {
      void ctx.close()
    }
  }, [])

  const playKeystroke = useCallback(
    (type: SoundType = 'key') => {
      if (!soundEnabled) return

      const throttle = THROTTLE_MS[type]
      if (throttle > 0) {
        const now = Date.now()
        if (now - lastSoundTimeRef.current[type] < throttle) return
        lastSoundTimeRef.current[type] = now
      }

      const ctx = audioCtxRef.current
      if (!ctx || !loadedBuffersRef.current) return

      if (ctx.state === 'suspended') void ctx.resume()

      const loaded = loadedBuffersRef.current
      const vol = 0.85 + Math.random() * 0.3

      switch (type) {
        case 'key':
          playBuffer(ctx, loaded.key, 0.95 + Math.random() * 0.1, 1.0 * vol)
          break
        case 'space':
          playBuffer(ctx, loaded.key, 0.75 + Math.random() * 0.1, 0.65 * vol)
          break
        case 'backspace':
          playBuffer(ctx, loaded.key, 0.95 + Math.random() * 0.1, 1.0 * vol)
          break
        case 'enter':
          playBuffer(ctx, loaded.enter, 0.97 + Math.random() * 0.06, 0.9 * vol)
          break
      }
    },
    [soundEnabled],
  )

  return { soundEnabled, setSoundEnabled, playKeystroke }
}
