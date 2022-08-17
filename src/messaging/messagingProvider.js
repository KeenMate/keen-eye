import {
	BackgroundScriptMessages as BgMessages,
	ContentScriptMessages as CsMessages
} from "@/messaging/messages"
import {
	sendMessageToBg,
	sendToCS,
	sendToSpecificCS
} from "@/messaging/scriptsComunicationHelper"
import {parseTransformations} from "@/transformations/transformationHelper"

export async function getRequestInfo(tabId = null) {
	return await sendMessageToBg(BgMessages.getRequestInfo, {tabId: tabId})
}

export async function getSettings() {
	const data = await sendMessageToBg(BgMessages.getSettings)
	// eslint-disable-next-line no-debugger
	if (data && data.settings) {
		parseTransformations(data.settings)
	}
	return data
}

export async function setSettings(level, settings, reloadOverlay) {
	console.log("save settings", settings)
	return await sendMessageToBg(BgMessages.setSettings, {
		level,
		settings,
		reloadOverlay
	})
}

export async function setCapturing(capturing) {
	return await sendMessageToBg(BgMessages.overlayRecordingUpdated, capturing)
}

export function getLocales() {
	return sendMessageToBg(BgMessages.getLocales)
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
