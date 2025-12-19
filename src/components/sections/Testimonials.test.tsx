import { render, screen, fireEvent, act } from '@testing-library/react';
import { Testimonials, Testimonial } from './Testimonials';

jest.mock('@/components/ui/SectionHeading', () => ({
    SectionHeading: ({ title }: any) => <div data-testid="section-heading">{title}</div>
}));

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: any) => <div className={className}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

jest.mock('lucide-react', () => ({
    Quote: () => <div data-testid="icon-quote" />,
    ChevronLeft: () => <div data-testid="icon-chevron-left" />,
    ChevronRight: () => <div data-testid="icon-chevron-right" />,
    Star: () => <div data-testid="icon-star" />,
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
            testimonials: {
                title: 'What Clients Say',
                subtitle: 'Testimonials from clients',
            }
        },
        language: 'en',
    }),
}));

const mockTestimonials: Testimonial[] = [
    {
        author: 'John Doe',
        role: 'CEO',
        company: 'Tech Solutions',
        content: 'Great work on the project!',
        rating: 5,
        language: 'en'
    },
    {
        author: 'Jane Smith',
        role: 'Product Manager',
        company: 'Innovative Apps',
        content: 'Very professional and talented.',
        rating: 4,
        language: 'en'
    }
];

describe('Testimonials Component', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders the section heading', () => {
        render(<Testimonials items={mockTestimonials} />);
        expect(screen.getByTestId('section-heading')).toBeInTheDocument();
    });

    it('renders the first testimonial initially', () => {
        render(<Testimonials items={mockTestimonials} />);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText(/Great work on the project!/)).toBeInTheDocument();
    });

    it('navigates to next testimonial on clicking next button', () => {
        render(<Testimonials items={mockTestimonials} />);
        const nextButton = screen.getByLabelText('Next testimonial');
        fireEvent.click(nextButton);
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText(/Very professional and talented./)).toBeInTheDocument();
    });

    it('navigates to previous testimonial on clicking prev button', () => {
        render(<Testimonials items={mockTestimonials} />);
        const prevButton = screen.getByLabelText('Previous testimonial');
        fireEvent.click(prevButton); // Goes to the last item
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('auto-plays to next testimonial after interval', () => {
        render(<Testimonials items={mockTestimonials} />);
        expect(screen.getByText('John Doe')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(8000);
        });

        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('renders indicators and handles click', () => {
        render(<Testimonials items={mockTestimonials} />);
        const indicator = screen.getByLabelText('Go to slide 2');
        fireEvent.click(indicator);
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('returns null when items is empty', () => {
        const { container } = render(<Testimonials items={[]} />);
        expect(container.firstChild).toBeNull();
    });

    it('only renders one testimonial at a time', () => {
        render(<Testimonials items={mockTestimonials} />);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
});
