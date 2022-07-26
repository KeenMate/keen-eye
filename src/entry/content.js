import { createApp } from "vue";
import PageOverlay from "../view/PageOverlay.vue";
import { getSettings } from "@/helpers/scriptsComunicationHelper";
// import { getLevelColor } from "@/helpers/helpers";
import { settingsChanged } from "@/constants/messages";
import Popper from "vue3-popper";
const elementId = "keen-eye-page-overlay-div";

chrome.runtime.onMessage.addListener((message, sender) => {
  sender;
  if (message?.type == settingsChanged) {
    console.log("SETTINGS CHANGED");
    loadAndRender();
  }
});

function loadAndRender() {
  remove();
  getSettings().then((response) => {
    if (!response.settings?.inject) return;
    render(response.settings, response.level);
  });
}

function remove() {
  let el = document.getElementById(elementId);
  if (el) el.remove();
}

function render(settings, level) {
  //* create container
  const div = document.createElement("div");
  // let borderColor = getLevelColor(level);

  div.setAttribute(
    "style",
    `position:fixed; z-index:99999; display:block; top: 0;left: 0;box-shadow: rgb(128 128 128 / 69%) 3px 3px 5px; min-width:550px;background: white;resize: both;overflow: auto;`
  );
  div.setAttribute("id", elementId);
  div.setAttribute("class", "complete-reset");
  document.body.appendChild(div);

  //* create shadow root
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
  addStyleContent(document.body, resetcss);
  addStyleContent(div.shadowRoot, resetcss);
  addStyle(
    div.shadowRoot,
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
  );
  addScript(
    div.shadowRoot,
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"
  );
  addStyleContent(div.shadowRoot, bootstrapBody);
  addStyle(div.shadowRoot, chrome.extension.getURL("css/content.css"));
  addStyle(div.shadowRoot, chrome.extension.getURL("modal.css"));
  addStyle(div.shadowRoot, chrome.extension.getURL("popper.css"));
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

const resetcss = `
.complete-reset,
.complete-reset::after,
.complete-reset::before,
.complete-reset:hover,
.complete-reset:focus,
.complete-reset:active,
.complete-reset:visited,
.complete-reset:link {
  all: initial;
}
`;
const bootstrapBody = `
.bootstrap-body{
margin: 0;
font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
font-size: 12px;
font-weight: 400;
line-height: 1.3;
color: #212529;
text-align: left;
background-color: #fff;
user-select: text;
}
td {
  white-space: nowrap;
}
`;

loadAndRender();
