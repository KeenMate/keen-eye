console.debug("STARTING CONTENT SCRIPT");

//https://stackoverflow.com/questions/9334084/moveable-draggable-div
var mydragg = (function () {
  return {
    move: function (divid, xpos, ypos) {
      divid.style.left = xpos + "px";
      divid.style.top = ypos + "px";
    },
    startMoving: function (divid, evt, containerId) {
      if (divid.id != containerId) {
        console.log(divid.id);
        return;
      }
      let containerEl = document.body;
      evt = evt || window.event;
      var posX = evt.clientX,
        posY = evt.clientY,
        divTop = divid.style.top,
        divLeft = divid.style.left,
        eWi = parseInt(divid.style.width),
        eHe = parseInt(divid.style.height),
        cWi = parseInt(containerEl.style.width),
        cHe = parseInt(containerEl.style.height);
      containerEl.style.cursor = "move";
      divTop = divTop.replace("px", "");
      divLeft = divLeft.replace("px", "");
      var diffX = posX - divLeft,
        diffY = posY - divTop;
      document.onmousemove = function (evt) {
        evt = evt || window.event;
        var posX = evt.clientX,
          posY = evt.clientY,
          aX = posX - diffX,
          aY = posY - diffY;
        if (aX < 0) aX = 0;
        if (aY < 0) aY = 0;
        if (aX + eWi > cWi) aX = cWi - eWi;
        if (aY + eHe > cHe) aY = cHe - eHe;
        mydragg.move(divid, aX, aY);
      };

      //https://stackoverflow.com/questions/9506041/events-mouseup-not-firing-after-mousemove
      evt.preventDefault();
    },
    stopMoving: function () {
      var a = document.createElement("script");
      document.body.style.cursor = "default";
      document.onmousemove = function () {};
    },
  };
})();
//end of borroved code

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
  `position:fixed; z-index:5055; display:block; top: 0;left: 0;border:solid black 2px; width:550px;background: white;`
);
div.setAttribute("id", elementId);
//onmousedown='mydragg.startMoving(this,"container",event);' onmouseup='mydragg.stopMoving("container");'
div.addEventListener("mousedown", (e) =>
  mydragg.startMoving(div, e, elementId)
);
div.addEventListener("mouseup", () => mydragg.stopMoving());
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
    let d = document.createElement("div");
    let copyBtn = document.createElement("button");
    copyBtn.innerHTML = "C";
    copyBtn.style = "min-width:0px";
    //because you cant use add event listeners ???
    // copyBtn.addEventListener("click", (e) => copyHeader(obj));
    copyBtn.setAttribute(
      "onclick",
      "navigator.clipboard.writeText('" + obj.name + ": " + obj.value + "')"
    );
    d.appendChild(copyBtn);
    d.innerHTML +=
      "  <b>" + sanitize(obj.name) + ":</b> " + sanitize(obj.value) + "<br />";
    results.appendChild(d);
  }

  function printKeys(headersArray) {
    for (var i = 0; i < headersArray.length; i++) {
      printHeader(headersArray[i]);
    }
  }
}
