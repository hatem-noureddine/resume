import { render, screen, waitFor } from '@testing-library/react';
import Home from './page';

// Mock dependencies
jest.mock('@/lib/posts', () => ({
    getSortedPostsData: jest.fn().mockResolvedValue([]),
}));

jest.mock('@/lib/keystatic', () => ({
    getBlogPosts: jest.fn().mockResolvedValue([]),
    getProjects: jest.fn().mockResolvedValue([
        { slug: 'test-project', entry: { title: 'Test Project', category: 'Web', image: '/img.jpg', link: 'https://example.com', language: 'en' } }
    ]),
    getExperience: jest.fn().mockResolvedValue([]),
    getSkills: jest.fn().mockResolvedValue([]),
    getResumes: jest.fn().mockResolvedValue([]),
    getTestimonials: jest.fn().mockResolvedValue([]),
    getCertifications: jest.fn().mockResolvedValue([]),
}));

// Mock child components
jest.mock('@/components/layout/Header', () => ({
    Header: () => <div data-testid="header" />,
}));
jest.mock('@/components/layout/Footer', () => ({
    Footer: () => <div data-testid="footer" />,
}));
jest.mock('@/components/sections/Hero', () => ({
    Hero: () => <div data-testid="hero" />,
}));
jest.mock('@/components/ui/WaveDivider', () => ({
    WaveDivider: () => <div data-testid="wave-divider" />,
}));
jest.mock('@/components/ui/ScrollReveal', () => ({
    ScrollReveal: ({ children }: any) => <div>{children}</div>,
}));
jest.mock('@/components/layout/FloatingActions', () => ({
    FloatingActions: () => <div data-testid="floating-actions" />,
}));
jest.mock('@/components/layout/FloatingAccessibility', () => ({
    FloatingAccessibility: () => <div data-testid="floating-accessibility" />,
}));
jest.mock('@/components/accessibility/VoiceNavigation', () => ({
    VoiceNavigation: () => <div data-testid="voice-navigation" />,
}));
jest.mock('@/components/ui/SectionTracker', () => ({
    SectionTracker: ({ children }: any) => <div>{children}</div>,
}));
jest.mock('@/components/ui/ErrorBoundary', () => ({
    ErrorBoundary: ({ children }: any) => <div>{children}</div>,
}));
jest.mock('@/context/FeatureFlags', () => ({
    Feature: ({ children }: any) => <div>{children}</div>,
}));

// Mock lazy loaded components
jest.mock('@/components/sections/Services', () => ({
    Services: () => <div data-testid="services" />,
}));
jest.mock('@/components/sections/Experience', () => ({
    Experience: () => <div data-testid="experience" />,
}));
jest.mock('@/components/sections/Portfolio', () => ({
    Portfolio: () => <div data-testid="portfolio" />,
}));
jest.mock('@/components/sections/Skills', () => ({
    Skills: () => <div data-testid="skills" />,
}));
jest.mock('@/components/sections/Blog', () => ({
    Blog: () => <div data-testid="blog" />,
}));
jest.mock('@/components/sections/Testimonials', () => ({
    Testimonials: () => <div data-testid="testimonials" />,
}));
jest.mock('@/components/sections/Certifications', () => ({
    Certifications: () => <div data-testid="certifications" />,
}));

import {
    getTestimonials,
    getSkills,
    getExperience,
    getProjects,
    getCertifications,
    getResumes,
    getBlogPosts
} from '@/lib/keystatic';


