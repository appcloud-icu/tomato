import { storage } from "./storage";
import { type SessionType, Timer } from "./timer";

export function setupApp(app: HTMLDivElement): void {
	const config = {
		focusDuration: storage.get("focusDuration"),
		shortBreakDuration: storage.get("shortBreakDuration"),
		longBreakDuration: storage.get("longBreakDuration"),
	};

	const timer = new Timer(config);

	const savedSessionCount = storage.get("sessionCount");
	const savedSessionType = storage.get("lastSessionType") as SessionType;

	for (let i = 0; i < savedSessionCount; i++) {
		timer.skip();
	}

	const lastType = timer.getSessionType();
	if (lastType !== savedSessionType) {
		timer.skip();
	}

	timer.updateConfig(config);
	timer.reset();

	let notificationPermission: NotificationPermission = "default";

	app.innerHTML = `
    <div class="timer-app">
      <header class="app-header">
        <h1>🍅 Tomato</h1>
        <div class="session-count">
          <span id="session-count-display">0</span>
          <span>sessions completed</span>
        </div>
      </header>

      <main class="timer-main">
        <div class="session-indicator" id="session-indicator">Focus</div>

        <div class="timer-display">
          <svg class="progress-ring" viewBox="0 0 200 200">
            <circle class="progress-ring-bg" cx="100" cy="100" r="90" fill="none" />
            <circle
              class="progress-ring-circle"
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
          <div class="time-display" id="time-display">25:00</div>
        </div>

        <div class="controls">
          <button id="btn-start-pause" class="btn btn-primary" type="button">Start</button>
          <button id="btn-reset" class="btn btn-secondary" type="button">Reset</button>
          <button id="btn-skip" class="btn btn-tertiary" type="button">Skip</button>
        </div>

        <button id="btn-settings" class="btn-settings" type="button" aria-label="Settings">
          ⚙️
        </button>
      </main>

      <div id="settings-modal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Settings</h2>
            <button id="btn-close-modal" class="btn-close" type="button" aria-label="Close">
              ✕
            </button>
          </div>

          <div class="modal-body">
            <div class="setting-group">
              <label for="focus-duration">
                Focus Duration (minutes)
              </label>
              <input
                id="focus-duration"
                type="number"
                min="1"
                max="60"
                value="25"
              />
            </div>

            <div class="setting-group">
              <label for="short-break-duration">
                Short Break (minutes)
              </label>
              <input
                id="short-break-duration"
                type="number"
                min="1"
                max="30"
                value="5"
              />
            </div>

            <div class="setting-group">
              <label for="long-break-duration">
                Long Break (minutes)
              </label>
              <input
                id="long-break-duration"
                type="number"
                min="1"
                max="60"
                value="15"
              />
            </div>

            <div class="setting-group">
              <label class="checkbox-label">
                <input id="notifications-enabled" type="checkbox" checked />
                Enable Notifications
              </label>
            </div>
          </div>

          <div class="modal-footer">
            <button id="btn-save-settings" class="btn btn-primary" type="button">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      id="pwa-toast"
      role="alert"
      aria-labelledby="toast-message"
    >
      <div class="message">
        <span id="toast-message"></span>
      </div>
      <div class="buttons">
        <button id="pwa-refresh" type="button">Reload</button>
        <button id="pwa-close" type="button">Close</button>
      </div>
    </div>
  `;

	const timeDisplay = document.getElementById("time-display");
	const sessionIndicator = document.getElementById("session-indicator");
	const sessionCountDisplay = document.getElementById("session-count-display");
	const progressCircle = document.querySelector(
		".progress-ring-circle",
	) as SVGCircleElement | null;
	const btnStartPause = document.getElementById(
		"btn-start-pause",
	) as HTMLButtonElement | null;
	const btnReset = document.getElementById(
		"btn-reset",
	) as HTMLButtonElement | null;
	const btnSkip = document.getElementById(
		"btn-skip",
	) as HTMLButtonElement | null;
	const btnSettings = document.getElementById(
		"btn-settings",
	) as HTMLButtonElement | null;
	const settingsModal = document.getElementById("settings-modal");
	const btnCloseModal = document.getElementById(
		"btn-close-modal",
	) as HTMLButtonElement | null;
	const btnSaveSettings = document.getElementById(
		"btn-save-settings",
	) as HTMLButtonElement | null;
	const focusDurationInput = document.getElementById(
		"focus-duration",
	) as HTMLInputElement | null;
	const shortBreakDurationInput = document.getElementById(
		"short-break-duration",
	) as HTMLInputElement | null;
	const longBreakDurationInput = document.getElementById(
		"long-break-duration",
	) as HTMLInputElement | null;
	const notificationsEnabled = document.getElementById(
		"notifications-enabled",
	) as HTMLInputElement | null;

	if (
		!timeDisplay ||
		!sessionIndicator ||
		!sessionCountDisplay ||
		!progressCircle ||
		!btnStartPause ||
		!btnReset ||
		!btnSkip ||
		!btnSettings ||
		!settingsModal ||
		!btnCloseModal ||
		!btnSaveSettings ||
		!focusDurationInput ||
		!shortBreakDurationInput ||
		!longBreakDurationInput ||
		!notificationsEnabled
	) {
		throw new Error("Required DOM elements not found");
	}

	const circle = progressCircle;
	const displayTime = timeDisplay;
	const indicator = sessionIndicator;
	const countDisplay = sessionCountDisplay;
	const startPauseBtn = btnStartPause;

	const circleRadius = circle.r.baseVal.value;
	const circumference = 2 * Math.PI * circleRadius;
	circle.style.strokeDasharray = `${circumference} ${circumference}`;
	circle.style.strokeDashoffset = `${circumference}`;

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	}

	function updateProgress(timeRemaining: number, totalTime: number): void {
		const progress = timeRemaining / totalTime;
		const offset = circumference - progress * circumference;
		circle.style.strokeDashoffset = `${offset}`;
	}

	function getSessionLabel(sessionType: SessionType): string {
		switch (sessionType) {
			case "focus":
				return "Focus";
			case "short-break":
				return "Short Break";
			case "long-break":
				return "Long Break";
		}
	}

	function getSessionColor(sessionType: SessionType): string {
		switch (sessionType) {
			case "focus":
				return "#e74c3c";
			case "short-break":
				return "#2ecc71";
			case "long-break":
				return "#3498db";
		}
	}

	function updateUI(state: ReturnType<Timer["getState"]>): void {
		const config = timer.getConfig();
		const totalTime = (() => {
			switch (state.sessionType) {
				case "focus":
					return config.focusDuration;
				case "short-break":
					return config.shortBreakDuration;
				case "long-break":
					return config.longBreakDuration;
			}
		})();

		displayTime.textContent = formatTime(state.timeRemaining);
		indicator.textContent = getSessionLabel(state.sessionType);

		const color = getSessionColor(state.sessionType);
		circle.style.stroke = color;
		indicator.style.color = color;

		updateProgress(state.timeRemaining, totalTime);
		countDisplay.textContent = timer.getSessionCount().toString();

		startPauseBtn.textContent = state.isRunning ? "Pause" : "Start";
	}

	async function requestNotificationPermission(): Promise<void> {
		if ("Notification" in window && notificationPermission === "default") {
			notificationPermission = await Notification.requestPermission();
		}
	}

	function showNotification(title: string, body: string): void {
		if ("Notification" in window && notificationPermission === "granted") {
			new Notification(title, { body, icon: "/favicon.svg" });
		}
	}

	timer.on("tick", updateUI);

	timer.on("session-complete", (sessionType) => {
		const messages: Record<SessionType, { title: string; body: string }> = {
			focus: { title: "Focus session complete! 🎉", body: "Time for a break" },
			"short-break": { title: "Break over!", body: "Ready to focus again?" },
			"long-break": {
				title: "Long break over!",
				body: "Ready for another focus session?",
			},
		};

		const { title, body } = messages[sessionType];
		showNotification(title, body);

		if (sessionType === "focus") {
			storage.set("sessionCount", timer.getSessionCount());
		}
	});

	timer.on("session-change", (sessionType) => {
		storage.set("lastSessionType", sessionType);
	});

	btnStartPause.addEventListener("click", () => {
		requestNotificationPermission().catch(() => {});

		if (timer.isRunning()) {
			timer.pause();
		} else {
			timer.start();
		}
	});

	btnReset.addEventListener("click", () => {
		timer.reset();
	});

	btnSkip.addEventListener("click", () => {
		timer.skip();
	});

	btnSettings.addEventListener("click", () => {
		const config = timer.getConfig();

		focusDurationInput.value = (config.focusDuration / 60).toString();
		shortBreakDurationInput.value = (config.shortBreakDuration / 60).toString();
		longBreakDurationInput.value = (config.longBreakDuration / 60).toString();

		settingsModal.classList.add("show");
	});

	btnCloseModal.addEventListener("click", () => {
		settingsModal.classList.remove("show");
	});

	settingsModal.addEventListener("click", (e) => {
		if (e.target === settingsModal) {
			settingsModal.classList.remove("show");
		}
	});

	btnSaveSettings.addEventListener("click", () => {
		const focusDuration = parseInt(focusDurationInput.value, 10) * 60;
		const shortBreakDuration = parseInt(shortBreakDurationInput.value, 10) * 60;
		const longBreakDuration = parseInt(longBreakDurationInput.value, 10) * 60;

		timer.updateConfig({
			focusDuration,
			shortBreakDuration,
			longBreakDuration,
		});

		storage.set("focusDuration", focusDuration);
		storage.set("shortBreakDuration", shortBreakDuration);
		storage.set("longBreakDuration", longBreakDuration);

		if (!notificationsEnabled.checked && notificationPermission === "granted") {
			notificationPermission = "denied";
		}

		settingsModal.classList.remove("show");
	});

	if ("Notification" in window && Notification.permission === "granted") {
		notificationPermission = "granted";
		notificationsEnabled.checked = true;
	} else if ("Notification" in window) {
		notificationsEnabled.checked = false;
	} else {
		notificationsEnabled.disabled = true;
	}

	updateUI(timer.getState());
}
