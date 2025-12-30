
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
        items: [
            {
                id: 1,
                title: "Web Design",
                description: "Crafting visually stunning and user-centric website designs.",
                icon: "Layout",
            },
            {
                id: 2,
                title: "Development",
                description: "Building robust and scalable web applications.",
                icon: "Code",
            },
            {
                id: 3,
                title: "UI/UX Design",
                description: "Creating intuitive and engaging user experiences.",
                icon: "Smartphone",
            },
            {
                id: 4,
                title: "Graphics Design",
                description: "Visual communication through typography, photography and illustration.",
                icon: "Palette",
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
                period: "2020 - Present",
                role: "Lead Developer",
                company: "Tech Solutions Inc.",
                logo: "/logo_HN.svg",
                description: "Leading the frontend team and architecting scalable solutions for enterprise clients.",
                duration: "4+ years",
                startDate: "2020-01",
                highlights: [
                    "Led a team of 8 developers to deliver 15+ projects on time",
                    "Architected microservices reducing load time by 40%",
                    "Implemented CI/CD pipeline improving deployment frequency by 3x"
                ],
                skills: ["Kotlin", "Android", "Jetpack Compose", "MVVM", "CI/CD"]
            },
            {
                id: 2,
                period: "2018 - 2020",
                role: "Senior Android Developer",
                company: "Creative Agency",
                logo: "/logo_HN.svg",
                description: "Developed high-performance mobile applications for global brands.",
                duration: "2 years",
                startDate: "2018-01",
                endDate: "2020-01",
                highlights: [
                    "Built 5 production apps with 1M+ combined downloads",
                    "Reduced app crash rate by 85% through proper error handling",
                    "Mentored 3 junior developers in best practices"
                ],
                skills: ["Kotlin", "Android", "Room", "Retrofit", "Koin"]
            },
            {
                id: 3,
                period: "2016 - 2018",
                role: "Android Developer",
                company: "StartUp Hub",
                logo: "/logo_HN.svg",
                description: "Collaborated with senior developers to build MVP products for startups.",
                duration: "2 years",
                startDate: "2016-01",
                endDate: "2018-01",
                highlights: [
                    "Developed 3 MVP applications from scratch",
                    "Integrated RESTful APIs and third-party SDKs",
                    "Participated in agile sprints and code reviews"
                ],
                skills: ["Java", "Android", "SQLite", "REST APIs"]
            },
            {
                id: 4,
                period: "2014 - 2016",
                role: "Junior Android Developer",
                company: "First Company",
                logo: "/logo_HN.svg",
                description: "Started my career...",
                duration: "2 years",
                startDate: "2014-01",
                endDate: "2016-01",
                highlights: ["Learned Android fundamentals"],
                skills: ["Java", "Android"]
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
            { icon: "Twitter", link: SITE_CONFIG.links.twitter },
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
