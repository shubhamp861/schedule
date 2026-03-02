
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ScheduleSync Diet Plan',
    short_name: 'ScheduleSync',
    description: 'Personalized nutrition tracking and smart alerts.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f9f5',
    theme_color: '#a3c35b',
    icons: [
      {
        src: 'https://picsum.photos/seed/appicon/192/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://picsum.photos/seed/appicon/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
