import { parse } from "tldts";
export function getDomain(url) {
  return parse(url).domain;
}

export async function getPath(urlString) {
  let location = new URL(urlString);

  return `${location.protocol}//${location.host}${location.pathname}`;
}

export async function getCurrentPath() {
  let tab = await getCurrentTab();
  return getPath(tab.url);
}

export function getCurrentTab() {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (response) => {
        resolve(response[0]);
      });
    } catch (e) {
      reject(e);
    }
  });
}
export async function getCurrentOrigin() {
  let tab = await getCurrentTab();
  return new URL(tab.url).origin;
}
