import {parseRegex} from "@/helpers/regexHelper"
import {updateQueryStringParameter} from "@/helpers/urlHelper"
import {onBeforeRequest, onBeforeSendHeaders, onTabRemoved} from "@/providers/chromeApiProvider"
import {beforeHeadersOptions, beforeRequestOptions, headerName} from "./languageConstants"

export class LanguageChanger {
	constructor(settingsProvider, filter) {
		this.settingsProvider = settingsProvider

		this.filter = filter ?? {urls: ["<all_urls>"]}

		this.redirects = {}

		this.init()
	}

	init() {
		onBeforeRequest(
			(detail) => this.handleBeforeRequest(detail),
			{...this.filter, types: ["main_frame"]},
			beforeRequestOptions
		)

		onBeforeSendHeaders(
			(detail) => this.handleBeforeHeadersSend(detail),
			{...this.filter},
			beforeHeadersOptions
		)

		onTabRemoved((detail) => this.removeRedirect(detail))
	}

	handleBeforeHeadersSend(details) {
		let settings = this.getSettings(details)

		if (!this.shouldChange(settings)) {
			return
		}

		return this.changeHeader(settings, details)
	}

	handleBeforeRequest(details) {
		let settings = this.getSettings(details)

		if (!this.shouldChange(settings)) {
			return
		}

		let url = details.url

		if (!this.firstRedirect(details, settings)) {
			console.log("not first time stop")

			return
		}

		url = this.changeQueryString(url, settings)
		url = this.changeUrl(url, settings)

		return this.redirect(details, url)
	}

	removeRedirect(tabId) {
		console.log("removed", tabId)

		delete this.redirects[tabId]
	}

	shouldChange(settings) {
		//only change if some language is specified
		return settings && !!settings.locale
	}

	shouldReplaceLocale(settings) {
		return !!settings.localeReplace
	}

	shouldChangeProperty(settings, property) {
		return (
			this.shouldReplaceLocale(settings) && !!settings.localeReplace[property]
		)
	}

	shouldChangeCookies(settings) {
		return this.shouldChangeProperty(settings, "cookieKey")
	}

	shouldChangeQueryString(settings) {
		return this.shouldChangeProperty(settings, "queryStringKey")
	}

	shouldChangeUrl(settings) {
		return this.shouldChangeProperty(settings, "urlRegex")
	}

	getSettings(details) {
		if (!details.url) {
			return
		}

		return this.settingsProvider.getMostSpecificSettingsSync(details.url)
			?.settings
	}

	changeCookie(cookieString, settings) {
		if (!cookieString || !this.shouldChangeCookies(settings)) {
			return
		}

		const cookieKey = settings.localeReplace.cookieKey

		const regex = new RegExp(`(?<=${cookieKey}=)([^;]+)`)
		cookieString = cookieString.replace(regex, settings.locale.code)

		return cookieString
	}

	changeHeader(settings, details) {
		const {locale} = settings

		let headerThere = false

		details.requestHeaders = details.requestHeaders ?? []

		for (const header of details.requestHeaders) {
			if (header.name.toLowerCase() === headerName) {
				header.value = locale.code ?? locale

				headerThere = true
			}

			if (header.name.toLowerCase() === "cookie") {
				if (!this.shouldChangeCookies(settings)) continue

				header.value = this.changeCookie(header.value, settings)
			}
		}

		//need to add header if it is not present there alerady
		if (!headerThere) {
			details.requestHeaders.push({name: headerName, value: locale})
		}

		return {requestHeaders: details.requestHeaders ?? []}
	}

	changeQueryString(url, settings) {
		if (!this.shouldChangeQueryString(settings)) {
			return url
		}

		let settingsValue = settings.localeReplace.queryStringKey

		let updatedUrl = url

		if (settingsValue.indexOf(";") > -1) {
			let keys = settingsValue.split(";")

			keys.forEach((key) => {
				let locale = settings.locale
				updatedUrl = updateQueryStringParameter(updatedUrl, key, locale.code)
			})
		} else {
			let key = settingsValue
			let locale = settings.locale
			updatedUrl = updateQueryStringParameter(updatedUrl, key, locale.code)
		}

		return updatedUrl
	}

	changeUrl(url, settings) {
		if (!this.shouldChangeUrl(settings)) {
			return url
		}

		const regex = parseRegex(settings.localeReplace.urlRegex)

		const replaceStr = `$1${settings.locale.code}$3`

		return url.replace(regex, replaceStr)
	}

	firstRedirect(details, settings) {
		if (this.redirects[details.tabId] === settings.locale.code) {
			return false
		}
		this.redirects[details.tabId] = settings.locale.code
		return true
	}

	redirect(details, url) {
		console.log(details.url, url)
		if (details.url === url) {
			return
		}

		return {redirectUrl: url}
	}
}
