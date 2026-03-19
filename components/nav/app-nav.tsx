'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export function AppNav() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="border-b border-border bg-background">
      <div className="max-w-3xl mx-auto h-14 flex items-center justify-between px-4 md:px-8">
        <Link
          href="/write"
          className="font-jetbrains text-sm font-semibold tracking-widest uppercase hover:text-muted-foreground transition-colors"
        >
          Typra
        </Link>

        <div className="flex items-center gap-1">
          <Button asChild variant="ghost">
            <Link href="/forum">Forum</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/profile">Profile</Link>
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
