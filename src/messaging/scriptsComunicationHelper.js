import {
	getCurrentTab,
	sendMessage,
	sendToTab,
	onMessage
} from "@/providers/chromeApiProvider"

export function sendMessageToBg(type, data) {
	return sendMessagePromise({type, data})
}

export function sendReply(succeeded, data, sendResponse) {
	sendResponse({ok: succeeded, data: data})
}

export function sendToSpecificCS(tabId, type, data) {
	sendToTab(tabId, {type, data})
}

export async function sendToCS(type, data) {
	let tab = await getCurrentTab()
	sendToSpecificCS(tab.id, type, data)
}

export function onMessageReceived(type, handler) {
	onMessage((message) => {
		if (message && message.type === type) {
			handler(message)
		}
	})
}

export async function sendMessagePromise(message) {
	const response = await sendMessage(message)

	if (response === undefined) {
		return Promise.resolve(null)
	}

	console.log("Sent message response", response)

	if (response?.ok) {
		return Promise.resolve(response.data)
	} else {
		return Promise.reject(response)
	}
}
