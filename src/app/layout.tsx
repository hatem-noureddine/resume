import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { FeatureFlagProvider } from "@/context/FeatureFlags";
import { AnnouncerProvider } from "@/context/AnnouncerContext";
import { VercelAnalytics } from "@/components/analytics/VercelAnalytics";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { SITE_METADATA, JSON_LD } from "@/config/site";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { getLanguages, getThemeSettings } from "@/lib/keystatic";
import { ExperimentProvider } from "@/context/ExperimentContext";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });

export const metadata: Metadata = SITE_METADATA;

export { VIEWPORT_CONFIG as viewport } from "@/config/site";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cmsLanguages = await getLanguages();
  const themeSettings = await getThemeSettings();

  const themeCss = themeSettings ? `
    :root {
      ${themeSettings.primaryColor ? `--color-primary: ${themeSettings.primaryColor};` : ''}
    }
    .light {
      ${themeSettings.lightMode?.background ? `--color-background: ${themeSettings.lightMode.background};` : ''}
      ${themeSettings.lightMode?.foreground ? `--color-foreground: ${themeSettings.lightMode.foreground};` : ''}
      ${themeSettings.lightMode?.secondary ? `--color-secondary: ${themeSettings.lightMode.secondary};` : ''}
    }
    .dark {
      ${themeSettings.darkMode?.background ? `--color-background: ${themeSettings.darkMode.background};` : ''}
      ${themeSettings.darkMode?.foreground ? `--color-foreground: ${themeSettings.darkMode.foreground};` : ''}
      ${themeSettings.darkMode?.secondary ? `--color-secondary: ${themeSettings.darkMode.secondary};` : ''}
    }
  ` : '';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {themeCss && (
          <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        )}
        {/* Blocking script to prevent theme flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (!theme || theme === 'system') {
                    theme = supportDarkMode ? 'dark' : 'light';
                  }
                  document.documentElement.classList.add(theme);
                  document.documentElement.style.colorScheme = theme;
                  
                  // Set background color immediately to avoid flash before CSS parses
                  var bgColor = theme === 'dark' ? '#0f0f0f' : '#fafafa';
                  var style = document.createElement('style');
                  style.id = 'theme-init';
                  style.innerHTML = 'html, body { background-color: ' + bgColor + ' !important; }';
                  document.head.appendChild(style);
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {/* Preload critical assets */}
        <link rel="preload" href="/lottie/scroll-mouse.json" as="fetch" crossOrigin="anonymous" />
      </head>
      <body
        className={cn(inter.variable, outfit.variable, "bg-background text-foreground font-sans antialiased overflow-x-hidden")}
        suppressHydrationWarning
      >
        <NoiseOverlay />
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none"
        >
          Skip to content
        </a>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <LanguageProvider cmsLanguages={cmsLanguages}>
            <FeatureFlagProvider>
              <ExperimentProvider>
                <AnnouncerProvider>
                  <ServiceWorkerRegistration />
                  <PWAInstallPrompt />
                  {children}
                  <ErrorBoundary fallback={null}>
                    <ChatWidget />
                  </ErrorBoundary>
                  <VercelAnalytics />
                </AnnouncerProvider>
              </ExperimentProvider>
            </FeatureFlagProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
