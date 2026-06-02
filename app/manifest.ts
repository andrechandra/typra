import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Typra',
    short_name: 'Typra',
    description: 'Your daily productivity and journaling companion',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#1c1f26',
    theme_color: '#1c1f26',
    orientation: 'portrait',
    icons: [
      {
        src: '/logo/tab-icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo/tab-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