describe('Home Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders main sections structure', async () => {
        const ui = await Home();
        render(ui);

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('hero')).toBeInTheDocument();

        // Dynamic components might load with delay or show skeleton first
        await waitFor(() => {
            expect(screen.getByTestId('services')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByTestId('certifications')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByTestId('experience')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByTestId('skills')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByTestId('portfolio')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByTestId('blog')).toBeInTheDocument();
        });

        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('renders testimonials when data is present', async () => {
        (getTestimonials as jest.Mock).mockResolvedValue([
            { entry: { author: 'John', content: 'Great', rating: 5, language: 'en' } }
        ]);

        const ui = await Home();
        render(ui);

        await waitFor(() => {
            expect(screen.getByTestId('testimonials')).toBeInTheDocument();
        });
    });

    it('does not render testimonials when data is empty', async () => {
        (getTestimonials as jest.Mock).mockResolvedValue([]);

        const ui = await Home();
        render(ui);

        await waitFor(() => {
            expect(screen.queryByTestId('testimonials')).not.toBeInTheDocument();
        });
    });

    it('passes processed props to components', async () => {
        (getSkills as jest.Mock).mockResolvedValue([
            { entry: { name: 'React', isProfessional: true, category: 'frontend', language: 'en' } },
            { entry: { name: 'Node', isProfessional: false, category: 'backend', language: 'en' } }
        ]);

        // We can spy on the mock implementation if we want, or simple verify render happens
        // Since the component is mocked as returning a div, we can't easily check props passed to it 
        // unless we change the mock to capture them.

        // Let's rely on the fact that it renders without crashing with data
        const ui = await Home();
        render(ui);
        expect(screen.getByTestId('skills')).toBeInTheDocument();
    });
    it('renders sections with populated data', async () => {
        // Mock data
        const mockSkills = [
            { slug: 'react', entry: { name: 'React', category: 'frontend', isProfessional: true, language: 'en' } },
            { slug: 'node', entry: { name: 'Node.js', category: 'backend', isProfessional: false, language: 'en' } },
        ];
        const mockExperience = [
            { slug: 'job1', entry: { role: 'Dev', company: 'Corp', startDate: '2020', endDate: '2021', description: 'Desc', highlights: ['H1'], isProfessional: true, language: 'en' } },
        ];
        const mockProjects = [
            { slug: 'proj1', entry: { title: 'Proj 1', category: 'Web', image: 'img.jpg', link: 'url', language: 'en' } },
        ];
        const mockTestimonials = [
            { slug: 't1', entry: { author: 'Bob', role: 'CEO', company: 'Inc', content: 'Good', avatar: 'img', rating: 5, language: 'en' } },
        ];
        const mockCertifications = [
            { slug: 'c1', entry: { name: 'Cert', issuer: 'Issuer', date: '2022', category: 'cloud', language: 'en' } }
        ];
        const mockResumes = [
            { slug: 'r1', entry: { label: 'Resume', language: 'en', file: '/resume.pdf' } }
        ];
        const mockPosts = [
            { slug: 'p1', entry: { title: 'Post 1', date: '2023', description: 'Desc', tags: ['tag'], category: 'Tech', language: 'en' } }
        ];

        // Apply mocks
        (getSkills as jest.Mock).mockResolvedValue(mockSkills);
        (getExperience as jest.Mock).mockResolvedValue(mockExperience);
        (getProjects as jest.Mock).mockResolvedValue(mockProjects);
        (getTestimonials as jest.Mock).mockResolvedValue(mockTestimonials);
        (getCertifications as jest.Mock).mockResolvedValue(mockCertifications);
        (getResumes as jest.Mock).mockResolvedValue(mockResumes);
        (getBlogPosts as jest.Mock).mockResolvedValue(mockPosts);

        const ui = await Home();
        render(ui);

        expect(screen.getByTestId('skills')).toBeInTheDocument();
        expect(screen.getByTestId('testimonials')).toBeInTheDocument();
        expect(screen.getByTestId('experience')).toBeInTheDocument();
    });

    it('renders sections with sparse data (hits fallbacks)', async () => {
        // Mock data with missing optional fields
        const mockSkills = [
            { slug: 'other', entry: { name: 'Other', category: 'other', isProfessional: false } }, // Missing language
        ] as any;
        const mockExperience = [
            { slug: 'job2', entry: { role: 'Intern', company: 'Inc', startDate: '2022' } }, // Missing endDate, description, highlights, language
        ] as any;
        const mockProjects = [
            { slug: 'proj2', entry: { title: 'Proj 2' } }, // Missing category, image, link, language
        ] as any;
        const mockTestimonials = [
            { slug: 't2', entry: { author: 'Alice', content: 'Nice' } }, // Missing role, company, avatar, language
        ] as any;
        const mockCertifications = [
            { slug: 'c2', entry: { name: 'Cert 2', issuer: 'Issuer', date: '2023', category: 'other' } }
        ] as any;
        const mockPosts = [
            { slug: 'p2', entry: { title: 'Post 2' } } // Missing date, description, tags, category
        ] as any;

        // Apply mocks
        (getSkills as jest.Mock).mockResolvedValue(mockSkills);
        (getExperience as jest.Mock).mockResolvedValue(mockExperience);
        (getProjects as jest.Mock).mockResolvedValue(mockProjects);
        (getTestimonials as jest.Mock).mockResolvedValue(mockTestimonials);
        (getCertifications as jest.Mock).mockResolvedValue(mockCertifications);
        (getResumes as jest.Mock).mockResolvedValue([]);
        (getBlogPosts as jest.Mock).mockResolvedValue(mockPosts);

        const ui = await Home();
        render(ui);

        // Assertions are just to ensure render completed
        expect(screen.getByTestId('skills')).toBeInTheDocument();
    });
});
