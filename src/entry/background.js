import { sendReply } from "@/helpers/scriptsComunicationHelper";
import {
  getAll,
  getMostSpecificSettings,
  getSettingsFromCache,
  toggleVisibility,
} from "@/helpers/storageHelper";
import { setSettings } from "@/helpers/storageHelper";
import { settings, requestInfo, savePosition } from "@/constants/messages";

("use strict");
var headers = {};

var mainFrameFilters = {
  urls: ["<all_urls>"],
  types: ["main_frame"],
};
var fetchFilters = {
  urls: ["<all_urls>"],
  types: ["xmlhttprequest"],
};

chrome.webRequest.onSendHeaders.addListener(
  function (details) {
    // chrome.extension.getBackgroundPage().console.log(details);
    headers[details.tabId] = { request: details };
  },
  mainFrameFilters,
  ["requestHeaders"]
);
chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    // chrome.extension.getBackgroundPage().console.log(details);
    headers[details.tabId] = headers[details.tabId] || {};
    headers[details.tabId].response = details;
    headers[details.tabId].responseHeaders = details.responseHeaders.sort(
      (a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
    );

    // chrome.extension
    //   .getBackgroundPage()
    //   .console.log(headers[details.tabId].response);
  },
  mainFrameFilters,
  ["responseHeaders"]
);

chrome.webRequest.onSendHeaders.addListener(
  function (details) {
    console.log(details.requestHeaders);
    headers[details.tabId] = headers[details.tabId] ?? {};
    headers[details.tabId].requests = headers[details.tabId].requests ?? {};
    headers[details.tabId].requests[details.requestId] = {
      ...details,
      startTimestamp: details.timeStamp,
    };
  },
  fetchFilters,
  ["requestHeaders"]
);
chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    //checks if some of objects arent undefined
    headers[details.tabId] = headers[details.tabId] ?? {};
    headers[details.tabId].requests = headers[details.tabId].requests ?? {};

    //merge request details, responsedetails and some custom props
    headers[details.tabId].requests[details.requestId] = {
      ...headers[details.tabId].requests[details.requestId],
      ...details,
      endTimestamp: details.timeStamp,
      ttfb:
        details.timeStamp -
          headers[details.tabId].requests[details.requestId]?.startTimestamp ??
        0,
    };
  },
  fetchFilters,
  ["responseHeaders"]
);
chrome.webRequest.onCompleted.addListener(
  function (details) {
    //checks if some of objects arent undefined
    headers[details.tabId] = headers[details.tabId] ?? {};
    headers[details.tabId].requests = headers[details.tabId].requests ?? {};

    //add took to object
    headers[details.tabId].requests[details.requestId].took =
      details.timeStamp -
      headers[details.tabId].requests[details.requestId].startTimestamp;
  },
  fetchFilters,
  ["responseHeaders"]
);
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  //handle messsage based on type
  switch (request.type) {
    case requestInfo:
      sendReply(true, headers[request.tabId ?? sender.tab.id], sendResponse);
      break;

    case settings:
      getMostSpecificSettings().then((settings) => {
        if (settings) {
          sendReply(true, settings, sendResponse);
        } else {
          sendReply(false, {}, sendResponse);
        }
      });
      break;

    case savePosition:
      console.log("saving position...");
      setSettings(
        request.level ?? "page",
        undefined,
        undefined,
        request.position,
        undefined,
        undefined
      ).then(() => sendReply(true, request.position, sendResponse));
      break;
    default:
      sendReply(false, {}, sendResponse);
      break;
  }
  return true;
});

chrome.tabs.onRemoved.addListener(function (tabId) {
  delete headers[tabId];
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-page-overlay") {
    console.log("toggling...");
    toggleVisibility();
  }
});

const localeListenerOptions = ["blocking", "requestHeaders", "extraHeaders"];
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    let res = getSettingsFromCache(cachedStorage, details.url);
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
    if (!headerThere)
      details.requestHeaders.push({ name: "accept-language", value: locale });

    return { requestHeaders: details.requestHeaders ?? [] };
  },
  { urls: ["<all_urls>"] },
  localeListenerOptions
);

var cachedStorage;
getAll().then((r) => (cachedStorage = r));
chrome.storage.onChanged.addListener(async function () {
  cachedStorage = await getAll();
});
