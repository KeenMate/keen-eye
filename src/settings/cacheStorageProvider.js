import { onStorageChange } from "../providers/chromeApiProvider";
import { SyncStorageProvider } from "./storageProvider";

export class CacheStorageProvider {
	constructor() {
		this.syncStorage = new SyncStorageProvider();

		this.cache = {};
		this.syncStorage.getAll().then((r) => Object.assign(this.cache, r));
		onStorageChange(async () => {
			Object.assign(this.cache, await this.syncStorage.getAll());
		});
	}
	setItem() {
		throw "cache is readOnly";
	}

	getItem(key) {
		if (!key) {
			return Promise.reject(`${key} is not valid key`);
		}
		return this.cache[key];
	}

	getAll() {
		return this.cache;
	}

	clear() {
		throw "cache is readOnly";
	}
}

export default new CacheStorageProvider();
