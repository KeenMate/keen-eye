//* MESSAGES
export function onMessage(handler) {
	chrome.runtime.onMessage.addListener(handler)
}

export function sendMessage(message) {
	return new Promise((resolve) => {
		chrome.runtime.sendMessage(message, (response) => {
			resolve(response)
		})
	})
}

export function sendToTab(tabId, message) {
	if (tabId > 0) {
		chrome.tabs.sendMessage(tabId, message)
	}
}

//* COMMANDS
export function onCommand(handler) {
	chrome.commands.onCommand.addListener(handler)
}

//* RESOURCES
export function getResourceUrl(resourcePath) {
	return chrome.extension.getURL(resourcePath)
}

//* TABS
export async function queryTabs(options) {
	return new Promise((resolve) => {
		chrome.tabs.query(options, (tabs) => {
			resolve(tabs)
		})
	})
}

export async function getCurrentTab() {
	let tabs = await queryTabs({ active: true, currentWindow: true })
	return tabs[0]
}

export function refreshTab(tab) {
	chrome.tabs.update(tab.id, { url: tab.url })
}

export function onTabRemoved(handler) {
	chrome.tabs.onRemoved.addListener(handler)
}

//* WEBREQUEST
export function onBeforeRequest(handler, filter, extra) {
	chrome.webRequest.onBeforeRequest.addListener(handler, filter, extra)
}
export function RemoveOnBeforeRequest(handler) {
	chrome.webRequest.onBeforeRequest.removeListener(handler)
}

export function onBeforeSendHeaders(handler, filter, extra) {
	chrome.webRequest.onBeforeSendHeaders.addListener(handler, filter, extra)
}
export function RemoveOnBeforeSendHeaders(handler) {
	chrome.webRequest.onBeforeSendHeaders.removeListener(handler)
}

export function onSendHeaders(handler, filter, extra) {
	chrome.webRequest.onSendHeaders.addListener(handler, filter, extra)
}
export function RemoveOnSendHeadersRemove(handler) {
	chrome.webRequest.onSendHeaders.removeListener(handler)
}

export function onHeadersReceived(handler, filter, extra) {
	chrome.webRequest.onHeadersReceived.addListener(handler, filter, extra)
}
export function RemoveOnHeadersReceivedRemove(handler) {
	chrome.webRequest.onHeadersReceived.removeListener(handler)
}

export function onCompleted(handler, filter, extra) {
	chrome.webRequest.onCompleted.addListener(handler, filter, extra)
}
export function RemoveOnCompletedRemove(handler) {
	chrome.webRequest.onCompleted.removeListener(handler)
}

//* STORAGE
export function setToStorage(items) {
	console.log(items)
	return new Promise((resolve, reject) => {
		chrome.storage.sync.set(items, () => {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError)
			}
			resolve()
		})
	})
}

export function getFromStorage(keys) {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get(keys, (result) => {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError)
			}
			resolve(result)
		})
	})
}

export function clearStorage() {
	return new Promise((resolve) => {
		chrome.storage.sync.clear(() => {
			resolve()
		})
	})
}

export function onStorageChange(handler) {
	chrome.storage.onChanged.addListener(handler)
}
