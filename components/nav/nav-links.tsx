'use client'

import Link from 'next/link'
import { LogOut, Settings } from 'lucide-react'
import { signOut } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

interface NavLinksProps {
  isLoggedIn: boolean
}

export function NavLinks({ isLoggedIn }: NavLinksProps) {
  return (
    <div className="flex items-center gap-1">
      {isLoggedIn ? (
        <>
          <Button asChild variant="ghost" size="icon" aria-label="Settings">
            <Link href="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
          <form action={signOut}>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </>
      ) : (
        <>
          <Button asChild variant="ghost" size="small">
            <Link href="/forum">Forum</Link>
          </Button>
          <Button asChild variant="ghost" size="small">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="small">
            <Link href="/signup">Sign up</Link>
          </Button>
        </>
      )}
      <ThemeToggle />
    </div>
  )
}
