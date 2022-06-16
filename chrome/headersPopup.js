"use strict";

chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
  var results = document.getElementById("results"),
    headers = chrome.extension.getBackgroundPage().headers[tab[0].id];
  var responseHeaders = headers.responseHeaders;
  console.log(responseHeaders);

  if (headers === undefined) {
    printError();
  } else {
    printResults();
  }

  function sanitize(data) {
    data = data.replace(/</g, "&lt;");
    data = data.replace(/>/g, "&gt;");
    return data;
  }

  function clearResults() {
    results.innerHTML = "";
  }

  function printError() {
    var error =
      "Error: could not get http headers, please try refreshing the page.";

    clearResults();
    results.innerHTML += '<p class="error-text">' + error + "</p>";
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
    printHeading("response");
    console.log(filteredHeaders);
    printKeys(filteredHeaders);

    function calcTime() {
      return (
        (headers["response"].timeStamp - headers["request"].timeStamp) /
        1000
      ).toFixed(4);
    }

    function printHeading(key) {
      var t = key[0].toUpperCase() + key.substring(1);

      if (key === "response") {
        results.innerHTML +=
          "<h2>" + t + " <small>(in " + calcTime() + "s)</small></h2>";
      } else {
        results.innerHTML += "<h2>" + t + "</h2>";
      }
    }
    function printHeader(obj) {
      results.innerHTML +=
        "<p><b>" + sanitize(obj.name) + ":</b> " + sanitize(obj.value) + "</p>";
    }

    function printKeys(headersArray) {
      for (var i = 0; i < headersArray.length; i++) {
        printHeader(headersArray[i]);
      }
    }
  }
});
