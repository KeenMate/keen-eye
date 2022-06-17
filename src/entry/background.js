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
    console.log("gotta send them some headers");
    console.log(headers[sender.tab.id]);
    sendResponse(headers[sender.tab.id]);
    return true;
  }
  if (request.type == "inject") {
    console.log("gonna check if should check");
    console.log(sender);
    if (sender.url.includes("microsoft"))
      //TODO check if should inject
      sendResponse({
        inject: true,
        allowedHeaders: [
          "x-ms-clitelem",
          "x-ms-ests-server",
          "x-ms-request-id",
        ],
      });
    return true;
  }
});

chrome.tabs.onRemoved.addListener(function (tabId) {
  delete headers[tabId];
});
