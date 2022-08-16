import {createApp} from "vue"
import PageOverlay from "@/overlay/PageOverlay.vue"
import {contentScriptMessages} from "@/messaging/messages"
import Popper from "vue3-popper"
import {
	bootstrapBody,
	containerName,
	containerStyle,
	removeName,
	resetCss
} from "@/overlay/overlayConstants"
import {getSettings} from "@/messaging/messagingProvider"
import {getResourceUrl} from "@/providers/chromeApiProvider"
import {onMessageReceived} from "@/messaging/scriptsComunicationHelper"

onMessageReceived(contentScriptMessages.settingsChanged, () => loadAndRender())

function loadAndRender() {
	getSettings().then(response => {
		remove()

		if (!!response?.settings?.inject === false) {
			console.log("remove ")
			return
		}

		console.log("render")

		render(response.settings, response.level)
	})
}

function remove() {
	let mainContainer = document.getElementById(containerName)

	if (mainContainer) {
		mainContainer.remove()
	}

	let elemetnsToRemove = document.getElementsByName(removeName) ?? []

	elemetnsToRemove.forEach(elem => {
		elem.remove()
	})
}

function render(settings, level) {
	console.log("START RENDER")

	//create container
	const div = document.createElement("div")
	div.setAttribute("style", containerStyle)
	div.setAttribute("id", containerName)
	div.setAttribute("class", "complete-reset")

	div.style.visibility = "hiddne"
	document.body.appendChild(div)
	//create shadow root
	div.attachShadow({mode: "open"})
	const appRoot = document.createElement("html")
	div.shadowRoot.appendChild(appRoot)
	addScriptsAndStyles(div)

	appRoot.classList.add("bootstrap-body")
	createVueApp(appRoot, {
		settings: settings,
		level: level
	})

	setTimeout(() => (div.style.visibility = "visible"), 30)
}
function createVueApp(appRoot, props) {
	//* create vue app
	const app = createApp(PageOverlay, props)
	// eslint-disable-next-line vue/multi-word-component-names
	app.component("Popper", Popper)
	app.mount(appRoot)
}

function addScriptsAndStyles(div) {
	addScript(
		div.shadowRoot,
		"https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"
	)
	addStyle(
		div.shadowRoot,
		"https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
	)
	addStyle(
		div.shadowRoot,
		"https://unpkg.com/vue-multiselect@2.1.0/dist/vue-multiselect.min.css"
	)

	//this is intentional
	addStyle(
		document.body,
		"https://cdnjs.cloudflare.com/ajax/libs/line-awesome/1.3.0/line-awesome/css/line-awesome.min.css",
		removeName
	)
	addStyle(
		div.shadowRoot,
		"https://cdnjs.cloudflare.com/ajax/libs/line-awesome/1.3.0/line-awesome/css/line-awesome.min.css"
	)
	addStyleContent(document.body, resetCss, removeName)
	addStyleContent(div.shadowRoot, resetCss)
	addStyleContent(div.shadowRoot, bootstrapBody)

	addStyle(div.shadowRoot, getResourceUrl("css/content.css"))
	addStyle(div.shadowRoot, getResourceUrl("modal.css"))
	addStyle(div.shadowRoot, getResourceUrl("popper.css"))
	addStyle(div.shadowRoot, getResourceUrl("overrides.css"))
}

function addStyle(el, href, name) {
	const styleLink = document.createElement("link")
	styleLink.setAttribute("rel", "stylesheet")
	styleLink.setAttribute("href", href)
	styleLink.setAttribute("name", name)
	el.appendChild(styleLink)
}

function addScript(el, href, name) {
	const script = document.createElement("script")
	script.setAttribute("crossorigin", "anonymous")
	script.setAttribute("src", href)
	script.setAttribute("name", name)
	el.appendChild(script)
}

function addStyleContent(el, content, name) {
	const styleEl = document.createElement("style")
	styleEl.innerHTML = content
	styleEl.setAttribute("name", name)
	el.appendChild(styleEl)
}

loadAndRender()
