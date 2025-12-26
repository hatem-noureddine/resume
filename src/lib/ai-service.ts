export interface SuggestionResponse {
    suggestions: string[];
}

export async function generateSuggestions(content: string, type: 'experience' | 'project'): Promise<SuggestionResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock suggestions logic
    const generalSuggestions = [
        "Use strong action verbs (e.g., Led, Developed, Optimized).",
        "Quantify impact with numbers (e.g., 'Reduced latency by 20%').",
        "Highlight the 'Why' and 'How', not just the 'What'."
    ];

    if (type === 'experience') {
        return {
            suggestions: [
                ...generalSuggestions,
                "Mention cross-functional collaboration if applicable.",
                "Did you mentor any junior developers during this time?"
            ]
        };
    } else {
        return {
            suggestions: [
                ...generalSuggestions,
                "Explain the problem this project solves.",
                "List the key challenges faced and how you overcame them."
            ]
        };
    }
}
