import { sendNewRequests } from "./messagingProvider";

export default function (headers) {
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
      headers[details.tabId] = { request: details, requests: undefined };
      console.warn("MAINFRAME");
      console.warn(headers[details.tabId]);
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
        (a, b) =>
          a.name.toLowerCase() > b.name.toLowerCase()
            ? 1
            : b.name.toLowerCase() > a.name.toLowerCase()
            ? -1
            : 0
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
      headers[details.tabId] = headers[details.tabId] ?? {};
      headers[details.tabId].requests = headers[details.tabId].requests ?? {};
      headers[details.tabId].requests[details.requestId] = {
        ...details,
        startTimestamp: details.timeStamp,
      };
      sendNewRequests(headers[details.tabId].requests, details.tabId);
    },
    fetchFilters,
    ["requestHeaders"]
  );
  chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
      //checks if some of objects arent undefined
      //I shouldnt have to do this, but chrome somtimes misbehave
      headers[details.tabId] = headers[details.tabId] ?? {};
      headers[details.tabId].requests = headers[details.tabId].requests ?? {};
      headers[details.tabId].requests[details.requestId] =
        headers[details.tabId].requests[details.requestId] ?? {};

      //merge request details, responsedetails and some custom props
      headers[details.tabId].requests[details.requestId] = {
        ...headers[details.tabId].requests[details.requestId],
        ...details,
        endTimestamp: details.timeStamp,
        ttfb:
          details.timeStamp -
            headers[details.tabId].requests[details.requestId]
              ?.startTimestamp ?? 0,
      };

      sendNewRequests(headers[details.tabId].requests, details.tabId);
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

      sendNewRequests(headers[details.tabId].requests, details.tabId);
    },
    fetchFilters,
    ["responseHeaders"]
  );

  chrome.tabs.onRemoved.addListener(function (tabId) {
    delete headers[tabId];
  });
}
