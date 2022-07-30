import { EMPTY_SETTINGS, levels } from "@/constants/settings";
import { types } from "@/constants/transformations";
import { BaseTransformation } from "@/types/baseTransformation";
import { UrlTransformation } from "@/types/urlTransformation";
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

export async function getSettings(level, url) {
  let storageKey = await getUrlPartCurrent(level, url);
  let setting = await getItem(storageKey);
  parseTranformations(setting);
  return setting;
}

export function parseTranformation(transformation) {
  switch (transformation.type) {
    case types.basic:
      return new BaseTransformation(transformation.headerRule);

    case types.url:
      return new UrlTransformation(
        transformation.headerRule,
        transformation.url
      );

    default:
      break;
  }
}

export function parseTranformations(settings) {
  if (!settings?.transformations || !Array.isArray(settings.transformations))
    return;
  console.log("transformations set gonna parse...");
  settings.transformations = settings.transformations.map((trans) =>
    parseTranformation(trans)
  );
}

export async function getMostSpecificSettings(url) {
  let settings;
  if (url) {
    url = new URL(url);
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
  let storageKey = await getUrlPartCurrent(level);
  let oldOriginInfo = (await getSettings(level)) ?? {};

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

export async function toggleVisibility() {
  let {
    level,
    settings: { inject },
  } = await getMostSpecificSettings();
  await setSettings(level, { inject: !inject });
  sendSettingsChanged();
}

export async function deleteSettings(level) {
  let storageKey = await getUrlPartCurrent(level);
  console.log("removing from " + storageKey);
  await setItem(storageKey, null);
}

export function getSettingsFromCache(cache, url) {
  if (!cache || !url) return null;
  url = new URL(url);
  let settings;

  //1. try page settings
  if ((settings = cache[getUrlPart(levels.page, url)])) {
    return { settings, level: levels.page };
  }
  //2. try origin settings
  if ((settings = cache[getUrlPart(levels.origin, url)])) {
    return { settings, level: levels.origin };
  }
  //3. try domain settings
  if ((settings = cache[getUrlPart(levels.domain, url)])) {
    return { settings, level: levels.domain };
  }
  //4. get global settings
  if ((settings = cache[getUrlPart(levels.global, url)])) {
    return { settings, level: levels.global };
  }

  //always some settings will be returned to prevent checking everything for undef
  return { settings: EMPTY_SETTINGS, level: levels.global };
}

export function useCache() {
  var cache = {};
  getAll().then((r) => (cache.storage = r));
  chrome.storage.onChanged.addListener(async function () {
    cache.storage = await getAll();
  });

  return cache;
}
