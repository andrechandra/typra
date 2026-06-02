import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CtaBanner() {
  return (
    <section className="border-t border-border/40 bg-muted/30 px-4 py-16 md:py-20 animate-in fade-in duration-700">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="space-y-2">
          <h2 className="font-jetbrains font-semibold text-2xl md:text-3xl tracking-tight">
            Everything you need to stay consistent.
          </h2>
          <p className="font-jetbrains text-sm text-muted-foreground">
            Nothing you don&#39;t.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="large">
            <Link href="/signup">Get started — it&#39;s free</Link>
          </Button>
          <Button asChild size="large" variant="outline">
            <Link href="/forum">Browse the forum</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
