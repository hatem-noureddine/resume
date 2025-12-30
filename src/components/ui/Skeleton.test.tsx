import { render, screen } from '@testing-library/react';
import { Skeleton, ImageWithSkeleton } from './Skeleton';

describe('Skeleton', () => {
    it('renders with default variant', () => {
        render(<Skeleton />);
        const skeleton = document.querySelector('.skeleton-box');
        expect(skeleton).toBeInTheDocument();
    });

    it('renders text variant', () => {
        render(<Skeleton variant="text" />);
        const skeleton = document.querySelector('.skeleton-text');
        expect(skeleton).toBeInTheDocument();
    });

    it('renders circle variant', () => {
        render(<Skeleton variant="circle" />);
        const skeleton = document.querySelector('.skeleton-circle');
        expect(skeleton).toBeInTheDocument();
    });

    it('applies custom width and height', () => {
        render(<Skeleton width={200} height={100} />);
        const skeleton = document.querySelector('.skeleton-box');
        expect(skeleton).toHaveStyle({ width: '200px', height: '100px' });
    });

    it('applies custom className', () => {
        render(<Skeleton className="custom-class" />);
        const skeleton = document.querySelector('.custom-class');
        expect(skeleton).toBeInTheDocument();
    });

    it('has aria-hidden for accessibility', () => {
        render(<Skeleton />);
        const skeleton = document.querySelector('.skeleton-box');
        expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    });
});

describe('ImageWithSkeleton', () => {
    it('renders image', () => {
        render(<ImageWithSkeleton src="/test.jpg" alt="Test image" width={300} height={200} />);
        const image = screen.getByAltText('Test image');
        expect(image).toBeInTheDocument();
    });

    it('shows skeleton initially', () => {
        render(<ImageWithSkeleton src="/test.jpg" alt="Test" width={300} height={200} />);
        const skeleton = document.querySelector('.skeleton-box');
        expect(skeleton).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <ImageWithSkeleton src="/test.jpg" alt="Test" className="custom-wrapper" />
        );
        expect(container.firstChild).toHaveClass('custom-wrapper');
    });

    it('renders with fill prop', () => {
        render(<ImageWithSkeleton src="/test.jpg" alt="Test" fill />);
        const image = screen.getByAltText('Test');
        expect(image).toBeInTheDocument();
    });
});
