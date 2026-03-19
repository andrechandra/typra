'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toastError } from '@/lib/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/

export function CreateUsernameForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!USERNAME_REGEX.test(username)) {
      setError('Username must be 3–20 characters: letters, numbers, or underscores only.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Session expired. Please sign in again.')
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: user.id, username })

    if (profileError) {
      if (profileError.code === '23505') {
        setError('Username already taken. Please choose another.')
      } else {
        toastError('Something went wrong. Please try again.')
      }
      setLoading(false)
      return
    }

    // Create matching settings row (fire-and-forget — non-critical)
    await supabase.from('settings').insert({ user_id: user.id })

    router.push('/write')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-jetbrains font-semibold tracking-tight">
            Choose a username
          </h1>
          <p className="text-sm text-muted-foreground">
            This is how others will see you on the forum
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            className="font-jetbrains"
            autoFocus
          />

          {error && (
            <p className="text-sm text-destructive font-jetbrains">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            state={loading ? 'loading' : 'default'}
            disabled={loading}
          >
            Continue
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground font-jetbrains">
          3–20 characters · letters, numbers, and underscores only
        </p>
      </div>
    </div>
  )
}
