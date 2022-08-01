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

export function sendToSpecificCS(tabId, type, data) {
  chrome.tabs.sendMessage(tabId, { type, data });
}

export function sendToCS(type, data) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]) {
      sendToSpecificCS(tabs[0].id, type, data);
    }
  });
}
