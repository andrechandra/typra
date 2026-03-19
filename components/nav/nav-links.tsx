'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogOut, Menu, Settings, X } from 'lucide-react'
import { signOut } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Separator } from '../ui/separator'

interface NavLinksProps {
  isLoggedIn: boolean
}

export function NavLinks({ isLoggedIn }: NavLinksProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const links = [
    { href: '/forum', label: 'Forum', show: true },
    { href: '/write', label: 'Write', show: isLoggedIn },
    { href: '/my-entries', label: 'My Entries', show: isLoggedIn },
  ].filter(({ show, href }) => show && pathname !== href)

  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:flex items-center gap-1">
        {links.map(({ href, label }) => (
          <Button key={href} asChild variant="ghost" size="small">
            <Link href={href}>{label}</Link>
          </Button>
        ))}

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
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="small">
              <Link href="/signup">Sign up</Link>
            </Button>
          </>
        )}

        <ThemeToggle />
      </div>

      {/* Mobile trigger */}
      <div className="flex sm:hidden items-center gap-1">
        <ThemeToggle />
        {isLoggedIn && (
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
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className="relative h-4 w-4 block">
            <Menu
              className={`h-4 w-4 absolute transition-all duration-200 ${open ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
            />
            <X
              className={`h-4 w-4 absolute transition-all duration-200 ${open ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}
            />
          </span>
        </Button>
      </div>

      {/* Mobile backdrop */}
      <div
        className={`sm:hidden fixed top-14 inset-x-0 bottom-0 z-40 bg-background/50 backdrop-blur-sm transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile dropdown */}
      <div
        className={`sm:hidden absolute top-14 left-0 right-0 border-b border-border bg-background z-50 px-4 py-2 flex flex-col gap-1 transition-all duration-200 origin-top ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-3 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      >
        <Separator />

        {links.map(({ href, label }) => (
          <Button
            key={href}
            asChild
            variant="ghost"
            className="justify-start w-full"
          >
            <Link href={href}>{label}</Link>
          </Button>
        ))}

        {isLoggedIn && (
          <Button asChild variant="ghost" className="justify-start w-full">
            <Link href="/settings">Settings</Link>
          </Button>
        )}

        {!isLoggedIn && (
          <>
            <Button
              asChild
              variant="ghost"
              className="justify-start w-full"
            >
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild variant="ghost" className="justify-start w-full">
              <Link href="/signup">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </>
  )
}
