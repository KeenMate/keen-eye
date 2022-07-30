import { createApp } from "vue";
import PageOverlay from "../view/PageOverlay.vue";
import { getSettings } from "@/helpers/scriptsComunicationHelper";
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
    if (!response?.settings?.inject) return;

    render(response.settings, response.level);
  });
}

function remove() {
  let el = document.getElementById(elementId);
  if (el) {
    el.remove();
  }
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

--bs-blue: #0d6efd;
--bs-indigo: #6610f2;
--bs-purple: #6f42c1;
--bs-pink: #d63384;
--bs-red: #dc3545;
--bs-orange: #fd7e14;
--bs-yellow: #ffc107;
--bs-green: #198754;
--bs-teal: #20c997;
--bs-cyan: #0dcaf0;
--bs-black: #000;
--bs-white: #fff;
--bs-gray: #6c757d;
--bs-gray-dark: #343a40;
--bs-gray-100: #f8f9fa;
--bs-gray-200: #e9ecef;
--bs-gray-300: #dee2e6;
--bs-gray-400: #ced4da;
--bs-gray-500: #adb5bd;
--bs-gray-600: #6c757d;
--bs-gray-700: #495057;
--bs-gray-800: #343a40;
--bs-gray-900: #212529;
--bs-primary: #0d6efd;
--bs-secondary: #6c757d;
--bs-success: #198754;
--bs-info: #0dcaf0;
--bs-warning: #ffc107;
--bs-danger: #dc3545;
--bs-light: #f8f9fa;
--bs-dark: #212529;
--bs-primary-rgb: 13, 110, 253;
--bs-secondary-rgb: 108, 117, 125;
--bs-success-rgb: 25, 135, 84;
--bs-info-rgb: 13, 202, 240;
--bs-warning-rgb: 255, 193, 7;
--bs-danger-rgb: 220, 53, 69;
--bs-light-rgb: 248, 249, 250;
--bs-dark-rgb: 33, 37, 41;
--bs-white-rgb: 255, 255, 255;
--bs-black-rgb: 0, 0, 0;
--bs-body-color-rgb: 33, 37, 41;
--bs-body-bg-rgb: 255, 255, 255;
--bs-font-sans-serif: system-ui, -apple-system, "Segoe UI", Roboto,
  "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif,
  "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
--bs-font-monospace: SFMono-Regular, Menlo, Monaco, Consolas,
  "Liberation Mono", "Courier New", monospace;
--bs-gradient: linear-gradient(
  180deg,
  rgba(255, 255, 255, 0.15),
  rgba(255, 255, 255, 0)
);
--bs-body-font-family: var(--bs-font-sans-serif);
--bs-body-font-size: 1rem;
--bs-body-font-weight: 400;
--bs-body-line-height: 1.5;
--bs-body-color: #212529;
--bs-body-bg: #fff;
--bs-border-width: 1px;
--bs-border-style: solid;
--bs-border-color: #dee2e6;
--bs-border-color-translucent: rgba(0, 0, 0, 0.175);
--bs-border-radius: 0.375rem;
--bs-border-radius-sm: 0.25rem;
--bs-border-radius-lg: 0.5rem;
--bs-border-radius-xl: 1rem;
--bs-border-radius-2xl: 2rem;
--bs-border-radius-pill: 50rem;
--bs-heading-color: ;
--bs-link-color: #0d6efd;
--bs-link-hover-color: #0a58ca;
--bs-code-color: #d63384;
--bs-highlight-bg: #fff3cd;}
td {
  white-space: nowrap;
}
`;

loadAndRender();
