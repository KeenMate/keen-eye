import StorageProvider from "@/settings/storageProvider"
import languages from "@/languages/languages"

const customLocalesKey = "CustomLocales"

export class LocaleStorage {
	constructor(storage) {
		this.storage = storage
	}

	saveCustomLocales(locales) {
		this.storage.setItem(customLocalesKey, locales)
	}

	async getLocales() {
		const customLanguages = await this.storage.getItem(customLocalesKey)

		return customLanguages || languages
	}

	clearCustomLocales() {
		this.storage.setItem(customLocalesKey, null)
	}
}

export default new LocaleStorage(StorageProvider)
