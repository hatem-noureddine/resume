import { generateSuggestions, SuggestionResponse } from './ai-service';

describe('ai-service', () => {
    describe('generateSuggestions', () => {
        it('should return suggestions for experience type', async () => {
            const result: SuggestionResponse = await generateSuggestions('test content', 'experience');

            expect(result.suggestions).toBeDefined();
            expect(Array.isArray(result.suggestions)).toBe(true);
            expect(result.suggestions.length).toBeGreaterThan(0);
            expect(result.suggestions).toContain("Use strong action verbs (e.g., Led, Developed, Optimized).");
            expect(result.suggestions).toContain("Mention cross-functional collaboration if applicable.");
            expect(result.suggestions).toContain("Did you mentor any junior developers during this time?");
        });

        it('should return suggestions for project type', async () => {
            const result: SuggestionResponse = await generateSuggestions('test content', 'project');

            expect(result.suggestions).toBeDefined();
            expect(Array.isArray(result.suggestions)).toBe(true);
            expect(result.suggestions.length).toBeGreaterThan(0);
            expect(result.suggestions).toContain("Use strong action verbs (e.g., Led, Developed, Optimized).");
            expect(result.suggestions).toContain("Explain the problem this project solves.");
            expect(result.suggestions).toContain("List the key challenges faced and how you overcame them.");
        });

        it('should include general suggestions in both types', async () => {
            const experienceResult = await generateSuggestions('content', 'experience');
            const projectResult = await generateSuggestions('content', 'project');

            const generalSuggestion = "Quantify impact with numbers (e.g., 'Reduced latency by 20%').";

            expect(experienceResult.suggestions).toContain(generalSuggestion);
            expect(projectResult.suggestions).toContain(generalSuggestion);
        });

        it('should handle empty content', async () => {
            const result = await generateSuggestions('', 'experience');

            expect(result.suggestions).toBeDefined();
            expect(result.suggestions.length).toBeGreaterThan(0);
        });
    });
});
