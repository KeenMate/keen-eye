import {
	onCompleted,
	RemoveOnCompletedRemove,
	onHeadersReceived,
	RemoveOnHeadersReceivedRemove,
	onSendHeaders,
	RemoveOnSendHeadersRemove,
	onTabRemoved
} from "../providers/chromeApiProvider"
import {fetchFilters, mainFrameFilters, extra} from "./requestInfoConstants"

export class RequestsHandler {
	constructor(requestInfoStore) {
		this.requestInfoStore = requestInfoStore

		this.handlers = this.createHandlerFunctions()

		this.addHandlers()
	}

	addHandlers() {
		onTabRemoved(this.tabForTabHandler)

		this.addMainframeHandlers()

		this.addRequestHandlers()
	}

	addMainframeHandlers() {
		onSendHeaders(
			this.handlers.mainframeSendHandler,
			mainFrameFilters,
			extra.requestHeaders
		)

		onHeadersReceived(
			this.handlers.mainFrameReceivedHandler,
			mainFrameFilters,
			extra.responseHeaders
		)
	}

	addRequestHandlers() {
		onSendHeaders(
			this.handlers.requestSendHandler,
			fetchFilters,
			extra.requestHeaders
		)

		onHeadersReceived(
			this.handlers.requestReceivedHandler,
			fetchFilters,
			extra.responseHeaders
		)

		onCompleted(
			this.handlers.requestCompleteHandler,
			fetchFilters,
			extra.responseHeaders
		)
	}

	removeRequestHandlers() {
		RemoveOnSendHeadersRemove(this.handlers.requestSendHandler)
		RemoveOnHeadersReceivedRemove(this.handlers.requestReceivedHandler)
		RemoveOnCompletedRemove(this.handlers.requestCompleteHandler)
	}

	createHandlerFunctions() {
		return {
			mainframeSendHandler: details =>
				this.requestInfoStore.mainFrameSend(details),
			mainFrameReceivedHandler: details =>
				this.requestInfoStore.mainFrameReceived(details),
			requestSendHandler: details => this.requestInfoStore.requestSend(details),
			requestReceivedHandler: details =>
				this.requestInfoStore.requestHeadersReceived(details),
			requestCompleteHandler: details =>
				this.requestInfoStore.requestComplete(details),
			tabForTabHandler: details => this.requestInfoStore.removeForTab(details)
		}
	}
}
