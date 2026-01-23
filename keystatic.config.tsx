import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
    storage: {
        kind: 'local',
    },
    collections: {
        blog: collection({
            label: 'Blog Posts',
            slugField: 'title',
            path: 'src/content/posts/*',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                date: fields.date({ label: 'Published Date' }),
                description: fields.text({ label: 'Description', multiline: true }),
                category: fields.text({ label: 'Category' }),
                tags: fields.array(fields.text({ label: 'Tag' }), {
                    label: 'Tags',
                    itemLabel: (props) => props.value,
                }),
                content: fields.markdoc({
                    label: 'Content',
                }),
                language: fields.relationship({
                    label: 'Language',
                    collection: 'languages',
                    validation: { isRequired: true }
                }),
            },
        }),
        projects: collection({
            label: 'Projects',
            slugField: 'title',
            path: 'src/content/projects/*',
            format: { data: 'json' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                category: fields.text({ label: 'Category' }),
                image: fields.text({ label: 'Main Image URL' }),
                link: fields.text({ label: 'External Project Link' }),
                description: fields.text({ label: 'Short Description', multiline: true }),
                technologies: fields.array(fields.text({ label: 'Technology' }), {
                    label: 'Tech Stack',
                    itemLabel: (props) => props.value,
                }),
                gallery: fields.array(fields.text({ label: 'Image URL' }), {
                    label: 'Gallery Images',
                    itemLabel: (props) => props.value,
                }),
                content: fields.markdoc({ label: 'Detailed Case Study Content' }),
                language: fields.relationship({
                    label: 'Language',
                    collection: 'languages',
                    validation: { isRequired: true }
                }),
            },
        }),
        experience: collection({
            label: 'Experience',
            slugField: 'company',
            path: 'src/content/experience/*',
            format: { data: 'json' },
            schema: {
                company: fields.slug({ name: { label: 'Company' } }),
                role: fields.text({ label: 'Role' }),
                startDate: fields.text({ label: 'Start Date (YYYY-MM)' }),
                endDate: fields.text({ label: 'End Date (YYYY-MM or Present)' }),
                description: fields.text({ label: 'Short Description', multiline: true }),
                highlights: fields.array(fields.text({ label: 'Highlight' }), {
                    label: 'Highlights',
                    itemLabel: (props) => props.value,
                }),
                skills: fields.array(fields.text({ label: 'Skill' }), {
                    label: 'Skills Used',
                    itemLabel: (props) => props.value,
                }),
                language: fields.relationship({
                    label: 'Language',
                    collection: 'languages',
                    validation: { isRequired: true }
                }),
            },
        }),
        skills: collection({
            label: 'Skills',
            slugField: 'name',
            path: 'src/content/skills/*',
            format: { data: 'json' },
            schema: {
                name: fields.slug({ name: { label: 'Skill Name' } }),
                category: fields.select({
                    label: 'Category',
                    options: [
                        { label: 'Architecture', value: 'architecture' },
                        { label: 'Development', value: 'development' },
                        { label: 'Testing', value: 'testing' },
                        { label: 'Design Patterns', value: 'design-patterns' },
                        { label: 'CI/CD', value: 'ci-cd' },
                        { label: 'UX/UI', value: 'ux-ui' },
                        { label: 'AI (IA)', value: 'ai' },
                        { label: 'Code Quality', value: 'code-quality' },
                        { label: 'Version Control', value: 'version-control' },
                        { label: 'Collaboration', value: 'collaboration' },
                        { label: 'Analytics', value: 'analytics' },
                        { label: 'Other', value: 'other' },
                    ],
                    defaultValue: 'other',
                }),
                isProfessional: fields.checkbox({
                    label: 'Is Professional Skill?',
                    description: 'Check if this is a "competence" vs a technical tool.',
                    defaultValue: false,
                }),
                proficiency: fields.integer({
                    label: 'Proficiency (0-100)',
                    validation: { min: 0, max: 100 },
                }),
                language: fields.relationship({
                    label: 'Language',
                    collection: 'languages',
                    validation: { isRequired: true }
                }),
            },
        }),
        resumes: collection({
            label: 'Resume Versions',
            slugField: 'label',
            path: 'src/content/resumes/*',
            format: { data: 'json' },
            schema: {
                label: fields.slug({ name: { label: 'Label (e.g. Detailed, Compact)' } }),
                language: fields.relationship({
                    label: 'Language',
                    collection: 'languages',
                    validation: { isRequired: true }
                }),
                file: fields.file({
                    label: 'PDF File',
                    directory: 'public/files/resumes',
                    publicPath: '/files/resumes/',
                    validation: { isRequired: true }
                }),
            },
        }),
        testimonials: collection({
            label: 'Testimonials',
            slugField: 'author',
            path: 'src/content/testimonials/*',
            format: { data: 'json' },
            schema: {
                author: fields.slug({ name: { label: 'Author Name' } }),
                role: fields.text({ label: 'Job Role/Title' }),
                company: fields.text({ label: 'Company Name' }),
                content: fields.text({ label: 'Testimonial Content', multiline: true }),
                avatar: fields.text({ label: 'Avatar URL or initials' }),
                rating: fields.integer({
                    label: 'Star Rating (1-5)',
                    validation: { min: 1, max: 5 },
                    defaultValue: 5,
                }),
                language: fields.relationship({
                    label: 'Language',
                    collection: 'languages',
                    validation: { isRequired: true }
                }),
            },
        }),
        certifications: collection({
            label: 'Certifications',
            slugField: 'name',
            path: 'src/content/certifications/*',
            format: { data: 'json' },
            schema: {
                name: fields.slug({ name: { label: 'Certification Name' } }),
                issuer: fields.text({ label: 'Issuing Organization' }),
                date: fields.date({ label: 'Issue Date' }),
                expiryDate: fields.date({ label: 'Expiry Date (Optional)' }),
                credentialId: fields.text({ label: 'Credential ID' }),
                credentialUrl: fields.text({ label: 'Credential URL' }),
                badge: fields.text({ label: 'Badge Image URL' }),
                category: fields.select({
                    label: 'Category',
                    options: [
                        { label: 'Cloud', value: 'cloud' },
                        { label: 'Frontend', value: 'frontend' },
                        { label: 'Backend', value: 'backend' },
                        { label: 'AI/ML', value: 'ai' },
                        { label: 'Other', value: 'other' },
                    ],
                    defaultValue: 'other',
                }),
                language: fields.relationship({
                    label: 'Language',
                    collection: 'languages',
                    validation: { isRequired: true }
                }),
            },
        }),
        languages: collection({
            label: 'Languages',
            slugField: 'code',
            path: 'src/content/languages/*',
            format: { data: 'json' },
            schema: {
                code: fields.slug({ name: { label: 'Language Code (e.g. en, fr, es)' } }),
                name: fields.text({ label: 'Language Name (e.g. English)' }),
                flag: fields.text({ label: 'Flag Emoji' }),
                isEnabled: fields.checkbox({ label: 'Enabled', defaultValue: true }),
            },
        }),
    },
    singletons: {
        linkedinSync: singleton({
            label: 'LinkedIn Synchronization',
            path: 'src/content/linkedin-sync',
            schema: {
                profileUrl: fields.text({
                    label: 'LinkedIn Profile URL',
                    description: 'The URL of the LinkedIn profile to sync from. [🚀 Trigger LinkedIn Sync](/api/sync/linkedin)',
                    validation: { isRequired: true }
                }),
                lastSyncDate: fields.text({
                    label: 'Last Successful Sync',
                    description: 'Date and time of the last successful synchronization.',
                    validation: { isRequired: false },
                }),
                syncLogs: fields.text({
                    label: 'Sync Logs',
                    multiline: true,
                }),
            },
        }),
        theme: singleton({
            label: 'Theme Settings',
            path: 'src/content/theme',
            format: { data: 'json' },
            schema: {
                primaryColor: fields.text({
                    label: '🔵 Primary Color',
                    description: 'Main brand color in HEX format',
                    defaultValue: '#2c75ff',
                    validation: { length: { min: 4, max: 9 } }
                }),
                primaryDark: fields.text({
                    label: '🔷 Primary Dark Color',
                    description: 'Darker shade of primary for hover states',
                    defaultValue: '#185ad7',
                    validation: { length: { min: 4, max: 9 } }
                }),
                lightMode: fields.object({
                    background: fields.text({
                        label: '⬜ Background Color',
                        description: 'Page background in Light Mode',
                        defaultValue: '#fafafa',
                        validation: { length: { min: 4, max: 9 } }
                    }),
                    foreground: fields.text({
                        label: '⬛ Text Color',
                        description: 'Main text color in Light Mode',
                        defaultValue: '#171717',
                        validation: { length: { min: 4, max: 9 } }
                    }),
                    secondary: fields.text({
                        label: '🔲 Secondary Background',
                        description: 'Cards, inputs background',
                        defaultValue: '#f4f4f5',
                        validation: { length: { min: 4, max: 9 } }
                    }),
                    secondaryForeground: fields.text({
                        label: '🔳 Secondary Text Color',
                        description: 'Muted text color',
                        defaultValue: '#52525b',
                        validation: { length: { min: 4, max: 9 } }
                    })
                }, { label: '☀️ Light Mode Colors' }),
                darkMode: fields.object({
                    background: fields.text({
                        label: '⬛ Background Color',
                        description: 'Page background in Dark Mode',
                        defaultValue: '#0f0f0f',
                        validation: { length: { min: 4, max: 9 } }
                    }),
                    foreground: fields.text({
                        label: '⬜ Text Color',
                        description: 'Main text color in Dark Mode',
                        defaultValue: '#ededed',
                        validation: { length: { min: 4, max: 9 } }
                    }),
                    secondary: fields.text({
                        label: '🔳 Secondary Background',
                        description: 'Cards, inputs background',
                        defaultValue: '#1f1f1f',
                        validation: { length: { min: 4, max: 9 } }
                    }),
                    secondaryForeground: fields.text({
                        label: '🔲 Secondary Text Color',
                        description: 'Muted text color',
                        defaultValue: '#a1a1aa',
                        validation: { length: { min: 4, max: 9 } }
                    })
                }, { label: '🌙 Dark Mode Colors' }),
                highContrast: fields.object({
                    background: fields.text({
                        label: '⬜ HC Background',
                        description: 'Page background',
                        defaultValue: '#ffffff',
                        validation: { length: { min: 4, max: 9 } }
                    }),
                    foreground: fields.text({
                        label: '⬛ HC Text',
                        description: 'Main text color',
                        defaultValue: '#000000',
                        validation: { length: { min: 4, max: 9 } }
                    }),
                    primary: fields.text({
                        label: '🔵 HC Primary',
                        description: 'Primary brand color',
                        defaultValue: '#0000ee',
                        validation: { length: { min: 4, max: 9 } }
                    }),
                    primaryDark: fields.text({
                        label: '🔷 HC Primary Dark',
                        description: 'Darker primary shade',
                        defaultValue: '#000099',
                        validation: { length: { min: 4, max: 9 } }
                    }),
                    secondary: fields.text({
                        label: '🔲 HC Secondary',
                        description: 'Secondary background',
                        defaultValue: '#f0f0f0',
                        validation: { length: { min: 4, max: 9 } }
                    }),
                    secondaryForeground: fields.text({
                        label: '🔳 HC Secondary Text',
                        description: 'Secondary text color',
                        defaultValue: '#000000',
                        validation: { length: { min: 4, max: 9 } }
                    })
                }, { label: '👁️ High Contrast (Light)' }),
                highContrastDark: fields.object({
                    background: fields.text({
                        label: '⬛ HC Dark Background',
                        description: 'Page background',
                        defaultValue: '#000000',
                        validation: { length: { min: 4, max: 9 } }
                    }),
                    foreground: fields.text({
                        label: '⬜ HC Dark Text',
                        description: 'Main text color',
                        defaultValue: '#ffffff',
                        validation: { length: { min: 4, max: 9 } }
                    }),
                    primary: fields.text({
                        label: '🟡 HC Dark Primary',
                        description: 'Primary brand color',
                        defaultValue: '#ffff00',
                        validation: { length: { min: 4, max: 9 } }
                    }),
                    primaryDark: fields.text({
                        label: '🔶 HC Dark Primary Dark',
                        description: 'Darker primary shade',
                        defaultValue: '#cccc00',
                        validation: { length: { min: 4, max: 9 } }
                    }),
                    secondary: fields.text({
                        label: '🔳 HC Dark Secondary',
                        description: 'Secondary background',
                        defaultValue: '#1a1a1a',
                        validation: { length: { min: 4, max: 9 } }
                    }),
                    secondaryForeground: fields.text({
                        label: '⬜ HC Dark Secondary Text',
                        description: 'Secondary text color',
                        defaultValue: '#ffffff',
                        validation: { length: { min: 4, max: 9 } }
                    })
                }, { label: '👁️ High Contrast (Dark)' })
            }
        }),
    },
});
