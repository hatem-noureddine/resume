# Deploying to GitHub Pages

This project is configured to automatically deploy to GitHub Pages using GitHub Actions whenever you push to the `main` or `master` branch.

## Prerequisites

-   A GitHub account.
-   Git installed locally.

## Step 1: Create a GitHub Repository

1.  Go to [github.com/new](https://github.com/new).
2.  Name your repository (e.g., `my-resume-site` or `username.github.io`).
3.  Set visibility (Public or Private). **Note**: GitHub Pages for Private repositories requires a Pro account.
4.  Do **not** initialize with README, .gitignore, or License (we have these already).
5.  Click **Create repository**.

## Step 2: Push Your Code

In your project folder (active terminal), run these commands replacing `<USERNAME>` and `<REPO>` with your details:

```bash
# Initialize git if not already done (it likely is)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Link to your new GitHub repository
git remote add origin https://github.com/<USERNAME>/<REPO>.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Configure GitHub Pages

1.  Go to your repository on GitHub.
2.  Navigate to **Settings** > **Pages** (sidebar).
3.  Under **Build and deployment** > **Source**, select **GitHub Actions**.
4.  That's it! The workflow file I created (`.github/workflows/deploy.yml`) will automatically detect this and start building.

## Step 4: Verify Deployment

1.  Click on the **Actions** tab in your repository to see the "Deploy to GitHub Pages" workflow running.
2.  Once green (success), click on the workflow run.
3.  Under the **deploy** job, you'll see the URL to your live site (e.g., `https://username.github.io/repo-name`).

## Important Note on Base Path

If your repository name is **not** `username.github.io` (e.g., it is `my-resume`), your site will be served at `https://username.github.io/my-resume`.

You **must** update `next.config.mjs` to handle this subpath, otherwise assets (images, CSS) won't load:

1.  Open `next.config.mjs`.
2.  Add `basePath: "/<REPO_NAME>",`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: "/my-resume", // Replace with your repository name
  images: {
    unoptimized: true,
  },
};
export default nextConfig;
```

3.  Commit and push this change: `git add . && git commit -m "Update base path" && git push`

If you named your repo `username.github.io`, you can skip this note!
