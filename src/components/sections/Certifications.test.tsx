import { render, screen } from '@testing-library/react';
import { Certifications, Certification } from './Certifications';

jest.mock('@/components/ui/SectionHeading', () => ({
    SectionHeading: ({ title, subtitle }: any) => (
        <div data-testid="section-heading">
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </div>
    )
}));

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: any) => <div className={className}>{children}</div>,
        span: ({ children, className }: any) => <span className={className}>{children}</span>,
        h3: ({ children, className }: any) => <h3 className={className}>{children}</h3>,
    }
}));

jest.mock('lucide-react', () => ({
    ExternalLink: () => <div data-testid="icon-external-link" />,
    Award: () => <div data-testid="icon-award" />,
    Calendar: () => <div data-testid="icon-calendar" />,
    ShieldCheck: () => <div data-testid="icon-shield-check" />,
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} alt={props.alt || ''} />,
}));

// Mock usePrefersReducedMotion
jest.mock('@/hooks/usePrefersReducedMotion', () => ({
    usePrefersReducedMotion: () => false
}));

// Mock LanguageContext
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => ({
        t: {
            certifications: {
                title: 'Certifications & Badges',
                subtitle: 'My certifications',
                verify: 'Verify Credential',
                issued: 'Issued',
            }
        },
        language: 'en',
    }),
}));

const mockCertifications: Certification[] = [
    {
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023-01-01',
        credentialId: 'AWS-123',
        credentialUrl: 'https://aws.amazon.com/verify/123',
        badge: 'https://example.com/aws-badge.png',
        category: 'cloud',
        language: 'en',
    },
    {
        name: 'Professional Scrum Master I',
        issuer: 'Scrum.org',
        date: '2022-05-15',
        category: 'other',
        language: 'en',
    }
];

describe('Certifications Component', () => {
    it('renders the section heading', () => {
        render(<Certifications items={mockCertifications} />);
        expect(screen.getByTestId('section-heading')).toBeInTheDocument();
        expect(screen.getByText('Certifications & Badges')).toBeInTheDocument();
    });

    it('renders all certification items', () => {
        render(<Certifications items={mockCertifications} />);
        expect(screen.getByText('AWS Certified Solutions Architect')).toBeInTheDocument();
        expect(screen.getByText('Professional Scrum Master I')).toBeInTheDocument();
        expect(screen.getByText('Amazon Web Services')).toBeInTheDocument();
        expect(screen.getByText('Scrum.org')).toBeInTheDocument();
    });

    it('renders badges when provided', () => {
        render(<Certifications items={mockCertifications} />);
        const images = screen.getAllByRole('img');
        expect(images.some(img => img.getAttribute('src') === 'https://example.com/aws-badge.png')).toBe(true);
    });

    it('renders fallback icon when badge is missing', () => {
        render(<Certifications items={mockCertifications} />);
        // The second cert has no badge, so it should show the Award icon
        expect(screen.getByTestId('icon-award')).toBeInTheDocument();
    });

    it('renders verification link when credentialUrl is provided', () => {
        render(<Certifications items={mockCertifications} />);
        const verifyLink = screen.getByText('Verify Credential');
        expect(verifyLink.closest('a')).toHaveAttribute('href', 'https://aws.amazon.com/verify/123');
    });

    it('returns null when items is empty', () => {
        const { container } = render(<Certifications items={[]} />);
        expect(container.firstChild).toBeNull();
    });

    it('formats date correctly', () => {
        render(<Certifications items={mockCertifications} />);
        // "Issued: January 2023" (depending on locale, but let's check part of it)
        expect(screen.getByText(/2023/)).toBeInTheDocument();
    });
});
