import { getUrlPart } from "./urlHelper";

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

export async function getSettings(level) {
  let urlInfo = await getItem(getUrlPart(level));
  return urlInfo ?? { inject: false };
}

export async function getMostSpecificSettings() {
  let settings;

  //1. try page settings
  if ((settings = getSettings("page")) !== undefined) return settings;
  //2. try origin settings
  if ((settings = getSettings("origin")) !== undefined) return settings;
  //3. try domain settings
  if ((settings = getSettings("domain")) !== undefined) return settings;

  return { inject: false };
}
/**
 * if some of them is null, it doesnt change it
 */
export async function setSettings(inject, headers, position) {
  let storageKey = await getUrlPart("origin");
  let oldOriginInfo = await getSettings();
  if (typeof inject === "boolean") oldOriginInfo.inject = inject;
  if (headers) oldOriginInfo.allowedHeaders = headers;
  if (position) {
    oldOriginInfo.position = position;
  }
  setItem(storageKey, oldOriginInfo);
}
