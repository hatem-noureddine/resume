import { render, screen, fireEvent } from '@testing-library/react';
import { FontSizeControls } from './FontSizeControls';

// Mock ThemeContext
const mockSetFontSize = jest.fn();
let mockFontSize: 'small' | 'medium' | 'large' = 'medium';

jest.mock('@/context/ThemeContext', () => ({
    useTheme: () => ({
        fontSize: mockFontSize,
        setFontSize: mockSetFontSize,
        highContrast: false,
        setHighContrast: jest.fn(),
        theme: 'light',
        setTheme: jest.fn(),
    }),
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
    Minus: () => <div data-testid="icon-minus" />,
    Plus: () => <div data-testid="icon-plus" />,
    Type: () => <div data-testid="icon-type" />,
}));

describe('FontSizeControls', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFontSize = 'medium';
    });

    it('renders all controls', () => {
        render(<FontSizeControls />);
        expect(screen.getByLabelText('Decrease font size')).toBeInTheDocument();
        expect(screen.getByLabelText('Increase font size')).toBeInTheDocument();
        expect(screen.getByText('medium')).toBeInTheDocument();
    });

    it('displays current font size', () => {
        mockFontSize = 'large';
        render(<FontSizeControls />);
        expect(screen.getByText('large')).toBeInTheDocument();
    });

    it('calls setFontSize with smaller size when decrease clicked', () => {
        mockFontSize = 'medium';
        render(<FontSizeControls />);
        fireEvent.click(screen.getByLabelText('Decrease font size'));
        expect(mockSetFontSize).toHaveBeenCalledWith('small');
    });

    it('calls setFontSize with larger size when increase clicked', () => {
        mockFontSize = 'medium';
        render(<FontSizeControls />);
        fireEvent.click(screen.getByLabelText('Increase font size'));
        expect(mockSetFontSize).toHaveBeenCalledWith('large');
    });

    it('disables decrease button at smallest size', () => {
        mockFontSize = 'small';
        render(<FontSizeControls />);
        const decreaseBtn = screen.getByLabelText('Decrease font size');
        expect(decreaseBtn).toBeDisabled();
    });

    it('disables increase button at largest size', () => {
        mockFontSize = 'large';
        render(<FontSizeControls />);
        const increaseBtn = screen.getByLabelText('Increase font size');
        expect(increaseBtn).toBeDisabled();
    });
});
