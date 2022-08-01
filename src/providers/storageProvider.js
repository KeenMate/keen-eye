import {
  clearStorage,
  onStorageChange,
  storageGet,
  storageSet,
} from "./chromeApiProvider";

export function setItem(key, value) {
  console.log(key, value);
  console.log({ [key]: value });
  return storageSet({ [key]: value });
}

export async function getItem(key) {
  if (!key) return Promise.reject(`${key} is not valid key`);
  return (await storageGet([key]))[key];
}

export function getAll() {
  return storageGet(null);
}

export function clear() {
  return clearStorage();
}

/**
 * return variable that is inMemory copy of settings so you can query it synch
 * @returns
 */
export function useCache() {
  var cache = {};
  getAll().then((r) => Object.assign(cache, r));
  onStorageChange(async () => {
    Object.assign(cache, await getAll());
  });

  return cache;
}
