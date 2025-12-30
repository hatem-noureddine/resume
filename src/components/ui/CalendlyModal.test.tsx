import { render, screen } from '@testing-library/react';
import { CalendlyModal } from './CalendlyModal';

// Mock Modal
jest.mock('./Modal', () => ({
    Modal: ({ isOpen, children, title }: any) => isOpen ? (
        <div data-testid="modal">
            <h1>{title}</h1>
            {children}
        </div>
    ) : null,
}));

// Mock react-calendly
jest.mock('react-calendly', () => ({
    InlineWidget: ({ url }: any) => <div data-testid="calendly-widget" data-url={url} />,
}));

describe('CalendlyModal', () => {
    it('does not render widget when closed', () => {
        render(<CalendlyModal isOpen={false} onClose={jest.fn()} />);
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('renders widget when open', () => {
        render(<CalendlyModal isOpen={true} onClose={jest.fn()} />);
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByText('Schedule a Call')).toBeInTheDocument();
        expect(screen.getByTestId('calendly-widget')).toBeInTheDocument();
    });

    it('uses correct default url', () => {
        render(<CalendlyModal isOpen={true} onClose={jest.fn()} />);
        const widget = screen.getByTestId('calendly-widget');
        expect(widget).toHaveAttribute('data-url', 'https://calendly.com/hatem-noureddine');
    });
});
