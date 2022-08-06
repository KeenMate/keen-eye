import { EmptySettings, PopupScopes } from "@/settings/settingConstants";
import {
  getCurrentTabUrl,
  getCurrentUrlParts,
  getUrlParts,
} from "../helpers/urlHelper";
import { parseTranformations } from "@/transformations/transformationHelper";
import { sendSettingsChanged } from "../messaging/messagingProvider";
import { SyncStorageProvider } from "./storageProvider";
import { CacheStorageProvider } from "./cacheStorageProvider";
export class SettingsProvider {
  constructor(asyncSource, syncSource) {
    if (!asyncSource) throw "you need to provide source to settings provider";
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
    if (!this.syncSource) return;
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

    let oldOriginInfo = (await this.getSettings(level)) ?? EmptySettings;

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
    if (settings.localeReplace !== undefined) {
      oldOriginInfo.localeReplace = settings.localeReplace;
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

    if ((settings = await this.getSettings(PopupScopes.page, url))) {
      return { settings, level: PopupScopes.page };
    }

    if ((settings = await this.getSettings(PopupScopes.origin, url))) {
      return { settings, level: PopupScopes.origin };
    }

    if ((settings = await this.getSettings(PopupScopes.domain, url))) {
      return { settings, level: PopupScopes.domain };
    }

    if ((settings = await this.getSettings(PopupScopes.global, url)) !== undefined) {
      return { settings, level: PopupScopes.global };
    }

    return { settings: { inject: false }, level: PopupScopes.global };
  }

  /**
   * only use with sync storageProvider
   * @param {*} url
   * @returns
   */
  getMostSpecificSettingsSync(url) {
    if (!this.syncSource) return;

    let settings;
    url = new URL(url);

    if ((settings = this.getSettingsSync(PopupScopes.page, url))) {
      return { settings, level: PopupScopes.page };
    }

    if ((settings = this.getSettingsSync(PopupScopes.origin, url))) {
      return { settings, level: PopupScopes.origin };
    }

    if ((settings = this.getSettingsSync(PopupScopes.domain, url))) {
      return { settings, level: PopupScopes.domain };
    }

    if ((settings = this.getSettingsSync(PopupScopes.global, url)) !== undefined) {
      return { settings, level: PopupScopes.global };
    }

    return { settings: { inject: false }, level: PopupScopes.global };
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
