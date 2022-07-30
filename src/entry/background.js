import {
  sendReply,
  sendSettingsChanged,
} from "@/helpers/scriptsComunicationHelper";
import {
  getMostSpecificSettings,
  toggleVisibility,
  useCache,
} from "@/helpers/storageHelper";
import { setSettings } from "@/helpers/storageHelper";
import { settings, requestInfo, saveSettings } from "@/constants/messages";
import headersProvider from "@/providers/headersProvider";
import languageChanger from "@/providers/languageChanger";
import { levels } from "@/constants/settings";

("use strict");
//setup providers
var headers = {};
headersProvider(headers);
var cache = useCache();
languageChanger(cache);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  //handle messsage based on type
  switch (request?.type) {
    case requestInfo:
      {
        const { tabId } = request.data;
        sendReply(true, headers[tabId ?? sender.tab.id], sendResponse);
      }
      break;

    case settings:
      getMostSpecificSettings(sender.url).then((settings) => {
        if (settings) {
          sendReply(true, settings, sendResponse);
        } else {
          sendReply(false, {}, sendResponse);
        }
      });
      break;
    case saveSettings: {
      console.log("saving settings");
      const { settings, level } = request.data;
      setSettings(level ?? levels.global, settings)
        .then(() => {
          if (
            settings.headerRules !== undefined ||
            settings.requestsRules !== undefined ||
            settings.inject !== undefined
          ) {
            sendSettingsChanged();
          }
          sendReply(true, undefined, sendResponse);
        })
        .catch((e) =>
          sendReply(
            false,
            { reason: "error setting data", error: e },
            sendResponse
          )
        );
      return true;
    }
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
