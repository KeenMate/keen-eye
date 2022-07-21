import { sendReply } from "@/helpers/scriptsComunicationHelper";
import { getMostSpecificSettings } from "@/helpers/storageHelper";
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

    console.log();
    // chrome.extension
    //   .getBackgroundPage()
    //   .console.log(headers[details.tabId].response);
  },
  mainFrameFilters,
  ["responseHeaders"]
);

chrome.webRequest.onSendHeaders.addListener(
  function (details) {
    console.debug("request");
    // console.debug(details);
    headers[details.tabId] = headers[details.tabId] ?? {};
    headers[details.tabId].requests = headers[details.tabId].requests ?? {};
    headers[details.tabId].requests[details.requestId] = {
      ...details,
      startTimestamp: details.timeStamp,
    };
    console.debug(headers[details.tabId].requests[details.requestId]);
  },
  fetchFilters,
  ["requestHeaders"]
);
chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    console.debug("response");
    // console.debug(details);
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
        headers[details.tabId].requests[details.requestId].startTimestamp,
    };
    console.debug(headers[details.tabId].requests[details.requestId]);
  },
  fetchFilters,
  ["responseHeaders"]
);
chrome.webRequest.onCompleted.addListener(
  function (details) {
    console.debug("on complete");
    // console.debug(details);
    //checks if some of objects arent undefined
    headers[details.tabId] = headers[details.tabId] ?? {};
    headers[details.tabId].requests = headers[details.tabId].requests ?? {};

    //add took to object
    (headers[details.tabId].requests[details.requestId].took =
      details.timeStamp -
      headers[details.tabId].requests[details.requestId].startTimestamp),
      console.debug(headers[details.tabId].requests[details.requestId]);
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
        console.log(settings);
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
