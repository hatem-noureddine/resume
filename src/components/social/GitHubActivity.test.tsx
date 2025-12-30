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

const createMockEvent = (type: string, overrides: Record<string, unknown> = {}) => ({
    id: Math.random().toString(),
    type,
    repo: { name: 'user/repo', url: 'https://github.com/user/repo' },
    created_at: new Date().toISOString(),
    payload: {},
    ...overrides,
});

describe('GitHubActivity', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', () => {
        globalThis.fetch = jest.fn(() => new Promise(() => { })) as jest.Mock;

        render(<GitHubActivity username="testuser" />);

        expect(screen.getByText('GitHub Activity')).toBeInTheDocument();
        expect(screen.getByText('@testuser')).toBeInTheDocument();
    });

    describe('error handling', () => {
        it('renders 404 error message for user not found', async () => {
            globalThis.fetch = jest.fn(() =>
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

        it('renders 403 error message for rate limit exceeded', async () => {
            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 403,
                })
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                expect(screen.getByText('API rate limit exceeded')).toBeInTheDocument();
            });
        });

        it('renders generic error for other status codes', async () => {
            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 500,
                })
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                expect(screen.getByText('Failed to fetch GitHub activity')).toBeInTheDocument();
            });
        });

        it('handles fetch network error', async () => {
            globalThis.fetch = jest.fn(() =>
                Promise.reject(new Error('Network error'))
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                expect(screen.getByText('Network error')).toBeInTheDocument();
            });
        });

        it('handles non-Error thrown objects', async () => {
            globalThis.fetch = jest.fn(() =>
                Promise.reject('Unknown error')
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                expect(screen.getByText('Failed to load activity')).toBeInTheDocument();
            });
        });
    });

    describe('event types', () => {
        it('renders PushEvent correctly', async () => {
            const mockEvents = [
                createMockEvent('PushEvent', {
                    payload: { commits: [{ message: 'Test commit', sha: 'abc123' }] },
                }),
            ];

            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockEvents),
                })
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                expect(screen.getByText(/Pushed 1 commit/)).toBeInTheDocument();
            });
            expect(screen.getByText('"Test commit"')).toBeInTheDocument();
        });

        it('renders PushEvent with multiple commits', async () => {
            const mockEvents = [
                createMockEvent('PushEvent', {
                    payload: {
                        commits: [
                            { message: 'Commit 1', sha: 'abc123' },
                            { message: 'Commit 2', sha: 'def456' },
                        ],
                    },
                }),
            ];

            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockEvents),
                })
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                expect(screen.getByText(/Pushed 2 commits/)).toBeInTheDocument();
            });
        });

        it('renders WatchEvent correctly', async () => {
            const mockEvents = [createMockEvent('WatchEvent', { payload: { action: 'started' } })];

            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockEvents),
                })
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                expect(screen.getByText('Starred')).toBeInTheDocument();
            });
        });

        it('renders ForkEvent correctly', async () => {
            const mockEvents = [createMockEvent('ForkEvent')];

            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockEvents),
                })
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                expect(screen.getByText('Forked')).toBeInTheDocument();
            });
        });

        it('renders CreateEvent correctly', async () => {
            const mockEvents = [createMockEvent('CreateEvent', { payload: { ref_type: 'branch' } })];

            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockEvents),
                })
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                expect(screen.getByText('Created branch')).toBeInTheDocument();
            });
        });

        it('renders CreateEvent with default ref_type', async () => {
            const mockEvents = [createMockEvent('CreateEvent', { payload: {} })];

            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockEvents),
                })
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                expect(screen.getByText('Created repository')).toBeInTheDocument();
            });
        });

        it('renders PullRequestEvent correctly', async () => {
            const mockEvents = [createMockEvent('PullRequestEvent', { payload: { action: 'opened' } })];

            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockEvents),
                })
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                expect(screen.getByText(/opened pull request/)).toBeInTheDocument();
            });
        });

        it('renders IssuesEvent correctly', async () => {
            const mockEvents = [createMockEvent('IssuesEvent', { payload: { action: 'closed' } })];

            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockEvents),
                })
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                expect(screen.getByText(/closed issue/)).toBeInTheDocument();
            });
        });

        it('renders unknown event type correctly', async () => {
            const mockEvents = [createMockEvent('UnknownEvent')];

            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockEvents),
                })
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                expect(screen.getByText('Activity in')).toBeInTheDocument();
            });
        });
    });

    describe('time formatting', () => {
        it('displays minutes ago correctly', async () => {
            const mockEvents = [
                createMockEvent('WatchEvent', {
                    created_at: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
                }),
            ];

            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockEvents),
                })
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                expect(screen.getByText('30m ago')).toBeInTheDocument();
            });
        });

        it('displays hours ago correctly', async () => {
            const mockEvents = [
                createMockEvent('WatchEvent', {
                    created_at: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
                }),
            ];

            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockEvents),
                })
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                expect(screen.getByText('5h ago')).toBeInTheDocument();
            });
        });

        it('displays days ago correctly', async () => {
            const mockEvents = [
                createMockEvent('WatchEvent', {
                    created_at: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
                }),
            ];

            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockEvents),
                })
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                expect(screen.getByText('3d ago')).toBeInTheDocument();
            });
        });

        it('displays date for events older than a week', async () => {
            const oldDate = new Date(Date.now() - 10 * 86400000); // 10 days ago
            const mockEvents = [
                createMockEvent('WatchEvent', {
                    created_at: oldDate.toISOString(),
                }),
            ];

            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockEvents),
                })
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                // Should show the actual date instead of "Xd ago"
                expect(screen.getByText(oldDate.toLocaleDateString())).toBeInTheDocument();
            });
        });
    });

    describe('empty state', () => {
        it('renders no activity message when events array is empty', async () => {
            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([]),
                })
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                expect(screen.getByText('No recent public activity')).toBeInTheDocument();
            });
        });
    });

    describe('rendering options', () => {
        it('renders without GlassCard when showCard is false', async () => {
            globalThis.fetch = jest.fn(() =>
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

        it('renders with GlassCard by default', async () => {
            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([]),
                })
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" />);

            await waitFor(() => {
                expect(screen.getByTestId('glass-card')).toBeInTheDocument();
            });
        });

        it('applies custom className', async () => {
            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([]),
                })
            ) as jest.Mock;

            const { container } = render(<GitHubActivity username="testuser" showCard={false} className="custom-class" />);

            await waitFor(() => {
                // The className is applied to the outer div
                expect(container.querySelector('.custom-class')).toBeInTheDocument();
            });
        });

        it('limits events based on maxEvents prop', async () => {
            globalThis.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([]),
                })
            ) as jest.Mock;

            render(<GitHubActivity username="testuser" maxEvents={3} />);

            await waitFor(() => {
                expect(globalThis.fetch).toHaveBeenCalledWith(
                    expect.stringContaining('per_page=3'),
                    expect.any(Object)
                );
            });
        });
    });
});

