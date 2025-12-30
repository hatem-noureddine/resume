import { render, screen, fireEvent } from '@testing-library/react';
import { SocialLottieIcon } from './SocialLottieIcon';

// Mock the hook
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: jest.fn(() => false),
}));

// Mock Lottie
jest.mock('lottie-react', () => ({
    __esModule: true,
    default: ({ style, ...props }: any) => (
        <div data-testid="lottie-animation" style={style} {...props} />
    ),
}));

// Mock animation files
jest.mock('@/../public/lottie/github-icon.json', () => ({ v: '5.0.0', layers: [] }), { virtual: true });
jest.mock('@/../public/lottie/linkedin-icon.json', () => ({ v: '5.0.0', layers: [] }), { virtual: true });
jest.mock('@/../public/lottie/mail-icon.json', () => ({ v: '5.0.0', layers: [] }), { virtual: true });
jest.mock('@/../public/lottie/download-arrow.json', () => ({ v: '5.0.0', layers: [] }), { virtual: true });

describe('SocialLottieIcon', () => {
    it('renders github icon', () => {
        render(<SocialLottieIcon icon="github" />);
        expect(screen.getByTestId('lottie-animation')).toBeInTheDocument();
    });

    it('renders linkedin icon', () => {
        render(<SocialLottieIcon icon="linkedin" />);
        expect(screen.getByTestId('lottie-animation')).toBeInTheDocument();
    });

    it('renders mail icon', () => {
        render(<SocialLottieIcon icon="mail" />);
        expect(screen.getByTestId('lottie-animation')).toBeInTheDocument();
    });

    it('has accessible label', () => {
        render(<SocialLottieIcon icon="github" ariaLabel="GitHub Profile" />);
        expect(screen.getByLabelText('GitHub Profile')).toBeInTheDocument();
    });

    it('applies custom size', () => {
        render(<SocialLottieIcon icon="github" size={48} />);
        const button = screen.getByRole('button');
        expect(button.style.width).toBe('48px');
        expect(button.style.height).toBe('48px');
    });

    it('handles mouse enter', () => {
        render(<SocialLottieIcon icon="github" />);
        const button = screen.getByRole('button');
        fireEvent.mouseEnter(button);
        expect(button).toBeInTheDocument();
    });

    it('handles mouse leave', () => {
        render(<SocialLottieIcon icon="github" />);
        const button = screen.getByRole('button');
        fireEvent.mouseLeave(button);
        expect(button).toBeInTheDocument();
    });
});
