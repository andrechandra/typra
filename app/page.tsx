import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Footer } from '@/components/footer'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/write')

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-8 md:px-16 py-16 flex-1 flex flex-col">
        <nav className="flex justify-between items-center">
          <span className="font-jetbrains text-sm font-semibold tracking-widest uppercase">
            Typra
          </span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="small">
              <Link href="/forum">Forum</Link>
            </Button>
            <Button asChild size="small">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <div className="space-y-3">
            <h1 className="font-jetbrains font-semibold text-3xl sm:text-4xl md:text-5xl tracking-tight">
              Write without noise.
            </h1>
            <p className="text-muted-foreground max-w-sm mx-auto text-sm md:text-base leading-relaxed font-jetbrains">
              A minimal journaling space. Type freely, save privately, share
              when it feels right.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="large">
              <Link href="/signup">Start writing</Link>
            </Button>
            <Button asChild variant="outline" size="large">
              <Link href="/forum">Read the forum</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
