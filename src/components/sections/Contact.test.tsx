import { render, screen, fireEvent } from '@testing-library/react';
import { Contact } from './Contact';
import { LanguageProvider } from '@/context/LanguageContext';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    Mail: () => <div data-testid="icon-mail" />,
    MapPin: () => <div data-testid="icon-map-pin" />,
    Phone: () => <div data-testid="icon-phone" />
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: any) => <div className={className}>{children}</div>,
    }
}));

describe('Contact Component', () => {
    const renderWithContext = (component: React.ReactNode) => {
        return render(
            <LanguageProvider>
                {component}
            </LanguageProvider>
        );
    };

    const mockLocationAssign = jest.fn();

    beforeAll(() => {
        // Mock window.location
        Object.defineProperty(window, 'location', {
            value: {
                href: '',
            },
            writable: true
        });
    });

    it('renders contact information', () => {
        renderWithContext(<Contact />);
        expect(screen.getByText('Contact Me')).toBeInTheDocument();
        // Email might be in a link, so we check for it loosely or by role if needed, but getByText is fine if it's visible text.
        // It is in <a href...>email</a>
        expect(screen.getAllByText('hatem.noureddine.pro@gmail.com')[0]).toBeInTheDocument();
    });

    it('renders contact form fields', () => {
        renderWithContext(<Contact />);
        expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Project Inquiry')).toBeInTheDocument();
    });

    it('submits form with mailto link', () => {
        renderWithContext(<Contact />);

        fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText('john@example.com'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Project Inquiry'), { target: { value: 'Test Subject' } });
        fireEvent.change(screen.getByPlaceholderText('Tell me about your project...'), { target: { value: 'Test Message' } });

        const form = screen.getByPlaceholderText('John Doe').closest('form');
        if (form) {
            fireEvent.submit(form);
            // Verify window.location.href was updated (checking logic, mostly relying on implementation correctness here as jsdom window.location behavior varies)
            expect(window.location.href).toContain('mailto:');
            expect(window.location.href).toContain('Test%20Subject');
        }
    });
});
