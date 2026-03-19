import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export async function ForumNav() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="border-b border-border bg-background px-4 md:px-8">
      <div className="max-w-3xl mx-auto h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-jetbrains text-sm font-semibold tracking-widest uppercase hover:text-muted-foreground transition-colors"
        >
          Typra
        </Link>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          {user ? (
            <Button asChild variant="ghost" size="small">
              <Link href="/write">Write</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="small">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="small">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
