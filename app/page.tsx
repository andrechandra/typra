import Link from 'next/link'
import { PenLine, Moon, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/footer'
import { SiteNav } from '@/components/nav/site-nav'
import { TypewriterPreview } from '@/components/typewriter-preview'

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
        <TypewriterPreview />
      </main>

      <Footer />
    </div>
  )
}
