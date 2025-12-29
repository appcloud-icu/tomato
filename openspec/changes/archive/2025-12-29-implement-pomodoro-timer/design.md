# Design: Pomodoro Timer Implementation

## Architecture

### Component Structure
```
TimerModule (class)
├── TimerState (interface)
├── TimerConfig (interface)
└── Event handling
```

### Core Modules

**1. Timer Module (`timer.ts`)**
- Centralized timer logic using `setInterval` for countdown
- State machine pattern for session transitions
- EventEmitter pattern for UI updates
- Immutable state updates for predictability

**2. Storage Module (`storage.ts`)**
- Wrapper around localStorage API
- Type-safe key management
- Default value handling
- Schema validation for stored data

**3. UI Module (`app.ts`)**
- DOM manipulation and rendering
- Event binding and user interactions
- Notification integration
- Settings modal management

### Data Flow

```
User Action → UI Event → Timer Module → State Update → EventEmitter → UI Update
                                   ↓
                            Storage Module (persist)
```

## Key Design Decisions

### 1. Vanilla JavaScript/TypeScript
**Rationale**: Project already uses vanilla JS in main.ts. No framework dependency keeps bundle size minimal and reduces complexity. The timer logic is straightforward and doesn't need reactive state management.

### 2. Class-based Timer Module
**Rationale**: Encapsulates timer logic, state, and events in one cohesive unit. Makes testing easier (timer class can be tested in isolation). Clear lifecycle management (start, pause, reset).

### 3. Session State Machine
**Rationale**: Pomodoro has clear states (Focus → Short Break → Focus → Long Break). State machine pattern makes transitions explicit and prevents invalid state combinations.

### 4. localStorage for Persistence
**Rationale**: Simple, synchronous, no external dependencies. Suitable for user preferences and session count. No need for IndexedDB complexity for this use case.

### 5. Browser Notifications over Custom Audio
**Rationale**: Browser notifications work across devices, respect system settings, and require no audio asset management. Custom audio would need asset loading and could be jarring.

### 6. Modal for Settings
**Rationale**: Keeps main UI minimal. Settings are infrequently changed. Modal provides clear separation between active timer and configuration.

### 7. Circular Progress Indicator
**Rationale**: More visually engaging than linear progress bar. Naturally maps to time remaining. Fits minimalist aesthetic better than complex charts.

## Technical Considerations

### Timer Accuracy
- `setInterval` can drift over time; use `Date.now()` delta for accuracy
- Pause/resume must account for elapsed time during inactivity
- Consider visibility API to pause timer when tab is hidden (optional enhancement)

### State Management
- Single source of truth in TimerModule
- UI is pure function of state
- Event-driven updates avoid tight coupling

### Responsiveness
- CSS Grid/Flexbox for layout
- `clamp()` for fluid typography
- Touch-friendly button sizes (min 44px height)
- Viewport meta tag already configured

### Accessibility
- ARIA labels for controls
- Keyboard navigation support
- High contrast colors for visibility
- Reduced motion preference support

### PWA Integration
- Existing service worker handles offline caching
- Timer runs entirely client-side
- No API calls needed (self-contained app)

## Trade-offs

| Decision | Benefit | Cost |
|----------|---------|------|
| Vanilla JS | No build overhead, small bundle | Manual DOM management |
| Class-based | Clear encapsulation | Less functional than hooks/fx |
| localStorage | Simple persistence | No cross-device sync |
| Browser notifications | System-native | Requires permission grant |

## Future Extensions (Out of Scope)
- Session history and analytics
- Cross-device sync (requires backend)
- Sound themes
- Integration with task managers
- Statistics and charts
