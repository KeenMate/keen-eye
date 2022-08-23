import {BackgroundScriptMessages as Messages} from "@/messaging/messages"
import {LanguageChanger} from "@/languages/languageChanger"
import SettingsManager from "@/settings/settings-manager"
import {sendReply} from "@/messaging/scriptsComunicationHelper"
import {onCommand, onMessage} from "@/providers/chromeApiProvider"
import {RequestInfo} from "@/requestInfo/requestInfo"
import languages from "@/languages/languages"
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
				console.log("sending settings", {settings, sender})
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

			SettingsManager.setSettings(level, settings, reloadOverlay)
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
			return true
		}
		default:
			sendReply(false, {}, sendResponse)
			break
	}
})

onCommand(command => {
	if (command === "toggle-page-overlay") {
		SettingsManager.toggleVisibility()
	}
})
