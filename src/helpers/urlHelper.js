import {getCurrentTab} from "@/providers/chromeApiProvider"
import {parse} from "tldts"

/**
 * gets domain from URL object based on tldts
 * @param {URL} url needs to be url object
 * @returns
 */
export function getDomain(url) {
	return parse(url.href).domain
}

export function getPath(url) {
	//https://stackoverflow.com/questions/6257463/how-to-get-the-url-without-any-parameters-in-javascript
	return `${url.protocol}//${url.host}${url.pathname}`
}

export function getUrlParts(url) {
	return {
		global: "!global!",
		domain: getDomain(url),
		origin: url.origin,
		page: getPath(url)
	}
}

export async function getCurrentTabUrl() {
	let currentTab = await getCurrentTab()

	return new URL(currentTab?.url ?? "")
}

export async function getCurrentUrlParts() {
	//if url is provided will use it instead of current tab one
	let url = await getCurrentTabUrl()

	return getUrlParts(url)
}

export function updateQueryStringParameter(uri, key, value) {
	//https://stackoverflow.com/questions/5999118/how-can-i-add-or-update-a-query-string-parameter
	const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i")
	const separator = uri.indexOf("?") !== -1 ? "&" : "?"

	if (uri.match(re)) {
		return uri.replace(re, "$1" + key + "=" + value + "$2")
	} else {
		return uri + separator + key + "=" + value
	}
}
