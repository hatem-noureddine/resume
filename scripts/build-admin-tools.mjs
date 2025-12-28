import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const ADMIN_DIR = path.join(PUBLIC_DIR, 'admin');
const ANALYZE_DIR = path.join(ADMIN_DIR, 'analyze');
const STORYBOOK_DIR = path.join(ADMIN_DIR, 'storybook');

async function buildAdminTools() {
    console.log('🚀 Building Admin Tools for Production...');

    // 1. Create directory structure
    if (!fs.existsSync(ADMIN_DIR)) {
        fs.mkdirSync(ADMIN_DIR, { recursive: true });
    }

    // 2. Handle Bundle Analyzer
    console.log('📊 Checking Bundle Analyzer reports...');
    const nextAnalyzeDir = path.join(process.cwd(), '.next', 'analyze');

    if (fs.existsSync(nextAnalyzeDir)) {
        if (!fs.existsSync(ANALYZE_DIR)) {
            fs.mkdirSync(ANALYZE_DIR, { recursive: true });
        }

        // Copy analyzer files
        const files = fs.readdirSync(nextAnalyzeDir);
        files.forEach(file => {
            fs.copyFileSync(
                path.join(nextAnalyzeDir, file),
                path.join(ANALYZE_DIR, file)
            );
        });
        console.log('✅ Bundle Analyzer reports copied to public/admin/analyze');
    } else {
        console.warn('⚠️ No Bundle Analyzer reports found in .next/analyze.');
        console.warn('   Run "ANALYZE=true npm run build" to generate them.');
    }

    // 3. Build Storybook
    console.log('🎨 Building Storybook...');
    const TEMP_STORYBOOK = path.join(process.cwd(), 'storybook-static');

    try {
        // Clean temp dir
        if (fs.existsSync(TEMP_STORYBOOK)) {
            fs.rmSync(TEMP_STORYBOOK, { recursive: true, force: true });
        }

        // Build to default temp directory to avoid EINVAL recursive copy
        execSync(`npx storybook build`, { stdio: 'inherit' });

        // Move to public/admin/storybook
        if (fs.existsSync(STORYBOOK_DIR)) {
            fs.rmSync(STORYBOOK_DIR, { recursive: true, force: true });
        }

        fs.renameSync(TEMP_STORYBOOK, STORYBOOK_DIR);

        console.log('✅ Storybook built and moved to public/admin/storybook');
    } catch (error) {
        console.error('❌ Failed to build Storybook:', error.message);
    }

    console.log('✨ Admin Tools build complete!');
}

try {
    await buildAdminTools();
} catch (err) {
    console.error('💥 Build failed:', err);
    process.exit(1);
}
