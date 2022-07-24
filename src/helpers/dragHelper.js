/**
 * makes element dragable
 */
//https://stackoverflow.com/questions/9334084/moveable-draggable-div
export default function (
  dragableElement,
  elementId,
  initialPosition,
  saveFunc
) {
  if (initialPosition) {
    move(
      document.getElementById(elementId),
      initialPosition.x,
      initialPosition.y
    );
  }
  dragableElement.addEventListener("mousedown", (e) =>
    startMoving(document.getElementById(elementId), e, elementId)
  );
  dragableElement.addEventListener("mouseup", () =>
    stopMoving(document.getElementById(elementId), saveFunc)
  );
}

function move(divid, xpos, ypos) {
  divid.style.left = xpos + "px";
  divid.style.top = ypos + "px";
}
function startMoving(divid, evt, containerId) {
  if (divid.id != containerId) {
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
    move(divid, aX, aY);
  };

  //https://stackoverflow.com/questions/9506041/events-mouseup-not-firing-after-mousemove
  evt.preventDefault();
}

function stopMoving(divid, savePosFunc) {
  // var a = document.createElement("script");
  document.body.style.cursor = "default";
  document.onmousemove = function () {};

  let left = parseInt(
    divid.style.left.substring(0, divid.style.left.length - 2)
  );
  let top = parseInt(divid.style.top.substring(0, divid.style.top.length - 2));
  savePosFunc({ x: left, y: top });
}
