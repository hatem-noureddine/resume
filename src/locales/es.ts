import { SITE_CONFIG } from "@/config/site";
import profileImage from "@/../public/profile.webp";

export const es = {
    header: {
        logo: "HN",
        nav: [
            { name: "Services", href: "/#services" },
            { name: "Expérience", href: "/#experience" },
            { name: "Projets", href: "/#portfolio" },
            { name: "Blog", href: "/#blog" },
        ],
        hireMe: "Engagez-moi",
    },
    hero: {
        name: "Hatem Noureddine",
        title: "Diseñador Creativo y Desarrollador",
        roles: ["Desarrollador Android", "Arquitecto Móvil", "Tech Lead", "Experto Kotlin"],
        description:
            "Descompongo problemas complejos de experiencia de usuario para crear soluciones íntegras que conectan a miles de millones de personas",
        downloadCV: "Descargar CV",
        followMe: "Sígueme",
        availableForHire: "Disponible",
        scrollDown: "Desplázate para explorar",
        stats: [
            { value: "12", label: "Años de Experiencia" },
            { value: "50+", label: "Proyectos Completados" },
            { value: "1.5k", label: "Clientes Satisfechos" },
        ],
        floatingCards: {
            projects: { value: "50+", label: "Proyectos", sublabel: "Completados" },
            experience: { value: "12", label: "Años", sublabel: "Experiencia" }
        },
        image: profileImage,
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
        title: "Mi Experiencia",
        subtitle: "Historial Laboral",
        roleDescription: "Responsabilidades Clave",
        showMore: "Ver Más",
        showLess: "Ver Menos",
        filterBySkill: "Filtrar por Habilidad",
        allSkills: "Todas",
        clearFilter: "Limpiar",
        items: [
            {
                id: 1,
                period: "2020 - Presente",
                role: "Desarrollador Líder",
                company: "Tech Solutions Inc.",
                description: "Liderando el equipo frontend y arquitectando soluciones escalables para clientes empresariales.",
                duration: "4+ años",
                startDate: "2020-01",
                highlights: [
                    "Lideré un equipo de 8 desarrolladores entregando 15+ proyectos a tiempo",
                    "Arquitectura de microservicios reduciendo el tiempo de carga en 40%",
                    "Implementación de pipeline CI/CD mejorando la frecuencia de despliegue 3x"
                ],
                skills: ["Kotlin", "Android", "Jetpack Compose", "MVVM", "CI/CD"]
            },
            {
                id: 2,
                period: "2018 - 2020",
                role: "Desarrollador Android Senior",
                company: "Creative Agency",
                description: "Desarrollo de aplicaciones móviles de alto rendimiento para marcas globales.",
                duration: "2 años",
                startDate: "2018-01",
                endDate: "2020-01",
                highlights: [
                    "Construí 5 aplicaciones con 1M+ descargas combinadas",
                    "Reducción de la tasa de fallos en 85% mediante manejo de errores apropiado",
                    "Mentoría de 3 desarrolladores junior en mejores prácticas"
                ],
                skills: ["Kotlin", "Android", "Room", "Retrofit", "Koin"]
            },
            {
                id: 3,
                period: "2016 - 2018",
                role: "Desarrollador Android",
                company: "StartUp Hub",
                description: "Colaboración con desarrolladores senior para construir productos MVP para startups.",
                duration: "2 años",
                startDate: "2016-01",
                endDate: "2018-01",
                highlights: [
                    "Desarrollo de 3 aplicaciones MVP desde cero",
                    "Integración de APIs REST y SDKs de terceros",
                    "Participación en sprints ágiles y revisiones de código"
                ],
                skills: ["Java", "Android", "SQLite", "APIs REST"]
            }
        ]
    },
    portfolio: {
        title: "Mis Proyectos",
        viewAll: "Ver Todos los Proyectos",
        allCategory: "Todos",
        pageTitle: "Todos los Proyectos",
        pageDescription: "Explore mi portafolio completo de proyectos de desarrollo, diseño y aplicaciones móviles.",
        backToHome: "Volver al Inicio",
        showing: "Mostrando",
        projects: "proyectos",
        inCategory: "en",
        noProjects: "No se encontraron proyectos",
        tryDifferentFilter: "Intente seleccionar una categoría diferente.",
        showAll: "Mostrar Todos los Proyectos",
        viewProject: "Ver",
        breadcrumb: {
            home: "Inicio",
            portfolio: "Portafolio"
        },
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
        title: "Últimas Publicaciones",
        description: "Reflexiones, ideas y tutoriales sobre desarrollo web, diseño y tecnología.",
        readMore: "Leer Más",
        viewAll: "Ver Todas las Publicaciones",
        searchPlaceholder: "Buscar artículos...",
        filterByTopic: "Filtrar por tema",
        clearFilters: "Limpiar filtros",
        notFound: "No se encontraron artículos que coincidan con sus criterios.",
        previous: "Anterior",
        next: "Siguiente",
        breadcrumb: {
            home: "Inicio",
            blog: "Blog"
        },
        showing: "Mostrando",
        posts: "publicaciones",
        taggedWith: "con etiqueta",
        minRead: "min de lectura",
        tryAdjusting: "Intente ajustar su búsqueda o filtros para encontrar lo que está buscando.",
        page: "Página",
        of: "de"
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
        email: SITE_CONFIG.email,
        phone: SITE_CONFIG.phone,
        addressLabel: "Adresse Postale",
        emailLabel: "Email",
        phoneLabel: "Téléphone",
        address: "123 Calle, Madrid, España",
        followMe: "Sígueme en las redes sociales",
        socials: [
            { icon: "Github", link: SITE_CONFIG.links.github },
            { icon: "Linkedin", link: SITE_CONFIG.links.linkedin },
            { icon: "Twitter", link: SITE_CONFIG.links.twitter },
            { icon: "Mail", link: `mailto:${SITE_CONFIG.email}` },
        ],
        form: {
            name: "Nom",
            email: "Email",
            subject: "Sujet",
            message: "Mensaje",
            send: "Enviar Mensaje",
            success: "¡Cliente de correo abierto! Tu mensaje está listo para enviar.",
            validation: {
                emailInvalid: "Por favor introduzca una dirección de correo válida",
                required: "Este campo es obligatorio"
            }
        }
    },
    footer: {
        rights: "Todos los derechos reservados.",
        backToTop: "Volver arriba"
    },
    chat: {
        greeting: "¡Hola! Soy el asistente de Hatem. 👋",
        intro: "Siempre estoy abierto a discutir nuevos proyectos, ideas creativas u oportunidades para ser parte de tu visión.",
        askMe: "¡No dudes en preguntarme sobre habilidades, experiencia, o simplemente saludar!",
        header: "Conectemos",
        subtitle: "Pregunta sobre habilidades",
        placeholder: "Pregunta sobre experiencia...",
        contactMe: "Contactar",
        viewResume: "Ver CV",
        thinking: "Pensando...",
        errorMessage: "Lo siento, tuve problemas para responder. Por favor contacta directamente a",
        suggestedQuestions: [
            "¿Cuáles son tus habilidades?",
            "Cuéntame sobre tu experiencia",
            "¿Estás disponible para contratar?",
            "¿En qué proyectos has trabajado?"
        ]
    },
    notFound: {
        title: "404",
        subtitle: "Página No Encontrada",
        message: "Lo siento, la página que estás buscando no existe o ha sido movida.",
        home: "Inicio",
        contact: "Contactar"
    }
};
