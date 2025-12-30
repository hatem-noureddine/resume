# Configuration Files

This folder contains all the configuration and content that can be easily updated without touching the code.

## Files

### `site.ts` - Site Configuration
Contains:
- **Name, title, description** - Your personal info
- **Contact info** - Email, phone, address
- **Social links** - GitHub, LinkedIn, Twitter
- **SEO metadata** - Open Graph, Twitter cards
- **Formspree ID** - Contact form configuration

### `resume.ts` - Resume Data for Chatbot
Contains:
- **Summary** - Brief professional summary
- **Skills** - Technical skills by category
- **Experience** - Work history with highlights
- **Education** - Academic background
- **Languages** - Spoken languages
- **Availability** - Hiring status

## How to Update

1. Open the file you want to edit
2. Update the values between the quotes
3. Save the file
4. Commit and push to deploy

## Example: Updating Your Name

In `site.ts`:
```typescript
export const SITE_CONFIG = {
    name: "Your Name Here",  // ← Change this
    ...
};
```

## Example: Adding Experience

In `resume.ts`:
```typescript
experience: [
    {
        title: "Job Title",
        company: "Company Name",
        period: "2022 - Present",
        location: "City, Country",
        highlights: [
            "Achievement 1",
            "Achievement 2"
        ]
    },
    // Add more jobs here
],
```
