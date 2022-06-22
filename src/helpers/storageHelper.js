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

export async function getCurrentOrigin() {
  let tab = await getCurrentTab();
  return new URL(tab.url).origin;
}

export function getCurrentTab() {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (response) => {
        resolve(response[0]);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export async function getOriginSettings() {
  let tabOrigin = await getCurrentOrigin();
  let urlInfo = await getItem(tabOrigin);
  return urlInfo ?? { inject: false };
}

/**
 * if some of them is null, it doesnt change it
 */
export async function setOriginSettings(inject, headers) {
  let tabOrigin = await getCurrentOrigin();
  let oldOriginInfo = await getOriginSettings();
  if (typeof inject === "boolean") oldOriginInfo.inject = inject;
  if (headers) oldOriginInfo.allowedHeaders = headers;

  setItem(tabOrigin, oldOriginInfo);
}
