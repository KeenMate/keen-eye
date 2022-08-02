import { onBeforeSendHeaders } from "../providers/chromeApiProvider";
import { headerName, localeListenerOptions } from "./languageConstants";

export class LanguageChanger {
  constructor(settingsProvider, filter) {
    this.settingsProvider = settingsProvider;

    this.filter = filter ?? { urls: ["<all_urls>"] };

    this.init();
  }

  init() {
    onBeforeSendHeaders(
      (detail) => this.handler(detail, this.filter),
      this.filter,
      localeListenerOptions
    );
  }

  handler(details) {
    let settings = this.getSettings(details);
    if (this.shouldChange(settings) === false) {
      return;
    }
    return this.changeHeader(settings, details);
  }

  shouldChange(settings) {
    if (!settings) return false;

    const { locale } = settings;

    //only change if some language is specified
    if (!locale) return false;

    return true;
  }

  getSettings(details) {
    return this.settingsProvider.getMostSpecificSettingsSync(details.url)
      ?.settings;
  }

  changeHeader(settings, details) {
    const { locale } = settings;

    let headerThere = false;

    for (const header of details.requestHeaders ?? []) {
      if (header.name.toLowerCase() === headerName) {
        header.value = locale.code ?? locale;

        headerThere = true;

        break;
      }
    }

    //need to add header if it is not present there alerady
    if (!headerThere) {
      details.requestHeaders.push({ name: headerName, value: locale });
    }

    return { requestHeaders: details.requestHeaders ?? [] };
  }
}
