import {
  onCompleted,
  onHeadersReceived,
  onSendHeaders,
  onTabRemoved,
} from "./chromeApiProvider";
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

  onSendHeaders(
    (details) => {
      // chrome.extension.getBackgroundPage().console.log(details);
      headers[details.tabId] = { request: details, requests: undefined };
    },
    mainFrameFilters,
    ["requestHeaders"]
  );
  onHeadersReceived(
    (details) => {
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

  onSendHeaders(
    (details) => {
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
  onHeadersReceived(
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
  onCompleted(
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

  onTabRemoved(function (tabId) {
    delete headers[tabId];
  });
}
