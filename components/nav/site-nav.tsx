import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NavLinks } from '@/components/nav/nav-links'

export async function SiteNav() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="border-b border-border bg-background relative z-50">
      <div className="max-w-3xl mx-auto h-14 flex items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="font-jetbrains text-sm font-semibold tracking-widest uppercase hover:text-muted-foreground transition-colors"
        >
          Typra
        </Link>

        <NavLinks isLoggedIn={!!user} />
      </div>
    </nav>
  )
}
