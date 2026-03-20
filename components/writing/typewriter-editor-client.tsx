'use client'

import dynamic from 'next/dynamic'

const TypewriterEditor = dynamic(
  () =>
    import('@/components/writing/typewriter-editor').then(
      (mod) => mod.TypewriterEditor
    ),
  { ssr: false }
)

export { TypewriterEditor }
