'use client'

import { useRef, useCallback, useState } from 'react'

/**
 * Synthesizes a soft typewriter keystroke click using the Web Audio API.
 * No audio files — sound is generated programmatically.
 *
 * AudioContext is lazily initialized on first keypress to satisfy browser
 * autoplay policy (requires user gesture before audio can play).
 */
export function useTypewriterSound() {
  const [soundEnabled, setSoundEnabled] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const lastSoundTimeRef = useRef<number>(0)

  const playKeystroke = useCallback(() => {
    if (!soundEnabled) return

    // Throttle: skip if last sound was less than 30ms ago (held keys)
    const now = Date.now()
    if (now - lastSoundTimeRef.current < 30) return
    lastSoundTimeRef.current = now

    // Lazy-init AudioContext on first user interaction
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    const ctx = audioCtxRef.current

    // Short white-noise burst with exponential decay envelope (~50ms)
    const bufferSize = Math.floor(ctx.sampleRate * 0.05)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      // Exponential decay shapes the click character
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3)
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    // Bandpass filter for "click" character — slight pitch randomness
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 1500 + Math.random() * 1000 // 1500–2500 Hz
    filter.Q.value = 0.5

    // Slight volume randomness for realism
    const gain = ctx.createGain()
    gain.gain.value = 0.04 + Math.random() * 0.03 // 0.04–0.07

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    source.start()
    source.stop(ctx.currentTime + 0.05)
  }, [soundEnabled])

  return { soundEnabled, setSoundEnabled, playKeystroke }
}
