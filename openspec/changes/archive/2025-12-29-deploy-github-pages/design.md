# Design: GitHub Pages Deployment

## Architecture Overview

The deployment pipeline follows a standard GitHub Actions pattern:
```
Push to main → Trigger workflow → Install dependencies → Build → Deploy to Pages
```

## Workflow Design

### Trigger
- **Event**: Push to `main` branch
- **Branch protection**: Workflow runs after commits are pushed (no manual approval needed for initial implementation)

### Runner
- **OS**: Ubuntu latest
- **Bun.js**: Use bun for dependency installation and build process

### Steps
1. **Checkout**: Clone repository
2. **Setup Bun**: Install Bun.js
3. **Install dependencies**: `bun install`
4. **Build**: `bun run build` (runs `tsc && vite build`)
5. **Deploy**: Upload `dist` folder to GitHub Pages

### Deployment Method
- **Strategy**: GitHub Actions `actions/deploy-pages` action
- **Artifact**: Upload `dist` folder as an artifact
- **Publishing source**: GitHub Actions artifact (recommended for workflow deployments)

## Build Output Configuration

The Vite build outputs to `dist` by default. GitHub Pages will serve the contents of this folder at the root URL.

### Path Considerations
- The app is a SPA (Single Page Application)
- VitePWA plugin handles fallback to `index.html` for client-side routing
- No base path configuration needed (app lives at root)

## Security Considerations

- No secrets required for public repository deployment
- Workflow uses GitHub's automatically provided `GITHUB_TOKEN`
- `GITHUB_TOKEN` has permission to deploy Pages

## Caching

- GitHub Actions automatically caches bun's dependency cache
- Build artifacts cached between workflow runs where possible

## Alternative Approaches Considered

### Deploy from gh-pages branch
- Pros: Simple, explicit history
- Cons: Requires additional checkout/deploy steps, branch management

### Deploy from /docs folder
- Pros: Everything in one branch
- Cons: Mixes source and build, complicates git history

### GitHub Actions artifact (chosen)
- Pros: Clean separation, recommended by GitHub, automatic artifact management
- Cons: Slightly more complex initial setup
