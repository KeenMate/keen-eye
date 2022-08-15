import {getCurrentTab, refreshTab} from "@/providers/chromeApiProvider"

export function refreshCurrentPage() {
	// source: https://stackoverflow.com/questions/32570100/how-to-reload-current-tab-from-within-a-chrome-extension-popup-html
	getCurrentTab().then((tab) => refreshTab(tab))
}

export function getStatusCodeColor(statusCode) {
	if (!statusCode) return "muted"
	if (statusCode >= 400) return "danger"
	if (statusCode < 200) return "info"
	if (statusCode < 300) return "success"
}
