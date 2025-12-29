# Project Context

## Purpose
Tomato is a minimalist Pomodoro timer application designed to help users maintain focus through structured work sessions. The app provides 25-minute focus intervals with 5-minute short breaks and 15-minute long breaks, featuring a clean, distraction-free interface with visual progress tracking and browser notifications.

## Tech Stack
- Bun.js for runtime and package management
- TypeScript for type-safe development
- Vite for build tooling and dev server
- Vite PWA plugin for offline support and installation
- Vanilla JavaScript/TypeScript (no framework dependencies)

## Project Conventions

### Code Style
- Use Biome for formatting and linting (run `bun format`)
- TypeScript strict mode enabled
- Prefer explicit type definitions over `any`
- Use semantic variable names that clearly indicate purpose
- Keep functions focused and single-responsibility
- Avoid non-null assertions (`!`); use proper null checks with optional chaining

### Architecture Patterns
- **Module Pattern**: Code organized into focused modules (timer, storage, app, pwa)
- **Event-Driven**: Timer module uses EventEmitter pattern for UI updates
- **State Machine**: Session transitions follow explicit state machine pattern (focus → short-break → focus → long-break cycle)
- **Immutable State Updates**: State is updated through controlled methods, not direct mutation
- **Separation of Concerns**: Timer logic, storage, and UI are decoupled through interfaces

### localStorage Key Structure
All localStorage keys use the `tomato_` prefix:
- `tomato_focusDuration`: Focus session length in seconds (default: 1500)
- `tomato_shortBreakDuration`: Short break length in seconds (default: 300)
- `tomato_longBreakDuration`: Long break length in seconds (default: 900)
- `tomato_sessionCount`: Number of completed focus sessions
- `tomato_lastSessionType`: String indicating the last session type ('focus', 'short-break', 'long-break')

### Testing Strategy
- Manual testing of timer accuracy across session types
- Verify localStorage persistence across browser sessions
- Test PWA offline functionality
- Validate responsive design on mobile (320px+) and desktop viewports
- Test notification permissions and display

### Git Workflow
- Conventional commits with clear, descriptive messages
- Feature branches for larger changes
- Main branch is auto-deployed to GitHub Pages

## Domain Context

### Pomodoro Technique
The Pomodoro Technique is a time management method that breaks work into 25-minute intervals separated by short breaks. After four focus sessions, a longer break (15-30 minutes) is taken. This pattern helps maintain mental agility and prevent burnout.

### Session Types
1. **Focus**: Primary work session (default 25 minutes)
2. **Short Break**: Brief rest between focus sessions (default 5 minutes)
3. **Long Break**: Extended rest after 4 focus sessions (default 15 minutes)

### Session Transition Logic
- After focus session → short break (or long break if session count is multiple of 4)
- After short break → focus
- After long break → focus
- Session count increments only after focus sessions

## Important Constraints
- **Minimal Complexity**: Keep the app simple and focused; avoid feature creep
- **No External Dependencies**: Timer runs entirely client-side without API calls
- **Browser Notifications**: Use native browser notifications instead of custom audio
- **Responsive Design**: Must work well on mobile devices (minimum 320px width)
- **Offline Support**: Full functionality available without internet connection

## External Dependencies
- None for core functionality
- Browser APIs: localStorage, Notification API, Service Worker API

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
