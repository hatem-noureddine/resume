# Hatem Noureddine - Portfolio Website

[![CI Pipeline](https://github.com/hatemnoureddine/resume/actions/workflows/ci.yml/badge.svg)](https://github.com/hatemnoureddine/resume/actions/workflows/ci.yml)
[![Deploy](https://github.com/hatemnoureddine/resume/actions/workflows/deploy.yml/badge.svg)](https://github.com/hatemnoureddine/resume/actions/workflows/deploy.yml)

A modern, responsive, and localized portfolio website built with **Next.js 16**, **Tailwind CSS v4**, and **Framer Motion**.

## ✨ Features

- 🌍 **Multi-language** - English, French, Spanish support
- 🌓 **Dark/Light Mode** - Automatic system preference detection
- 📱 **Fully Responsive** - Mobile-first design
- ⚡ **Performance Optimized** - Dynamic imports, image optimization
- ♿ **Accessible** - WCAG 2.1 compliant with skip links
- 📝 **Blog** - Markdown-powered blog with categories
- 🔍 **SEO Ready** - Sitemap, meta tags, structured data (Breadcrumbs)
- 🛡️ **RSL Compliant** - Responsible Source Licensing implementation (`license.xml`, `robots.txt`)
- ☠️ **Smart Skeletons** - Layout-matched loading states to minimize CLS
- 📜 **Parallax Scrolling** - Immersive visual depth in Hero section
- 📑 **Table of Contents** - Auto-generated for blog posts

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/hatemnoureddine/resume.git
cd resume

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run verify` | **Run all checks** (lint, test, build, e2e) |
| `npm run verify:quick` | Quick local check (lint, test, build) |

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: Jest, Playwright, axe-core
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
src/
├── app/               # Next.js App Router pages
├── components/        # React components
│   ├── layout/        # Header, Footer
│   ├── sections/      # Page sections
│   └── ui/            # Reusable UI atoms
├── context/           # Global state (Theme, Language)
├── data/              # Static data files
├── lib/               # Utilities
└── locales/           # Translation files
```

## 📝 Updating Content

Content is managed in the `src/locales/` directory:

1. **Personal Info** - Edit `hero` section in locale files
2. **Skills** - Update `skills.professional` and `skills.technical`
3. **Experience** - Modify `experience` array
4. **Contact** - Update `contact` object

See [TECHNICAL.md](./TECHNICAL.md) for detailed architecture documentation.

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions to:
- GitHub Pages
- Vercel
- Netlify

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

Built with ❤️ by [Hatem Noureddine](https://hatemnoureddine.github.io/resume/)
