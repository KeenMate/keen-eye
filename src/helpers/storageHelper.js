import { EMPTY_SETTINGS } from "@/constants/settings";
import { sendSettingsChanged } from "./scriptsComunicationHelper";
import { getUrlPartCurrent, getUrlPart } from "./urlHelper";

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
  if (!key) return Promise.reject("wrong key");
  // console.log(key);
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

export async function getSettings(level) {
  let storageKey = await getUrlPartCurrent(level);
  let urlInfo = await getItem(storageKey);
  return urlInfo;
}

export async function getMostSpecificSettings() {
  let settings;

  // let pageUrl = getUrlPartCurrent("page"),originUrl = getUrlPartCurrent("origin"),domainUrl = getUrlPartCurrent("domain")
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
export async function setSettings(
  level,
  inject = undefined,
  headers = undefined,
  position = undefined,
  requestsRules = undefined,
  locale = undefined
) {
  let storageKey = await getUrlPartCurrent(level);
  let oldOriginInfo = (await getSettings(level)) ?? {};
  if (inject !== undefined) oldOriginInfo.inject = inject;
  if (headers !== undefined) oldOriginInfo.headerRules = headers;
  if (position !== undefined) {
    oldOriginInfo.position = position;
  }
  if (requestsRules !== undefined) {
    oldOriginInfo.requestsRules = requestsRules;
  }
  if (locale !== undefined) {
    oldOriginInfo.locale = locale;
  }
  return setItem(storageKey, oldOriginInfo);
}

export async function toggleVisibility() {
  let {
    level,
    settings: { inject },
  } = await getMostSpecificSettings();
  console.log(level);
  console.log(inject);
  await setSettings(level, !inject);
  sendSettingsChanged();
}

export async function deleteSettings(level) {
  let storageKey = await getUrlPartCurrent(level);
  console.log("removing from " + storageKey);
  await setItem(storageKey, null);
}

export function getLocaleForTab() {
  return { value: "cs-CZ" };
}

export function getSettingsFromCache(cache, url) {
  if (!cache || !url) return null;
  url = new URL(url);
  let settings;
  //1. try page settings
  if ((settings = cache[getUrlPart("page", url)]))
    return { settings, level: "page" };
  //2. try origin settings
  if ((settings = cache[getUrlPart("origin", url)]))
    return { settings, level: "origin" };
  //3. try domain settings
  if ((settings = cache[getUrlPart("domain", url)]))
    return { settings, level: "domain" };

  //4. get global settings
  if ((settings = cache[getUrlPart("global", url)]))
    return { settings, level: "global" };

  return { settings: EMPTY_SETTINGS, level: "global" };
}
