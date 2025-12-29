# Change: Deploy to GitHub Pages

## Why
The project needs a reliable, automated deployment pipeline to make the application accessible via a public URL. GitHub Pages provides free hosting for static sites with automatic deployment from the repository.

## What Changes
- Create `.github/workflows/deploy.yml` with GitHub Actions workflow
- Configure workflow to install Bun.js and build the application
- Deploy built artifacts to GitHub Pages on push to main branch

## Impact
- Affected specs: github-pages-deployment
- Affected code: New workflow file at `.github/workflows/deploy.yml`
