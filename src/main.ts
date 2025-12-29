import "./style.css";
import { setupApp } from "./app.ts";
import { initPWA } from "./pwa.ts";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
	throw new Error("App container not found");
}
setupApp(app);
initPWA(app);
