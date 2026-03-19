import '@/styles/globals.css'
import type { Metadata } from 'next'
import { siteConfig } from '@/constants/site-config'
import { fonts } from '@/lib/fonts'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'

export const generateMetadata = (): Metadata => ({
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  robots: { index: true, follow: true },
  icons: {
    icon: '/logo/tab-icon.png',
    shortcut: '/logo/tab-icon.png',
    apple: '/logo/tab-icon.png',
  },
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: '/opengraph/opengraph-image.png',
    type: 'website',
    locale: '',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: '/opengraph/opengraph-image.png',
  },
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={fonts.join(' ')}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                '--normal-bg': 'hsl(var(--card))',
                '--normal-text': 'hsl(var(--foreground))',
                '--normal-border': 'hsl(var(--border))',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                boxShadow:
                  '0 1px 3px hsl(var(--foreground) / 0.06), 0 1px 2px hsl(var(--foreground) / 0.04)',
              } as React.CSSProperties,
            }}
          />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
