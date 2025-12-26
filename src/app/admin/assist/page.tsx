import { getExperience, getProjects } from "@/lib/keystatic";
import { AssistantClient } from "./client";

export default async function AdminAssistPage() {
    const experience = await getExperience();
    const projects = await getProjects();

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">AI Content Assistant 🤖</h1>
            <p className="text-gray-600 mb-8">
                Select an item to analyze and receive AI-powered suggestions for improvement.
            </p>

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
        </div>
    );
}
