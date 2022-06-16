console.debug("STARTING CONTENT SCRIPT");
var results;
var responseHeaders;
var headers;
chrome.runtime.sendMessage({ type: "get-headers" }, function (response) {
  results = document.getElementById(elementId);
  console.debug(response);
  headers = response;

  responseHeaders = headers.responseHeaders;
  if (response) {
    printResults();
  }
});

const elementId = "ms-header-displayer-div";

("use strict");
const div = document.createElement("div");
// iframe.setAttribute("src", "https://www.keybr.com/");
div.setAttribute(
  "style",
  `position:fixed; z-index:5055; display:block; top: 0;left: 0;border:solid black 2px; width:420px; height:100px;background: white;`
);
div.setAttribute("id", elementId);
document.body.appendChild(div);

function sanitize(data) {
  data = data.replace(/</g, "&lt;");
  data = data.replace(/>/g, "&gt;");
  return data;
}

function clearResults() {
  results.innerHTML = "";
}

function printResults() {
  clearResults();
  let filteredHeaders = responseHeaders
    .filter((h) => {
      return h.name.startsWith("x-ms") || h.name == "Location";
    })
    .sort(function (a, b) {
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
    });
  printHeading();
  printKeys(filteredHeaders);

  function calcTime() {
    return (
      (headers["response"].timeStamp - headers["request"].timeStamp) /
      1000
    ).toFixed(4);
  }

  function printHeading(key) {
    results.innerHTML += "<b>" + calcTime() + "s</b> <br />";
  }
  function printHeader(obj) {
    results.innerHTML +=
      "<b>" + sanitize(obj.name) + ":</b> " + sanitize(obj.value) + "<br />";
  }

  function printKeys(headersArray) {
    for (var i = 0; i < headersArray.length; i++) {
      printHeader(headersArray[i]);
    }
  }
}
