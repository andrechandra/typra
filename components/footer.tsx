import Link from 'next/link'
import { siteConfig } from '@/constants/site-config'

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8 px-4">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-jetbrains">
        <p>
          Made by{' '}
          <Link
            href="https://github.com/andrechandra"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline underline-offset-4 transition-colors"
          >
            Andre Chandra
          </Link>
        </p>

        <div className="flex items-center gap-4">
          {siteConfig.githubUrl && (
            <Link
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub ↗
            </Link>
          )}
          {siteConfig.supportUrl && (
            <Link
              href={siteConfig.supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Support ↗
            </Link>
          )}
        </div>
      </div>
    </footer>
  )
}
