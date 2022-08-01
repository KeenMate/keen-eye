import { EMPTY_SETTINGS, levels } from "@/constants/settings";
import {
  getCurrentTabUrl,
  getCurrentUrlParts,
  getUrlParts,
} from "../helpers/urlHelper";
import { parseTranformations } from "@/helpers/transformationHelper";
import { sendSettingsChanged } from "./messagingProvider";
import { SyncStorageProvider } from "./storageProvider";
import { CacheStorageProvider } from "./cacheStorageProvider";
export class SettingsProvider {
  constructor(asyncSource, syncSource) {
    this.asyncSource = asyncSource;
    this.syncSource = syncSource;
  }
  async getSettings(level, url) {
    //if url is not specified use current url
    let urlParts =
      url !== undefined ? getUrlParts(url) : await getCurrentUrlParts();
    let storageKey = urlParts[level];

    if (storageKey === undefined) {
      return Promise.reject("couldnt get current url");
    }

    // console.log(url, urlParts, storageKey);

    let setting = await this.asyncSource.getItem(storageKey);
    parseTranformations(setting);

    return setting;
  }
  getSettingsSync(level, url) {
    //if url is not specified use current url
    let urlParts = getUrlParts(url);
    let storageKey = urlParts[level];

    if (storageKey === undefined) {
      return Promise.reject("couldnt get current url");
    }

    // console.log(url, urlParts, storageKey);

    let setting = this.syncSource.getItem(storageKey);
    parseTranformations(setting);

    return setting;
  }

  async deleteSettings(level) {
    let urlParts = await getCurrentUrlParts();
    let storageKey = urlParts[level];
    console.log("removing from " + storageKey);
    await this.asyncSource.setItem(storageKey, null);
  }

  /**
   * if some of them is undefined, it doesnt change it
   */
  async setSettings(level, settings) {
    let urlParts = await getCurrentUrlParts();
    let storageKey = urlParts[level];
    if (storageKey === undefined) {
      return Promise.reject("couldnt get current url");
    }

    let oldOriginInfo = (await this.getSettings(level)) ?? EMPTY_SETTINGS;

    //TODO use for
    //#region replce if undef
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
    //#endregion

    return this.asyncSource.setItem(storageKey, oldOriginInfo);
  }

  async getMostSpecificSettings(url) {
    let settings;
    
    if (url) {
      url = new URL(url);
    } else {
      url = await getCurrentTabUrl();
    }

    if ((settings = await this.getSettings(levels.page, url))) {
      return { settings, level: levels.page };
    }

    if ((settings = await this.getSettings(levels.origin, url))) {
      return { settings, level: levels.origin };
    }

    if ((settings = await this.getSettings(levels.domain, url))) {
      return { settings, level: levels.domain };
    }

    if ((settings = await this.getSettings(levels.global, url)) !== undefined) {
      return { settings, level: levels.global };
    }

    return { settings: { inject: false }, level: levels.global };
  }

  /**
   * only use with sync storageProvider
   * @param {*} url
   * @returns
   */
  getMostSpecificSettingsSync(url) {
    let settings;
    url = new URL(url);

    if ((settings = this.getSettingsSync(levels.page, url))) {
      return { settings, level: levels.page };
    }

    if ((settings = this.getSettingsSync(levels.origin, url))) {
      return { settings, level: levels.origin };
    }

    if ((settings = this.getSettingsSync(levels.domain, url))) {
      return { settings, level: levels.domain };
    }
    
    if ((settings = this.getSettingsSync(levels.global, url)) !== undefined) {
      return { settings, level: levels.global };
    }

    return { settings: { inject: false }, level: levels.global };
  }

  async toggleVisibility() {
    let {
      level,
      settings: { inject },
    } = await this.getMostSpecificSettings();
    await this.setSettings(level, { inject: !inject });
    sendSettingsChanged();
  }
}

export default new SettingsProvider(
  new SyncStorageProvider(),
  new CacheStorageProvider()
);
