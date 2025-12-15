"use client";

import Script from "next/script";

export function GoogleAnalytics() {
    // If no ID is provided, do not render anything
    // You should set NEXT_PUBLIC_GA_ID in your .env.local file
    const gaId = process.env.NEXT_PUBLIC_GA_ID;

    if (!gaId) {
        return null;
    }

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', '${gaId}');
                `}
            </Script>
        </>
    );
}
