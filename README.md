# Portfolio / Resume Website

A modern, responsive, and localized portfolio website built with **Next.js**, **Tailwind CSS**, and **Framer Motion**.

## 🚀 Getting Started

### Prerequisites

*   Node.js 18+ installed.
*   npm or yarn package manager.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd resume_1
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests

To run the test suite:
```bash
npm test
```

## 🛠️ Project Structure

*   `src/app`: Main application pages (Next.js App Router).
*   `src/components`: Reusable UI components.
    *   `sections`: High-level page sections (Hero, Skills, Experience, etc.).
    *   `ui`: Atomic components (Buttons, etc.).
*   `src/locales`: Localization files (`en.ts`, `fr.ts`, `es.ts`). **Update content here.**
*   `src/context`: Global state (Theme, Language).

## 📝 How to Update Content

The website's content is separated from the code in the `src/locales` directory.

1.  **Skills**:
    *   Open `src/locales/en.ts` (and other languages).
    *   Navigate to the `skills` object.
    *   Add/Remove items in `professional.items` or `technical.categories`.
2.  **Experience/Education**:
    *   Edit the `experience` array in the locale files.
3.  **Contact Info**:
    *   Update email, phone, and social links in the `contact` object.
4.  **Icons**:
    *   The `Skills` component automatically maps skill names to icons. To force a specific icon, use an object format: `{ name: "Your Skill", icon: "IconName" }` where `IconName` matches a Lucide React icon.

## 🚢 Deployment

This project is optimized for static deployment (e.g., Vercel, Netlify, GitHub Pages).

### Vercel (Recommended)

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Vercel will detect Next.js and configure the build automatically.

### GitHub Pages

1.  Update `next.config.ts` to enable static export:
    ```typescript
    const nextConfig = {
      output: 'export',
      images: { unoptimized: true } // Required for static export
    };
    ```
2.  Run `npm run build`.
3.  Deploy the `out` directory.

## 📄 Documentation

For more detailed technical choices, see [TECHNICAL.md](./TECHNICAL.md).
