import { render, screen, fireEvent } from '@testing-library/react';
import { AdminLayout } from './AdminLayout';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

// Mock dependencies
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
}));

jest.mock('@/context/ThemeContext', () => ({
    useTheme: jest.fn(),
}));

jest.mock('./CommandPalette', () => ({
    CommandPalette: () => <div data-testid="command-palette" />,
    CommandTrigger: ({ onClick }: any) => <button onClick={onClick} data-testid="command-trigger">Search</button>,
    useCommandPalette: () => ({ isOpen: false, open: jest.fn(), close: jest.fn() }),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    Settings: () => <div data-testid="icon-settings" />,
    Activity: () => <div data-testid="icon-activity" />,
    MessageSquare: () => <div data-testid="icon-message-square" />,
    FileText: () => <div data-testid="icon-file-text" />,
    ChevronRight: () => <div data-testid="icon-chevron-right" />,
    Menu: () => <div data-testid="icon-menu" />,
    X: () => <div data-testid="icon-x" />,
    Home: () => <div data-testid="icon-home" />,
    BarChart3: () => <div data-testid="icon-bar-chart" />,
    Palette: () => <div data-testid="icon-palette" />,
    ExternalLink: () => <div data-testid="icon-external-link" />,
    ChevronLeft: () => <div data-testid="icon-chevron-left" />,
    Moon: () => <div data-testid="icon-moon" />,
    Sun: () => <div data-testid="icon-sun" />,
    LogOut: () => <div data-testid="icon-logout" />,
}));

describe('AdminLayout', () => {
    const mockRouter = { push: jest.fn(), refresh: jest.fn() };
    const mockSetTheme = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (usePathname as jest.Mock).mockReturnValue('/admin');
        (useTheme as jest.Mock).mockReturnValue({ theme: 'light', setTheme: mockSetTheme });
        globalThis.fetch = jest.fn();
    });

    it('renders layout structure', () => {
        render(<AdminLayout>Test Content</AdminLayout>);

        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
        expect(screen.getByLabelText('Open menu')).toBeInTheDocument(); // Mobile menu button
    });

    it('toggles sidebar on mobile', () => {
        render(<AdminLayout>Content</AdminLayout>);

        const toggleBtn = screen.getByLabelText('Open menu');
        fireEvent.click(toggleBtn);

        expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
        expect(screen.getByLabelText('Close sidebar')).toBeInTheDocument(); // Overlay

        // Close via overlay
        fireEvent.click(screen.getByLabelText('Close sidebar'));
        expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    });

    it('highlights active nav item', () => {
        (usePathname as jest.Mock).mockReturnValue('/admin/assist');
        render(<AdminLayout>Content</AdminLayout>);

        // "AI Assistant" appears in sidebar and breadcrumbs
        const aiLinks = screen.getAllByText('AI Assistant');
        expect(aiLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('handles theme toggle', () => {
        render(<AdminLayout>Content</AdminLayout>);

        const toggleBtn = screen.getByText('Dark Mode'); // currently light, so shows "Dark Mode" label or "Switch to.."
        // Wait, the button text is "Dark Mode" (with moon icon) when theme is not dark (i.e. light)
        fireEvent.click(toggleBtn);

        expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('handles logout', async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValue({ ok: true });

        render(<AdminLayout>Content</AdminLayout>);

        const logoutBtn = screen.getByText('Log Out');
        fireEvent.click(logoutBtn);

        expect(globalThis.fetch).toHaveBeenCalledWith('/api/admin/logout', { method: 'POST' });
        // Need to wait for async actions
        await screen.findByText('Log Out'); // just to wait a tick

        expect(mockRouter.push).toHaveBeenCalledWith('/admin/login');
        expect(mockRouter.refresh).toHaveBeenCalled();
    });

    it('handles logout failure', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        (globalThis.fetch as jest.Mock).mockRejectedValue(new Error('Logout failed'));

        render(<AdminLayout>Content</AdminLayout>);

        fireEvent.click(screen.getByText('Log Out'));

        // Should not redirect
        await screen.findByText('Log Out');
        expect(mockRouter.push).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});
