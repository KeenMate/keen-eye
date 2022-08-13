import {
	getCurrentTab,
	sendMessage,
	sendToTab
} from "@/providers/chromeApiProvider"

export async function sendMessagePromise(message) {
	let response = await sendMessage(message)
	console.debug(response)
	if (response === undefined) {
		return Promise.resolve(null)
	}
	if (response?.ok) {
		return Promise.resolve(response.data)
	} else {
		return Promise.reject(response)
	}
}

export function sendMessageToBg(type, data) {
	return sendMessagePromise({ type, data })
}

export function sendReply(succeded, data, sendResponse) {
	sendResponse({ ok: succeded, data: data })
}

export function sendToSpecificCS(tabId, type, data) {
	sendToTab(tabId, { type, data })
}

export async function sendToCS(type, data) {
	let tab = await getCurrentTab()
	sendToSpecificCS(tab.id, type, data)
}
