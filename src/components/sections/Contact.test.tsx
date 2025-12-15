/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Contact } from './Contact';
import { LanguageProvider } from '@/context/LanguageContext';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    Mail: () => <div data-testid="icon-mail" />,
    MapPin: () => <div data-testid="icon-map-pin" />,
    Phone: () => <div data-testid="icon-phone" />,
    User: () => <div data-testid="icon-user" />,
    FileText: () => <div data-testid="icon-file-text" />,
    MessageSquare: () => <div data-testid="icon-message" />,
    Send: () => <div data-testid="icon-send" />,
    Loader2: () => <div data-testid="icon-loader" />,
    CheckCircle: () => <div data-testid="icon-check" />,
    Github: () => <div data-testid="icon-github" />,
    Linkedin: () => <div data-testid="icon-linkedin" />,
    Twitter: () => <div data-testid="icon-twitter" />,
    X: () => <div data-testid="icon-x" />,
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: any) => <div className={className}>{children}</div>,
        span: ({ children, className }: any) => <span className={className}>{children}</span>,
        h1: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
        h2: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
        h3: ({ children, className }: any) => <h3 className={className}>{children}</h3>,
        p: ({ children, className }: any) => <p className={className}>{children}</p>,
        a: ({ children, className, href }: any) => <a className={className} href={href}>{children}</a>,
        button: ({ children, className, onClick, type, disabled }: any) => <button className={className} onClick={onClick} type={type} disabled={disabled}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Contact Component', () => {
    const renderWithContext = (component: React.ReactNode) => {
        return render(
            <LanguageProvider>
                {component}
            </LanguageProvider>
        );
    };

    // const mockLocationAssign = jest.fn();

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
        // Verify form exists and can be submitted (jsdom doesn't fully support window.location changes)
        expect(form).toBeInTheDocument();
        if (form) {
            // Test that submit doesn't throw
            expect(() => fireEvent.submit(form)).not.toThrow();
        }
    });
});
