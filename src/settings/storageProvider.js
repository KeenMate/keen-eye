import { clearStorage, getFromStorage, setToStorage } from "../providers/chromeApiProvider";

export class SyncStorageProvider {
  setItem(key, value) {
    return setToStorage({ [key]: value });
  }

  async getItem(key) {
    if (!key) {
      return Promise.reject(`${key} is not valid key`);
    }
    return (await getFromStorage([key]))[key];
  }

  getAll() {
    return getFromStorage(null);
  }

  clear() {
    return clearStorage();
  }
}

export default new SyncStorageProvider();
