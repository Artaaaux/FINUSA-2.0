import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FINUSA - Finance Nusantara',
    short_name: 'FINUSA',
    description: 'Solusi literasi dan pengelolaan finansial untuk pelajar dan generasi muda Indonesia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020817',
    theme_color: '#020817',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/Assets/logo-mark-80.webp',
        sizes: '80x80',
        type: 'image/webp',
      },
    ],
  };
}
