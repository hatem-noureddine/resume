import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../final_out/resume');
const reportDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
}

function getAllHtmlFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return [];
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllHtmlFiles(filePath, fileList);
        } else {
            if (path.extname(file) === '.html') {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

const htmlFiles = getAllHtmlFiles(distDir);
let brokenLinks = [];
let totalLinks = 0;

console.log(`🔍 Scanning ${htmlFiles.length} HTML files for broken links...`);

htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const links = content.match(/href="([^"]*)"/g) || [];

    links.forEach(link => {
        totalLinks++;
        // Extract URL
        let url = link.replace('href="', '').replace('"', '');

        // Ignore external links, anchors, mailto, tel
        if (url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:') || url === '') {
            return;
        }

        // Strip anchor/query
        const cleanUrl = url.split('#')[0].split('?')[0];

        if (cleanUrl === '') return; // Just an anchor link like href="#services"

        // Check internal links
        // Normalize absolute paths (e.g. /resume/...) to file system
        let targetPath;
        if (cleanUrl.startsWith('/resume/')) {
            targetPath = path.join(distDir, cleanUrl.replace('/resume/', ''));
        } else if (cleanUrl === '/resume') {
            targetPath = distDir;
        } else if (cleanUrl.startsWith('/')) {
            // Assuming base path /resume is mandated
            // If url is /foo, check if it maps to known root or file?
            // Since basepath is /resume, valid links should likely start with /resume or be relative
            // But let's assume root mapping if loose
            targetPath = path.join(distDir, '../', cleanUrl);
        } else {
            // Relative
            targetPath = path.join(path.dirname(file), cleanUrl);
        }

        // Handle directory index and html extension
        let exists = fs.existsSync(targetPath);
        if (!exists) {
            // Try adding .html
            if (fs.existsSync(targetPath + '.html')) exists = true;
            // Try index.html
            else if (fs.existsSync(path.join(targetPath, 'index.html'))) exists = true;
        }

        if (!exists) {
            brokenLinks.push({ source: path.relative(distDir, file), url });
        }
    });
});

if (brokenLinks.length > 0) {
    console.error(`❌ Found ${brokenLinks.length} broken links:`);
    brokenLinks.forEach(b => console.error(`   ${b.source} -> ${b.url}`));
} else {
    console.log(`✅ Checked ${totalLinks} links. No broken internal links found.`);
}

// Always write report
const reportPath = path.join(reportDir, 'links.json');
fs.writeFileSync(reportPath, JSON.stringify({
    brokenLinks,
    totalLinks,
    success: brokenLinks.length === 0
}, null, 2));
console.log(`📄 Check report saved to reports/links.json`);
