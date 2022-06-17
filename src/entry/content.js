console.log("hello world content todo something~");
import { createApp } from "vue";
import PageOverlay from "../view/PageOverlay.vue";

chrome.runtime.sendMessage({ type: "inject" }, function (response) {
  if (response?.inject) {
    var allowedHeaders = response.allowedHeaders;

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
          // var a = document.createElement("script");
          document.body.style.cursor = "default";
          document.onmousemove = function () {};
        },
      };
    })();
    //end of borroved code

    //creation on container
    const elementId = "keen-eye-page-overlay-div";
    const div = document.createElement("div");
    div.setAttribute(
      "style",
      `position:fixed; z-index:5055; display:block; top: 0;left: 0;border:solid black 2px; width:550px;background: white;`
    );
    div.setAttribute("id", elementId);
    div.addEventListener("mousedown", (e) =>
      mydragg.startMoving(div, e, elementId)
    );
    div.addEventListener("mouseup", () => mydragg.stopMoving());
    document.body.appendChild(div);

    createApp(PageOverlay, {
      allowedHeaders: allowedHeaders,
    }).mount("#" + elementId);
  } else {
    return;
  }
});
