import { render, screen } from '@testing-library/react';
import { Comments } from './Comments';
// Mock Theme Context
jest.mock('@/context/ThemeContext', () => ({
    useTheme: jest.fn()
}));

import { useTheme } from '@/context/ThemeContext';

// Mock Giscus component
jest.mock('@giscus/react', () => {
    return function DummyGiscus(props: any) {
        return (
            <div data-testid="giscus-comments">
                Giscus Component
                <span data-testid="giscus-theme">{props.theme}</span>
            </div>
        );
    };
});

// Mock config
const mockSiteConfig = {
    giscus: {
        repo: 'test/repo',
        repoId: '123',
        category: 'General',
        categoryId: '456'
    }
};

jest.mock('@/config/site', () => ({
    get SITE_CONFIG() {
        return mockSiteConfig;
    }
}));

const renderWithTheme = (theme: 'light' | 'dark' | 'system') => {
    (useTheme as jest.Mock).mockReturnValue({ theme });
    return render(<Comments />);
};

describe('Comments Component', () => {
    it('renders the comments section', () => {
        renderWithTheme('light');
        expect(screen.getByRole('region', { name: /comments/i })).toBeInTheDocument();
        expect(screen.getByText('Comments')).toBeInTheDocument();
        expect(screen.getByTestId('giscus-comments')).toBeInTheDocument();
    });

    it('passes light theme to Giscus when current theme is light', () => {
        renderWithTheme('light');
        expect(screen.getByTestId('giscus-theme')).toHaveTextContent('light');
    });

    it('passes dark theme to Giscus when current theme is dark', () => {
        renderWithTheme('dark');
        expect(screen.getByTestId('giscus-theme')).toHaveTextContent('dark');
    });

    it('does not render if repo config is missing', () => {
        // Temporarily clear repo
        const originalRepo = mockSiteConfig.giscus.repo;
        mockSiteConfig.giscus.repo = '' as any;

        renderWithTheme('light');
        expect(screen.queryByText('Comments')).not.toBeInTheDocument();

        // Restore
        mockSiteConfig.giscus.repo = originalRepo;
    });
});
