export const fr = {
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
        roles: ["Développeur Android", "Architecte Mobile", "Lead Tech", "Expert Kotlin"],
        description:
            "Je décompose les problèmes d'expérience utilisateur complexes pour créer des solutions intègres qui connectent des milliards de personnes",
        downloadCV: "Télécharger CV",
        followMe: "Suivez-moi",
        availableForHire: "Disponible",
        scrollDown: "Défiler pour explorer",
        stats: [
            { value: "12", label: "Années d'Expérience" },
            { value: "50+", label: "Projets Terminés" },
            { value: "1.5k", label: "Clients Satisfaits" },
        ],
        floatingCards: {
            projects: { value: "50+", label: "Projets", sublabel: "Terminés" },
            experience: { value: "12", label: "Années", sublabel: "d'Expérience" }
        },
        image: "/resume/profile.png",
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
                period: "2020 - Présent",
                role: "Développeur Lead",
                company: "Tech Solutions Inc.",
                description: "Direction de l'équipe frontend et architecture de solutions évolutives pour les clients entreprise.",
                duration: "4+ ans",
                startDate: "2020-01",
                highlights: [
                    "Direction d'une équipe de 8 développeurs pour livrer 15+ projets dans les délais",
                    "Architecture de microservices réduisant le temps de chargement de 40%",
                    "Implémentation du pipeline CI/CD améliorant la fréquence de déploiement par 3x"
                ],
                skills: ["Kotlin", "Android", "Jetpack Compose", "MVVM", "CI/CD"]
            },
            {
                id: 2,
                period: "2018 - 2020",
                role: "Développeur Android Senior",
                company: "Creative Agency",
                description: "Développement d'applications mobiles haute performance pour des marques mondiales.",
                duration: "2 ans",
                startDate: "2018-01",
                endDate: "2020-01",
                highlights: [
                    "Construction de 5 applications avec 1M+ téléchargements combinés",
                    "Réduction du taux de crash de 85% grâce à une gestion d'erreurs appropriée",
                    "Mentorat de 3 développeurs juniors sur les meilleures pratiques"
                ],
                skills: ["Kotlin", "Android", "Room", "Retrofit", "Koin"]
            },
            {
                id: 3,
                period: "2016 - 2018",
                role: "Développeur Android",
                company: "StartUp Hub",
                description: "Collaboration avec des développeurs seniors pour construire des produits MVP pour startups.",
                duration: "2 ans",
                startDate: "2016-01",
                endDate: "2018-01",
                highlights: [
                    "Développement de 3 applications MVP from scratch",
                    "Intégration d'APIs REST et SDKs tiers",
                    "Participation aux sprints agiles et revues de code"
                ],
                skills: ["Java", "Android", "SQLite", "APIs REST"]
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
        email: "hatem.noureddine.pro@gmail.com",
        phone: "+01 123 654 8096",
        addressLabel: "Adresse Postale",
        emailLabel: "Email",
        phoneLabel: "Téléphone",
        address: "123 Rue, Paris, France",
        followMe: "Suivez-moi sur les réseaux sociaux",
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
        backToTop: "Retour en haut"
    }
};
