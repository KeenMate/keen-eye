export async function getRequestInfo() {
  return await sendMessagePromise({ type: "get-headers" });
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
  console.log({ ok: succeded, data: data });
  sendResponse({ ok: succeded, data: data });
}
