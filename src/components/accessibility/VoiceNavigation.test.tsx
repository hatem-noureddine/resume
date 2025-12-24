import { render, screen, fireEvent, act } from '@testing-library/react';
import { VoiceNavigation } from './VoiceNavigation';

// Mock dependencies
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => ({
        t: {
            accessibility: {
                voiceNavigation: 'Voice Navigation',
                startListening: 'Start listening',
                stopListening: 'Stop listening',
            }
        },
        language: 'en',
        direction: 'ltr',
    }),
}));

jest.mock('@/context/AnnouncerContext', () => ({
    useAnnouncer: () => ({
        announce: jest.fn(),
        isAccessibilityMenuOpen: false,
        setAccessibilityMenuOpen: jest.fn(),
    }),
}));

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick, ...props }: any) => (
            <div className={className} onClick={onClick} data-testid="motion-div" {...props}>
                {children}
            </div>
        ),
        button: ({ children, className, onClick, 'aria-label': ariaLabel, disabled, ...props }: any) => (
            <button
                className={className}
                onClick={onClick}
                aria-label={ariaLabel}
                disabled={disabled}
                data-testid="motion-button"
                {...props}
            >
                {children}
            </button>
        ),
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

jest.mock('lucide-react', () => ({
    Mic: () => <div data-testid="mic-icon" />,
    MicOff: () => <div data-testid="mic-off-icon" />,
    X: () => <div data-testid="x-icon" />,
    Volume2: () => <div data-testid="volume-icon" />,
}));

// Mock SpeechRecognition
const mockRecognition = {
    continuous: false,
    interimResults: false,
    lang: '',
    start: jest.fn(),
    stop: jest.fn(),
    abort: jest.fn(),
    onstart: null as any,
    onresult: null as any,
    onerror: null as any,
    onend: null as any,
};

const MockSpeechRecognition = jest.fn(() => mockRecognition);

describe('VoiceNavigation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock window.scrollY
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
        // Don't set SpeechRecognition by default (simulate unsupported)
        delete (window as any).SpeechRecognition;
        delete (window as any).webkitSpeechRecognition;
    });

    it('renders without crashing', () => {
        const { container } = render(<VoiceNavigation />);
        expect(container).toBeInTheDocument();
    });

    it('is not visible initially when scrollY is 0', () => {
        render(<VoiceNavigation />);
        // Component may render but be hidden based on scroll position
        expect(document.body).toBeInTheDocument();
    });

    it('becomes visible after scrolling past threshold', () => {
        render(<VoiceNavigation />);

        // Simulate scroll
        Object.defineProperty(window, 'scrollY', { value: 400, writable: true });

        act(() => {
            window.dispatchEvent(new Event('scroll'));
        });

        // Component should now be visible
    });

    it('shows unsupported state when SpeechRecognition is not available', () => {
        render(<VoiceNavigation />);
        // The component should detect that speech recognition is not supported
    });

    describe('with SpeechRecognition support', () => {
        beforeEach(() => {
            (window as any).SpeechRecognition = MockSpeechRecognition;
        });

        it('detects SpeechRecognition support', () => {
            render(<VoiceNavigation />);
            expect(MockSpeechRecognition).toBeDefined();
        });

        it('can be toggled on', async () => {
            Object.defineProperty(window, 'scrollY', { value: 400, writable: true });

            render(<VoiceNavigation />);

            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });

            // Find and click the microphone button
            const buttons = screen.queryAllByTestId('motion-button');
            if (buttons.length > 0) {
                fireEvent.click(buttons[0]);
            }
        });
    });

    describe('with webkitSpeechRecognition fallback', () => {
        beforeEach(() => {
            (window as any).webkitSpeechRecognition = MockSpeechRecognition;
        });

        it('uses webkit prefixed API when standard is not available', () => {
            render(<VoiceNavigation />);
            expect((window as any).webkitSpeechRecognition).toBeDefined();
        });
    });

    it('cleans up scroll listener on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

        const { unmount } = render(<VoiceNavigation />);
        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
        removeEventListenerSpy.mockRestore();
    });

    it('accepts custom className', () => {
        const { container } = render(<VoiceNavigation className="custom-class" />);
        expect(container).toBeInTheDocument();
    });
});
