import {
	backgroudScriptMessages as BgMessages,
	settingsChanged,
	newRequests
} from "@/messaging/messages"
import {
	sendMessageToBg,
	sendToCS,
	sendToSpecificCS
} from "@/messaging/scriptsComunicationHelper"
import { parseTransformations } from "@/transformations/transformationHelper"

export async function getRequestInfo(tabId = null) {
	return await sendMessageToBg(BgMessages.getRequestInfo, { tabId: tabId })
}

export async function getSettings() {
	const data = await sendMessageToBg(BgMessages.getSettings)
	// eslint-disable-next-line no-debugger
	if (data && data.settings) {
		parseTransformations(data.settings)
	}
	return data
}

export async function setSettings(level, settings) {
	console.log("save settings", settings)
	return await sendMessageToBg(BgMessages.setSettings, { level, settings })
}

export function getLocales() {
	return sendMessageToBg(BgMessages.getLocales)
}

export async function saveDivPosition(level, position) {
	return setSettings(level, { position })
}
export async function changeInject(level, inject) {
	return setSettings(level, { inject })
}

export function sendSettingsChanged() {
	return sendToCS(settingsChanged)
}

export function sendNewRequests(requests, tabId) {
	sendToSpecificCS(tabId, newRequests, requests)
}
