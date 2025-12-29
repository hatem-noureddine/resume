import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AssistantClient } from './client';
import { SuggestionResponse } from '@/lib/ai-service';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    Sparkles: () => <div data-testid="icon-sparkles" />,
    History: () => <div data-testid="icon-history" />,
    Loader2: () => <div data-testid="icon-loader" />,
    Zap: () => <div data-testid="icon-zap" />,
    MessageSquare: () => <div data-testid="icon-message" />,
    ArrowRight: () => <div data-testid="icon-arrow-right" />,
    Copy: () => <div data-testid="icon-copy" />,
    Check: () => <div data-testid="icon-check" />,
    RefreshCw: () => <div data-testid="icon-refresh" />,
    Trash2: () => <div data-testid="icon-trash" />,
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('AssistantClient', () => {
    const mockExperience = [
        { slug: 'exp-1', role: 'Dev', company: 'Tech Inc', description: 'Wrote code.' }
    ];
    const mockProjects = [
        { slug: 'proj-1', title: 'Cool App', description: 'Built an app.' }
    ];

    const originalFetch = globalThis.fetch;
    const mockFetch = jest.fn();

    beforeEach(() => {
        globalThis.fetch = mockFetch;
        localStorage.clear();
        jest.clearAllMocks();
    });

    afterAll(() => {
        globalThis.fetch = originalFetch;
    });

    it('renders initial state correctly', () => {
        render(<AssistantClient initialExperience={mockExperience} initialProjects={mockProjects} />);

        expect(screen.getByText('AI Content Assistant')).toBeInTheDocument();
        expect(screen.getByText('Dev')).toBeInTheDocument(); // Experience item
        expect(screen.getByText('Cool App')).toBeInTheDocument(); // Project item
        expect(screen.getByText("Let's improve your resume")).toBeInTheDocument(); // Empty state
    });

    it('selects an item and runs analysis', async () => {
        const mockResponse: SuggestionResponse = {
            suggestions: ['Better action verbs', 'More metrics']
        };
        mockFetch.mockResolvedValueOnce({
            json: async () => mockResponse,
        });

        render(<AssistantClient initialExperience={mockExperience} initialProjects={mockProjects} />);

        // Click on an experience item
        fireEvent.click(screen.getByText('Dev'));

        // Should show loading state (mocked mostly, but we can check if fetch was called)
        expect(mockFetch).toHaveBeenCalledWith('/api/assist', expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('Wrote code.')
        }));

        // Wait for results
        await waitFor(() => {
            expect(screen.getByText('Better action verbs')).toBeInTheDocument();
        });
    });

    it('handles analysis error', async () => {
        mockFetch.mockRejectedValueOnce(new Error('API Failure'));

        render(<AssistantClient initialExperience={mockExperience} initialProjects={mockProjects} />);

        fireEvent.click(screen.getByText('Dev'));

        await waitFor(() => {
            expect(screen.getByText(/Error fetching suggestions/)).toBeInTheDocument();
        });
    });

    it('toggles history view', () => {
        render(<AssistantClient initialExperience={mockExperience} initialProjects={mockProjects} />);

        const historyBtn = screen.getByText('History');
        fireEvent.click(historyBtn);

        expect(screen.getByText('Recent Analyses')).toBeInTheDocument();
        expect(screen.getByText('No recent analyses found.')).toBeInTheDocument();
    });

    it('loads and displays history from localStorage', () => {
        const mockHistory = [{
            id: '123',
            itemSlug: 'exp-1',
            itemTitle: 'Dev at Tech Inc',
            type: 'experience',
            suggestions: ['Old suggestions'],
            timestamp: Date.now()
        }];
        localStorage.setItem('ai_assistant_history', JSON.stringify(mockHistory));

        render(<AssistantClient initialExperience={mockExperience} initialProjects={mockProjects} />);

        fireEvent.click(screen.getByText('History'));

        expect(screen.getByText('Old suggestions')).toBeInTheDocument();
    });

    it('clears history', () => {
        const mockHistory = [{
            id: '123',
            itemSlug: 'exp-1',
            itemTitle: 'Dev at Tech Inc',
            type: 'experience',
            suggestions: ['Old suggestions'],
            timestamp: Date.now()
        }];
        localStorage.setItem('ai_assistant_history', JSON.stringify(mockHistory));

        render(<AssistantClient initialExperience={mockExperience} initialProjects={mockProjects} />);

        fireEvent.click(screen.getByText('History'));
        fireEvent.click(screen.getByText('Clear History'));

        expect(screen.queryByText('Old suggestions')).not.toBeInTheDocument();
        const stored = localStorage.getItem('ai_assistant_history');
        expect(stored === null || stored === '[]').toBeTruthy();
    });

    it('handles bulk analysis', async () => {
        const mockResponse: SuggestionResponse = {
            suggestions: ['Bulk suggestion']
        };
        mockFetch.mockResolvedValue({
            json: async () => mockResponse,
        });

        render(<AssistantClient initialExperience={mockExperience} initialProjects={mockProjects} />);

        fireEvent.click(screen.getByText(/Bulk/));

        // Should trigger fetch for each item (1 exp + 1 proj = 2)
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(2);
        });

        // Should switch to history view automatically
        expect(screen.getByText('Recent Analyses')).toBeInTheDocument();
        expect(screen.getAllByText('Bulk suggestion')).toHaveLength(2);
    });

    it('applies custom instructions', async () => {
        const mockResponse: SuggestionResponse = {
            suggestions: ['Customized suggestion']
        };
        mockFetch.mockResolvedValueOnce({
            json: async () => mockResponse,
        });

        render(<AssistantClient initialExperience={mockExperience} initialProjects={mockProjects} />);

        // Select item first
        fireEvent.click(screen.getByText('Dev'));

        // Wait for first auto-analysis to finish (or mock it to resolve quick)
        await waitFor(() => expect(screen.getByText('Optimization Suggestions')).toBeInTheDocument());
        mockFetch.mockClear();

        // Type instruction
        const input = screen.getByPlaceholderText(/e.g. 'Make it more technical'/);
        fireEvent.change(input, { target: { value: 'Make it funny' } });

        // Click Apply
        mockFetch.mockResolvedValueOnce({
            json: async () => ({ suggestions: ['Funny one'] }),
        });
        fireEvent.click(screen.getByText('Apply'));

        expect(mockFetch).toHaveBeenCalledWith('/api/assist', expect.objectContaining({
            body: expect.stringContaining('Make it funny')
        }));

        await waitFor(() => {
            expect(screen.getByText('Funny one')).toBeInTheDocument();
        });
    });
});
