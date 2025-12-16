
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Contact } from './Contact';
import { LanguageProvider } from '@/context/LanguageContext';

// Mock Formspree
const mockHandleSubmit = jest.fn();
jest.mock('@formspree/react', () => ({
    useForm: jest.fn(() => [{ submitting: false, succeeded: false, errors: [] }, mockHandleSubmit]),
    ValidationError: () => <div />
}));

// Mock UI Components
jest.mock('@/components/ui/SectionHeading', () => ({
    SectionHeading: ({ title, subtitle }: any) => <div data-testid="section-heading">{title} {subtitle}</div>
}));

jest.mock('@/components/ui/Button', () => ({
    Button: ({ children, disabled, className, ...props }: any) => (
        <button disabled={disabled} className={className} {...props}>
            {children}
        </button>
    )
}));

// Mock Language
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => ({
        t: {
            contact: {
                title: 'Contact Me',
                subtitle: 'Get in Touch',
                introTitle: 'Let\'s Talk',
                introDescription: 'I am available for freelance work.',
                address: 'Tunis, Tunisia',
                addressLabel: 'Location',
                email: 'hatem.noureddine.pro@gmail.com',
                emailLabel: 'Email',
                phone: '+216 12 345 678',
                phoneLabel: 'Phone',
                followMe: 'Follow me',
                form: {
                    name: 'Name',
                    email: 'Email',
                    subject: 'Subject',
                    message: 'Message',
                    send: 'Send Message',
                    success: 'Message sent successfully!',
                    validation: {
                        required: 'Required',
                        emailInvalid: 'Invalid email'
                    }
                }
            }
        },
        language: 'en'
    }),
    LanguageProvider: ({ children }: any) => <div>{children}</div>
}));

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
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: any) => <div className={className}>{children}</div>,
        a: ({ children, className, href }: any) => <a className={className} href={href}>{children}</a>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Contact Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders contact form fields', () => {
        render(<Contact />);
        expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Project Inquiry')).toBeInTheDocument();
    });

    it('submits form using Formspree', async () => {
        render(<Contact />);

        fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText('john@example.com'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Project Inquiry'), { target: { value: 'Test Subject' } });
        fireEvent.change(screen.getByPlaceholderText('Tell me about your project...'), { target: { value: 'Test Message' } });

        const form = screen.getByPlaceholderText('John Doe').closest('form');
        if (form) {
            fireEvent.submit(form);
            await waitFor(() => {
                expect(mockHandleSubmit).toHaveBeenCalled();
            });
        }
    });

    it('displays validation errors', async () => {
        render(<Contact />);

        const form = screen.getByPlaceholderText('John Doe').closest('form');
        if (form) {
            // Submit empty form
            fireEvent.submit(form);

            // Wait for validation error to appear (it's handled in onBlur in the component, but let's trigger blur)
            fireEvent.blur(screen.getByPlaceholderText('John Doe'));

            await waitFor(() => {
                expect(screen.getByText('Required')).toBeInTheDocument();
            });
        }
    });
});
