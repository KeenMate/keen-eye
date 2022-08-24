import {
	onCompleted,
	RemoveOnCompleted,
	onHeadersReceived,
	RemoveOnHeadersReceived,
	onSendHeaders,
	RemoveOnSendHeaders,
	onTabRemoved
} from "@/providers/chromeApiProvider"
import {fetchFilters, mainFrameFilters, extra} from "./requestInfoConstants"

import settingsManager from "@/settings/settings-manager"

export class RequestsHandler {
	constructor(requestInfoStore) {
		this.requestInfoStore = requestInfoStore

		this.listeners = this.createListeners()

		//this is added separatly so even if you have capturing disabled,
		//it will clean its memory
		onTabRemoved(this.tabForTabListener)

		settingsManager.getOverlayRecordingAsync().then(capturing => {
			this.setCapturing(capturing ?? true)
		})
	}

	setCapturing(capturing) {
		if (this.capturing === capturing)
			return

		this.capturing = capturing

		console.log("Set capturing to ", capturing)

		if (this.capturing) {
			this.addListeners()
		} else {
			this.removeListeners()
			this.requestInfoStore.removeStorage()
		}
	}

	addListeners() {
		this.addMainframeListeners()
		this.addRequestListeners()
	}

	removeListeners() {
		this.removeMainframeListeners()
		this.removeRequestListeners()
	}

	addMainframeListeners() {
		onSendHeaders(
			this.listeners.mainframeSendListener,
			mainFrameFilters,
			extra.requestHeaders
		)

		onHeadersReceived(
			this.listeners.mainFrameReceivedListener,
			mainFrameFilters,
			extra.responseHeaders
		)
	}

	removeMainframeListeners() {
		RemoveOnSendHeaders(this.listeners.mainframeSendListener)
		RemoveOnHeadersReceived(this.listeners.mainFrameReceivedListener)
	}

	addRequestListeners() {
		onSendHeaders(
			this.listeners.requestSendListener,
			fetchFilters,
			extra.requestHeaders
		)

		onHeadersReceived(
			this.listeners.requestReceivedListener,
			fetchFilters,
			extra.responseHeaders
		)

		onCompleted(
			this.listeners.requestCompleteListener,
			fetchFilters,
			extra.responseHeaders
		)
	}

	removeRequestListeners() {
		RemoveOnSendHeaders(this.listeners.requestSendListener)
		RemoveOnHeadersReceived(this.listeners.requestReceivedListener)
		RemoveOnCompleted(this.listeners.requestCompleteListener)
	}

	mainframeSendListener(details) {
		this.requestInfoStore.mainFrameSend(details)
	}

	mainFrameReceivedListener(details) {
		this.requestInfoStore.mainFrameReceived(details)
	}

	requestSendListener(details) {
		this.requestInfoStore.requestSend(details)
	}

	requestReceivedListener(details) {
		this.requestInfoStore.requestHeadersReceived(details)
	}

	requestCompleteListener(details) {
		this.requestInfoStore.requestComplete(details)
	}

	tabForTabListener(details) {
		this.requestInfoStore.removeForTab(details)
	}

	createListeners() {
		return {
			mainframeSendListener: this.mainframeSendListener.bind(this),
			mainFrameReceivedListener: this.mainFrameReceivedListener.bind(this),
			requestSendListener: this.requestSendListener.bind(this),
			requestReceivedListener: this.requestReceivedListener.bind(this),
			requestCompleteListener: this.requestCompleteListener.bind(this),
			tabForTabListener: this.tabForTabListener.bind(this)
		}
	}
}
