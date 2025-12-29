import { generateSuggestions, generateCoverLetter } from './ai-service';

describe('ai-service', () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
        process.env.GROQ_API_KEY = 'test-key';
        globalThis.fetch = jest.fn();
        (globalThis.fetch as jest.Mock).mockClear();
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
        delete process.env.GROQ_API_KEY;
    });

    const mockGroqResponse = (suggestions: string[]) => {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                choices: [
                    {
                        message: {
                            content: JSON.stringify({ suggestions })
                        }
                    }
                ]
            })
        });
    };

    describe('generateSuggestions', () => {
        it('should return suggestions for experience type', async () => {
            const suggestions = [
                "Use strong action verbs (e.g., Led, Developed, Optimized).",
                "Mention cross-functional collaboration if applicable.",
                "Did you mentor any junior developers during this time?"
            ];
            (globalThis.fetch as jest.Mock).mockImplementationOnce(() => mockGroqResponse(suggestions));

            const result = await generateSuggestions('test content', 'experience');

            expect(result.suggestions).toEqual(suggestions);
            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining('api.groq.com'),
                expect.objectContaining({
                    body: expect.stringContaining('experience')
                })
            );
        });

        it('should return suggestions for project type', async () => {
            const suggestions = [
                "Explain the problem this project solves.",
                "List the key challenges faced and how you overcame them."
            ];
            (globalThis.fetch as jest.Mock).mockImplementationOnce(() => mockGroqResponse(suggestions));

            const result = await generateSuggestions('test content', 'project');

            expect(result.suggestions).toEqual(suggestions);
            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining('api.groq.com'),
                expect.objectContaining({
                    body: expect.stringContaining('project')
                })
            );
        });

        it('should include custom instructions in the prompt', async () => {
            const suggestions = ["Custom suggestion"];
            (globalThis.fetch as jest.Mock).mockImplementationOnce(() => mockGroqResponse(suggestions));

            await generateSuggestions('content', 'experience', 'Make it funny');

            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining('api.groq.com'),
                expect.objectContaining({
                    body: expect.stringContaining('Additional User Instructions: Make it funny')
                })
            );
        });

        it('should throw error if GROQ_API_KEY is missing', async () => {
            delete process.env.GROQ_API_KEY;
            await expect(generateSuggestions('content', 'experience'))
                .rejects.toThrow("GROQ_API_KEY is not configured");
        });

        it('should handle API errors', async () => {
            (globalThis.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: { message: "Invalid API Key" } })
            }));

            await expect(generateSuggestions('content', 'experience'))
                .rejects.toThrow("Invalid API Key");
        });

        it('should handle malformed JSON response with fallback extraction', async () => {
            (globalThis.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    choices: [
                        {
                            message: {
                                content: "Here are some suggestions:\n- Suggestion 1\n- Suggestion 2"
                            }
                        }
                    ]
                })
            }));

            const result = await generateSuggestions('content', 'experience');
            expect(result.suggestions).toContain("- Suggestion 1");
            expect(result.suggestions).toContain("- Suggestion 2");
        });
    });

    describe('generateCoverLetter', () => {
        const mockCoverLetterResponse = (content: string) => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    choices: [
                        {
                            message: {
                                content
                            }
                        }
                    ]
                })
            });
        };

        it('should return generated cover letter', async () => {
            const letter = "Dear Hiring Manager...";
            (globalThis.fetch as jest.Mock).mockImplementationOnce(() => mockCoverLetterResponse(letter));

            const result = await generateCoverLetter('Job Desc', 'Resume Context');

            expect(result).toBe(letter);
            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining('api.groq.com'),
                expect.objectContaining({
                    body: expect.stringContaining('Job Desc')
                })
            );
        });

        it('should include custom instructions', async () => {
            const letter = "Custom letter";
            (globalThis.fetch as jest.Mock).mockImplementationOnce(() => mockCoverLetterResponse(letter));

            await generateCoverLetter('Job', 'Resume', 'Make it concise');

            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining('api.groq.com'),
                expect.objectContaining({
                    body: expect.stringContaining('Additional Instructions: Make it concise')
                })
            );
        });

        it('should throw error if GROQ_API_KEY is missing', async () => {
            delete process.env.GROQ_API_KEY;
            await expect(generateCoverLetter('Job', 'Resume'))
                .rejects.toThrow("GROQ_API_KEY is not configured");
        });

        it('should handle API errors', async () => {
            (globalThis.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: { message: "API Error" } })
            }));

            await expect(generateCoverLetter('Job', 'Resume'))
                .rejects.toThrow("API Error");
        });
    });
});
