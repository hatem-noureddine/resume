import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Dynamic parameters
        // Dynamic parameters
        const title = searchParams.get('title') || 'Hatem Noureddine';
        const description = searchParams.get('subtitle') || searchParams.get('description') || 'Android & Kotlin Developer';
        const label = searchParams.get('category') || searchParams.get('label') || 'Portfolio';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        backgroundColor: '#0f0f0f',
                        backgroundImage: 'radial-gradient(circle at 25% 25%, #1a1a1a 0%, #0f0f0f 100%)',
                        padding: '80px',
                        fontFamily: 'sans-serif',
                    }}
                >
                    {/* Subtle background accent */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '-150px',
                            right: '-150px',
                            width: '500px',
                            height: '500px',
                            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                            borderRadius: '100%',
                        }}
                    />

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            zIndex: 10,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '10px',
                            }}
                        >
                            <div
                                style={{
                                    padding: '6px 14px',
                                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                    borderRadius: '20px',
                                    color: '#818cf8',
                                    fontSize: '20px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                {label}
                            </div>
                        </div>

                        <h1
                            style={{
                                fontSize: '72px',
                                fontWeight: 800,
                                color: 'white',
                                lineHeight: 1.1,
                                marginBottom: '10px',
                                maxWidth: '900px',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                            }}
                        >
                            {title}
                        </h1>

                        <p
                            style={{
                                fontSize: '32px',
                                color: '#94a3b8',
                                lineHeight: 1.4,
                                maxWidth: '800px',
                                margin: 0,
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                            }}
                        >
                            {description}
                        </p>
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            bottom: '80px',
                            left: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                        }}
                    >
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                backgroundColor: '#6366f1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '24px',
                            }}
                        >
                            H
                        </div>
                        <div
                            style={{
                                fontSize: '24px',
                                fontWeight: 600,
                                color: '#cbd5e1',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            hatem-noureddine.dev
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        console.log(message);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
