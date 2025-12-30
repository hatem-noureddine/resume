import { render, screen } from '@testing-library/react';
import { Portfolio } from './Portfolio';

// Mock Language
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => ({
        t: {
            portfolio: {
                title: 'My Projects',
                items: [
                    { id: 1, title: 'Project 1', category: 'Web', image: '/img1.png', link: '#' }
                ]
            }
        },
        language: 'en'
    }),
    LanguageProvider: ({ children }: any) => <div>{children}</div>
}));

jest.mock('@/components/ui/SectionHeading', () => ({
    SectionHeading: ({ title }: any) => <div>{title}</div>
}));

jest.mock('@/components/ui/Button', () => ({
    Button: ({ children }: any) => <button>{children}</button>
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children }: any) => <a href="#">{children}</a>,
}));

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: any) => <div className={className}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

jest.mock('lucide-react', () => ({
    ExternalLink: () => <div />,
    Github: () => <div />,
    ArrowRight: () => <div data-testid="arrow-right" />,
    ArrowUpRight: () => <div data-testid="arrow-up-right" />,
}));

jest.mock('next/image', () => ({
    __esModule: true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @next/next/no-img-element
    default: ({ fill, ...props }: any) => <img {...props} alt={props.alt || ''} />,
}));

jest.mock('@/components/sections/ClientCarousel', () => ({
    ClientCarousel: () => <div data-testid="client-carousel" />
}));

describe('Portfolio Component', () => {
    it('renders portfolio projects', () => {
        render(<Portfolio />);
        expect(screen.getByText('My Projects')).toBeInTheDocument();
        expect(screen.getByText('Project 1')).toBeInTheDocument();
    });
});
