import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export const en = {
    header: {
        logo: "HN",
        nav: [
            { name: "Services", href: "/#services" },
            { name: "Experience", href: "/#experience" },
            { name: "Projects", href: "/#portfolio" },
            { name: "Blog", href: "/#blog" },
            { name: "Contact", href: "/#contact" },
        ],
        hireMe: "Hire Me",
    },
    hero: {
        name: "Hatem Noureddine",
        title: "Creative Designer & Developer",
        description:
            "I break down complex user experience problems to create integrity focussed solutions that connect billions of people",
        stats: [
            { value: "12", label: "Years of Experience" },
            { value: "50+", label: "Projects Completed" },
            { value: "1.5k", label: "Happy Clients" },
        ],
        image: "/resume/profile.png",
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
        items: [
            {
                id: 1,
                period: "2020 - Present",
                role: "Lead Developer",
                company: "Tech Solutions Inc.",
                description: "Leading the frontend team and architecting scalable solutions.",
            },
            {
                id: 2,
                period: "2018 - 2020",
                role: "Senior UI/UX Designer",
                company: "Creative Agency",
                description: "Designed award-winning interfaces for global brands.",
            },
            {
                id: 3,
                period: "2016 - 2018",
                role: "Junior Developer",
                company: "StartUp Hub",
                description: "Collaborated with senior developers to build MVP products.",
                startDate: "2016-01",
                endDate: "2018-05", // Added date for sorting since logic depends on it
            },
            {
                id: 4,
                period: "2018 - 2020",
                role: "Senior UI/UX Designer",
                company: "Creative Agency (Duplicate)",
                description: "Designed award-winning interfaces for global brands.",
                startDate: "2018-01",
                endDate: "2020-01",
            },
            {
                id: 5,
                period: "2016 - 2018",
                role: "Junior Developer",
                company: "StartUp Hub (Duplicate)",
                description: "Collaborated with senior developers to build MVP products.",
                startDate: "2015-01",
                endDate: "2016-01",
            },
        ]
    },
    portfolio: {
        title: "My Projects",
        items: [
            // {
            //     id: 1,
            //     title: "E-commerce Platform",
            //     category: "Development",
            //     image: "https://placehold.co/600x400/1f1f1f/FFF",
            //     link: "#",
            // },
            // {
            //     id: 2,
            //     title: "Finance Dashboard",
            //     category: "UI/UX",
            //     image: "https://placehold.co/600x400/1f1f1f/FFF",
            //     link: "#",
            // },
            // {
            //     id: 3,
            //     title: "Travel App",
            //     category: "Mobile",
            //     image: "https://placehold.co/600x400/1f1f1f/FFF",
            //     link: "#",
            // },
            // {
            //     id: 4,
            //     title: "Social Media App",
            //     category: "Mobile",
            //     image: "https://placehold.co/600x400/1f1f1f/FFF",
            //     link: "#",
            // },
            // {
            //     id: 5,
            //     title: "Corporate Website",
            //     category: "Web Design",
            //     image: "https://placehold.co/600x400/1f1f1f/FFF",
            //     link: "#",
            // }
        ]
    },
    blog: {
        title: "Latest Posts",
        description: "Thoughts, ideas, and tutorials on web development, design, and technology.",
        readMore: "Read More",
        searchPlaceholder: "Search for articles, tutorials, and insights...",
        filterByTopic: "Filter by Topic",
        clearFilters: "Clear Filters",
        notFound: "No posts found matching your criteria.",
        previous: "Previous",
        next: "Next"
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
        email: "hatem.noureddine.pro@gmail.com",
        phone: "+01 123 654 8096",
        addressLabel: "Address Post",
        emailLabel: "Email",
        phoneLabel: "Phone",
        address: "123 Street, New York, USA",
        socials: [
            { icon: "Github", link: "https://github.com" },
            { icon: "Linkedin", link: "https://linkedin.com" },
            { icon: "Twitter", link: "https://twitter.com" },
            { icon: "Mail", link: "mailto:hatem.noureddine.pro@gmail.com" },
        ],
        form: {
            name: "Name",
            email: "Email",
            subject: "Subject",
            message: "Message",
            send: "Send Message",
            validation: {
                emailInvalid: "Please enter a valid email address",
                required: "This field is required"
            }
        }
    },
    footer: {
        rights: "All rights reserved."
    }
};
