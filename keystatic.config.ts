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
            format: { contentField: 'content' },
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
            schema: {
                name: fields.slug({ name: { label: 'Skill Name' } }),
                category: fields.select({
                    label: 'Category',
                    options: [
                        { label: 'Frontend', value: 'frontend' },
                        { label: 'Backend', value: 'backend' },
                        { label: 'DevOps', value: 'devops' },
                        { label: 'Mobile', value: 'mobile' },
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
    },
});
