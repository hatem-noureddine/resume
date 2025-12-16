import type { Metadata } from 'next';

export const SITE_CONFIG = {
    name: "Hatem Noureddine",
    title: "Kotlin Android Developer",
    description: "I break down complex user experience problems to create integrity focussed solutions that connect billions of people",
    email: "hatem.noureddine.pro@gmail.com",
    phone: "+33 6 66 88 70 79",
    address: "Paris, France",
    url: "https://resume-cb6ssf9ve-hatem-noureddines-projects.vercel.app/",
    links: {
        github: "https://github.com/hatemnoureddine",
        linkedin: "https://linkedin.com/in/hatemnoureddine",
        twitter: "https://twitter.com/hatemnoureddine",
        resume: "/files/Hatem_Noureddine_Resume.pdf"
    },
    formspree: {
        contactFormId: "mrbnvyrn"
    }
};

export const SITE_METADATA: Metadata = {
    title: `${SITE_CONFIG.name} - Creative Designer & Developer`,
    description: 'Personal portfolio website showcasing projects, skills, and experience in web development and design.',
    keywords: ['portfolio', 'web developer', 'designer', 'React', 'Next.js', 'Android', 'Kotlin'],
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    alternates: {
        canonical: SITE_CONFIG.url,
        languages: {
            'en': SITE_CONFIG.url,
            'fr': `${SITE_CONFIG.url}?lang=fr`,
            'es': `${SITE_CONFIG.url}?lang=es`,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: SITE_CONFIG.url,
        siteName: `${SITE_CONFIG.name} Portfolio`,
        title: `${SITE_CONFIG.name} - Creative Designer & Developer`,
        description: 'Personal portfolio website showcasing projects, skills, and experience in web development and design.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: `${SITE_CONFIG.name} Portfolio`,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${SITE_CONFIG.name} - Creative Designer & Developer`,
        description: 'Personal portfolio website showcasing projects, skills, and experience.',
        images: ['/og-image.png'],
        creator: '@hatemnoureddine',
    },
    icons: {
        icon: '/logo_HN.svg',
    },
    metadataBase: new URL('https://hatem-noureddine.vercel.app'), // TODO: Update after deployment
};

export const VIEWPORT_CONFIG = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export const JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    jobTitle: 'Creative Designer & Developer',
    sameAs: [
        SITE_CONFIG.links.github,
        SITE_CONFIG.links.linkedin,
    ],
};
