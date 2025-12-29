import { registerSW } from "virtual:pwa-register";

export function initPWA(app: Element) {
	const pwaToast = app.querySelector<HTMLDivElement>("#pwa-toast");
	const pwaToastMessage = pwaToast?.querySelector<HTMLDivElement>(
		".message #toast-message",
	);
	const pwaCloseBtn = pwaToast?.querySelector<HTMLButtonElement>("#pwa-close");
	const pwaRefreshBtn =
		pwaToast?.querySelector<HTMLButtonElement>("#pwa-refresh");

	if (!pwaToast || !pwaToastMessage || !pwaCloseBtn || !pwaRefreshBtn) {
		throw new Error("PWA toast elements not found");
	}

	const toast = pwaToast;
	const toastMessage = pwaToastMessage;
	const closeBtn = pwaCloseBtn;
	const refreshBtn = pwaRefreshBtn;

	let refreshSW: (reloadPage?: boolean) => Promise<void> | undefined;

	const refreshCallback = () => refreshSW?.(true);

	function hidePwaToast(raf: boolean) {
		if (raf) {
			requestAnimationFrame(() => hidePwaToast(false));
			return;
		}
		if (toast.classList.contains("refresh"))
			refreshBtn.removeEventListener("click", refreshCallback);

		toast.classList.remove("show", "refresh");
	}
	function showPwaToast(offline: boolean) {
		if (!offline) refreshBtn.addEventListener("click", refreshCallback);
		requestAnimationFrame(() => {
			hidePwaToast(false);
			if (!offline) toast.classList.add("refresh");
			toast.classList.add("show");
		});
	}

	let swActivated = false;
	// periodic sync is disabled, change the value to enable it, the period is in milliseconds
	// You can remove onRegisteredSW callback and registerPeriodicSync function
	const period = 0;

	window.addEventListener("load", () => {
		closeBtn.addEventListener("click", () => hidePwaToast(true));
		refreshSW = registerSW({
			immediate: true,
			onOfflineReady() {
				toastMessage.innerHTML = "App ready to work offline";
				showPwaToast(true);
			},
			onNeedRefresh() {
				toastMessage.innerHTML =
					"New content available, click on reload button to update";
				showPwaToast(false);
			},
			onRegisteredSW(swUrl, r) {
				if (period <= 0) return;
				if (r?.active?.state === "activated") {
					swActivated = true;
					registerPeriodicSync(period, swUrl, r);
				} else if (r?.installing) {
					r.installing.addEventListener("statechange", (e) => {
						const sw = e.target as ServiceWorker;
						swActivated = sw.state === "activated";
						if (swActivated) registerPeriodicSync(period, swUrl, r);
					});
				}
			},
		});
	});
}

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(
	period: number,
	swUrl: string,
	r: ServiceWorkerRegistration,
) {
	if (period <= 0) return;

	setInterval(async () => {
		if ("onLine" in navigator && !navigator.onLine) return;

		const resp = await fetch(swUrl, {
			cache: "no-store",
			headers: {
				cache: "no-store",
				"cache-control": "no-cache",
			},
		});

		if (resp?.status === 200) await r.update();
	}, period);
}
