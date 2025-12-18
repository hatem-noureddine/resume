# Hatem Noureddine - Portfolio Website

[![CI Pipeline](https://github.com/hatemnoureddine/resume/actions/workflows/ci.yml/badge.svg)](https://github.com/hatemnoureddine/resume/actions/workflows/ci.yml)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://hatem-noureddine-resume.vercel.app/)

A modern, responsive, and localized portfolio website built with **Next.js 16**, **Tailwind CSS v4**, and **Framer Motion**. Now with an **AI-powered chatbot** for interactive resume exploration!

## ✨ Features

- 🤖 **AI Chatbot** - Ask questions about skills and experience (powered by Groq)
- 🌍 **Multi-language** - English, French, Spanish support
- 🌓 **Dark/Light Mode** - Automatic system preference detection
- 📱 **Fully Responsive** - Mobile-first design
- ⚡ **Performance Optimized** - Dynamic imports, image optimization
- ♿ **Accessible** - WCAG 2.1 compliant with skip links
- 📝 **Blog** - Markdown-powered blog with categories
- 🔍 **SEO Ready** - Sitemap, meta tags, structured data
- 📊 **Analytics** - Vercel Analytics and Speed Insights
- ☠️ **Smart Skeletons** - Layout-matched loading states
- 📜 **Parallax Scrolling** - Immersive visual depth in Hero section

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/hatemnoureddine/resume.git
cd resume

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GROQ_API_KEY to .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Groq API key for AI chatbot | Yes (for chat) |

Get your free API key at [console.groq.com](https://console.groq.com).

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run storybook` | Start Storybook for component development |
| `npm run verify` | **Run all checks** (lint, test, build, e2e) |
| `npm run verify:quick` | Quick local check (lint, test, build) |

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI**: [Groq](https://groq.com/) (Llama 3.1)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Testing**: Jest, Playwright, axe-core, Storybook
- **Deployment**: [Vercel](https://vercel.com/)

## 📁 Project Structure

```
src/
├── app/               # Next.js App Router pages
│   └── api/           # API routes (chat endpoint)
├── components/        # React components
│   ├── chat/          # AI Chatbot widget
│   ├── layout/        # Header, Footer
│   ├── sections/      # Page sections
│   └── ui/            # Reusable UI atoms
├── config/            # Site configuration (easy to edit)
│   ├── site.ts        # Site metadata, URLs, links
│   └── resume.ts      # Resume data for AI chatbot
├── context/           # Global state (Theme, Language)
├── lib/               # Utilities
└── locales/           # Translation files (en, fr, es)
```

## 📝 Updating Content

### Easy Configuration (No Code Required)

Edit files in `src/config/`:

| File | What to Update |
|------|----------------|
| `site.ts` | Name, email, social links, URLs |
| `resume.ts` | Skills, experience, education for chatbot |

### Translations

Edit files in `src/locales/`:

| File | Language |
|------|----------|
| `en.ts` | English |
| `fr.ts` | French |
| `es.ts` | Spanish |

See [TECHNICAL.md](./TECHNICAL.md) for detailed architecture documentation.

## 🚢 Deployment

This project is deployed on **Vercel** for full Next.js features including:
- API Routes (for AI chatbot)
- Image Optimization
- Edge Functions
- Preview Deployments

### Deploy to Vercel

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add `GROQ_API_KEY` environment variable
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

Built with ❤️ by [Hatem Noureddine](https://hatem-noureddine-resume.vercel.app/)
