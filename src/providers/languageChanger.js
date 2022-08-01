import { onBeforeSendHeaders } from "./chromeApiProvider";
import { getSettingsFromCache } from "./settingsProvider";

export default function (cache) {
  const localeListenerOptions = ["blocking", "requestHeaders", "extraHeaders"];
  onBeforeSendHeaders(
    (details) => {
      let res = getSettingsFromCache(cache, details.url);
      if (!res) return;
      const {
        settings: { locale },
      } = res;
      if (!locale) return;
      let headerThere = false;
      for (const header of details.requestHeaders ?? []) {
        if (header.name.toLowerCase() === "accept-language") {
          header.value = locale.code ?? locale;
          headerThere = true;
          break;
        }
      }
      if (!headerThere) {
        details.requestHeaders.push({ name: "accept-language", value: locale });
      }

      return { requestHeaders: details.requestHeaders ?? [] };
    },
    { urls: ["<all_urls>"] },
    localeListenerOptions
  );
}
