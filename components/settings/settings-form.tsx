'use client'

import { useState } from 'react'
import { toastSuccess, toastError } from '@/lib/toast'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/
const USERNAME_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000

interface SettingsFormProps {
  userId: string
  username: string
  defaultIsAnonymous: boolean
  lastUsernameChange: string | null
}

export function SettingsForm({
  userId,
  username: initialUsername,
  defaultIsAnonymous: initialDefaultIsAnonymous,
  lastUsernameChange,
}: SettingsFormProps) {
  const [username, setUsername] = useState(initialUsername)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [usernameLoading, setUsernameLoading] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const [isAnonymous, setIsAnonymous] = useState(initialDefaultIsAnonymous)
  const [anonymousLoading, setAnonymousLoading] = useState(false)

  const canChangeUsername =
    lastUsernameChange === null ||
    Date.now() - new Date(lastUsernameChange).getTime() > USERNAME_COOLDOWN_MS

  const unlockDate = lastUsernameChange
    ? new Date(new Date(lastUsernameChange).getTime() + USERNAME_COOLDOWN_MS).toLocaleDateString(
        undefined,
        { month: 'long', day: 'numeric', year: 'numeric' }
      )
    : null

  async function handleUsernameSubmit(e: React.FormEvent) {
    e.preventDefault()
    setUsernameError(null)

    if (!canChangeUsername) {
      setUsernameError(`You can change your username again on ${unlockDate}.`)
      return
    }

    if (!USERNAME_REGEX.test(username)) {
      setUsernameError('Username must be 3–20 characters: letters, numbers, or underscores only.')
      return
    }

    setUsernameLoading(true)
    const supabase = createClient()

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', userId)

    if (profileError) {
      if (profileError.code === '23505') {
        setUsernameError('Username already taken. Please choose another.')
      } else {
        toastError('Failed to update username.')
      }
      setUsernameLoading(false)
      return
    }

    const now = new Date().toISOString()
    await supabase
      .from('settings')
      .upsert(
        { user_id: userId, last_username_change: now, updated_at: now },
        { onConflict: 'user_id' }
      )

    toastSuccess('Username updated.')
    setUsernameLoading(false)
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError(null)

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    setPasswordLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      toastError(error.message)
      setPasswordLoading(false)
      return
    }

    toastSuccess('Password updated.')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordLoading(false)
  }

  async function handleAnonymousToggle() {
    setAnonymousLoading(true)
    const supabase = createClient()
    const next = !isAnonymous

    const { error } = await supabase
      .from('profiles')
      .update({ default_is_anonymous: next })
      .eq('id', userId)

    if (error) {
      toastError('Failed to save preference.')
      setAnonymousLoading(false)
      return
    }

    setIsAnonymous(next)
    toastSuccess('Preference saved.')
    setAnonymousLoading(false)
  }

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-xl font-jetbrains font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground font-jetbrains">
          Manage your account and preferences
        </p>
      </div>

      {/* Username */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-sm font-jetbrains font-semibold">Username</h2>
          {!canChangeUsername && (
            <p className="text-xs text-muted-foreground font-jetbrains">
              Next change available on {unlockDate}
            </p>
          )}
        </div>
        <form onSubmit={handleUsernameSubmit} className="flex gap-2">
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            disabled={!canChangeUsername}
            className="font-jetbrains max-w-xs"
          />
          <Button
            type="submit"
            size="small"
            state={usernameLoading ? 'loading' : 'default'}
            disabled={usernameLoading || !canChangeUsername}
          >
            Save
          </Button>
        </form>
        {usernameError && (
          <p className="text-sm text-destructive font-jetbrains">{usernameError}</p>
        )}
      </section>

      {/* Password */}
      <section className="space-y-4">
        <h2 className="text-sm font-jetbrains font-semibold">Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-2 max-w-xs">
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            className="font-jetbrains"
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className="font-jetbrains"
          />
          {passwordError && (
            <p className="text-sm text-destructive font-jetbrains">{passwordError}</p>
          )}
          <Button
            type="submit"
            size="small"
            state={passwordLoading ? 'loading' : 'default'}
            disabled={passwordLoading || !newPassword}
          >
            Update password
          </Button>
        </form>
      </section>

      {/* Default anonymous */}
      <section className="space-y-3">
        <h2 className="text-sm font-jetbrains font-semibold">Default posting preference</h2>
        <div className="flex items-center justify-between max-w-xs rounded-lg border border-border px-4 py-3">
          <div className="space-y-0.5">
            <p className="text-sm font-jetbrains font-medium">Post anonymously by default</p>
            <p className="text-xs text-muted-foreground font-jetbrains">
              {isAnonymous ? 'Your name will be hidden on public entries' : 'Your name will appear on public entries'}
            </p>
          </div>
          <button
            onClick={handleAnonymousToggle}
            disabled={anonymousLoading}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
              isAnonymous ? 'bg-foreground' : 'bg-input'
            }`}
            role="switch"
            aria-checked={isAnonymous}
            aria-label="Toggle default anonymous posting"
          >
            <span
              className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                isAnonymous ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </section>
    </div>
  )
}
