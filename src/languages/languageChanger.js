import { updateQueryStringParameter } from "@/helpers/urlHelper";
import {
  onBeforeSendHeaders,
  onBeforeRequest,
} from "../providers/chromeApiProvider";
import {
  headerName,
  beforeHeadersOptions,
  beforeRequestOptions,
} from "./languageConstants";

export class LanguageChanger {
  constructor(settingsProvider, filter) {
    this.settingsProvider = settingsProvider;

    this.filter = filter ?? { urls: ["<all_urls>"] };

    this.init();
  }

  init() {
    onBeforeSendHeaders(
      (detail) => this.handleBeforeHeadersSend(detail),
      this.filter,
      beforeHeadersOptions
    );
    onBeforeRequest(
      (detail) => this.handleBeforeRequest(detail),
      this.filter,
      beforeRequestOptions
    );
  }

  handleBeforeHeadersSend(details) {
    let settings = this.getSettings(details);
    if (!this.shouldChange(settings)) {
      return;
    }
    return this.changeHeader(settings, details);
  }

  handleBeforeRequest(details) {
    let settings = this.getSettings(details);

    if (!this.shouldChange(settings)) {
      return;
    }

    let url = details.url;

    url = this.changeQueryString(url, settings);
    console.log(url);
    return this.redirect(details, url);
  }

  shouldChange(settings) {
    if (!settings) return false;

    const { locale } = settings;

    //only change if some language is specified
    if (!locale) return false;

    return true;
  }

  shouldChangeCookies(settings) {
    const { localeReplace } = settings;
    if (!localeReplace) {
      return false;
    }
    const { cookieKey } = localeReplace;

    if (!cookieKey) {
      return false;
    }

    return true;
  }

  getSettings(details) {
    if (!details.url) {
      return;
    }

    return this.settingsProvider.getMostSpecificSettingsSync(details.url)
      ?.settings;
  }

  changeCookie(cookieString, settings) {
    if (!cookieString || !this.shouldChangeCookies(settings)) {
      return;
    }

    let cookieKey = settings.localeReplace.cookieKey;

    let regex = new RegExp(`(?<=${cookieKey}=)([^;]+)`);

    cookieString = cookieString.replace(regex, settings.locale.code);

    return cookieString;
  }

  changeHeader(settings, details) {
    const { locale } = settings;

    let headerThere = false;

    details.requestHeaders = details.requestHeaders ?? [];

    for (const header of details.requestHeaders) {
      if (header.name.toLowerCase() === headerName) {
        header.value = locale.code ?? locale;

        headerThere = true;
      }

      if (header.name.toLowerCase() === "cookie") {
        if (!this.shouldChangeCookies(settings)) continue;

        header.value = this.changeCookie(header.value, settings);
      }
    }

    //need to add header if it is not present there alerady
    if (!headerThere) {
      details.requestHeaders.push({ name: headerName, value: locale });
    }

    return { requestHeaders: details.requestHeaders ?? [] };
  }

  shouldChangeQueryString(settings) {
    const { localeReplace } = settings;
    if (!localeReplace) {
      return false;
    }
    const { queryStringKey } = localeReplace;

    if (!queryStringKey) {
      return false;
    }

    return true;
  }

  changeQueryString(url, settings) {
    if (!this.shouldChangeQueryString(settings)) {
      return url;
    }
    let param = settings.localeReplace.queryStringKey;
    let locale = settings.locale;

    return updateQueryStringParameter(url, param, locale.code);
  }

  redirect(details, url) {
    if (details.url === url) {
      return;
    }

    console.log("redirecting..");
    return { redirectUrl: url };
  }
}
