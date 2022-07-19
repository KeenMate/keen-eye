import { getUrlPart } from "./urlHelper";

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
  // console.log(key);
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
  // console.log(level);
  let storageKey = await getUrlPart(level);
  // console.log(storageKey);
  let urlInfo = await getItem(storageKey);
  // console.log(urlInfo);
  return urlInfo;
}

export async function getMostSpecificSettings() {
  let settings;

  // let pageUrl = getUrlPart("page"),originUrl = getUrlPart("origin"),domainUrl = getUrlPart("domain")
  //1. try page settings
  if ((settings = await getSettings("page")))
    return { settings, level: "page" };
  //2. try origin settings
  if ((settings = await getSettings("origin")))
    return { settings, level: "origin" };
  //3. try domain settings
  if ((settings = await getSettings("domain")))
    return { settings, level: "domain" };
  //4. get global settings
  if ((settings = await getSettings("global")) !== undefined)
    return { settings, level: "global" };

  return { settings: { inject: false }, level: "global" };
}

/**
 * if some of them is null, it doesnt change it
 */
export async function setSettings(level, inject, headers, position) {
  console.warn(level);
  let storageKey = await getUrlPart(level);
  let oldOriginInfo = (await getSettings(level)) ?? {};
  if (typeof inject === "boolean") oldOriginInfo.inject = inject;
  if (headers) oldOriginInfo.allowedHeaders = headers;
  if (position) {
    oldOriginInfo.position = position;
  }
  return setItem(storageKey, oldOriginInfo);
}

export async function deleteSettings(level) {
  let storageKey = await getUrlPart(level);
  console.log("removing from " + storageKey);
  await setItem(storageKey, null);
  console.log(await getItem(storageKey));
}
