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
		)
	}
	dragableElement.addEventListener("mousedown", (e) =>
		startMoving(document.getElementById(elementId), e, elementId)
	)
	dragableElement.addEventListener("mouseup", () =>
		stopMoving(document.getElementById(elementId), saveFunc)
	)
}

function move(element, left, top) {
	element.style.left = left + "px"
	element.style.top = top + "px"
}

function startMoving(element, event, containerId) {
	if (element.id !== containerId) return

	const containerEl = document.body
	containerEl.style.cursor = "move"

	// event = event || window.event
	const posX = event.clientX,
		posY = event.clientY,
		divTop = parseInt(element.style.top),
		divLeft = parseInt(element.style.left),
		elementWidth = parseInt(element.style.width),
		elementHeight = parseInt(element.style.height),
		containerWidth = parseInt(containerEl.style.width),
		containerHeight = parseInt(containerEl.style.height)

	const diffX = posX - divLeft,
		diffY = posY - divTop
	document.onmousemove = function (evt) {
		evt = evt || window.event
		let posX = evt.clientX,
			posY = evt.clientY,
			aX = posX - diffX,
			aY = posY - diffY
		if (aX < 0) aX = 0
		if (aY < 0) aY = 0
		if (aX + elementWidth > containerWidth) aX = containerWidth - elementWidth
		if (aY + elementHeight > containerHeight) aY = containerHeight - elementHeight
		move(element, aX, aY)
	}

	//https://stackoverflow.com/questions/9506041/events-mouseup-not-firing-after-mousemove
	event.preventDefault()
}

function stopMoving(element, savePosFunc) {
	// var a = document.createElement("script");
	document.body.style.cursor = "default"
	document.onmousemove = function () {
	}

	let left = parseInt(
		element.style.left.substring(0, element.style.left.length - 2)
	)
	let top = parseInt(element.style.top.substring(0, element.style.top.length - 2))
	savePosFunc({x: left, y: top})
}
