import { createApp } from "vue";
import PageOverlay from "../view/PageOverlay.vue";
import { getSettings } from "@/helpers/scriptsComunicationHelper";
import addDrag from "@/helpers/dragHelper";
import { getLevelColor } from "@/helpers/helpers";

// import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
getSettings().then((response) => {
  if (!response?.settings?.inject) return;
  console.log("injecting...");

  //* create container
  const elementId = "keen-eye-page-overlay-div";
  const div = document.createElement("div");
  let borderColor = getLevelColor(response.level);

  div.setAttribute(
    "style",
    `position:fixed; z-index:99999; display:block; top: 0;left: 0;border:solid ${borderColor} 5px; min-width:550px;background: white;resize: both;overflow: auto;`
  );
  div.setAttribute("id", elementId);
  div.setAttribute("class", "complete-reset");
  addDrag(div, elementId, response.settings.position, response.level);
  addStyleContent(document.body, resetcss);
  document.body.appendChild(div);

  //* create shadow root
  div.attachShadow({ mode: "open" });
  const appRoot = document.createElement("div");
  div.shadowRoot.appendChild(appRoot);
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
  appRoot.classList.add("bootstrap-body");

  //* create vue app
  const app = createApp(PageOverlay, {
    settings: response.settings,
    level: response.level,
  });
  app.mount(appRoot);
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
font-size: 10 px;
font-weight: 400;
line-height: 1.3;
color: #212529;
text-align: left;
background-color: #fff;
}
`;
