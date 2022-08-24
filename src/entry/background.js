import {BackgroundScriptMessages as Messages} from "@/messaging/messages"
import {LanguageChanger} from "@/languages/languageChanger"
import SettingsManager from "@/settings/settings-manager"
import {sendReply} from "@/messaging/scriptsComunicationHelper"
import {onCommand, onMessage} from "@/providers/chromeApiProvider"
import {RequestInfo} from "@/requestInfo/requestInfo"
import {DefaultLanguages} from "@/constants/languages"
import {RequestsHandler} from "@/requestInfo/requestsHandler"


("use strict")
//setup providers
const requestInfo = new RequestInfo()

const requestHandler = new RequestsHandler(requestInfo)

new LanguageChanger(SettingsManager)

onMessage(function (request, sender, sendResponse) {
	console.debug("bg got message", request, sender)
	// handle message based on type
	switch (request?.type) {
		case Messages.overlayRecordingUpdated: {
			console.log("setting capturing to", !!request.data)

			requestHandler.setCapturing(!!request.data)
		}
			break

		case Messages.getRequestInfo: {
			const {tabId} = request.data

			let tabRequestInfo = requestInfo.getInfoForTab(tabId ?? sender.tab.id)

			console.log("sending request info ", tabRequestInfo, sender)

			sendReply(true, tabRequestInfo, sendResponse)
		}
			break

		case Messages.getSettings: {
			SettingsManager.getMostSpecificSettings(sender.url).then(settings => {
				console.log("Getting settings for command", {settings, sender})
				if (settings) {
					sendReply(true, settings, sendResponse)
				} else {
					sendReply(false, {}, sendResponse)
				}
			})

			return true
		}
		case Messages.setSettings: {
			const {settings, level, reloadOverlay} = request.data

			console.log("saving settings: ", {settings, level}, {reloadOverlay})

			SettingsManager.setSettings(settings, null, level, reloadOverlay)
				.then(() => {
					sendReply(true, {}, sendResponse)
				})
				.catch(e =>
					sendReply(
						false,
						{reason: "error setting data", error: e},
						sendResponse
					)
				)
			return true
		}

		case Messages.getLocales: {
			SettingsManager.getMostSpecificSettings(sender.url).then(({settings}) => {
				console.log("Most specific settings for custom locales", settings, settings?.customLocales || DefaultLanguages)
				sendReply(true, settings?.customLocales || DefaultLanguages, sendResponse)
			})
			return true
		}

		default:
			sendReply(false, {message: "Unknown message type", detail: request?.type}, sendResponse)
			break
	}
})

onCommand(command => {
	if (command === "toggle-page-overlay") {
		SettingsManager.toggleVisibility()
	}
})
