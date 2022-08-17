import {getEmptySettings} from "@/settings/settingConstants"
import {
	getCurrentTabUrl,
	getCurrentUrlParts,
	getUrlParts
} from "@/helpers/urlHelper"
import {parseTransformations} from "@/transformations/transformationHelper"
import {sendSettingsChanged, setCapturing} from "@/messaging/messagingProvider"
import {StorageProvider} from "./storageProvider"
import {CacheStorageProvider} from "./cacheStorageProvider"
import {OverlayRecordingKey} from "@/constants/storage-keys"

export class SettingsManager {
	constructor(asyncSource, syncSource) {
		if (!asyncSource)
			throw new Error("You need to provide source to settings provider")

		this.asyncSource = asyncSource
		this.syncSource = syncSource
	}

	async setOverlayRecordingAsync(overlayRecording) {
		await this.asyncSource.setItem(OverlayRecordingKey, overlayRecording)

		await setCapturing(overlayRecording)
		// THE settings are not changed in reality
		// await sendSettingsChanged()
	}

	async getOverlayRecordingAsync() {
		return await this.asyncSource.getItem(OverlayRecordingKey)
	}

	async getSettings(level, url) {
		const storageKey =
			(url && this.getStorageKeyForUrl(getUrlParts(url), level)) ||
			(await this.getStorageKey(level))

		// console.log(url, urlParts, storageKey);

		const setting = await this.asyncSource.getItem(storageKey)
		parseTransformations(setting)

		return setting
	}

	getSettingsSync(level, url) {
		if (!this.syncSource) return

		//if url is not specified use current url
		const storageKey = this.getStorageKeyForUrl(getUrlParts(url), level)

		const settings = this.syncSource.getItem(storageKey)
		parseTransformations(settings)

		return settings
	}

	async deleteSettings(level, reloadOverlay) {
		const storageKey = await this.getStorageKey(level)
		console.log("removing from " + storageKey)
		await this.asyncSource.setItem(storageKey, null)

		if (reloadOverlay) {
			sendSettingsChanged()
		}
	}

	/**
	 * if some of them is undefined, it doesnt change it
	 */
	async setSettings(level, settings, reloadOverlay = false) {
		const storageKey = await this.getStorageKey(level)

		let oldOriginInfo = (await this.getSettings(level)) ?? getEmptySettings()

		//TODO use for
		//#region replce if undef
		if (settings.inject !== undefined) {
			oldOriginInfo.inject = settings.inject
		}
		if (settings.headerRules !== undefined) {
			oldOriginInfo.headerRules = settings.headerRules
		}
		if (settings.position !== undefined) {
			oldOriginInfo.position = settings.position
		}
		if (settings.requestsRules !== undefined) {
			oldOriginInfo.requestsRules = settings.requestsRules
		}
		if (settings.locale !== undefined) {
			oldOriginInfo.locale = settings.locale
		}
		if (settings.transformations !== undefined) {
			oldOriginInfo.transformations = settings.transformations
		}
		if (settings.localeReplace !== undefined) {
			oldOriginInfo.localeReplace = settings.localeReplace
		}
		//#endregion

		console.log("saving to storage ", storageKey, oldOriginInfo)

		await this.asyncSource.setItem(storageKey, oldOriginInfo)

		if (reloadOverlay) {
			console.log("SETTINGS CHANGED")
			sendSettingsChanged()
		}
	}

	async getMostSpecificSettings(url) {
		let settings

		if (url) {
			url = new URL(url)
		} else {
			url = await getCurrentTabUrl()
		}
		console.log("Getting most specific settings for url", url)

		if ((settings = await this.getSettings("page", url))) {
			return {settings, level: "page"}
		}

		if ((settings = await this.getSettings("origin", url))) {
			return {settings, level: "origin"}
		}

		if ((settings = await this.getSettings("domain", url))) {
			return {settings, level: "domain"}
		}

		if ((settings = await this.getSettings("global", url))) {
			return {settings, level: "global"}
		}

		return {settings: {inject: false}, level: "global"}
	}

	/**
	 * only use with sync storageProvider
	 * @param {*} url
	 * @returns
	 */
	getMostSpecificSettingsSync(url) {
		if (!this.syncSource) return

		let settings
		url = new URL(url)

		if ((settings = this.getSettingsSync("page", url))) {
			return {settings, level: "page"}
		}

		if ((settings = this.getSettingsSync("origin", url))) {
			return {settings, level: "origin"}
		}

		if ((settings = this.getSettingsSync("domain", url))) {
			return {settings, level: "domain"}
		}

		if ((settings = this.getSettingsSync("global", url)) !== undefined) {
			return {settings, level: "global"}
		}

		return {settings: {inject: false}, level: "global"}
	}

	async toggleVisibility(reloadOverlay) {
		let {
			level,
			settings: {inject}
		} = await this.getMostSpecificSettings()

		await this.setSettings(level, {inject: !inject}, reloadOverlay)
	}

	async getStorageKey(level) {
		const urlParts = await getCurrentUrlParts()

		return this.getStorageKeyForUrl(urlParts, level)
	}

	getStorageKeyForUrl(urlParts, level) {
		if (urlParts.page.startsWith("chrome")) {
			throw new Error(`not allowed url: ${JSON.stringify(urlParts)}`)
		}

		const storageKey = urlParts[level]

		if (!storageKey) {
			console.warn("incorect url part", level, urlParts)

			throw new Error(
				`Url part: ${level} is not in url: ${JSON.stringify(urlParts)}`
			)
		}
		return storageKey
	}
}

export default new SettingsManager(
	new StorageProvider(),
	new CacheStorageProvider()
)
