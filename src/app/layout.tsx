import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { FeatureFlagProvider } from "@/context/FeatureFlags";
import { VercelAnalytics } from "@/components/analytics/VercelAnalytics";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { SITE_METADATA, VIEWPORT_CONFIG, JSON_LD } from "@/config/site";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = SITE_METADATA;

export const viewport = VIEWPORT_CONFIG;


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body
        className={cn(inter.variable, outfit.variable, "bg-background text-foreground font-sans antialiased overflow-x-hidden")}
        suppressHydrationWarning
      >
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none"
        >
          Skip to content
        </a>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <LanguageProvider>
            <FeatureFlagProvider>
              {children}
              <ErrorBoundary fallback={null}>
                <ChatWidget />
              </ErrorBoundary>
              <VercelAnalytics />
            </FeatureFlagProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

