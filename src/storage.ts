export interface StorageKeys {
	focusDuration: number;
	shortBreakDuration: number;
	longBreakDuration: number;
	sessionCount: number;
	lastSessionType: string;
}

const DEFAULT_VALUES: StorageKeys = {
	focusDuration: 25 * 60,
	shortBreakDuration: 5 * 60,
	longBreakDuration: 15 * 60,
	sessionCount: 0,
	lastSessionType: "focus",
};

class Storage {
	get<K extends keyof StorageKeys>(key: K): StorageKeys[K] {
		try {
			const stored = localStorage.getItem(`tomato_${key}`);
			if (stored === null) {
				return DEFAULT_VALUES[key];
			}

			const parsed = JSON.parse(stored);

			if (typeof parsed !== typeof DEFAULT_VALUES[key]) {
				console.warn(`Storage: Invalid type for ${key}, using default`);
				return DEFAULT_VALUES[key];
			}

			return parsed as StorageKeys[K];
		} catch (error) {
			console.error(`Storage: Error reading ${key}`, error);
			return DEFAULT_VALUES[key];
		}
	}

	set<K extends keyof StorageKeys>(key: K, value: StorageKeys[K]): void {
		try {
			localStorage.setItem(`tomato_${key}`, JSON.stringify(value));
		} catch (error) {
			console.error(`Storage: Error writing ${key}`, error);
		}
	}

	getAll(): StorageKeys {
		const result: Partial<StorageKeys> = {};

		for (const key of Object.keys(DEFAULT_VALUES) as Array<keyof StorageKeys>) {
			(result as Record<keyof StorageKeys, StorageKeys[keyof StorageKeys]>)[
				key
			] = this.get(key);
		}

		return result as StorageKeys;
	}

	reset(): void {
		for (const key of Object.keys(DEFAULT_VALUES) as Array<keyof StorageKeys>) {
			localStorage.removeItem(`tomato_${key}`);
		}
	}
}

export const storage = new Storage();
