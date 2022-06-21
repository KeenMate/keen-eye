export function setItem(key, value) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [key]: value }, function () {
      resolve();
    });
  });
}

export function getItem(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], function (result) {
      resolve(result[key]);
    });
  });
}

export function getCurrentOrigin() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (response) => {
      console.log(response[0].url);
      let origin = new URL(response[0].url).origin;

      resolve(origin);
    });
  });
}

export async function getOriginSettings() {
  let tabOrigin = await getCurrentOrigin();
  let urlInfo = await getItem(tabOrigin);
  return urlInfo ?? { inject: false };
}

export async function setInjection(inject) {
  console.log(inject);
  let tabOrigin = await getCurrentOrigin();
  setItem(tabOrigin, {
    inject: inject,
    allowedHeaders: ["x-ms-clitelem", "x-ms-ests-server", "x-ms-request-id"],
  });
}
