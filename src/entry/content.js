import { createApp } from "vue";
import PageOverlay from "../view/PageOverlay.vue";
import { shouldInject } from "@/helpers/scriptsComunicationHelper";
import addDrag from "@/helpers/dragHelper";

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
    createApp(PageOverlay, {
      allowedHeaders: allowedHeaders,
    }).mount(div.shadowRoot);
  } else {
    return;
  }
});
