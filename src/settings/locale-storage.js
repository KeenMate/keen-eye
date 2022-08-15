import StorageProvider from "@/settings/storageProvider"

const customLocalesKey = "CustomLocales"

export class LocaleStorage {
	constructor(storage) {
		this.storage = storage
	}

	saveCustomLocales(locales) {
		this.storage.setItem(customLocalesKey, locales)
	}

	async getLocales() {
		return await this.storage.getItem(customLocalesKey)
	}

	clearCustomLocales() {
		this.storage.setItem(customLocalesKey, null)
	}
}

export default new LocaleStorage(StorageProvider)
