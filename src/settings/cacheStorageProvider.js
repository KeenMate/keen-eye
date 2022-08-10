import {onStorageChange} from "@/providers/chromeApiProvider"
import {StorageProvider} from "./storageProvider"

export class CacheStorageProvider {
	constructor() {
		this.storage = new StorageProvider()

		this.cache = {}
		this.storage.getAll().then((r) => Object.assign(this.cache, r))
		onStorageChange(async () => {
			Object.assign(this.cache, await this.storage.getAll())
		})
	}

	setItem() {
		throw "cache is readOnly"
	}

	getItem(key) {
		if (!key)
			throw new Error(`${key} is not valid key`)

		return this.cache[key]
	}

	getAll() {
		return this.cache
	}

	clear() {
		throw "cache is readOnly"
	}
}

export default new CacheStorageProvider()
