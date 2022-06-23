import { createApp } from "vue";
import PageOverlay from "../view/PageOverlay.vue";
import { shouldInject } from "@/helpers/scriptsComunicationHelper";
import addDrag from "@/helpers/dragHelper";

import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
shouldInject().then((response) => {
  if (response?.inject) {
    var allowedHeaders = response.allowedHeaders;

    //creation on container
    const elementId = "keen-eye-page-overlay-div";
    const div = document.createElement("div");
    div.setAttribute(
      "style",
      `position:fixed; z-index:5055; display:block; top: 0;left: 0;border:solid black 2px; width:550px;background: white;`
    );
    div.setAttribute("id", elementId);
    addDrag(div, elementId);
    document.body.appendChild(div);
    div.attachShadow({ mode: "open" });

    const appRoot = document.createElement("div");
    appRoot.classList.add("reset");
    div.shadowRoot.appendChild(appRoot);
    const app = createApp(PageOverlay, {
      allowedHeaders: allowedHeaders,
    });
    app.mount(appRoot);
    // console.log(chrome.runtime.getURL("reset-script.css"));
    // addStyle(div.shadowRoot, chrome.runtime.getURL("reset-script.css"));
    addStyleContent(div.shadowRoot, resetcss);
    addStyle(
      div.shadowRoot,
      "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
    );
    addScript(
      div.shadowRoot,
      "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"
    );
  } else {
    return;
  }
});

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
/***
    The new CSS reset - version 1.7.2 (last updated 23.6.2022)
    GitHub page: https://github.com/elad2412/the-new-css-reset
***/

/*
    Remove all the styles of the "User-Agent-Stylesheet", except for the 'display' property
    - The "symbol *" part is to solve Firefox SVG sprite bug
 */
*:where(:not(html, iframe, canvas, img, svg, video):not(svg *, symbol *)) {
  all: unset;
  display: revert;
}

/* Preferred box-sizing value */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Reapply the pointer cursor for anchor tags */
a,
button {
  cursor: revert;
}

/* Remove list styles (bullets/numbers) */
ol,
ul,
menu {
  list-style: none;
}

/* For images to not be able to exceed their container */
img {
  max-width: 100%;
}

/* removes spacing between cells in tables */
table {
  border-collapse: collapse;
}

/* Safari - solving issue when using user-select:none on the <body> text input doesn't working */
input,
textarea {
  -webkit-user-select: auto;
}

/* revert the 'white-space' property for textarea elements on Safari */
textarea {
  white-space: revert;
}

/* minimum style to allow to style meter element */
meter {
  -webkit-appearance: revert;
  appearance: revert;
}

/* reset default text opacity of input placeholder */
::placeholder {
  color: unset;
}

/* fix the feature of 'hidden' attribute.
 display:revert; revert to element instead of attribute */
:where([hidden]) {
  display: none;
}

/* revert for bug in Chromium browsers
 - fix for the content editable attribute will work properly.
 - webkit-user-select: auto; added for Safari in case of using user-select:none on wrapper element*/
:where([contenteditable]:not([contenteditable="false"])) {
  -moz-user-modify: read-write;
  -webkit-user-modify: read-write;
  overflow-wrap: break-word;
  -webkit-line-break: after-white-space;
  -webkit-user-select: auto;
}

/* apply back the draggable feature - exist only in Chromium and Safari */
:where([draggable="true"]) {
  -webkit-user-drag: element;
}
`;
