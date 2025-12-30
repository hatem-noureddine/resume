# Getting Started

[← Back to Home](Home)

This guide will help you set up the portfolio website for local development.

## Prerequisites

- **Node.js** 18.17 or later
- **npm** 9+ or **pnpm**
- **Git**

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/hatem-noureddine/resume.git
cd resume
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Add your API keys to `.env.local`:

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | [Groq Console](https://console.groq.com) - Powers AI chatbot | Yes (for chat) |

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run storybook` | Start Storybook |
| `npm run verify` | Run all checks (lint, test, build, e2e) |

## Project Structure

```
src/
├── app/               # Next.js App Router pages
├── components/        # React components
├── config/            # Site configuration
├── content/           # Keystatic CMS content
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
└── locales/           # Translation files
```

## Next Steps

- [Architecture](Architecture) - Understand the system design
- [Development Guide](Development-Guide) - Learn coding standards
- [Components](Components) - Explore the UI library
