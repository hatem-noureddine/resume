import { SITE_CONFIG } from "@/config/site";
import type { Locale } from "./types";
import profileImage from "@/../public/profile.webp";

export const fr: Locale = {
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
        title: "Tech Lead Android",
        roles: ["Développeur Android", "Architecte Mobile", "Lead Tech", "Expert Kotlin"],
        description:
            "13 ans d'expérience. Spécialisé dans la création d'écosystèmes mobiles complexes et performants. Direction d'équipes internationales pour livrer des solutions d'entreprise innovantes.",
        downloadCV: "Télécharger CV",
        followMe: "Suivez-moi",
        availableForHire: "Disponible",
        scrollDown: "Défiler pour explorer",
        stats: [
            { value: "13", label: "Années d'Expérience" },
            { value: "50+", label: "Projets Terminés" },
            { value: "15M", label: "Clients Satisfaits" },
        ],
        floatingCards: {
            projects: { value: "50+", label: "Projets", sublabel: "Terminés" },
            experience: { value: "13", label: "Années", sublabel: "d'Expérience" }
        },
        image: profileImage,
    },
    services: {
        title: "Mes Services",
        showMore: "En savoir plus",
        showLess: "Réduire",
        items: [
            {
                id: 1,
                title: "Développement",
                description: "Construction d'applications mobiles robustes et évolutives.",
                longDescription: "Expertise en développement Android natif avec Kotlin et Jetpack Compose. Je conçois des architectures modulaires (MVVM, MVI) garantissant performance, testabilité et maintenabilité à long terme.",
                icon: "Code",
            },
            {
                id: 2,
                title: "UI/UX Design",
                description: "Création d'expériences utilisateur intuitives et engageantes.",
                longDescription: "Travail en collaboration avec les équipes de design pour créer des interfaces utilisateur modernes et fluides centrées sur l'utilisateur mobile.",
                icon: "Layout",
            },
            {
                id: 3,
                title: "Code Audit",
                description: "Analyse et amélioration du code existant pour améliorer sa qualité et sa performance.",
                longDescription: "Analyse approfondie de votre base de code pour identifier les dettes techniques, les goulots d'étranglement de performance et les failles de sécurité. Livraison d'un rapport détaillé avec des recommandations exploitables.",
                icon: "Smartphone",
            },
            {
                id: 4,
                title: "CI/CD",
                description: "Mise en place d'un pipeline CI/CD pour automatiser les différents processus de déploiement.",
                longDescription: "Automatisation complète du cycle de vie de vos applications : tests, analyse de qualité, génération de builds et déploiement sur les stores (Google Play) via GitHub Actions, Jenkins, teamCity ou Fastlane.",
                icon: "Pipeline",
            },
        ]
    },
    experience: {
        title: "Mon Expérience",
        subtitle: "Parcours Professionnel",
        roleDescription: "Responsabilités Clés",
        showMore: "Voir Plus",
        showLess: "Voir Moins",
        filterBySkill: "Filtrer par Compétence",
        allSkills: "Toutes",
        clearFilter: "Effacer",
        items: [
            {
                id: 1,
                period: "Juillet 2022 - Juin 2025",
                role: "Lead Développeur Android",
                company: "Stellantis",
                logo: "/logo_HN.svg",
                description: "Conception et implémentation d'un SDK « Middleware » évolutif pour les services véhicules non-connectés et d'un SDK « Framework » graphique (Design System) commun aux marques du groupe.",
                duration: "3 ans",
                startDate: "2022-07",
                endDate: "2025-06",
                highlights: [
                    "Middleware SDK : Unification des backends hétérogènes par la normalisation des schémas de données et des formats d'API",
                    "Framework SDK : Développement d'un SDK UI basé sur les Figma Design Tokens via JSON (mises à jour visuelles multi-marques en temps réel)",
                    "Automatisation : Création de scripts Gradle pour la génération automatique de classes Kotlin à partir des design tokens",
                    "Qualité : Leadership technique, revues de code et enforcement qualité via Sonar, Detekt et ktlint dans des pipelines CI/CD complexes",
                    "Architecture : Mise en place d'une architecture modulaire (Clean Architecture, MVVM) orientée features"
                ],
                skills: ["Kotlin", "Jetpack Compose", "Coroutines", "Flow", "Ktor", "Koin", "Room", "Firebase Crashlytics", "GitHub Copilot", "TeamCity"]
            },
            {
                id: 2,
                period: "Septembre 2020 - Juin 2022",
                role: "Senior Développeur Android / Tech Lead",
                company: "PSA (Stellantis)",
                logo: "/logo_HN.svg",
                description: "Refonte du SDK de communication avec les véhicules du groupe et développement d'une application témoin pour faciliter l'intégration tiers.",
                duration: "2 ans",
                startDate: "2020-09",
                endDate: "2022-06",
                highlights: [
                    "Migration : Portage du SDK de communication vers Kotlin et Coroutines pour une exposition réactive des données",
                    "Design System : Intégration des principes d'Atomic Design pour supporter les chartes graphiques multi-marques",
                    "CI/CD : Automatisation des processus de livraison via des scripts Python et Gradle personnalisés",
                    "Documentation : Rédaction de spécifications techniques structurées sur Confluence pour l'alignement des équipes"
                ],
                skills: ["Kotlin", "Coroutines", "Atomic Design", "Koin", "Room", "TeamCity", "Architecture Hexagonale"]
            },
            {
                id: 3,
                period: "Septembre 2018 - Août 2020",
                role: "Senior Développeur Android",
                company: "John Paul (Accor Hotels)",
                logo: "/logo_HN.svg",
                description: "Développement d'une application modulaire pour le service de conciergerie Accor Hotels et de fonctionnalités pour VISA et Toyota.",
                duration: "2 ans",
                startDate: "2018-09",
                endDate: "2020-08",
                highlights: [
                    "Modularité : Refactorisation du code commun en modules et migration vers Kotlin et AndroidX",
                    "Formulaires Dynamiques : Création d'un système de génération dynamique de formulaires via des configurations JSON",
                    "Sécurité : Chiffrement des données sensibles en vue de la préparation à la certification PCI",
                    "Intégrations : Google Maps/Places, Zendesk, et SDKs de paiement (Stripe, Adyen)"
                ],
                skills: ["Kotlin", "MVVM", "Dagger 2", "Retrofit", "Fastlane", "GitLab CI", "Sentry"]
            },
            {
                id: 4,
                period: "Décembre 2017 - Septembre 2018",
                role: "Senior Développeur Android",
                company: "LCL - Le Crédit Lyonnais",
                logo: "/logo_HN.svg",
                description: "Refonte profonde de l'application bancaire « LCL – Mes Comptes » et optimisation de la sécurité réseau.",
                duration: "10 mois",
                startDate: "2017-12",
                endDate: "2018-09",
                highlights: [
                    "Tech Migration : Lead du passage de Java vers Kotlin et transition vers une architecture MVP",
                    "Performance UI : Optimisation des layouts via ConstraintLayout pour améliorer la fluidité",
                    "Sécurité Réseau : Migration vers Retrofit avec implémentation de SSL pinning",
                    "Banking : Développement des fonctionnalités de virements permanents et différés"
                ],
                skills: ["Kotlin", "Retrofit", "SSL Pinning", "MVP", "ConstraintLayout", "Jenkins", "Sonar"]
            },
            {
                id: 5,
                period: "Janvier 2012 - Novembre 2017",
                role: "Lead Développeur Android",
                company: "Proxym-IT Agency",
                logo: "/logo_HN.svg",
                description: "Lead développeur sur de nombreux projets clients stratégiques (Allianz connect, BOZER, VanCleef & Arpel, Dior, etc.).",
                duration: "5+ ans",
                startDate: "2012-01",
                endDate: "2017-11",
                highlights: [
                    "SDK Banking : Développement d'un SDK spécialisé dans la dématérialisation des dépôts de chèques",
                    "Architecture : Mise en place d'architectures modulaires utilisant Dagger 2 et RxJava",
                    "Multi-domaine : Réalisation d'apps VOIP, messagerie instantanée (Tchapper) et guides touristiques"
                ],
                skills: ["Android SDK", "Java", "RxJava", "Dagger 2", "Retrofit", "SQLite", "Git"]
            }
        ]
    },
    portfolio: {
        title: "Mes Projets",
        viewAll: "Voir Tous les Projets",
        allCategory: "Tous",
        pageTitle: "Tous les Projets",
        pageDescription: "Explorez mon portfolio complet de projets de développement, design et applications mobiles.",
        backToHome: "Retour à l'accueil",
        showing: "Affichage de",
        projects: "projets",
        inCategory: "dans",
        noProjects: "Aucun projet trouvé",
        tryDifferentFilter: "Essayez de sélectionner une autre catégorie.",
        showAll: "Afficher Tous les Projets",
        viewProject: "Voir",
        breadcrumb: {
            home: "Accueil",
            portfolio: "Portfolio"
        },
        items: [
            {
                id: 1,
                title: "Plateforme E-commerce",
                category: "Développement",
                image: "https://placehold.co/600x400/1f1f1f/FFF",
                link: "#",
            },
            {
                id: 2,
                title: "Tableau de Bord Finance",
                category: "UI/UX",
                image: "https://placehold.co/600x400/1f1f1f/FFF",
                link: "#",
            },
            {
                id: 3,
                title: "App de Voyage",
                category: "Mobile",
                image: "https://placehold.co/600x400/1f1f1f/FFF",
                link: "#",
            },
            {
                id: 4,
                title: "Application Réseau Social",
                category: "Mobile",
                image: "https://placehold.co/600x400/1f1f1f/FFF",
                link: "#",
            },
            {
                id: 5,
                title: "Site Web Corporatif",
                category: "Web Design",
                image: "https://placehold.co/600x400/1f1f1f/FFF",
                link: "#",
            }
        ]
    },
    blog: {
        title: "Derniers articles du blog",
        description: "Réflexions, idées et tutoriels sur le développement web, le design et la technologie.",
        readMore: "Lire la suite",
        viewAll: "Voir Tous les Articles",
        searchPlaceholder: "Rechercher des articles...",
        filterByTopic: "Filtrer par sujet",
        clearFilters: "Effacer les filtres",
        notFound: "Aucun article trouvé correspondant à vos critères.",
        previous: "Précédent",
        next: "Suivant",
        breadcrumb: {
            home: "Accueil",
            blog: "Blog"
        },
        showing: "Affichage de",
        posts: "articles",
        taggedWith: "avec le tag",
        minRead: "min de lecture",
        tryAdjusting: "Essayez d'ajuster votre recherche ou vos filtres pour trouver ce que vous cherchez.",
        page: "Page",
        of: "sur"
    },
    skills: {
        title: "Mes Compétences",
        description: "Un aperçu complet de mon expertise technique et de mes capacités professionnelles.",
        professional: {
            title: "Professionnel",
            items: [
                "Gestion d’équipe",
                "Analyse technique & fonctionnelle",
                "Rédaction de documentation technique",
                "Collaboration avec les équipes",
                "Veiller à la qualité du code",
                "Relecture de code",
                "Roadmap Produit",
                "Gestion de Backlog"
            ]
        },
        technical: {
            title: "Technique",
            categories: [
                {
                    name: "Architecture",
                    items: ["Clean Arch", "Arch Modulaire", "MVVM", "MVI"]
                },
                {
                    name: "Développement",
                    items: ["Kotlin", "Android", "Jetpack Compose", "Room", "Coroutines", "Koin", "Hilt", "Gradle DSL", "Google Maps", "Ktor", "Retrofit", "Kotlin MultiPlatform", "Compose MultiPlatform"]
                },
                {
                    name: "Test pour mobile",
                    items: ["JUnit", "Robolectric", "Mockk", "Espresso"]
                },
                {
                    name: "Design Patterns",
                    items: ["Dependency Injection", "Singleton", "Observer", "Adapter", "Facade", "Repository"]
                },
                {
                    name: "CI/CD pour Mobile",
                    items: ["Jenkins", "Fastlane", "TeamCity", "GitHub Actions"]
                },
                {
                    name: "UX/UI pour Mobile",
                    items: ["Figma", "Overflow", "Zeplin"]
                },
                {
                    name: "Intelligence artificielle",
                    items: ["Copilot", "Gemini"]
                },
                {
                    name: "Qualité de code",
                    items: ["Sonar", "Detekt", "Lint", "Kover"]
                },
                {
                    name: "Gestion de version",
                    items: ["Git", "Gitflow"]
                },
                {
                    name: "Outils de collaboration",
                    items: ["Jira", "Confluence", "Redmine"]
                },
                {
                    name: "Outils d’analyse",
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
        address: "123 Rue, Paris, France",
        followMe: "Suivez-moi sur les réseaux sociaux",
        socials: [
            { icon: "Github", link: SITE_CONFIG.links.github },
            { icon: "Linkedin", link: SITE_CONFIG.links.linkedin },
            { icon: "Mail", link: `mailto:${SITE_CONFIG.email}` },
        ],
        form: {
            name: "Nom",
            email: "Email",
            subject: "Sujet",
            message: "Message",
            send: "Envoyer le Message",
            success: "Client email ouvert ! Votre message est prêt à être envoyé.",
            validation: {
                emailInvalid: "Veuillez entrer une adresse email valide",
                required: "Ce champ est requis"
            }
        }
    },
    footer: {
        rights: "Tous droits réservés.",
        backToTop: "Retour en haut",
        newsletter: {
            title: "Abonnez-vous à ma newsletter",
            description: "Recevez les dernières actualités et mises à jour."
        }
    },
    chat: {
        greeting: "Bonjour ! Je suis l'assistant de Hatem. 👋",
        intro: "Je suis toujours ouvert à la discussion de nouveaux projets, d'idées créatives ou d'opportunités de faire partie de vos visions.",
        askMe: "N'hésitez pas à me poser des questions sur mes compétences, mon expérience, ou simplement à dire bonjour !",
        header: "Discutons",
        subtitle: "Posez vos questions",
        placeholder: "Posez une question...",
        contactMe: "Me contacter",
        viewResume: "Voir le CV",
        thinking: "Réflexion...",
        errorMessage: "Désolé, j'ai eu du mal à répondre. Veuillez contacter directement à",
        suggestedQuestions: [
            "Quelles sont vos compétences ?",
            "Parlez-moi de votre expérience",
            "Êtes-vous disponible ?",
            "Sur quels projets avez-vous travaillé ?"
        ]
    },
    notFound: {
        title: "404",
        subtitle: "Page Non Trouvée",
        message: "Désolé, la page que vous recherchez n'existe pas ou a été déplacée.",
        home: "Accueil",
        contact: "Me Contacter"
    }
};
