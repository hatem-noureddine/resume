import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// OG Image dimensions
const WIDTH = 1200;
const HEIGHT = 630;

/**
 * Dynamic OG Image generation API.
 * 
 * Usage: /api/og?title=My%20Title&subtitle=Subtitle&category=Tech
 * 
 * Query params:
 * - title: Main title text
 * - subtitle: Optional subtitle
 * - category: Optional category badge
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || 'Hatem Noureddine';
    const subtitle = searchParams.get('subtitle') || 'Kotlin Android Developer';
    const category = searchParams.get('category');

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontFamily: 'system-ui, sans-serif',
                    padding: '60px',
                }}
            >
                {/* Background pattern */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    }}
                />

                {/* Category badge */}
                {category && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '9999px',
                            padding: '12px 24px',
                            marginBottom: '24px',
                        }}
                    >
                        <span style={{ color: 'white', fontSize: '24px', fontWeight: 500 }}>
                            {category}
                        </span>
                    </div>
                )}

                {/* Title */}
                <h1
                    style={{
                        fontSize: title.length > 40 ? '48px' : '64px',
                        fontWeight: 700,
                        color: 'white',
                        textAlign: 'center',
                        margin: 0,
                        lineHeight: 1.2,
                        maxWidth: '900px',
                        textShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    }}
                >
                    {title}
                </h1>

                {/* Subtitle */}
                {subtitle && (
                    <p
                        style={{
                            fontSize: '28px',
                            color: 'rgba(255, 255, 255, 0.85)',
                            textAlign: 'center',
                            margin: '24px 0 0 0',
                            maxWidth: '800px',
                        }}
                    >
                        {subtitle}
                    </p>
                )}

                {/* Logo/Brand */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}
                >
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '20px',
                            color: '#667eea',
                        }}
                    >
                        HN
                    </div>
                    <span style={{ color: 'white', fontSize: '24px', fontWeight: 500 }}>
                        hatem-noureddine.dev
                    </span>
                </div>
            </div>
        ),
        {
            width: WIDTH,
            height: HEIGHT,
        }
    );
}
