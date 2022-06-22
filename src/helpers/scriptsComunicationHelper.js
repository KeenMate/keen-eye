export async function getRequestInfo(tabId = null) {
  return await sendMessagePromise({ type: "get-headers", tabId: tabId });
}

export async function shouldInject() {
  return await sendMessagePromise({ type: "inject" });
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
