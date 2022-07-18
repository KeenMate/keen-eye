export function copyTextToClipboard(text) {
	return navigator.clipboard.writeText(text)
}

export function readTextFromClipboard() {
	return navigator.clipboard.readText()
}
