import {BackgroundScriptMessages as Messages} from "@/messaging/messages"
import {LanguageChanger} from "@/languages/languageChanger"
import SettingsManager from "@/settings/settings-manager"
import {sendSettingsChanged} from "@/messaging/messagingProvider"
import {sendReply} from "@/messaging/scriptsComunicationHelper"
import {onCommand, onMessage} from "@/providers/chromeApiProvider"
import {RequestInfo} from "@/requestInfo/requestInfo"
import languages from "@/languages/languages"
import {RequestsHandler} from "@/requestInfo/requestsHandler"


("use strict")
//setup providers
const requestInfoStore = new RequestInfo()

const requestHandler = new RequestsHandler(requestInfoStore)

new LanguageChanger(SettingsManager)

onMessage(function (request, sender, sendResponse) {
	console.debug("bg got message", request, sender)
	// Handle message based on type
	switch (request?.type) {
		case Messages.overlayRecordingUpdated: {
			if (request.data)
				requestHandler.addListeners()
			else
				requestHandler.removeListeners()
		}
			break

		case Messages.getRequestInfo: {
			const {tabId} = request.data

			let requestInfo = requestInfoStore.getInfoForTab(tabId ?? sender.tab.id)

			console.log("sending request info ", {requestInfo, sender})

			sendReply(true, requestInfo, sendResponse)
		}
			break

		case Messages.getSettings:
			SettingsManager.getMostSpecificSettings(sender.url).then(settings => {
				console.log("sending settings", {settings, sender})
				if (settings) {
					sendReply(true, settings, sendResponse)
				} else {
					sendReply(false, {}, sendResponse)
				}
			})
			break
		case Messages.setSettings: {
			const {settings, level} = request.data

			console.log("saving settings: ", {settings, level})

			SettingsManager.setSettings(level, settings)
				.then(() => {
					if (
						settings.headerRules !== undefined ||
						settings.requestsRules !== undefined ||
						settings.inject !== undefined
					) {
						sendSettingsChanged()
					}
					sendReply(true, undefined, sendResponse)
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

		case Messages.getLocales:
			SettingsManager.getMostSpecificSettings(sender.url).then(settings => {
				console.log("sending most specific settings", {
					url: sender.url,
					settings,
					sender
				})

				if (settings) {
					sendReply(true, settings.customLocales || languages, sendResponse)
				} else {
					sendReply(false, {}, sendResponse)
				}
			})
			break

		default:
			sendReply(false, {}, sendResponse)
			break
	}
	return true
})

onCommand(command => {
	if (command === "toggle-page-overlay") {
		SettingsManager.toggleVisibility()
	}
})
