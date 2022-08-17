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

export class RequestsHandler {
	constructor(requestInfoStore) {
		this.requestInfoStore = requestInfoStore

		this.addListeners()
	}

	addListeners() {
		onTabRemoved(this.tabForTabListener)

		this.addMainframeListeners()

		this.addRequestListeners()
	}

	removeListeners() {
		this.removeRequestListeners()
	}

	addMainframeListeners() {
		onSendHeaders(
			this.mainframeSendListener,
			mainFrameFilters,
			extra.requestHeaders
		)

		onHeadersReceived(
			this.mainFrameReceivedListener,
			mainFrameFilters,
			extra.responseHeaders
		)
	}

	addRequestListeners() {
		onSendHeaders(
			this.requestSendListener,
			fetchFilters,
			extra.requestHeaders
		)

		onHeadersReceived(
			this.requestReceivedListener,
			fetchFilters,
			extra.responseHeaders
		)

		onCompleted(
			this.requestCompleteListener,
			fetchFilters,
			extra.responseHeaders
		)
	}

	removeRequestListeners() {
		RemoveOnSendHeaders(this.requestSendListener)
		RemoveOnHeadersReceived(this.requestReceivedListener)
		RemoveOnCompleted(this.requestCompleteListener)
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
}
