export function setItem(key, value) {
  // console.log(key);
  // console.log(value);
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [key]: value }, function () {
      resolve();
    });
  });
}

export function getItem(key) {
  if (!key) return Promise.reject(`${key} is not valid key`);
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], function (result) {
      resolve(result[key]);
    });
  });
}

export function getAll() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(null, function (result) {
      console.log(result);
      resolve(result);
    });
  });
}

export function clearStorage() {
  chrome.storage.sync.clear();
}

/**
 * return variable that is inMemory copy of settings so you can query it synch
 * @returns 
 */
export function useCache() {
  var cache = {};
  getAll().then((r) => (cache.storage = r));
  chrome.storage.onChanged.addListener(async function () {
    cache.storage = await getAll();
  });

  return cache;
}
