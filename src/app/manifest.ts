import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/site';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: SITE_CONFIG.name,
        short_name: "Hatem",
        description: SITE_CONFIG.description,
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
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
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            }
        ],
    };
}
