export interface SuggestionResponse {
    suggestions: string[];
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function generateSuggestions(
    content: string,
    type: 'experience' | 'project',
    customInstructions?: string
): Promise<SuggestionResponse> {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("GROQ_API_KEY is not configured");
    }

    const systemPrompt = `You are a professional resume writer and career coach. 
Your goal is to provide specific, actionable, and high-impact suggestions to improve the given ${type} description.
Focus on:
1. Using strong action verbs (e.g., "Spearheaded", "Optimized", "Engineered").
2. Quantifying achievements (e.g., "Reduced latency by 15%", "Managed a $10k budget").
3. Highlighting the technical stack and specific skills.
4. Ensuring the tone is professional and concise.

${customInstructions ? `Additional User Instructions: ${customInstructions}` : ""}

Return the response as a JSON object with a single key "suggestions" which is an array of strings. 
Each string should be a single, standalone improvement suggestion.
Provide between 3 and 5 suggestions.`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.1-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Please analyze this ${type} description: "${content}"` }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
                max_tokens: 1024,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Failed to fetch suggestions from Groq");
        }

        const data = await response.json();
        const contentResponse = data.choices[0].message.content;

        try {
            return JSON.parse(contentResponse) as SuggestionResponse;
        } catch {
            console.error("Failed to parse Groq response:", contentResponse);
            // Fallback: If it's not JSON but has lines, try to extract them
            const lines = contentResponse
                .split("\n")
                .map((l: string) => l.trim())
                .filter((l: string) => l.length > 5 && !l.includes("{") && !l.includes("}"));
            return { suggestions: lines.slice(0, 5) };
        }
    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
}

export async function generateCoverLetter(
    jobDescription: string,
    resumeContext: string,
    customInstructions?: string
): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("GROQ_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert career coach and professional copywriter.
Your goal is to write a compelling, tailored cover letter for a software engineering position.
You will be provided with:
1. The User's Resume/Portfolio Data (Experience, Skills, Projects).
2. The Job Description.

Guidelines:
- Tone: Professional, enthusiastic, and confident (but not arrogant).
- Structure:
    - Opening: Hook the reader, mention the specific role and company.
    - Body Paragraph 1: Connect previous experience to key requirements in the JD. Use specific examples from the resume data.
    - Body Paragraph 2: Highlight technical skills and specific projects that align with the role.
    - Closing: Reiterate enthusiasm and call to action (interview).
- Format: Plain text/Markdown. Do not include placeholders like "[Your Name]" if you know the name. If unknown, use brackets.
- Length: Concise (300-400 words).

${customInstructions ? `Additional Instructions: ${customInstructions}` : ""}`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.1-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    {
                        role: "user",
                        content: `RESUME DATA:\n${resumeContext}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nPlease write the cover letter.`
                    }
                ],
                temperature: 0.7,
                max_tokens: 2048,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Failed to generate cover letter");
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
}
