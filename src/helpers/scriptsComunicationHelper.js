import {
  settings,
  requestInfo,
  settingsChanged,
  saveSettings,
  newRequests,
} from "@/constants/messages";

export async function getRequestInfo(tabId = null) {
  return await sendMessagePromise({
    type: requestInfo,
    data: { tabId: tabId },
  });
}

export async function getSettings() {
  return await sendMessagePromise({ type: settings });
}

export async function saveDivPosition(level, position) {
  return setSettings(level, { position });
}
export async function changeInject(level, inject) {
  return setSettings(level, { inject });
}

export async function setSettings(level, settings) {
  console.log("save settings", settings);
  return await sendMessagePromise({
    type: saveSettings,
    data: { level, settings },
  });
}

export function sendMessagePromise(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      console.log(response);
      if (response === undefined) resolve();
      if (response?.ok) {
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

export function sendToSpecificCs(tabId, type, data) {
  chrome.tabs.sendMessage(tabId, { type, data });
}

export function sendToCS(type, data) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]) sendToSpecificCs(tabs[0].id, type, data);
  });
}

export function sendSettingsChanged() {
  sendToCS(settingsChanged);
}

export function sendNewRequests(requests, tabId) {
  sendToSpecificCs(tabId, newRequests, requests);
}
