
import { SITE_CONFIG } from "@/config/site";
import type { Locale } from "./types";
import profileImage from "@/../public/profile.webp";

export const en: Locale = {
    header: {
        logo: "HN",
        nav: [
            { name: "Services", href: "/#services" },
            { name: "Experience", href: "/#experience" },
            { name: "Projects", href: "/#portfolio" },
            { name: "Blog", href: "/#blog" },
        ],
        hireMe: "Hire Me",
    },
    hero: {
        name: "Hatem Noureddine",
        title: "Tech Lead Android",
        roles: ["Android Developer", "Mobile Architect", "Tech Lead", "Kotlin Expert"],
        description:
            "13 Years of Experience. Specialized in creating high-performance, complex mobile ecosystems. Leading international teams to deliver innovative automotive and enterprise solutions.",
        downloadCV: "Download CV",
        followMe: "Follow Me",
        availableForHire: "Available for Hire",
        scrollDown: "Scroll to explore",
        stats: [
            { value: "13", label: "Years of Experience" },
            { value: "50+", label: "Projects Completed" },
            { value: "1.5k", label: "Happy Clients" },
        ],
        floatingCards: {
            projects: { value: "50+", label: "Projects", sublabel: "Completed" },
            experience: { value: "13", label: "Years", sublabel: "Experience" }
        },
        image: profileImage,
    },
    services: {
        title: "My Services",
        showMore: "Show Details",
        showLess: "Show Less",
        items: [
            {
                id: 1,
                title: "Development",
                description: "Building robust and scalable mobile applications.",
                longDescription: "Expertise in native Android development using Kotlin and Jetpack Compose. I design modular architectures (MVVM, MVI) ensuring performance, testability, and long-term maintainability.",
                icon: "Code",
            },
            {
                id: 2,
                title: "UI/UX Design",
                description: "Creating intuitive and engaging user experiences.",
                longDescription: "Crafting modern and fluid interfaces centered on the mobile user. Using Figma for prototyping and implementing complex animations with Framer Motion and Jetpack Compose.",
                icon: "Layout",
            },
            {
                id: 3,
                title: "Code Audit",
                description: "Analyzing and improving existing code to enhance its quality and performance.",
                longDescription: "In-depth analysis of your codebase to identify technical debt, performance bottlenecks, and security vulnerabilities. Delivery of a detailed report with actionable recommendations.",
                icon: "Smartphone",
            },
            {
                id: 4,
                title: "CI/CD",
                description: "Setting up a CI/CD pipeline to automate the various deployment processes.",
                longDescription: "Complete automation of your applications' lifecycle: testing, quality analysis (Sonar), build generation, and store deployment (Google Play) via GitHub Actions, Jenkins, or Fastlane.",
                icon: "Pipeline",
            },
        ]
    },
    experience: {
        title: "My Experience",
        subtitle: "Work History",
        roleDescription: "Key Responsibilities",
        showMore: "Show More",
        showLess: "Show Less",
        filterBySkill: "Filter by Skill",
        allSkills: "All",
        clearFilter: "Clear",
        items: [
            {
                id: 1,
                period: "July 2022 - June 2025",
                role: "Lead Android Developer",
                company: "Stellantis",
                logo: "/logo_HN.svg",
                description: "Design and implementation of an evolutionary 'Middleware' SDK for non-connected vehicle services and a graphical 'Framework' SDK (Design System) shared across group brands.",
                duration: "3 years",
                startDate: "2022-07",
                endDate: "2025-06",
                highlights: [
                    "Middleware SDK: Unified heterogeneous backends by normalizing data schemas and API formats",
                    "Framework SDK: Developed a UI SDK based on Figma Design Tokens via JSON (multi-brand visual updates in real-time)",
                    "Automation: Created custom Gradle scripts for automatic Kotlin class generation from design tokens",
                    "Quality: Technical leadership, code reviews, and quality enforcement via Sonar, Detekt, and ktlint in complex CI/CD pipelines",
                    "Architecture: Implemented a feature-oriented modular architecture (Clean Architecture, MVVM)"
                ],
                skills: ["Kotlin", "Jetpack Compose", "Coroutines", "Flow", "Ktor", "Koin", "Room", "Firebase Crashlytics", "GitHub Copilot", "TeamCity"]
            },
            {
                id: 2,
                period: "September 2020 - June 2022",
                role: "Senior Android Developer / Tech Lead",
                company: "PSA (Stellantis)",
                logo: "/logo_HN.svg",
                description: "Overhaul of the group's vehicle communication SDK and development of a sample application to facilitate third-party integration.",
                duration: "2 years",
                startDate: "2020-09",
                endDate: "2022-06",
                highlights: [
                    "Migration: Ported the communication SDK to Kotlin and Coroutines for reactive data exposure",
                    "Design System: Integrated Atomic Design principles to support multi-brand graphic charters",
                    "CI/CD: Automated delivery processes via custom Python and Gradle scripts",
                    "Documentation: Authored structured technical specifications on Confluence for team alignment"
                ],
                skills: ["Kotlin", "Coroutines", "Atomic Design", "Koin", "Room", "TeamCity", "Hexagonal Architecture"]
            },
            {
                id: 3,
                period: "September 2018 - August 2020",
                role: "Senior Android Developer",
                company: "John Paul (Accor Hotels)",
                logo: "/logo_HN.svg",
                description: "Development of a modular application for the Accor Hotels concierge service and features for VISA and Toyota.",
                duration: "2 years",
                startDate: "2018-09",
                endDate: "2020-08",
                highlights: [
                    "Modularity: Refactored common code into modules and migrated to Kotlin and AndroidX",
                    "Dynamic Forms: Created a dynamic form generation system via JSON configurations",
                    "Security: Encrypted sensitive data in preparation for PCI certification",
                    "Integrations: Google Maps/Places, Zendesk, and payment SDKs (Stripe, Adyen)"
                ],
                skills: ["Kotlin", "MVVM", "Dagger 2", "Retrofit", "Fastlane", "GitLab CI", "Sentry"]
            },
            {
                id: 4,
                period: "December 2017 - September 2018",
                role: "Senior Android Developer",
                company: "LCL - Le Crédit Lyonnais",
                logo: "/logo_HN.svg",
                description: "Deep redesign of the 'LCL – Mes Comptes' banking app and optimization of network security.",
                duration: "10 months",
                startDate: "2017-12",
                endDate: "2018-09",
                highlights: [
                    "Tech Migration: Led the transition from Java to Kotlin and towards an MVP architecture",
                    "UI Performance: Optimized layouts via ConstraintLayout to improve fluidity",
                    "Network Security: Migrated to Retrofit with SSL pinning implementation",
                    "Banking: Developed permanent and deferred transfer features"
                ],
                skills: ["Kotlin", "Retrofit", "SSL Pinning", "MVP", "ConstraintLayout", "Jenkins", "Sonar"]
            },
            {
                id: 5,
                period: "January 2012 - November 2017",
                role: "Lead Android Developer",
                company: "Proxym-IT Agency",
                logo: "/logo_HN.svg",
                description: "Lead developer on numerous strategic client projects (Allianz connect, BOZER, VanCleef & Arpel, Dior, etc.).",
                duration: "5+ years",
                startDate: "2012-01",
                endDate: "2017-11",
                highlights: [
                    "SDK Banking: Developed a specialized SDK for check deposit digitalization",
                    "Architecture: Implemented modular architectures using Dagger 2 and RxJava",
                    "Multi-domain: Built VOIP apps, instant messaging (Tchapper), and tourist guides"
                ],
                skills: ["Android SDK", "Java", "RxJava", "Dagger 2", "Retrofit", "SQLite", "Git"]
            }
        ]
    },
    portfolio: {
        title: "My Projects",
        viewAll: "View All Projects",
        allCategory: "All",
        pageTitle: "All Projects",
        pageDescription: "Explore my complete portfolio of projects across development, design, and mobile apps.",
        backToHome: "Back to Home",
        showing: "Showing",
        projects: "projects",
        inCategory: "in",
        noProjects: "No projects found",
        tryDifferentFilter: "Try selecting a different category.",
        showAll: "Show All Projects",
        viewProject: "View",
        breadcrumb: {
            home: "Home",
            portfolio: "Portfolio"
        },
        items: [
            {
                id: 1,
                title: "E-commerce Platform",
                category: "Development",
                image: "https://placehold.co/600x400/1f1f1f/FFF",
                link: "#",
            },
            {
                id: 2,
                title: "Finance Dashboard",
                category: "UI/UX",
                image: "https://placehold.co/600x400/1f1f1f/FFF",
                link: "#",
            },
            {
                id: 3,
                title: "Travel App",
                category: "Mobile",
                image: "https://placehold.co/600x400/1f1f1f/FFF",
                link: "#",
            },
            {
                id: 4,
                title: "Social Media App",
                category: "Mobile",
                image: "https://placehold.co/600x400/1f1f1f/FFF",
                link: "#",
            },
            {
                id: 5,
                title: "Corporate Website",
                category: "Web Design",
                image: "https://placehold.co/600x400/1f1f1f/FFF",
                link: "#",
            }
        ]
    },
    blog: {
        title: "Latest Posts",
        description: "Thoughts, ideas, and tutorials on web development, design, and technology.",
        readMore: "Read More",
        viewAll: "View All Posts",
        searchPlaceholder: "Search for articles, tutorials, and insights...",
        filterByTopic: "Filter by Topic",
        clearFilters: "Clear Filters",
        notFound: "No posts found matching your criteria.",
        previous: "Previous",
        next: "Next",
        breadcrumb: {
            home: "Home",
            blog: "Blog"
        },
        showing: "Showing",
        posts: "posts",
        taggedWith: "tagged with",
        minRead: "min read",
        tryAdjusting: "Try adjusting your search or filters to find what you're looking for.",
        page: "Page",
        of: "of"
    },
    skills: {
        title: "My Skills",
        description: "A comprehensive overview of my technical expertise and professional capabilities.",
        professional: {
            title: "Professional",
            items: [
                "Team Management",
                "Technical & Functional Analysis",
                "Technical Documentation",
                "Team Collaboration",
                "Code Quality Assurance",
                "Code Review",
                "Product Roadmap",
                "Backlog Management"
            ]
        },
        technical: {
            title: "Technical",
            categories: [
                {
                    name: "Architecture",
                    items: ["Clean Arch", "Modular Arch", "MVVM", "MVI"]
                },
                {
                    name: "Development",
                    items: ["Kotlin", "Android", "Jetpack Compose", "Room", "Coroutines", "Koin", "Hilt", "Gradle DSL", "Google Maps", "Ktor", "Retrofit", "Kotlin MultiPlatform", "Compose MultiPlatform"]
                },
                {
                    name: "Mobile Testing",
                    items: ["JUnit", "Robolectric", "Mockk", "Espresso"]
                },
                {
                    name: "Design Patterns",
                    items: ["Dependency Injection", "Singleton", "Observer", "Adapter", "Facade", "Repository"]
                },
                {
                    name: "CI/CD for Mobile",
                    items: ["Jenkins", "Fastlane", "TeamCity", "GitHub Actions"]
                },
                {
                    name: "Mobile UX/UI",
                    items: ["Figma", "Overflow", "Zeplin"]
                },
                {
                    name: "AI",
                    items: ["Copilot", "Gemini"]
                },
                {
                    name: "Code Quality",
                    items: ["Sonar", "Detekt", "Lint", "Kover"]
                },
                {
                    name: "Version Control",
                    items: ["Git", "Gitflow"]
                },
                {
                    name: "Collaboration Tools",
                    items: ["Jira", "Confluence", "Redmine"]
                },
                {
                    name: "Analytics",
                    items: ["Firebase Analytics", "Kotzilla"]
                }
            ]
        }
    },

    contact: {
        title: "Contact Me",
        subtitle: "Let's Connect",
        introTitle: "Don't be shy, say hello!",
        introDescription: "I am always open to discussing new projects, creative ideas or opportunities to be part of your visions.",
        email: SITE_CONFIG.email,
        phone: SITE_CONFIG.phone,
        addressLabel: "Address Post",
        emailLabel: "Email",
        phoneLabel: "Phone",
        address: SITE_CONFIG.address,
        followMe: "Follow me on social media",
        socials: [
            { icon: "Github", link: SITE_CONFIG.links.github },
            { icon: "Linkedin", link: SITE_CONFIG.links.linkedin },
            { icon: "Mail", link: `mailto:${SITE_CONFIG.email} ` },
        ],
        form: {
            name: "Name",
            email: "Email",
            subject: "Subject",
            message: "Message",
            send: "Send Message",
            success: "Email client opened! Your message is ready to send.",
            validation: {
                emailInvalid: "Please enter a valid email address",
                required: "This field is required"
            }
        }
    },
    footer: {
        rights: "All rights reserved.",
        backToTop: "Back to top",
        newsletter: {
            title: "Subscribe to my newsletter",
            description: "Get notified about new posts and updates."
        }
    },
    chat: {
        greeting: "Hi! I'm Hatem's assistant. 👋",
        intro: "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
        askMe: "Feel free to ask me about skills, experience, or just say hello!",
        header: "Let's Connect",
        subtitle: "Ask about skills & experience",
        placeholder: "Ask about experience, skills...",
        contactMe: "Contact Me",
        viewResume: "View Resume",
        thinking: "Thinking...",
        errorMessage: "Sorry, I had trouble responding. Please contact directly at",
        suggestedQuestions: [
            "What are your main skills?",
            "Tell me about your experience",
            "Are you available for hire?",
            "What projects have you worked on?"
        ]
    },
    notFound: {
        title: "404",
        subtitle: "Page Not Found",
        message: "Sorry, the page you're looking for doesn't exist or has been moved.",
        home: "Go Home",
        contact: "Contact Me"
    }
};
