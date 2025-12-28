import { getExperience, getProjects } from "@/lib/keystatic";
import { AssistantClient } from "./client";

export default async function AdminAssistPage() {
    const experience = await getExperience();
    const projects = await getProjects();

    return (
        <AssistantClient
            initialExperience={experience.map(e => ({
                slug: e.slug,
                company: e.entry.company,
                role: e.entry.role,
                description: e.entry.description
            }))}
            initialProjects={projects.map(p => ({
                slug: p.slug,
                title: p.entry.title,
                description: p.entry.description
            }))}
        />
    );
}
