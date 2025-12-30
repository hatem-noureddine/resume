import { NextResponse } from 'next/server';
import { generateCoverLetter } from '@/lib/ai-service';
import { getExperience, getSkills, getProjects } from '@/lib/keystatic';

interface SkillItem {
    entry: {
        name: string;
        isProfessional: boolean;
    };
}

interface ExperienceItem {
    entry: {
        role: string;
        company: string;
        startDate: string;
        endDate?: string | null;
        highlights: string[];
    };
}

interface ProjectItem {
    entry: {
        title: string;
        description: string;
        technologies: string[];
    };
}

export async function POST(req: Request) {
    try {
        const { jobDescription, customInstructions } = await req.json();

        if (!jobDescription) {
            return NextResponse.json(
                { error: 'Job description is required' },
                { status: 400 }
            );
        }

        // 1. Fetch Resume Data to build context
        const [experience, skills, projects] = await Promise.all([
            getExperience(),
            getSkills(),
            getProjects()
        ]);

        // 2. Format Context
        const formattedSkills = (skills as unknown as SkillItem[])
            .filter((s) => s.entry.isProfessional)
            .map((s) => s.entry.name)
            .join(', ');

        const formattedExperience = (experience as unknown as ExperienceItem[]).map((e) => `
Role: ${e.entry.role} at ${e.entry.company}
Duration: ${e.entry.startDate} - ${e.entry.endDate || 'Present'}
Highlights: ${e.entry.highlights.join('; ')}
`).join('\n');

        const formattedProjects = (projects as unknown as ProjectItem[]).map((p) => `
Project: ${p.entry.title} - ${p.entry.description}
Tech: ${p.entry.technologies.join(', ')}
`).join('\n');

        const resumeContext = `
SKILLS: ${formattedSkills}

EXPERIENCE:
${formattedExperience}

PROJECTS:
${formattedProjects}
`;

        // 3. Call AI Service
        const coverLetter = await generateCoverLetter(
            jobDescription,
            resumeContext,
            customInstructions
        );

        return NextResponse.json({ coverLetter });

    } catch (error) {
        console.error('Cover letter generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate cover letter' },
            { status: 500 }
        );
    }
}
