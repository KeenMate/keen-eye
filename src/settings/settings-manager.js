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
		if (!this.syncSource)
			return

		//if url is not specified use current url
		const storageKey = this.getStorageKeyForUrl(getUrlParts(url), level)

		const settings = this.syncSource.getItem(storageKey)
		parseTransformations(settings)

		return settings
	}

	async deleteSettings(level, reloadOverlay) {
		const storageKey = await this.getStorageKey(level)

		await this.asyncSource.setItem(storageKey, null)

		if (reloadOverlay)
			await sendSettingsChanged()
	}

	/**
	 * Saves only those settings that have non-undefined value
	 */
	async setSettings(level, settings, reloadOverlay = false) {
		const storageKey = await this.getStorageKey(level)

		let oldOriginInfo = (await this.getSettings(level)) ?? getEmptySettings()

		Object.keys(settings)
			.filter(x => settings[x] !== undefined)
			.forEach(x => {
				oldOriginInfo[x] = settings[x]
			})

		await this.asyncSource.setItem(storageKey, oldOriginInfo)

		if (reloadOverlay)
			await sendSettingsChanged()
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
