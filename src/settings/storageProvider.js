import {clearStorage, getFromStorage, setToStorage} from "@/providers/chromeApiProvider"

export class StorageProvider {
	async setItem(key, value) {
		return await setToStorage({[key]: value})
	}

	async getItem(key) {
		if (!key) {
			return Promise.reject(`${key} is not valid key`)
		}
		return (await getFromStorage([key]))[key]
	}

	getAll() {
		return getFromStorage(null)
	}

	clear() {
		return clearStorage()
	}
}

export default new StorageProvider()
