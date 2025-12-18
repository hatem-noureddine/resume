# Deploying to Vercel (Recommended)

This project is optimized for deployment on [Vercel](https://vercel.com), the creators of Next.js. Vercel provides zero-configuration deployment, Edge Functions (required for the AI chatbot), and Analytics.

## Step 1: Push to GitHub

Ensure your project is pushed to a GitHub repository:

```bash
git add .
git commit -m "Ready for deployment"
git push
```

## Step 2: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Click **Import** next to your GitHub repository.
3. In the **Configure Project** step:
   - Framework Preset: **Next.js** (detected automatically)
   - Root Directory: `./` (default)
   - Build Command: `next build` (default)

## Step 3: Configure Environment Variables

This is critical for the AI chatbot to function.

1. Expand the **Environment Variables** section.
2. Add the following variable:
   - **Key**: `GROQ_API_KEY`
   - **Value**: Your API key from [Groq Console](https://console.groq.com)

3. (Optional) If using Vercel Analytics, no extra var is needed usually, but you can enable it in the dashboard after deployment.

## Step 4: Deploy

Click **Deploy**. Vercel will build your project and provide a production URL (e.g., `https://your-project.vercel.app`).
