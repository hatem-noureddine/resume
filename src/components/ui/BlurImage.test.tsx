import { render, screen, fireEvent } from '@testing-library/react';
import { BlurImage } from './BlurImage';

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: { src: string; alt: string; className?: string; onLoad?: () => void; fill?: boolean }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={props.src}
            alt={props.alt}
            className={props.className}
            data-testid="blur-image"
            onLoad={props.onLoad}
        />
    ),
}));

describe('BlurImage', () => {
    it('renders image with src and alt', () => {
        render(<BlurImage src="/test-image.jpg" alt="Test Image" />);

        const img = screen.getByTestId('blur-image');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', '/test-image.jpg');
        expect(img).toHaveAttribute('alt', 'Test Image');
    });

    it('applies custom className', () => {
        render(<BlurImage src="/test.jpg" alt="Test" className="custom-class" />);

        const img = screen.getByTestId('blur-image');
        expect(img).toHaveClass('custom-class');
    });

    it('handles image load event', () => {
        render(<BlurImage src="/test.jpg" alt="Test" />);

        const img = screen.getByTestId('blur-image');

        // Trigger onLoad event
        fireEvent.load(img);

        // Image should still be rendered
        expect(img).toBeInTheDocument();
    });

    it('renders with fill prop', () => {
        render(<BlurImage src="/test.jpg" alt="Test" fill />);
        expect(screen.getByTestId('blur-image')).toBeInTheDocument();
    });

    it('renders with width and height props', () => {
        render(<BlurImage src="/test.jpg" alt="Test" width={200} height={100} />);
        expect(screen.getByTestId('blur-image')).toBeInTheDocument();
    });
});
