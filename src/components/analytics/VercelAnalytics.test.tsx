import { render } from '@testing-library/react';
import { VercelAnalytics } from './VercelAnalytics';

// Mock both Vercel packages
jest.mock('@vercel/analytics/next', () => ({
    Analytics: () => <div data-testid="vercel-analytics" />,
}));

jest.mock('@vercel/speed-insights/next', () => ({
    SpeedInsights: () => <div data-testid="speed-insights" />,
}));

describe('VercelAnalytics', () => {
    it('renders without crashing', () => {
        // In test environment (NODE_ENV !== "production"), component returns null initially
        // This test verifies the component doesn't throw errors
        const { container } = render(<VercelAnalytics />);
        expect(container).toBeInTheDocument();
    });

    it('returns null when not mounted (initial render)', () => {
        const { container } = render(<VercelAnalytics />);
        // Component returns null on initial render before requestAnimationFrame callback
        expect(container.innerHTML).toBe('');
    });
});

