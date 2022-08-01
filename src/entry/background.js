import { settings, requestInfo, saveSettings } from "@/constants/messages";
import headersProvider from "@/providers/headersProvider";
import languageChanger from "@/providers/languageChanger";
import settingsProvider from "@/providers/settingsProvider";
import { sendSettingsChanged } from "@/providers/messagingProvider";
import { sendReply } from "@/helpers/scriptsComunicationHelper";
import { onCommand, onMessage } from "@/providers/chromeApiProvider";

("use strict");
//setup providers
var headers = {};
headersProvider(headers);
languageChanger(settingsProvider);

onMessage(function (request, sender, sendResponse) {
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
      settingsProvider.getMostSpecificSettings(sender.url).then((settings) => {
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

      settingsProvider
        .setSettings(level, settings)
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

onCommand((command) => {
  if (command === "toggle-page-overlay") {
    console.log("toggling...");
    settingsProvider.toggleVisibility();
  }
});
