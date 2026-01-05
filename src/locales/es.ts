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
        title: "Mis Servicios",
        showMore: "Ver detalles",
        showLess: "Ver menos",
        items: [
            {
                id: 1,
                title: "Desarrollo",
                description: "Construcción de aplicaciones móviles robustas y escalables.",
                longDescription: "Experiencia en desarrollo nativo de Android con Kotlin y Jetpack Compose. Diseño arquitecturas modulares (MVVM, MVI) que garantizan rendimiento, testabilidad y mantenibilidad a largo plazo.",
                icon: "Code",
            },
            {
                id: 2,
                title: "Diseño UI/UX",
                description: "Creación de experiencias de usuario intuitivas y atractivas.",
                longDescription: "Diseño de interfaces modernas y fluidas centradas en el usuario móvil. Uso de Figma para prototipado e implementación de animaciones complejas con Framer Motion y Jetpack Compose.",
                icon: "Layout",
            },
            {
                id: 3,
                title: "Auditoría de Código",
                description: "Análisis y mejora del código existente para mejorar su calidad y rendimiento.",
                longDescription: "Análisis profundo de su base de código para identificar deudas técnicas, cuellos de botella de rendimiento y vulnerabilidades de seguridad. Entrega de un informe detallado con recomendaciones accionables.",
                icon: "Smartphone",
            },
            {
                id: 4,
                title: "CI/CD",
                description: "Configuración de un flujo de CI/CD para automatizar los procesos de despliegue.",
                longDescription: "Automatización completa del ciclo de vida de sus aplicaciones: pruebas, análisis de calidad (Sonar), generación de builds y despliegue en las tiendas (Google Play) vía GitHub Actions, Jenkins o Fastlane.",
                icon: "Pipeline",
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
                period: "Julio 2022 - Junio 2025",
                role: "Lead Desarrollador Android",
                company: "Stellantis",
                logo: "/logo_HN.svg",
                description: "Diseño e implementación de un SDK « Middleware » evolutivo para servicios de vehículos no conectados y un SDK « Framework » gráfico (Design System) compartido entre las marcas del grupo.",
                duration: "3 años",
                startDate: "2022-07",
                endDate: "2025-06",
                highlights: [
                    "Middleware SDK: Unificación de backends heterogéneos mediante la normalización de esquemas de datos y formatos de API",
                    "Framework SDK: Desarrollo de un SDK de UI basado en Figma Design Tokens a través de JSON (actualizaciones visuales multimarca en tiempo real)",
                    "Automatización: Creación de scripts Gradle personalizados para la generación automática de clases Kotlin a partir de design tokens",
                    "Calidad: Liderazgo técnico, revisiones de código y cumplimiento de calidad mediante Sonar, Detekt y ktlint en pipelines de CI/CD complejos",
                    "Arquitectura: Implementación de una arquitectura modular orientada a features (Clean Architecture, MVVM)"
                ],
                skills: ["Kotlin", "Jetpack Compose", "Coroutines", "Flow", "Ktor", "Koin", "Room", "Firebase Crashlytics", "GitHub Copilot", "TeamCity"]
            },
            {
                id: 2,
                period: "Septiembre 2020 - Junio 2022",
                role: "Senior Desarrollador Android / Tech Lead",
                company: "PSA (Stellantis)",
                logo: "/logo_HN.svg",
                description: "Remodelación del SDK de comunicación con los vehículos del grupo y desarrollo de una aplicación de muestra para facilitar la integración de terceros.",
                duration: "2 años",
                startDate: "2020-09",
                endDate: "2022-06",
                highlights: [
                    "Migración: Adaptación del SDK de comunicación a Kotlin y Coroutines para una exposición reactiva de datos",
                    "Design System: Integración de los principios de Atomic Design para soportar cartas gráficas multimarca",
                    "CI/CD: Automatización de los procesos de entrega mediante scripts personalizados de Python y Gradle",
                    "Documentación: Redacción de especificaciones técnicas estructuradas en Confluence para la alineación de los equipos"
                ],
                skills: ["Kotlin", "Coroutines", "Atomic Design", "Koin", "Room", "TeamCity", "Arquitectura Hexagonal"]
            },
            {
                id: 3,
                period: "Septiembre 2018 - Agosto 2020",
                role: "Senior Desarrollador Android",
                company: "John Paul (Accor Hotels)",
                logo: "/logo_HN.svg",
                description: "Desarrollo de una aplicación modular para el servicio de conserjería de Accor Hotels y funciones para VISA y Toyota.",
                duration: "2 años",
                startDate: "2018-09",
                endDate: "2020-08",
                highlights: [
                    "Modularidad: Refactorización del código común en módulos y migración a Kotlin y AndroidX",
                    "Formularios Dinámicos: Creación de un sistema de generación dinámica de formularios a través de configuraciones JSON",
                    "Seguridad: Cifrado de datos sensibles en preparación para la certificación PCI",
                    "Integraciones: Google Maps/Places, Zendesk y SDK de pago (Stripe, Adyen)"
                ],
                skills: ["Kotlin", "MVVM", "Dagger 2", "Retrofit", "Fastlane", "GitLab CI", "Sentry"]
            },
            {
                id: 4,
                period: "Diciembre 2017 - Septiembre 2018",
                role: "Senior Desarrollador Android",
                company: "LCL - Le Crédit Lyonnais",
                logo: "/logo_HN.svg",
                description: "Rediseño profundo de la aplicación bancaria « LCL – Mes Comptes » y optimización de la seguridad de red.",
                duration: "10 meses",
                startDate: "2017-12",
                endDate: "2018-09",
                highlights: [
                    "Tech Migration: Liderazgo en la transición de Java a Kotlin y hacia una arquitectura MVP",
                    "Rendimiento UI: Optimización de layouts mediante ConstraintLayout para mejorar la fluidez",
                    "Seguridad de Red: Migración a Retrofit con implementación de SSL pinning",
                    "Banca: Desarrollo de funciones de transferencias permanentes y diferidas"
                ],
                skills: ["Kotlin", "Retrofit", "SSL Pinning", "MVP", "ConstraintLayout", "Jenkins", "Sonar"]
            },
            {
                id: 5,
                period: "Enero 2012 - Noviembre 2017",
                role: "Lead Desarrollador Android",
                company: "Proxym-IT Agency",
                logo: "/logo_HN.svg",
                description: "Líder de desarrollo en numerosos proyectos estratégicos de clientes (Allianz connect, BOZER, VanCleef & Arpel, Dior, etc.).",
                duration: "5+ años",
                startDate: "2012-01",
                endDate: "2017-11",
                highlights: [
                    "SDK Banking: Desarrollo de un SDK especializado en la digitalización de depósitos de cheques",
                    "Arquitectura: Implementación de arquitecturas modulares utilizando Dagger 2 y RxJava",
                    "Multidominio: Creación de aplicaciones VOIP, mensajería instantánea (Tchapper) y guías turísticas"
                ],
                skills: ["Android SDK", "Java", "RxJava", "Dagger 2", "Retrofit", "SQLite", "Git"]
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
