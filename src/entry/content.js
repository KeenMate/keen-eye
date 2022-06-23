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
    addStyle(div.shadowRoot, chrome.runtime.getURL("reset-script.css"));
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
  const script = document.createElement("link");
  script.setAttribute("crossorigin", "anonymous");
  script.setAttribute("href", href);
  el.appendChild(script);
}
