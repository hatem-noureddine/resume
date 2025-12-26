import { NextResponse } from 'next/server';
import { syncLinkedInData, fetchLinkedInMock } from '@/lib/linkedin-sync';
import fs from 'node:fs';
import path from 'node:path';

export async function POST() {
    try {
        // 1. Fetch data (mock for now)
        const data = await fetchLinkedInMock();

        // 2. Perform synchronization
        const result = await syncLinkedInData(data);

        // 3. Update Keystatic Singleton
        const singletonPath = path.join(process.cwd(), 'src/content/linkedin-sync.json');

        let existingConfig = { profileUrl: "" };
        if (fs.existsSync(singletonPath)) {
            try {
                existingConfig = JSON.parse(fs.readFileSync(singletonPath, 'utf8'));
            } catch (e) {
                console.error("Failed to read existing sync config", e);
            }
        }

        const updatedConfig = {
            ...existingConfig,
            lastSyncDate: new Date().toLocaleString(),
            syncLogs: result.logs
        };

        fs.writeFileSync(singletonPath, JSON.stringify(updatedConfig, null, 2));

        return NextResponse.json({
            success: true,
            summary: result.summary,
            logs: result.logs
        });
    } catch (error) {
        console.error('LinkedIn Sync Error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// Allow GET for easy testing in browser if needed (optional, but requested for "happening from keystatic")
export async function GET() {
    return POST();
}
