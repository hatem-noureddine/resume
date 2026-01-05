# Deployment

[← Back to Home](Home)

This project is optimized for deployment on [Vercel](https://vercel.com), the creators of Next.js.

## Prerequisites

- GitHub account with the repository
- Vercel account (free tier works)
- Groq API key for the AI chatbot

## Step 1: Push to GitHub

Ensure your project is pushed to a GitHub repository:

```bash
git add .
git commit -m "Ready for deployment"
git push
```

## Step 2: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **Import** next to your GitHub repository
3. In the **Configure Project** step:
   - Framework Preset: **Next.js** (detected automatically)
   - Root Directory: `./` (default)
   - Build Command: `next build` (default)

## Step 3: Configure Environment Variables

This is critical for the AI chatbot to function.

1. Expand **Environment Variables** section
2. Add the following:

| Key | Value | Description |
|-----|-------|-------------|
| `GROQ_API_KEY` | Your API key | From [Groq Console](https://console.groq.com) |

## Step 4: Deploy

Click **Deploy**. Vercel will build your project and provide a production URL.

## Automatic Deployments

Once connected:
- **Production**: Every push to `main` triggers a production deploy
- **Preview**: Every PR gets a preview deployment

## Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes (for chat) | Powers AI chatbot |

## Vercel Features Used

- ✅ Edge Functions (API routes)
- ✅ Image Optimization
- ✅ Analytics & Speed Insights
- ✅ Preview Deployments

## Related Docs

- [Getting Started](Getting-Started) - Local setup
- [Architecture](Architecture) - System design
