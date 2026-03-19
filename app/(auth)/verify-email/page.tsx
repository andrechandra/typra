import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Verify Email',
}

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-sm space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-jetbrains font-semibold tracking-tight">
          Check your inbox
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We&apos;ve sent a verification link to your email address. Click the
          link to activate your account and start writing.
        </p>
      </div>

      <Button asChild variant="outline" className="w-full">
        <Link href="/login">Back to sign in</Link>
      </Button>
    </div>
  )
}
