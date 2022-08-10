import {
	settings,
	requestInfo,
	settingsChanged,
	saveSettings,
	newRequests,
} from "@/messaging/messages";
import {
	sendMessagePromise,
	sendToCS,
	sendToSpecificCS,
} from "@/messaging/scriptsComunicationHelper";
import { parseTranformations } from "@/transformations/transformationHelper";

export async function getRequestInfo(tabId = null) {
	return await sendMessagePromise({
		type: requestInfo,
		data: { tabId: tabId },
	});
}

export async function getSettings() {
	const data = await sendMessagePromise({type: settings})
	// eslint-disable-next-line no-debugger
	if (data && data.settings) {
		parseTranformations(data.settings);
	}
	return data;
}

export async function saveDivPosition(level, position) {
	return setSettings(level, { position });
}
export async function changeInject(level, inject) {
	return setSettings(level, { inject });
}

export async function setSettings(level, settings) {
	console.log("save settings", settings);
	return await sendMessagePromise({
		type: saveSettings,
		data: { level, settings },
	});
}

export function sendSettingsChanged() {
	sendToCS(settingsChanged);
}

export function sendNewRequests(requests, tabId) {
	sendToSpecificCS(tabId, newRequests, requests);
}
