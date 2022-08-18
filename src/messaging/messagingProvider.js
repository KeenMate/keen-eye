import {
	BackgroundScriptMessages as BackgroundMessages,
	ContentScriptMessages as CsMessages
} from "@/messaging/messages"
import {
	sendMessageToBg,
	sendToCS,
	sendToSpecificCS
} from "@/messaging/scriptsComunicationHelper"
import {parseTransformations} from "@/transformations/transformationHelper"

export async function getRequestInfo(tabId = null) {
	return await sendMessageToBg(BackgroundMessages.getRequestInfo, {tabId: tabId})
}

export async function getSettings() {
	const data = await sendMessageToBg(BackgroundMessages.getSettings)
	// eslint-disable-next-line no-debugger
	if (data && data.settings) {
		parseTransformations(data.settings)
	}
	return data
}

export async function setSettings(level, settings, reloadOverlay) {
	console.log("save settings", settings)
	return await sendMessageToBg(BackgroundMessages.setSettings, {
		level,
		settings,
		reloadOverlay
	})
}

export async function setCapturing(capturing) {
	return await sendMessageToBg(BackgroundMessages.overlayRecordingUpdated, capturing)
}

export function getLocales() {
	return sendMessageToBg(BackgroundMessages.getLocales)
}

export async function saveDivPosition(level, position, reloadOverlay = false) {
	return setSettings(level, {position}, reloadOverlay)
}
export async function changeInject(level, inject, reloadOverlay = true) {
	return setSettings(level, {inject}, reloadOverlay)
}

export function sendSettingsChanged() {
	return sendToCS(CsMessages.settingsChanged)
}

export function sendNewRequests(requests, tabId) {
	sendToSpecificCS(tabId, CsMessages.newRequests, requests)
}
