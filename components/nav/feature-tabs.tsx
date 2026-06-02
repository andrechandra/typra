'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CheckSquare,
  ListTodo,
  PenLine,
  BookOpen,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/habits', label: 'Habits', icon: CheckSquare },
  { href: '/tasks', label: 'Tasks', icon: ListTodo },
  { href: '/write', label: 'Write', icon: PenLine },
  { href: '/my-entries', label: 'Journal', icon: BookOpen },
  { href: '/forum', label: 'Forum', icon: MessageSquare },
]

export function FeatureTabs() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop tab bar — shown below the top nav on md+ screens */}
      <div className="hidden md:block border-b border-border bg-background">
        <div className="max-w-3xl mx-auto px-4 md:px-8 flex items-center gap-1">
          {tabs.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2.5 text-xs font-jetbrains font-medium border-b-2 transition-colors',
                isActive(href)
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile bottom nav — fixed at bottom, only show 5 core tabs */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-background border-t border-border pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
        <div className="flex items-stretch">
          {tabs.slice(0, 5).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] text-[10px] font-jetbrains transition-colors',
                isActive(href)
                  ? 'text-foreground'
                  : 'text-muted-foreground',
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5',
                  isActive(href) ? 'text-foreground' : 'text-muted-foreground',
                )}
              />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
