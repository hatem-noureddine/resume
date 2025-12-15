import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Hatem Noureddine - Creative Designer & Developer',
  description: 'Personal portfolio website showcasing projects, skills, and experience in web development and design.',
  keywords: ['portfolio', 'web developer', 'designer', 'React', 'Next.js', 'Android', 'Kotlin'],
  authors: [{ name: 'Hatem Noureddine' }],
  creator: 'Hatem Noureddine',
  alternates: {
    canonical: 'https://hatemnoureddine.github.io/resume/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hatemnoureddine.github.io/resume/',
    siteName: 'Hatem Noureddine Portfolio',
    title: 'Hatem Noureddine - Creative Designer & Developer',
    description: 'Personal portfolio website showcasing projects, skills, and experience in web development and design.',
    images: [
      {
        url: '/resume/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hatem Noureddine Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hatem Noureddine - Creative Designer & Developer',
    description: 'Personal portfolio website showcasing projects, skills, and experience.',
    images: ['/resume/og-image.png'],
    creator: '@hatemnoureddine',
  },
  icons: {
    icon: '/resume/logo_HN.svg',
  },
  metadataBase: new URL('https://hatemnoureddine.github.io'),
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// JSON-LD structured data for Person schema
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Hatem Noureddine',
  url: 'https://hatemnoureddine.github.io/resume/',
  jobTitle: 'Creative Designer & Developer',
  sameAs: [
    'https://github.com/hatemnoureddine',
    'https://linkedin.com/in/hatemnoureddine',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Preconnect hints for external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={cn(inter.variable, outfit.variable, "bg-background text-foreground font-sans antialiased overflow-x-hidden")}>
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none"
        >
          Skip to content
        </a>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

