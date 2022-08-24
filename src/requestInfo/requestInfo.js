import {sortBy, throttle} from "lodash"

import {sendNewRequests} from "@/messaging/messagingProvider"
import {SendNewRequestsMaxWait} from "@/constants/overlay"

export class RequestInfo {
	constructor() {
		this.requestInfo = {}

		// only send request max 1 per second to prevent performance issues
		this.throttle = throttle(this.sendMessage, SendNewRequestsMaxWait)

		this.tabsToMessage = new Set()
	}

	throttledSend(tabId) {
		this.tabsToMessage.add(tabId)

		this.throttle()
	}

	async sendMessage() {
		this.tabsToMessage.forEach(tabId => {
			sendNewRequests(this.requestInfo[tabId].requests, tabId)
		})

		this.tabsToMessage.clear()
	}

	ensureNotUndef(details) {
		//ensure object for mainframe
		this.requestInfo[details.tabId] = this.requestInfo[details.tabId] ?? {}

		//ensure object for requests
		this.requestInfo[details.tabId].requests =
			this.requestInfo[details.tabId].requests ?? {}
	}

	requestEnsureAndSend(details, func) {
		this.ensureNotUndef(details)

		// ensure object for this specific request
		this.requestInfo[details.tabId].requests[details.requestId] =
			this.requestInfo[details.tabId].requests[details.requestId] ?? {}

		func()

		this.throttledSend(details.tabId)
	}

	getInfoForTab(tabId) {
		return this.requestInfo[tabId]
	}

	//mainframe
	mainFrameSend(details) {
		this.requestInfo[details.tabId] = {request: details, requests: {}}
	}

	mainFrameReceived(details) {
		this.ensureNotUndef(details)

		this.requestInfo[details.tabId].response = details

		this.requestInfo[details.tabId].responseHeaders = this.sortRequestHeaders(details.responseHeaders)
		this.requestInfo[details.tabId].responseHeaders = this.sortRequestHeaders(details.responseHeaders)
		console.log("Sorted request info headers", this.requestInfo[details.tabId].responseHeaders)
	}

	//xhtml requests
	requestSend(details) {
		this.requestEnsureAndSend(details, () => {
			this.requestInfo[details.tabId].requests[details.requestId] = {
				...details,
				requestHeaders: this.sortRequestHeaders(details.requestHeaders),
				responseHeaders: this.sortRequestHeaders(details.responseHeaders),
				startTimestamp: details.timeStamp
			}
		})
	}
	requestHeadersReceived(details) {
		this.requestEnsureAndSend(details, () => {
			let oldRequestInfo =
				this.requestInfo[details.tabId].requests[details.requestId]

			let startTimestamp = oldRequestInfo?.startTimestamp ?? 0

			this.requestInfo[details.tabId].requests[details.requestId] = {
				...oldRequestInfo,
				...details,
				requestHeaders: this.sortRequestHeaders(details.requestHeaders || oldRequestInfo.requestHeaders),
				responseHeaders: this.sortRequestHeaders(details.responseHeaders || oldRequestInfo.responseHeaders),
				endTimestamp: details.timeStamp,
				ttfb: details.timeStamp - startTimestamp
			}
		})
	}
	requestComplete(details) {
		this.requestEnsureAndSend(details, () => {
			const startTimestamp =
				this.requestInfo[details.tabId].requests[details.requestId]
					.startTimestamp

			this.requestInfo[details.tabId].requests[details.requestId].took = details.timeStamp - startTimestamp
		})
	}

	removeForTab(tabId) {
		delete this.requestInfo[tabId]
	}

	removeStorage() {
		console.log("removing storage")

		this.requestInfo = {}
	}

	sortRequestHeaders(headers) {
		if (!headers)
			return headers

		return sortBy(headers.map(x => ({...x, name: x.name.toLocaleLowerCase()})), ["name"])
	}
}
