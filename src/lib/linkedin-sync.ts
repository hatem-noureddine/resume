import fs from 'node:fs';
import path from 'node:path';

export interface LinkedInExperience {
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description: string;
    highlights: string[];
    skills: string[];
}

export interface LinkedInSkill {
    name: string;
    category: 'frontend' | 'backend' | 'devops' | 'mobile' | 'other';
    proficiency: number;
}

export interface LinkedInData {
    experience: LinkedInExperience[];
    skills: LinkedInSkill[];
}

/**
 * Normalizes a company name into a slug for file naming.
 */
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replaceAll(/([^\w\s-])/g, '')
        .replaceAll(/([\s_-]+)/g, '-')
        .replaceAll(/(^-+|-+$)/g, '');
}

/**
 * Compares and writes a single record if different.
 */
function syncRecord(filePath: string, newRecord: unknown): 'created' | 'updated' | 'skipped' {
    let existingRecord = null;
    if (fs.existsSync(filePath)) {
        try {
            existingRecord = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
            console.error(`Failed to read ${filePath}`, e);
        }
    }

    if (existingRecord) {
        if (JSON.stringify(existingRecord) === JSON.stringify(newRecord)) {
            return 'skipped';
        }
        // Update
    }

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(newRecord, null, 2));
    return existingRecord ? 'updated' : 'created';
}

/**
 * Synchronizes LinkedIn data with Keystatic collections.
 * Uses idempotency by comparing existing records to avoid unnecessary writes.
 */
export async function syncLinkedInData(data: LinkedInData, languageCode: string = 'en') {
    const logs: string[] = [`Sync started at ${new Date().toISOString()}`];
    const stats = { experience: { created: 0, updated: 0, skipped: 0 }, skills: { created: 0, updated: 0, skipped: 0 } };

    // 1. Sync Experience
    for (const exp of data.experience) {
        const slug = slugify(exp.company);
        const filePath = path.join(process.cwd(), 'src/content/experience', `${slug}.json`);

        const newRecord = {
            company: exp.company,
            role: exp.role,
            startDate: exp.startDate,
            endDate: exp.endDate || 'Present',
            description: exp.description,
            highlights: exp.highlights,
            skills: exp.skills,
            language: languageCode
        };

        const result = syncRecord(filePath, newRecord);
        stats.experience[result]++;
    }

    // 2. Sync Skills
    for (const skill of data.skills) {
        const slug = slugify(skill.name);
        const filePath = path.join(process.cwd(), 'src/content/skills', `${slug}.json`);

        const newRecord = {
            name: skill.name,
            category: skill.category,
            isProfessional: false, // Default
            proficiency: skill.proficiency,
            language: languageCode
        };

        const result = syncRecord(filePath, newRecord);
        stats.skills[result]++;
    }

    logs.push(
        `Experience: ${stats.experience.created} created, ${stats.experience.updated} updated, ${stats.experience.skipped} skipped.`,
        `Skills: ${stats.skills.created} created, ${stats.skills.updated} updated, ${stats.skills.skipped} skipped.`,
        `Sync completed at ${new Date().toISOString()}`
    );

    return {
        success: true,
        logs: logs.join('\n'),
        summary: `Experience: ${stats.experience.updated + stats.experience.created} changed. Skills: ${stats.skills.updated + stats.skills.created} changed.`
    };
}

/**
 * Mock function to simulate fetching data from LinkedIn.
 * In a real scenario, this would call an external API.
 */
export async function fetchLinkedInMock(): Promise<LinkedInData> {
    return {
        experience: [
            {
                company: "LinkedIn Mock Corp",
                role: "Fullstack Developer",
                startDate: "2023-01",
                description: "Working on complex systems.",
                highlights: ["Improved performance by 50%", "Led a team of 10"],
                skills: ["React", "Node.js", "TypeScript"]
            }
        ],
        skills: [
            { name: "TypeScript", category: "frontend", proficiency: 95 },
            { name: "Node.js", category: "backend", proficiency: 90 }
        ]
    };
}
