# Project Context

## Purpose
[Describe your project's purpose and goals]

## Tech Stack
- Bun.js for runtime and package management
- TypeScript for type-safe development
- Vite for build tooling and dev server

## Project Conventions

### Code Style
[Describe your code style preferences, formatting rules, and naming conventions]

### Architecture Patterns
[Document your architectural decisions and patterns]

### Testing Strategy
[Explain your testing approach and requirements]

### Git Workflow
[Describe your branching strategy and commit conventions]

## Domain Context
[Add domain-specific knowledge that AI assistants need to understand]

## Important Constraints
[List any technical, business, or regulatory constraints]

## External Dependencies
[Document key external services, APIs, or systems]

## Deployment

### GitHub Pages
The application is automatically deployed to GitHub Pages on each push to the `main` branch.

**Deployment URL**: https://lirc572.github.io/tomato/

**Enabling GitHub Pages**:
1. Go to Repository Settings → Pages
2. Under "Build and deployment", select "GitHub Actions" as the source
3. The workflow (`.github/workflows/deploy.yml`) will automatically deploy on push to main

**Troubleshooting**:
- If deployment fails, check the Actions tab for workflow run logs
- Ensure the repository is public (or GitHub Pages is enabled for private repos)
- Verify the `dist` folder is being created by the build step
