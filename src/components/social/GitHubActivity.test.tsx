import { render, screen, waitFor } from '@testing-library/react';
import { GitHubActivity } from './GitHubActivity';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
    },
}));

// Mock GlassCard
jest.mock('@/components/ui/Glass', () => ({
    GlassCard: ({ children, className }: any) => (
        <div data-testid="glass-card" className={className}>{children}</div>
    ),
}));

const mockEvents = [
    {
        id: '1',
        type: 'PushEvent',
        repo: { name: 'user/repo', url: 'https://github.com/user/repo' },
        created_at: new Date().toISOString(),
        payload: { commits: [{ message: 'Test commit', sha: 'abc123' }] },
    },
    {
        id: '2',
        type: 'WatchEvent',
        repo: { name: 'user/starred-repo', url: 'https://github.com/user/starred-repo' },
        created_at: new Date(Date.now() - 3600000).toISOString(),
        payload: { action: 'started' },
    },
];

describe('GitHubActivity', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', () => {
        global.fetch = jest.fn(() => new Promise(() => { })) as jest.Mock;

        render(<GitHubActivity username="testuser" />);

        expect(screen.getByText('GitHub Activity')).toBeInTheDocument();
        expect(screen.getByText('@testuser')).toBeInTheDocument();
    });

    it('renders events after successful fetch', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockEvents),
            })
        ) as jest.Mock;

        render(<GitHubActivity username="testuser" />);

        await waitFor(() => {
            expect(screen.getByText(/Pushed 1 commit/)).toBeInTheDocument();
        });

        expect(screen.getByText('repo')).toBeInTheDocument();
        expect(screen.getByText('"Test commit"')).toBeInTheDocument();
    });

    it('renders error on failed fetch', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 404,
            })
        ) as jest.Mock;

        render(<GitHubActivity username="invaliduser" />);

        await waitFor(() => {
            expect(screen.getByText('GitHub user not found')).toBeInTheDocument();
        });
    });

    it('renders without GlassCard when showCard is false', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]),
            })
        ) as jest.Mock;

        render(<GitHubActivity username="testuser" showCard={false} />);

        await waitFor(() => {
            expect(screen.queryByTestId('glass-card')).not.toBeInTheDocument();
        });
    });

    it('limits events based on maxEvents prop', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockEvents),
            })
        ) as jest.Mock;

        render(<GitHubActivity username="testuser" maxEvents={1} />);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('per_page=1'),
                expect.any(Object)
            );
        });
    });
});
