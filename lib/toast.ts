import { toast } from 'sonner'

interface ToastOptions {
    duration?: number
}

const BASE = {
    position: 'bottom-right' as const,
    duration: 3000,
}

export const toastSuccess = (message: string, options?: ToastOptions) =>
    toast.success(message, {
        ...BASE,
        ...options,
        icon: null,
        style: {
            '--normal-bg': 'var(--toast-success-bg)',
            '--normal-text': 'hsl(var(--foreground))',
            '--normal-border': 'var(--toast-success-border)',
            borderLeft: '3px solid var(--toast-success-border)',
            paddingLeft: '14px',
        } as React.CSSProperties,
    })

export const toastError = (message: string, options?: ToastOptions) =>
    toast.error(message, {
        ...BASE,
        ...options,
        icon: null,
        style: {
            '--normal-bg': 'var(--toast-error-bg)',
            '--normal-text': 'hsl(var(--foreground))',
            '--normal-border': 'var(--toast-error-border)',
            borderLeft: '3px solid var(--toast-error-border)',
            paddingLeft: '14px',
        } as React.CSSProperties,
    })

export const toastInfo = (message: string, options?: ToastOptions) =>
    toast(message, {
        ...BASE,
        ...options,
        icon: null,
        style: {
            '--normal-bg': 'var(--toast-info-bg)',
            '--normal-text': 'hsl(var(--foreground))',
            '--normal-border': 'var(--toast-info-border)',
            borderLeft: '3px solid hsl(var(--border))',
            paddingLeft: '14px',
        } as React.CSSProperties,
    })
