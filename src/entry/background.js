import { sendReply } from "@/helpers/scriptsComunicationHelper";
import {
  getMostSpecificSettings,
  toggleVisibility,
  useCache,
} from "@/helpers/storageHelper";
import { setSettings } from "@/helpers/storageHelper";
import { settings, requestInfo, savePosition } from "@/constants/messages";
import headersProvider from "@/providers/headersProvider";
import languageChanger from "@/providers/languageChanger";

("use strict");
//setup providers
var headers = {};
headersProvider(headers);
var cache = {};
useCache(cache);
languageChanger(cache);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  //handle messsage based on type
  switch (request.type) {
    case requestInfo:
      console.log(headers);
      sendReply(true, headers[request.tabId ?? sender.tab.id], sendResponse);
      break;

    case settings:
      getMostSpecificSettings().then((settings) => {
        if (settings) {
          sendReply(true, settings, sendResponse);
        } else {
          sendReply(false, {}, sendResponse);
        }
      });
      break;

    case savePosition:
      console.log("saving position...");
      setSettings(
        request.level ?? "page",
        undefined,
        undefined,
        request.position,
        undefined,
        undefined
      ).then(() => sendReply(true, request.position, sendResponse));
      break;
    default:
      sendReply(false, {}, sendResponse);
      break;
  }
  return true;
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-page-overlay") {
    console.log("toggling...");
    toggleVisibility();
  }
});
