import { render, screen, waitFor, act } from '@testing-library/react';
import { DevToolsSection } from './DevToolsSection';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    BarChart3: () => <div data-testid="icon-bar-chart" />,
    Palette: () => <div data-testid="icon-palette" />,
    Terminal: () => <div data-testid="icon-terminal" />,
    Copy: () => <div data-testid="icon-copy" />,
    Check: () => <div data-testid="icon-check" />,
    ExternalLink: () => <div data-testid="icon-external-link" />,
    Activity: () => <div data-testid="icon-activity" />,
}));

describe('DevToolsSection', () => {
    const originalLocation = globalThis.location;

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset location mock
        Object.defineProperty(globalThis, 'location', {
            value: { ...originalLocation, hostname: 'localhost' },
            writable: true
        });
    });

    afterAll(() => {
        Object.defineProperty(globalThis, 'location', {
            value: originalLocation,
            writable: true
        });
    });

    it('renders in local environment', () => {
        render(<DevToolsSection />);
        expect(screen.getByText('(local env)')).toBeInTheDocument();
        expect(screen.getAllByTestId('icon-copy')).toHaveLength(2); // Two tools with copy buttons
        expect(screen.getByText('npm run analyze')).toBeInTheDocument();
    });

    it('renders in production environment', () => {
        Object.defineProperty(globalThis, 'location', {
            value: { ...originalLocation, hostname: 'example.com' },
            writable: true
        });

        render(<DevToolsSection />);
        expect(screen.getByText('(production build)')).toBeInTheDocument();
        expect(screen.getAllByText('View Production Report')).toHaveLength(2);
        expect(screen.queryByText('npm run analyze')).not.toBeInTheDocument(); // No commands in prod
    });

    it('checks service status - online', async () => {
        jest.useFakeTimers();
        globalThis.fetch = jest.fn().mockResolvedValue({ ok: true });

        render(<DevToolsSection />);

        // Fast-forward initial check
        await act(async () => {
            jest.runOnlyPendingTimers();
        });

        await waitFor(() => {
            expect(screen.getAllByText('Active')).toHaveLength(2); // Two tools online
        });

        jest.useRealTimers();
    });

    it('checks service status - offline', async () => {
        jest.useFakeTimers();
        globalThis.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

        render(<DevToolsSection />);

        await act(async () => {
            jest.runOnlyPendingTimers();
        });

        await waitFor(() => {
            expect(screen.getAllByText('Offline')).toHaveLength(2);
        });

        jest.useRealTimers();
    });

    it('copies command to clipboard', async () => {
        const mockClipboard = {
            writeText: jest.fn().mockResolvedValue(undefined),
        };
        Object.defineProperty(navigator, 'clipboard', {
            value: mockClipboard,
            writable: true,
        });

        render(<DevToolsSection />);

        const copyButtons = screen.getAllByTitle('Copy command');
        await act(async () => {
            copyButtons[0].click();
        });

        expect(mockClipboard.writeText).toHaveBeenCalledWith('npm run analyze');
        expect(screen.getByTestId('icon-check')).toBeInTheDocument(); // Copied state
    });

    it('checks correct URL based on environment', async () => {
        jest.useFakeTimers();
        const fetchMock = jest.fn().mockResolvedValue({ ok: true });
        globalThis.fetch = fetchMock;

        // Production check
        Object.defineProperty(globalThis, 'location', {
            value: { ...originalLocation, hostname: 'example.com' },
            writable: true
        });

        render(<DevToolsSection />);

        await act(async () => {
            jest.runOnlyPendingTimers();
        });

        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/admin/analyze/client.html'),
            expect.anything()
        );

        jest.useRealTimers();
    });
});
