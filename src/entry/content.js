import {createApp} from "vue"
import PageOverlay from "@/overlay/PageOverlay.vue"
import {ContentScriptMessages} from "@/messaging/messages"
import {
	ContainerClass,
	ContainerWrapperId, DefaultContainerHeight, DefaultContainerWidth
} from "@/constants/overlay"
import {getSettings, updateOverlaySize} from "@/messaging/messagingProvider"
import {getResourceUrl} from "@/providers/chromeApiProvider"
import {onMessageReceived} from "@/messaging/scriptsComunicationHelper"
import "@/assets/css/apps/overlay.scss"
import {debounce} from "lodash"
import {ResizeDebounceDelay} from "@/constants/ui"

onMessageReceived(ContentScriptMessages.settingsChanged, () => {
	console.log("settings changed message received")
	loadAndRender()
})

function loadAndRender() {
	getSettings().then(response => {
		removeOverlay()

		if (!response?.settings?.inject) {
			console.log("Not rendering overlay because of settings")
			return
		}

		renderOverlay(response.settings, response.level)
	})
}

function removeOverlay() {
	const container = document.getElementById(ContainerWrapperId)

	if (container) {
		container.remove()
	}

	// document.getElementsByName(ContainerWrapperId)
	// 	.forEach(elem => {
	// 		elem.remove()
	// 	})
}

function renderOverlay(settings, level) {
	console.log("START RENDER")

	addExternalScriptsAndStyles(document.body)

	// create container
	const {container, callback} = createOverlayContainer(settings, level)

	// create shadow root
	container.attachShadow({mode: "open"})
	const shadowRootElement = document.createElement("div")
	shadowRootElement.classList.add("bootstrap-body")

	addInternalScriptsAndStyles(shadowRootElement)

	const appRoot = document.createElement("div")
	createVueApp(appRoot, {
		settings: settings,
		level: level
	})
	shadowRootElement.appendChild(appRoot)

	container.shadowRoot.appendChild(shadowRootElement)
	document.body.appendChild(container)

	setTimeout(callback, 1000)
}

function createOverlayContainer(settings, level) {
	const container = document.createElement("div")

	container.setAttribute("id", ContainerWrapperId)
	container.setAttribute("class", ContainerClass)
	container.style.visibility = "hidden"

	// sets size of container
	container.style.width = (settings.size?.width || DefaultContainerWidth) + "px"
	container.style.height = (settings.size?.height || DefaultContainerHeight) + "px"

	// watches if keen eye wrapper gets resized and after debounce, saves current size of wrapper to settings
	const debouncedResize = debounce(size => {
		updateOverlaySize(size, level)
	}, ResizeDebounceDelay)
	const resizeObserver = new ResizeObserver(mutations => {
		debouncedResize({
			width: mutations[0].contentRect.width,
			height: mutations[0].contentRect.height
		})
	})
	resizeObserver.observe(container, {attributes: true})

	return {
		container,
		callback() {
			// not needed when size is set initially
			if (!settings.resize)
				container.dispatchEvent(new Event("resize"))

			container.style.visibility = "visible"
		}
	}
}

function createVueApp(appRoot, props) {
	//* create vue app
	const app = createApp(PageOverlay, props)
	app.mount(appRoot)

	return app
}

function addExternalScriptsAndStyles(parentElement) {
	addStyle(parentElement, getResourceUrl("external/overlay.css"))
}

function addInternalScriptsAndStyles(parentElement) {
	addScript(parentElement, getResourceUrl("external/bootstrap.bundle.min.js"))

	addStyle(parentElement, getResourceUrl("external/popper.css"))
	addStyle(parentElement, getResourceUrl("external/line-awesome.min.css"))
	addStyle(document.body, getResourceUrl("external/line-awesome.min.css"))
	addStyle(parentElement, getResourceUrl("external/bootstrap.min.css"))
	addStyle(parentElement, getResourceUrl("external/vue-multiselect.min.css"))

	addStyle(parentElement, getResourceUrl("css/content.css"))
}

function addStyle(el, href) {
	const styleLink = document.createElement("link")
	styleLink.setAttribute("rel", "stylesheet")
	styleLink.setAttribute("href", href)
	el.appendChild(styleLink)
}

function addScript(el, src) {
	const script = document.createElement("script")
	script.setAttribute("crossorigin", "anonymous")
	script.setAttribute("src", src)
	el.appendChild(script)
}

function addStyleContent(el, content) {
	const styleEl = document.createElement("style")
	styleEl.innerHTML = content
	el.appendChild(styleEl)
}

loadAndRender()
