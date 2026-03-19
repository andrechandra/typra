import Link from 'next/link'
import { PenLine, Moon, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/footer'
import { SiteNav } from '@/components/nav/site-nav'

const SAMPLE_TEXT = `It was a quiet Tuesday evening. I sat by the window,\nwatching the rain trace lines down the glass.\n\nThere is something about rain that makes the words\ncome easier. Like the world is finally still enough\nto hear itself think.`

const features = [
  {
    icon: PenLine,
    label: 'Typewriter experience',
    description: 'Monospace font, paper texture, and soft keystroke sounds.',
  },
  {
    icon: Moon,
    label: 'Calm by design',
    description: 'Paper-warm light mode and deep charcoal dark mode.',
  },
  {
    icon: Lock,
    label: 'Private by default',
    description: 'Your words stay yours. Share only what you choose.',
  },
]

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLoggedIn = !!user

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNav />

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-24 md:py-32">
          <div className="text-center space-y-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-5">
              <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-jetbrains">
                Typra
              </p>
              <h1 className="font-jetbrains font-semibold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight">
                End your day
                <br />
                in words.
              </h1>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed font-jetbrains">
                A minimalist, typewriter-inspired journaling app designed to
                help you reflect, unwind, and capture your thoughts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {isLoggedIn ? (
                <Button asChild size="large">
                  <Link href="/write">Continue Writing</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="large">
                    <Link href="/signup">Start Writing</Link>
                  </Button>
                  <Button asChild size="large" variant="outline">
                    <Link href="/forum">Browse Forum</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border/40 px-4 py-16 md:py-20 animate-in fade-in duration-700 delay-200">
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {features.map(({ icon: Icon, label, description }) => (
              <div key={label} className="space-y-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <p className="font-jetbrains text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed font-jetbrains">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Mock Editor Preview Section */}
        <section className="px-4 py-16 md:py-20 animate-in fade-in duration-700 delay-300">
          <div className="max-w-xl mx-auto space-y-5">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-jetbrains text-center">
              What it feels like
            </p>
            <div className="bg-card paper-texture rounded-lg shadow-md border border-border/50 px-8 md:px-12 py-10">
              <p className="font-jetbrains text-sm leading-8 tracking-wide text-foreground/50 whitespace-pre-line">
                {SAMPLE_TEXT}
                <span className="cursor-blink text-foreground/70">█</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
