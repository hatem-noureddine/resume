import { render, screen } from '@testing-library/react';
import { Comments } from './Comments';

// Mock useTheme
jest.mock('@/context/ThemeContext', () => ({
    useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}));

// Mock Giscus
jest.mock('@giscus/react', () => ({
    __esModule: true,
    default: ({ id, repo }: { id: string; repo: string }) => (
        <div data-testid="giscus" data-id={id} data-repo={repo}>
            Giscus Comments
        </div>
    ),
}));

describe('Comments', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
            NEXT_PUBLIC_GISCUS_REPO: 'hatem-noureddine/resume',
            NEXT_PUBLIC_GISCUS_REPO_ID: 'R_123',
            NEXT_PUBLIC_GISCUS_CATEGORY: 'Blog Comments',
            NEXT_PUBLIC_GISCUS_CATEGORY_ID: 'DIC_123',
        };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('renders comments section when configured', () => {
        render(<Comments slug="test-post" />);
        expect(screen.getByText('Comments')).toBeInTheDocument();
    });

    it('renders Giscus component with correct props', () => {
        render(<Comments slug="test-post" />);
        const giscus = screen.getByTestId('giscus');
        expect(giscus).toBeInTheDocument();
    });

    it('returns null when repo is not configured', () => {
        process.env.NEXT_PUBLIC_GISCUS_REPO = '';
        const { container } = render(<Comments slug="test-post" />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when repoId is not configured', () => {
        process.env.NEXT_PUBLIC_GISCUS_REPO_ID = '';
        const { container } = render(<Comments slug="test-post" />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when categoryId is not configured', () => {
        process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID = '';
        const { container } = render(<Comments slug="test-post" />);
        expect(container.firstChild).toBeNull();
    });
});
