import { render } from '@testing-library/react';
import { ParticleBackground } from './ParticleBackground';

// Mock the hook
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: jest.fn(() => false),
}));

// Mock HTML canvas
beforeAll(() => {
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
        fillRect: jest.fn(),
        clearRect: jest.fn(),
        getImageData: jest.fn(),
        putImageData: jest.fn(),
        createImageData: jest.fn(),
        setTransform: jest.fn(),
        drawImage: jest.fn(),
        save: jest.fn(),
        restore: jest.fn(),
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        closePath: jest.fn(),
        stroke: jest.fn(),
        fill: jest.fn(),
        arc: jest.fn(),
        translate: jest.fn(),
        scale: jest.fn(),
        rotate: jest.fn(),
        measureText: jest.fn(() => ({ width: 0 })),
    })) as any;
});

describe('ParticleBackground', () => {
    it('renders without crashing', () => {
        const { container } = render(<ParticleBackground />);
        expect(container).toBeInTheDocument();
    });

    it('renders a canvas element', () => {
        const { container } = render(<ParticleBackground />);
        const canvas = container.querySelector('canvas');
        expect(canvas).toBeInTheDocument();
    });

    it('can be imported', () => {
        expect(ParticleBackground).toBeDefined();
        expect(typeof ParticleBackground).toBe('function');
    });
});
