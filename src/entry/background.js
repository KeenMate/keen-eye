import { sendReply } from "@/helpers/scriptsComunicationHelper";
import { getOriginSettings } from "@/helpers/storageHelper";
import { setOriginSettings } from "@/helpers/storageHelper";
import { settings, requestInfo, savePosition } from "@/constants/messages";

("use strict");
var headers = {};

var filters = {
  urls: ["<all_urls>"],
  types: ["main_frame"],
};

chrome.webRequest.onSendHeaders.addListener(
  function (details) {
    chrome.extension.getBackgroundPage().console.log(details);
    headers[details.tabId] = headers[details.tabId] || {};
    headers[details.tabId].request = details;
  },
  filters,
  ["requestHeaders"]
);

chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    chrome.extension.getBackgroundPage().console.log(details);
    headers[details.tabId] = headers[details.tabId] || {};
    headers[details.tabId].response = details;
    headers[details.tabId].responseHeaders = details.responseHeaders;
    chrome.extension
      .getBackgroundPage()
      .console.log(headers[details.tabId].response);
  },
  filters,
  ["responseHeaders"]
);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  //handle messsage based on type
  switch (request.type) {
    case requestInfo:
      console.log(headers[request.tabId ?? sender.tab.id]);
      sendReply(true, headers[request.tabId ?? sender.tab.id], sendResponse);
      break;

    case settings:
      getOriginSettings().then((originSettings) => {
        if (originSettings) {
          sendReply(true, originSettings, sendResponse);
        } else {
          sendReply(false, {}, sendResponse);
        }
      });
      break;

    case savePosition:
      console.log("saving position...");
      setOriginSettings(null, null, request.position).then(() =>
        sendReply(true, request.position, sendResponse)
      );
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
