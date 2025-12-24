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
        const { container } = render(<VercelAnalytics />);
        expect(container).toBeInTheDocument();
    });

    it('includes Analytics component', () => {
        const { getByTestId } = render(<VercelAnalytics />);
        expect(getByTestId('vercel-analytics')).toBeInTheDocument();
    });

    it('includes SpeedInsights component', () => {
        const { getByTestId } = render(<VercelAnalytics />);
        expect(getByTestId('speed-insights')).toBeInTheDocument();
    });
});
