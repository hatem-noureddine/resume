// Locale Types - Comprehensive TypeScript definitions for translations
import { StaticImageData } from "next/image";

export interface NavItem {
    name: string;
    href: string;
}

export interface HeaderLocale {
    logo: string;
    nav: NavItem[];
    hireMe: string;
}

export interface StatItem {
    value: string;
    label: string;
}

export interface FloatingCard {
    value: string;
    label: string;
    sublabel: string;
}

export interface HeroLocale {
    name: string;
    title: string;
    roles: string[];
    description: string;
    downloadCV: string;
    followMe: string;
    readMore?: string;
    readLess?: string;
    availableForHire: string;
    scrollDown: string;
    stats: StatItem[];
    floatingCards: {
        projects: FloatingCard;
        experience: FloatingCard;
    };
    image: string | StaticImageData;
}

export interface ServiceItem {
    id: number;
    title: string;
    description: string;
    longDescription?: string;
    icon: string;
}

export interface ServicesLocale {
    title: string;
    showMore: string;
    showLess: string;
    items: ServiceItem[];
}

export interface ExperienceItem {
    id: number;
    period: string;
    role: string;
    company: string;
    logo: string;
    description: string;
    duration: string;
    startDate: string;
    endDate?: string;
    highlights: string[];
    skills: string[];
}

export interface ExperienceLocale {
    title: string;
    subtitle: string;
    roleDescription: string;
    showMore: string;
    showLess: string;
    filterBySkill: string;
    allSkills: string;
    clearFilter: string;
    items: ExperienceItem[];
}

export interface PortfolioItem {
    id: number;
    title: string;
    category: string;
    image: string;
    link: string;
}

export interface BreadcrumbLocale {
    home: string;
    portfolio?: string;
    blog?: string;
}

export interface PortfolioLocale {
    title: string;
    viewAll: string;
    allCategory: string;
    pageTitle: string;
    pageDescription: string;
    backToHome: string;
    showing: string;
    projects: string;
    inCategory: string;
    noProjects: string;
    tryDifferentFilter: string;
    showAll: string;
    viewProject: string;
    breadcrumb: BreadcrumbLocale;
    items: PortfolioItem[];
}

export interface BlogLocale {
    title: string;
    description: string;
    readMore: string;
    viewAll: string;
    searchPlaceholder: string;
    filterByTopic: string;
    clearFilters: string;
    notFound: string;
    previous: string;
    next: string;
    breadcrumb: BreadcrumbLocale;
    showing: string;
    posts: string;
    taggedWith: string;
    minRead: string;
    tryAdjusting: string;
    page: string;
    of: string;
}

export interface SkillCategory {
    name: string;
    items: string[];
}

export interface SkillsLocale {
    title: string;
    description: string;
    professional: {
        title: string;
        items: string[];
    };
    technical: {
        title: string;
        categories: SkillCategory[];
    };
}

export interface SocialLink {
    icon: string;
    link: string;
}

export interface ContactForm {
    name: string;
    email: string;
    subject: string;
    message: string;
    send: string;
    success: string;
    validation: {
        emailInvalid: string;
        required: string;
    };
}

export interface ContactLocale {
    title: string;
    subtitle: string;
    introTitle: string;
    introDescription: string;
    email: string;
    phone: string;
    addressLabel: string;
    emailLabel: string;
    phoneLabel: string;
    address: string;
    followMe: string;
    socials: SocialLink[];
    form: ContactForm;
}

export interface NewsletterLocale {
    title: string;
    description: string;
}

export interface FooterLocale {
    rights: string;
    backToTop: string;
    newsletter: NewsletterLocale;
}

export interface ChatLocale {
    greeting: string;
    intro: string;
    askMe: string;
    header: string;
    subtitle: string;
    placeholder: string;
    contactMe: string;
    viewResume: string;
    thinking: string;
    errorMessage: string;
    suggestedQuestions: string[];
}

export interface NotFoundLocale {
    title: string;
    subtitle: string;
    message: string;
    home: string;
    contact: string;
}

// Cooperation Section
export interface CooperationLocale {
    title: string;
    description: string;
    availableFor: string;
    partnership: string;
    freelanceDesc: string;
    partnershipDesc: string;
    contactBtn: string;
    stats: {
        clients: string;
        experience: string;
        projects: string;
        support: string;
    };
}

// Main Locale Type
export interface Locale {
    header: HeaderLocale;
    hero: HeroLocale;
    services: ServicesLocale;
    experience: ExperienceLocale;
    portfolio: PortfolioLocale;
    blog: BlogLocale;
    skills: SkillsLocale;
    cooperation?: CooperationLocale;
    contact: ContactLocale;
    footer: FooterLocale;
    chat: ChatLocale;
    notFound: NotFoundLocale;
}
