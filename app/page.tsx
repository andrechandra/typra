import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/footer'
import { SiteNav } from '@/components/nav/site-nav'
import { TypewriterPreview } from '@/components/typewriter-preview'
import { FeatureStrip } from '@/components/landing/feature-strip'
import { HowItWorks } from '@/components/landing/how-it-works'
import { HabitsPreview } from '@/components/landing/habits-preview'
import { TasksPreview } from '@/components/landing/tasks-preview'
import { StreakTeaser } from '@/components/landing/streak-teaser'
import { CtaBanner } from '@/components/landing/cta-banner'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNav />

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-24 md:py-32">
          <div className="text-center space-y-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-5">
              <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-jetbrains">
                Journal · Habits · Tasks
              </p>
              <h1 className="font-jetbrains font-semibold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight">
                Write. Track.
                <br />
                Finish.
              </h1>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed font-jetbrains">
                A focused workspace for your writing, habits, and tasks, built
                for the way you actually think.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="large">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button asChild size="large" variant="outline">
                <Link href="/forum">Browse Forum</Link>
              </Button>
            </div>
          </div>
        </section>

        <FeatureStrip />
        <HowItWorks />
        <TypewriterPreview />
        <HabitsPreview />
        <TasksPreview />
        <StreakTeaser />
        <CtaBanner />
      </main>

      <Footer />
    </div>
  )
}
