import { sendReply } from "@/helpers/scriptsComunicationHelper";
import { getOriginSettings } from "@/helpers/storageHelper";

console.log("hello world background todo something~");
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
  console.log(sender);
  if (request.type == "get-headers") {
    console.log(headers[sender.tab.id]);
    sendReply(true, headers[sender.tab.id], sendResponse);
    return true;
  }
  console.log(request);
  if (request.type == "inject") {
    console.log(sender);
    getOriginSettings().then((originSettings) => {
      if (originSettings) {
        //TODO check if should inject
        sendReply(true, originSettings, sendResponse);
      } else {
        sendReply(false, {}, sendResponse);
      }
    });
    return true;
  }
});

chrome.tabs.onRemoved.addListener(function (tabId) {
  delete headers[tabId];
});
