import {throttle} from "lodash"

import {sendNewRequests} from "@/messaging/messagingProvider"
import {sortHeaders} from "./requestInfoHelpers"
import {sendNewRequestsMaxWait} from "@/overlay/overlayConstants"

export class RequestInfo {
	constructor() {
		this.requestInfo = {}

		// only send request max 1 per second to prevent performance issues
		this.throttle = throttle(this.sendMessage, sendNewRequestsMaxWait)

		this.tabsToMessage = new Set()
	}

	throttledSend(tabId) {
		this.tabsToMessage.add(tabId)

		this.throttle()
	}

	sendMessage() {
		this.tabsToMessage.forEach((tabId) => {
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

		//ensure obejct for this specific request
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

		this.requestInfo[details.tabId].responseHeaders = sortHeaders(
			details.responseHeaders
		)
	}

	//xhtml requests
	requestSend(details) {
		this.requestEnsureAndSend(details, () => {
			this.requestInfo[details.tabId].requests[details.requestId] = {
				...details,
				startTimestamp: details.timeStamp
			}
		})
	}
	requestHeadersReceived(details) {
		this.requestEnsureAndSend(details, () => {
			let oldRequestInfo =
				this.requestInfo[details.tabId].requests[details.requestId]

			let startTimestamp = oldRequestInfo?.startTimestamp ?? 0
			let ttfb = details.timeStamp - startTimestamp

			let newInfo = {
				...oldRequestInfo,
				...details,
				endTimestamp: details.timeStamp,
				ttfb: ttfb
			}

			this.requestInfo[details.tabId].requests[details.requestId] = newInfo
		})
	}
	requestComplete(details) {
		this.requestEnsureAndSend(details, () => {
			let startTimestamp =
				this.requestInfo[details.tabId].requests[details.requestId]
					.startTimestamp

			let took = details.timeStamp - startTimestamp

			this.requestInfo[details.tabId].requests[details.requestId].took = took
		})
	}

	removeForTab(tabId) {
		delete this.requestInfo[tabId]
	}
}
