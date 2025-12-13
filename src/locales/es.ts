export const es = {
    header: {
        logo: "HN",
        nav: [
            { name: "Services", href: "/#services" },
            { name: "Expérience", href: "/#experience" },
            { name: "Projets", href: "/#portfolio" },
            { name: "Blog", href: "/#blog" },
            { name: "Contact", href: "/#contact" },
        ],
        hireMe: "Engagez-moi",
    },
    hero: {
        name: "Hatem Noureddine",
        title: "Designer Créatif & Développeur",
        description:
            "Je décompose les problèmes d'expérience utilisateur complexes pour créer des solutions intègres qui connectent des milliards de personnes",
        stats: [
            { value: "12", label: "Années d'Expérience" },
            { value: "50+", label: "Projets Terminés" },
            { value: "1.5k", label: "Clients Satisfaits" },
        ],
        image: "/profile.png",
    },
    services: {
        title: "Mes Services",
        items: [
            {
                id: 1,
                title: "Web Design",
                description: "Création de designs de sites web visuellement époustouflants et centrés sur l'utilisateur.",
                icon: "Layout",
            },
            {
                id: 2,
                title: "Développement",
                description: "Construction d'applications web robustes et évolutives.",
                icon: "Code",
            },
            {
                id: 3,
                title: "UI/UX Design",
                description: "Création d'expériences utilisateur intuitives et engageantes.",
                icon: "Smartphone",
            },
            {
                id: 4,
                title: "Design Graphique",
                description: "Communication visuelle à travers la typographie, la photographie et l'illustration.",
                icon: "Palette",
            },
        ]
    },
    experience: {
        title: "Mon Expérience",
        items: [
            {
                id: 1,
                period: "2020 - Présent",
                role: "Développeur Lead",
                company: "Tech Solutions Inc.",
                description: "Direction de l'équipe frontend et architecture de solutions évolutives.",
            },
            {
                id: 2,
                period: "2018 - 2020",
                role: "Senior UI/UX Designer",
                company: "Creative Agency",
                description: "Conception d'interfaces primées pour des marques mondiales.",
            },
            {
                id: 3,
                period: "2016 - 2018",
                role: "Développeur Junior",
                company: "StartUp Hub",
                description: "Collaboration avec des développeurs seniors pour construire des produits MVP.",
            },
        ]
    },
    portfolio: {
        title: "Mis Proyectos",
        items: [
            {
                id: 1,
                title: "Plataforma de Comercio Electrónico",
                category: "Desarrollo",
                image: "https://placehold.co/600x400/1f1f1f/FFF",
                link: "#",
            },
            {
                id: 2,
                title: "Panel Financiero",
                category: "UI/UX",
                image: "https://placehold.co/600x400/1f1f1f/FFF",
                link: "#",
            },
            {
                id: 3,
                title: "App de Viajes",
                category: "Móvil",
                image: "https://placehold.co/600x400/1f1f1f/FFF",
                link: "#",
            },
            {
                id: 4,
                title: "App de Redes Sociales",
                category: "Móvil",
                image: "https://placehold.co/600x400/1f1f1f/FFF",
                link: "#",
            },
            {
                id: 5,
                title: "Sitio Web Corporativo",
                category: "Diseño Web",
                image: "https://placehold.co/600x400/1f1f1f/FFF",
                link: "#",
            }
        ]
    },
    blog: {
        title: "Derniers articles du blog",
        description: "Réflexions, idées et tutoriels sur le développement web, le design et la technologie.",
        readMore: "Lire la suite",
        searchPlaceholder: "Rechercher des articles...",
        filterByTopic: "Filtrer par sujet",
        clearFilters: "Effacer les filtres",
        notFound: "Aucun article trouvé correspondant à vos critères.",
        previous: "Précédent",
        next: "Suivant"
    },
    skills: {
        title: "Mis Habilidades",
        description: "Una visión general completa de mi experiencia técnica y capacidades profesionales.",
        professional: {
            title: "Profesional",
            items: [
                "Gestión de Equipos",
                "Análisis Técnico y Funcional",
                "Redacción de Documentación Técnica",
                "Colaboración en Equipo",
                "Aseguramiento de Calidad de Código",
                "Revisión de Código",
                "Hoja de Ruta del Producto",
                "Gestión de Backlog"
            ]
        },
        technical: {
            title: "Técnica",
            categories: [
                {
                    name: "Arquitectura",
                    items: ["Clean Arch", "Modular Arch", "MVVM", "MVI"]
                },
                {
                    name: "Desarrollo",
                    items: ["Kotlin", "Android", "Jetpack Compose", "Room", "Coroutines", "Koin", "Hilt", "Gradle DSL", "Google Maps", "Ktor", "Retrofit", "Kotlin MultiPlatform", "Compose MultiPlatform"]
                },
                {
                    name: "Pruebas Móviles",
                    items: ["JUnit", "Robolectric", "Mockk", "Espresso"]
                },
                {
                    name: "Patrones de Diseño",
                    items: ["Dependency Injection", "Singleton", "Observer", "Adapter", "Facade", "Repository"]
                },
                {
                    name: "CI/CD para Móvil",
                    items: ["Jenkins", "Fastlane", "TeamCity", "GitHub Actions"]
                },
                {
                    name: "UX/UI para Móvil",
                    items: ["Figma", "Overflow", "Zeplin"]
                },
                {
                    name: "IA",
                    items: ["Copilot", "Gemini"]
                },
                {
                    name: "Calidad de Código",
                    items: ["Sonar", "Detekt", "Lint", "Kover"]
                },
                {
                    name: "Control de Versiones",
                    items: ["Git", "Gitflow"]
                },
                {
                    name: "Herramientas de Colaboración",
                    items: ["Jira", "Confluence", "Redmine"]
                },
                {
                    name: "Analítica",
                    items: ["Firebase Analytics", "Kotzilla"]
                }
            ]
        }
    },
    cooperation: {
        title: "Coopérons pour construire quelque chose de grand.",
        description: "Je suis toujours ouvert à la discussion de nouveaux projets, d'idées créatives ou d'opportunités de faire partie de vos visions.",
        availableFor: "Disponible pour Freelance",
        partnership: "Partenariat de Projet",
        freelanceDesc: "Disponible pour des projets freelance et des consultations.",
        partnershipDesc: "Ouvert aux partenariats à long terme et aux collaborations.",
        contactBtn: "Contactez-moi",
        stats: {
            clients: "Clients Satisfaits",
            experience: "Années d'Expérience",
            projects: "Projets Terminés",
            support: "Support"
        }
    },
    contact: {
        title: "Contactez-moi",
        subtitle: "Connectons-nous",
        introTitle: "Ne soyez pas timide, dites bonjour !",
        introDescription: "Je suis toujours ouvert à la discussion de nouveaux projets, d'idées créatives ou d'opportunités de faire partie de vos visions.",
        email: "hatem.noureddine.pro@gmail.com",
        phone: "+01 123 654 8096",
        addressLabel: "Adresse Postale",
        emailLabel: "Email",
        phoneLabel: "Téléphone",
        address: "123 Street, New York, USA",
        socials: [
            { icon: "Github", link: "https://github.com" },
            { icon: "Linkedin", link: "https://linkedin.com" },
            { icon: "Twitter", link: "https://twitter.com" },
            { icon: "Mail", link: "mailto:hatem.noureddine.pro@gmail.com" },
        ],
        form: {
            name: "Nom",
            email: "Email",
            subject: "Sujet",
            message: "Mensaje",
            send: "Enviar Mensaje",
            validation: {
                emailInvalid: "Por favor introduzca una dirección de correo válida",
                required: "Este campo es obligatorio"
            }
        }
    },
    footer: {
        rights: "Tous droits réservés."
    }
};
