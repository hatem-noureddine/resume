import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export const siteData = {
    header: {
        logo: "HN",
        nav: [
            { name: "Services", href: "/#services" },
            { name: "Experience", href: "/#experience" },
            { name: "Projects", href: "/#portfolio" },
            { name: "Blog", href: "/#blog" },
            { name: "Contact", href: "/#contact" },
        ],
    },
    hero: {
        name: "James Smith",
        title: "Creative Designer & Developer",
        description:
            "I break down complex user experience problems to create integrity focussed solutions that connect billions of people",
        stats: [
            { value: "12", label: "Years of Experience" },
            { value: "50+", label: "Projects Completed" },
            { value: "1.5k", label: "Happy Clients" },
        ],
        image: "/profile.png", // We will need a placeholder image
    },
    services: [
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
    ],
    experience: [
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
    ],
    portfolio: [
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
    ],
    contact: {
        email: "hatem.noureddine.pro@gmail.com",
        phone: "+01 123 654 8096",
        address: "123 Street, New York, USA",
        socials: [
            { icon: Github, link: "https://github.com" },
            { icon: Linkedin, link: "https://linkedin.com" },
            { icon: Twitter, link: "https://twitter.com" },
            { icon: Mail, link: "mailto:hatem.noureddine.pro@gmail.com" },
        ],
    },
};
