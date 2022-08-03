import { clearStorage, storageGet, storageSet } from "../providers/chromeApiProvider";

export class SyncStorageProvider {
  setItem(key, value) {
    return storageSet({ [key]: value });
  }

  async getItem(key) {
    if (!key) {
      return Promise.reject(`${key} is not valid key`);
    }
    return (await storageGet([key]))[key];
  }

  getAll() {
    return storageGet(null);
  }

  clear() {
    return clearStorage();
  }
}

export default new SyncStorageProvider();