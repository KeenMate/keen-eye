import {
  settings,
  requestInfo,
  savePosition,
  settingsChanged,
} from "@/constants/messages";

export async function getRequestInfo(tabId = null) {
  return await sendMessagePromise({ type: requestInfo, tabId: tabId });
}

export async function getSettings() {
  return await sendMessagePromise({ type: settings });
}

export async function saveDivPosition(position, level) {
  return await sendMessagePromise({
    type: savePosition,
    position: position,
    level: level,
  });
}

export function sendMessagePromise(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      console.log(response);
      if (response.ok) {
        resolve(response.data);
      } else {
        reject("Something wrong");
      }
    });
  });
}

export function sendReply(succeded, data, sendResponse) {
  sendResponse({ ok: succeded, data: data });
}

export function sendToCS(type, data) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type, data });
  });
}

export function sendSettingsChanged() {
  sendToCS(settingsChanged);
}
