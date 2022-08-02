import { createApp } from "vue";
import PageOverlay from "@/overlay/PageOverlay.vue";
import { settingsChanged } from "@/messaging/messages";
import Popper from "vue3-popper";
import {
  bootstrapBody,
  containerName,
  containerStyle,
  resetCss,
} from "@/overlay/overlayConstants";
import { getSettings } from "@/messaging/messagingProvider";
import { getResourceUrl, onMessage } from "@/providers/chromeApiProvider";

onMessage((message) => {
  if (message?.type == settingsChanged) {
    console.log("SETTINGS CHANGED");
    loadAndRender();
  }
});

function loadAndRender() {
  remove();
  getSettings().then((response) => {
    if (!response?.settings?.inject) return;

    render(response.settings, response.level);
  });
}

function remove() {
  let el = document.getElementById(containerName);
  if (el) {
    el.remove();
  }
}

function render(settings, level) {
  //create container
  const div = document.createElement("div");
  div.setAttribute("style", containerStyle);
  div.setAttribute("id", containerName);
  div.setAttribute("class", "complete-reset");
  document.body.appendChild(div);

  //create shadow root
  div.attachShadow({ mode: "open" });
  const appRoot = document.createElement("div");
  div.shadowRoot.appendChild(appRoot);
  addScriptsAndStyles(div);

  appRoot.classList.add("bootstrap-body");
  createVueApp(appRoot, {
    settings: settings,
    level: level,
  });
}
function createVueApp(appRoot, props) {
  //* create vue app
  const app = createApp(PageOverlay, props);
  // eslint-disable-next-line vue/multi-word-component-names
  app.component("Popper", Popper);
  app.mount(appRoot);
}

function addScriptsAndStyles(div) {
  addScript(
    div.shadowRoot,
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"
  );
  addStyle(
    div.shadowRoot,
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
  );
  addStyleContent(document.body, resetCss);
  addStyleContent(div.shadowRoot, resetCss);
  addStyleContent(div.shadowRoot, bootstrapBody);
  addStyle(div.shadowRoot, getResourceUrl("css/content.css"));
  addStyle(div.shadowRoot, getResourceUrl("modal.css"));
  addStyle(div.shadowRoot, getResourceUrl("popper.css"));
}

function addStyle(el, href) {
  const styleLink = document.createElement("link");
  styleLink.setAttribute("rel", "stylesheet");
  styleLink.setAttribute("href", href);
  el.appendChild(styleLink);
}

function addScript(el, href) {
  const script = document.createElement("script");
  script.setAttribute("crossorigin", "anonymous");
  script.setAttribute("src", href);
  el.appendChild(script);
}

function addStyleContent(el, content) {
  const styleEl = document.createElement("style");
  styleEl.innerHTML = content;
  el.appendChild(styleEl);
}

loadAndRender();
