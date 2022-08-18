import {createApp} from "vue"
import PageOverlay from "@/overlay/PageOverlay.vue"
import {ContentScriptMessages} from "@/messaging/messages"
import {
	ContainerClass,
	ContainerWrapperId,
} from "@/constants/overlay"
import {getSettings} from "@/messaging/messagingProvider"
import {getResourceUrl} from "@/providers/chromeApiProvider"
import {onMessageReceived} from "@/messaging/scriptsComunicationHelper"
import "@/assets/css/overlay.scss"

onMessageReceived(ContentScriptMessages.settingsChanged, () => {
	console.log("settings changed message received")
	loadAndRender()
})

function loadAndRender() {
	getSettings().then(response => {
		removeOverlay()

		if (response?.settings?.inject) {
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

	// Create container
	const div = document.createElement("div")
	div.setAttribute("id", ContainerWrapperId)
	div.setAttribute("class", ContainerClass)
	// div.style.visibility = "hidden"

	// Create shadow root
	div.attachShadow({mode: "open"})
	const appRoot = document.createElement("div")
	appRoot.classList.add("bootstrap-body")
	addScriptsAndStyles(appRoot)

	createVueApp(appRoot, {
		settings: settings,
		level: level
	})

	div.shadowRoot.appendChild(appRoot)
	document.body.appendChild(div)

	// setTimeout(() => (div.style.visibility = "visible"), 30)
}

function createVueApp(appRoot, props) {
	//* create vue app
	const app = createApp(PageOverlay, props)
	app.mount(appRoot)

	return app
}

function addScriptsAndStyles(appRoot) {
	addScript(appRoot, getResourceUrl("/external/bootstrap.bundle.min.js"))

	// addStyleContent(document.body, resetCss)
	// addStyleContent(appRoot.shadowRoot, resetCss)
	// addStyleContent(appRoot.shadowRoot, BootstrapBody)

	addStyle(appRoot, getResourceUrl("css/content.css"))

	addStyle(appRoot, getResourceUrl("external/popper.css"))
	addStyle(appRoot, getResourceUrl("external/line-awesome.min.css"))
	addStyle(document.body, getResourceUrl("external/line-awesome.min.css"))
	addStyle(appRoot, getResourceUrl("external/bootstrap.min.css"))
	addStyle(appRoot, getResourceUrl("external/vue-multiselect.min.css"))
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
