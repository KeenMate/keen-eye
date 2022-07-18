import { getCurrentOrigin } from "./urlHelper";

export function setItem(key, value) {
  console.log(key);
  console.log(value);
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

export function clearStorage() {
  chrome.storage.sync.clear();
}

export async function getSettings() {
  let tabOrigin = await getCurrentOrigin();
  let urlInfo = await getItem(tabOrigin);
  return urlInfo ?? { inject: false };
}

/**
 * if some of them is null, it doesnt change it
 */
export async function setSettings(inject, headers, position) {
  let tabOrigin = await getCurrentOrigin();
  let oldOriginInfo = await getSettings();
  if (typeof inject === "boolean") oldOriginInfo.inject = inject;
  if (headers) oldOriginInfo.allowedHeaders = headers;
  if (position) {
    oldOriginInfo.position = position;
  }
  setItem(tabOrigin, oldOriginInfo);
}
