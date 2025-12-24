import { render, screen } from '@testing-library/react';
import { Hero3D } from './Hero3D';

// Mock @react-three/fiber
jest.mock('@react-three/fiber', () => ({
    Canvas: ({ children }: any) => <div data-testid="canvas">{children}</div>,
    useFrame: () => { },
    useThree: () => ({ viewport: { width: 10, height: 10 } }),
}));

// Mock @react-three/drei
jest.mock('@react-three/drei', () => ({
    Points: ({ children }: any) => <div data-testid="points">{children}</div>,
    PointMaterial: () => <div data-testid="point-material" />,
}));

// Mock THREE
jest.mock('three', () => ({
    Points: jest.fn(),
}));

describe('Hero3D', () => {
    it('renders without crashing', () => {
        const { container } = render(<Hero3D />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('renders Canvas component', () => {
        render(<Hero3D />);
        expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('has absolute positioning', () => {
        const { container } = render(<Hero3D />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('absolute');
    });

    it('covers full container', () => {
        const { container } = render(<Hero3D />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('inset-0');
    });

    it('has pointer-events-none', () => {
        const { container } = render(<Hero3D />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('pointer-events-none');
    });

    it('renders particle points', () => {
        render(<Hero3D />);
        const points = screen.getAllByTestId('points');
        expect(points.length).toBeGreaterThan(0);
    });
});
