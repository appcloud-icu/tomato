# Spec: Pomodoro Timer

## ADDED Requirements

### Requirement: Timer SHALL countdown accurately
The application SHALL display a countdown timer in MM:SS format for the current session type.

#### Scenario: User starts a focus session
Given the timer is in Focus mode
When the user clicks Start
Then the timer shall begin counting down from 25:00
And the time displayed shall update every second
And the Start button shall change to Pause

#### Scenario: User pauses timer
Given the timer is running
When the user clicks Pause
Then the countdown shall stop
And the current time shall remain displayed
And the Pause button shall change to Start

#### Scenario: Timer reaches zero
Given the timer is running
When the countdown reaches 00:00
Then the timer shall stop
And a browser notification shall be displayed
And the session type shall transition to the next in sequence

#### Scenario: User resets timer
Given the timer is paused or running
When the user clicks Reset
Then the timer shall reset to the full duration of the current session type
And the timer shall be in paused state

### Requirement: Application SHALL support session types
The application SHALL support three session types: Focus (25 min), Short Break (5 min), and Long Break (15 min), with automatic transitions between them.

#### Scenario: Focus session completes
Given the timer is in Focus mode
When the countdown reaches 00:00
Then the timer shall transition to Short Break mode
And the timer shall reset to 5:00

#### Scenario: Every 4th Focus session completes
Given the timer is in Focus mode
And 3 Focus sessions have been completed
When the countdown reaches 00:00
Then the timer shall transition to Long Break mode
And the timer shall reset to 15:00

#### Scenario: Break session completes
Given the timer is in Short Break or Long Break mode
When the countdown reaches 00:00
Then the timer shall transition to Focus mode
And the timer shall reset to 25:00
And the session counter shall increment

### Requirement: Application SHALL track completed sessions
The application SHALL display the number of completed Focus sessions and persist this count.

#### Scenario: Display session count
Given the user has completed 3 Focus sessions
When the timer page loads
Then the session counter shall display "3"
And the count shall be visually prominent

#### Scenario: Persist session count
Given the user completes a Focus session
When the page is reloaded
Then the session counter shall display the correct count from localStorage

#### Scenario: Session count resets
Given the user has completed 10 Focus sessions
When the user clicks Reset in settings or manually clears data
Then the session counter shall display 0

### Requirement: Application SHALL provide timer controls
The application SHALL provide Start/Pause, Reset, and Skip controls with clear visual states.

#### Scenario: Start/Pause button state
Given the timer is stopped
When the Start/Pause button is displayed
Then it shall show "Start"
And it shall be enabled
Given the timer is running
When the Start/Pause button is displayed
Then it shall show "Pause"
And it shall be enabled

#### Scenario: Skip button behavior
Given the timer is in any session type
When the user clicks Skip
Then the current timer shall stop
And the session type shall transition to the next in sequence
And the timer shall reset to the new session's full duration

### Requirement: Application SHALL allow custom durations
The application SHALL allow users to customize session durations via a settings modal.

#### Scenario: User changes focus duration
Given the settings modal is open
When the user changes Focus duration to 30 minutes
And clicks Save
Then Focus sessions shall default to 30 minutes
And the current timer shall update if in Focus mode

#### Scenario: Invalid duration input
Given the settings modal is open
When the user enters a negative number or zero
Then the Save button shall be disabled
Or an error message shall be displayed

#### Scenario: Settings persist
Given the user has saved custom durations
When the page is reloaded
Then the custom durations shall be applied from localStorage

### Requirement: Application SHALL send notifications
The application SHALL request notification permissions and alert users when sessions complete.

#### Scenario: Request notification permission
Given the user has not granted notification permission
When the user clicks Start for the first time
Then the browser shall request notification permission

#### Scenario: Session completion notification
Given the user has granted notification permission
When a session reaches 00:00
Then a browser notification shall appear
And the notification text shall indicate the completed session type
And the notification shall suggest the next action (e.g., "Time for a break!")

#### Scenario: Notification denied
Given the user has denied notification permission
When a session reaches 00:00
Then the application shall display an in-app visual indicator
And shall not show browser notifications

### Requirement: Application SHALL provide visual feedback
The application SHALL provide clear visual feedback for the timer state and progress.

#### Scenario: Progress indicator
Given the timer is running
When the time updates
Then a progress indicator (circular or bar) shall show remaining time
And the indicator shall update smoothly

#### Scenario: Session type indication
Given the timer is in Focus mode
When the page loads
Then a visual indicator shall show "Focus"
Given the timer is in Break mode
When the page loads
Then a visual indicator shall show "Short Break" or "Long Break"

#### Scenario: Active timer styling
Given the timer is running
When the timer display is rendered
Then it shall have a distinct visual style (e.g., different color or animation)
And when paused, the styling shall change to indicate inactivity

### Requirement: Application SHALL be responsive
The application SHALL be fully responsive and functional on mobile (320px+) and desktop devices.

#### Scenario: Mobile layout
Given the viewport width is 375px
When the page loads
Then all controls shall be touch-friendly (min 44px height)
And the layout shall adjust to fit the screen without scrolling
And text shall be legible at the smaller size

#### Scenario: Desktop layout
Given the viewport width is 1280px
When the page loads
Then the timer shall be centered
And there shall be appropriate whitespace around elements
And the design shall not appear stretched

#### Scenario: Orientation change
Given the user rotates their device
When the orientation changes from portrait to landscape
Then the layout shall adapt smoothly
And all controls shall remain functional

### Requirement: Application SHALL work offline
The application SHALL work offline using the existing PWA service worker.

#### Scenario: Load timer offline
Given the user has previously visited the site
When the user is offline
Then the timer page shall load
And all timer functionality shall work

#### Scenario: Persist settings offline
Given the user is offline
When the user saves new settings
Then the settings shall be saved to localStorage
And shall persist across offline sessions

### Requirement: Application SHALL be accessible
The application SHALL be accessible via keyboard and screen readers.

#### Scenario: Keyboard navigation
Given the user is using a keyboard
When the user presses Tab
Then focus shall move through controls in logical order
And the Start/Pause, Reset, and Settings buttons shall be accessible via Enter/Space

#### Scenario: Screen reader announcements
Given a screen reader is active
When the timer updates
Then the current time shall be announced periodically
And session type changes shall be announced
And notifications shall be readable by the screen reader

#### Scenario: High contrast
Given the user prefers high contrast
When the page loads
Then colors shall meet WCAG AA contrast ratios
And text shall be clearly visible against backgrounds
