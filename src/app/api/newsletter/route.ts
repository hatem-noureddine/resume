
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
        return NextResponse.json(
            { error: 'Invalid email address' },
            { status: 400 }
        );
    }

    const API_KEY = process.env.BUTTONDOWN_API_KEY;

    if (!API_KEY) {
        // Fallback for development/preview without keys
        console.warn('BUTTONDOWN_API_KEY is missing. Mocking successful subscription.');
        return NextResponse.json(
            { message: 'Mock subscription successful (API key missing)' },
            { status: 200 }
        );
    }

    try {
        const response = await fetch('https://api.buttondown.email/v1/subscribers', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Buttondown API Error:', errorData);
            return NextResponse.json(
                { error: 'Failed to subscribe. Please try again later.' },
                { status: response.status }
            );
        }

        return NextResponse.json(
            { message: 'Successfully subscribed!' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Newsletter Subscription Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
