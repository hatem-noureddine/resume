import { NextRequest, NextResponse } from 'next/server';
import { generateSuggestions } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { content, type, customInstructions } = body;

        if (!content || !type) {
            return NextResponse.json({ error: 'Missing content or type' }, { status: 400 });
        }

        const result = await generateSuggestions(content, type, customInstructions);
        return NextResponse.json(result);
    } catch (error) {
        console.error('AI Service Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
