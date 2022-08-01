import { EMPTY_SETTINGS, levels } from "@/constants/settings";
import {
  getCurrentTabUrl,
  getCurrentUrlParts,
  getUrlParts,
} from "../helpers/urlHelper";
import { getItem, setItem } from "./storageProvider";
import { parseTranformations } from "@/helpers/transformationHelper";
import { sendSettingsChanged } from "./messagingProvider";

export async function getSettings(level, url) {
  //if url is not specified use current url
  let urlParts =
    url !== undefined ? getUrlParts(url) : await getCurrentUrlParts();
  let storageKey = urlParts[level];

  if (storageKey === undefined) {
    return Promise.reject("couldnt get current url");
  }

  console.log(url, urlParts, storageKey);

  let setting = await getItem(storageKey);
  parseTranformations(setting);

  return setting;
}

export function getSettingsFromCache(cache, url) {
  if (!cache || !url) return null;
  url = new URL(url);
  let settings;

  let urlParts = getUrlParts(url);
  //1. try page settings
  if ((settings = cache[urlParts[levels.page]])) {
    return { settings, level: levels.page };
  }
  //2. try origin settings
  if ((settings = cache[urlParts[levels.origin]])) {
    return { settings, level: levels.origin };
  }
  //3. try domain settings
  if ((settings = cache[urlParts[levels.domain]])) {
    return { settings, level: levels.domain };
  }
  //4. get global settings
  if ((settings = cache[urlParts[levels.global]])) {
    return { settings, level: levels.global };
  }

  //always some settings will be returned to prevent checking everything for undef
  return { settings: EMPTY_SETTINGS, level: levels.global };
}
export async function getMostSpecificSettings(url) {
  let settings;
  if (url) {
    url = new URL(url);
  } else {
    url = await getCurrentTabUrl();
  }
  //1. try page settings
  if ((settings = await getSettings(levels.page, url))) {
    return { settings, level: levels.page };
  }
  //2. try origin settings
  if ((settings = await getSettings(levels.origin, url))) {
    return { settings, level: levels.origin };
  }
  //3. try domain settings
  if ((settings = await getSettings(levels.domain, url))) {
    return { settings, level: levels.domain };
  }
  //4. get global settings
  if ((settings = await getSettings(levels.global, url)) !== undefined) {
    return { settings, level: levels.global };
  }

  return { settings: { inject: false }, level: levels.global };
}

/**
 * if some of them is undefined, it doesnt change it
 */
export async function setSettings(level, settings) {
  let urlParts = await getCurrentUrlParts();
  let storageKey = urlParts[level];
  if (storageKey === undefined) {
    return Promise.reject("couldnt get current url");
  }

  let oldOriginInfo = (await getSettings(level)) ?? EMPTY_SETTINGS;

  if (settings.inject !== undefined) {
    oldOriginInfo.inject = settings.inject;
  }
  if (settings.headerRules !== undefined) {
    oldOriginInfo.headerRules = settings.headerRules;
  }
  if (settings.position !== undefined) {
    oldOriginInfo.position = settings.position;
  }
  if (settings.requestsRules !== undefined) {
    oldOriginInfo.requestsRules = settings.requestsRules;
  }
  if (settings.locale !== undefined) {
    oldOriginInfo.locale = settings.locale;
  }
  if (settings.transformations !== undefined) {
    oldOriginInfo.transformations = settings.transformations;
  }

  return setItem(storageKey, oldOriginInfo);
}

export async function deleteSettings(level) {
  let urlParts = await getCurrentUrlParts();
  let storageKey = urlParts[level];
  console.log("removing from " + storageKey);
  await setItem(storageKey, null);
}

export async function toggleVisibility() {
  let {
    level,
    settings: { inject },
  } = await getMostSpecificSettings();
  await setSettings(level, { inject: !inject });
  sendSettingsChanged();
}
