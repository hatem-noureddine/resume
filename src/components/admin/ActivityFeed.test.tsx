import { render, screen } from '@testing-library/react';
import { ActivityFeed } from './ActivityFeed';
import { formatDistanceToNow } from 'date-fns';

// Mock dependencies
jest.mock('date-fns', () => ({
    formatDistanceToNow: jest.fn(),
}));

jest.mock('lucide-react', () => ({
    GitCommit: () => <div data-testid="icon-git-commit" />,
    Clock: () => <div data-testid="icon-clock" />,
    ExternalLink: () => <div data-testid="icon-external-link" />,
    Activity: () => <div data-testid="icon-activity" />,
}));

describe('ActivityFeed', () => {
    const mockActivity = [
        {
            sha: '1234567890',
            commit: {
                message: 'fix: something',
                author: {
                    name: 'Hatem',
                    date: '2023-01-01T12:00:00Z',
                },
            },
            html_url: 'http://github.com/commit/1234567890',
        },
    ];

    const originalFetch = globalThis.fetch;

    beforeEach(() => {
        globalThis.fetch = jest.fn();
        (formatDistanceToNow as jest.Mock).mockReturnValue('2 hours ago');
    });

    afterAll(() => {
        globalThis.fetch = originalFetch;
    });

    it('renders recent activity successfully', async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockActivity,
        });

        // Since ActivityFeed is an async RSC, we await it to get the element
        const ui = await ActivityFeed();
        render(ui);

        expect(screen.getByText('Recent Activity')).toBeInTheDocument();
        expect(screen.getByText('fix: something')).toBeInTheDocument();
        expect(screen.getByText('1234567')).toBeInTheDocument(); // Short SHA
        expect(screen.getByText('2 hours ago')).toBeInTheDocument();
    });

    it('renders empty state when no activities', async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => [],
        });

        const ui = await ActivityFeed();
        render(ui);

        expect(screen.getByText('No recent activity found.')).toBeInTheDocument();
    });

    it('handles fetch error gracefully (returns empty list logc internally)', async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValue({
            ok: false,
        });

        // We expect it to catch the error and return empty array logic
        const ui = await ActivityFeed();
        render(ui);

        expect(screen.getByText('No recent activity found.')).toBeInTheDocument();
    });

    it('handles network exception', async () => {
        (globalThis.fetch as jest.Mock).mockRejectedValue(new Error('Network Fail'));

        // We expect it to catch the error and return empty array logic
        const ui = await ActivityFeed();
        render(ui);

        expect(screen.getByText('No recent activity found.')).toBeInTheDocument();
    });
});
