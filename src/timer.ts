export type SessionType = "focus" | "short-break" | "long-break";

export interface TimerState {
	isRunning: boolean;
	sessionType: SessionType;
	timeRemaining: number;
	sessionCount: number;
}

export interface TimerConfig {
	focusDuration: number;
	shortBreakDuration: number;
	longBreakDuration: number;
}

export interface TimerEvents {
	tick: (state: TimerState) => void;
	"session-complete": (sessionType: SessionType) => void;
	"session-change": (sessionType: SessionType) => void;
}

export class Timer {
	private state: TimerState;
	private config: TimerConfig;
	private intervalId: number | null = null;
	private listeners: Map<
		keyof TimerEvents,
		Set<TimerEvents[keyof TimerEvents]>
	> = new Map();
	private startTime: number | null = null;
	private initialTimeRemaining: number | null = null;

	constructor(config?: Partial<TimerConfig>) {
		this.config = {
			focusDuration: config?.focusDuration || 25 * 60,
			shortBreakDuration: config?.shortBreakDuration || 5 * 60,
			longBreakDuration: config?.longBreakDuration || 15 * 60,
		};

		this.state = {
			isRunning: false,
			sessionType: "focus",
			timeRemaining: this.config.focusDuration,
			sessionCount: 0,
		};
	}

	on<K extends keyof TimerEvents>(event: K, callback: TimerEvents[K]): void {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Set());
		}
		this.listeners.get(event)?.add(callback);
	}

	off<K extends keyof TimerEvents>(event: K, callback: TimerEvents[K]): void {
		this.listeners.get(event)?.delete(callback);
	}

	private emit<K extends keyof TimerEvents>(
		event: K,
		...args: Parameters<TimerEvents[K]>
	): void {
		this.listeners.get(event)?.forEach((callback) => {
			(callback as (...args: unknown[]) => void)(...args);
		});
	}

	start(): void {
		if (this.state.isRunning) return;

		this.state.isRunning = true;
		this.startTime = Date.now();
		this.initialTimeRemaining = this.state.timeRemaining;
		this.intervalId = window.setInterval(() => this.tick(), 1000);
		this.emit("tick", this.state);
	}

	pause(): void {
		if (!this.state.isRunning) return;

		this.state.isRunning = false;
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}

		this.startTime = null;
		this.initialTimeRemaining = null;
		this.emit("tick", this.state);
	}

	reset(): void {
		this.pause();
		this.state.timeRemaining = this.getDurationForSession(
			this.state.sessionType,
		);
		this.state.isRunning = false;
		this.emit("tick", this.state);
	}

	skip(): void {
		this.pause();
		this.advanceToNextSession();
		this.state.timeRemaining = this.getDurationForSession(
			this.state.sessionType,
		);
		this.emit("tick", this.state);
	}

	private tick(): void {
		if (this.startTime === null || this.initialTimeRemaining === null) return;

		const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
		const remaining = Math.max(0, this.initialTimeRemaining - elapsed);

		this.state.timeRemaining = remaining;

		if (remaining === 0) {
			this.completeSession();
		} else {
			this.emit("tick", this.state);
		}
	}

	private completeSession(): void {
		const currentSession = this.state.sessionType;
		const wasRunning = this.state.isRunning;
		this.pause();
		this.emit("session-complete", currentSession);

		if (currentSession === "focus") {
			this.state.sessionCount++;
		}

		this.advanceToNextSession();
		this.state.timeRemaining = this.getDurationForSession(
			this.state.sessionType,
		);
		this.emit("session-change", this.state.sessionType);
		this.emit("tick", this.state);

		if (wasRunning) {
			this.start();
		}
	}

	private advanceToNextSession(): void {
		const currentSession = this.state.sessionType;

		if (currentSession === "focus") {
			if (this.state.sessionCount > 0 && this.state.sessionCount % 4 === 0) {
				this.state.sessionType = "long-break";
			} else {
				this.state.sessionType = "short-break";
			}
		} else {
			this.state.sessionType = "focus";
		}
	}

	private getDurationForSession(sessionType: SessionType): number {
		switch (sessionType) {
			case "focus":
				return this.config.focusDuration;
			case "short-break":
				return this.config.shortBreakDuration;
			case "long-break":
				return this.config.longBreakDuration;
		}
	}

	updateConfig(newConfig: Partial<TimerConfig>): void {
		this.config = { ...this.config, ...newConfig };

		if (!this.state.isRunning) {
			this.state.timeRemaining = this.getDurationForSession(
				this.state.sessionType,
			);
			this.emit("tick", this.state);
		}
	}

	getState(): Readonly<TimerState> {
		return { ...this.state };
	}

	getConfig(): Readonly<TimerConfig> {
		return { ...this.config };
	}

	getSessionCount(): number {
		return this.state.sessionCount;
	}

	getSessionType(): SessionType {
		return this.state.sessionType;
	}

	isRunning(): boolean {
		return this.state.isRunning;
	}

	getTimeRemaining(): number {
		return this.state.timeRemaining;
	}
}
