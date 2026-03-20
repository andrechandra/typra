import { Inter, JetBrains_Mono } from 'next/font/google'

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
})

const fontMono = JetBrains_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
})

export const fonts = [fontSans.variable, fontMono.variable]
