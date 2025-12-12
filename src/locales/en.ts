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
        image: "/profile.png",
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
            },
        ]
    },
    portfolio: {
        title: "My Projects",
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
        description: "I work with a wide range of technologies and tools to bring ideas to life.",
        categories: {
            frontend: "Frontend",
            backend: "Backend"
        }
    },
    cooperation: {
        title: "Let's Cooperate to build something great.",
        description: "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.",
        availableFor: "Available for Freelance",
        partnership: "Project Partnership",
        freelanceDesc: "Available for freelance projects and consultation.",
        partnershipDesc: "Open to long-term partnerships and collaborations.",
        contactBtn: "Contact Me",
        stats: {
            clients: "Happy Clients",
            experience: "Years Experience", // Fixed typo "Years of Experience" matches previously but verifying
            projects: "Projects Completed",
            support: "Support"
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
            send: "Send Message"
        }
    },
    footer: {
        rights: "All rights reserved."
    }
};
