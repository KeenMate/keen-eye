import { parse } from "tldts";
/**
 * gets domain from URL object based on tldts
 * @param {URL} url needs to be url object
 * @returns
 */
export function getDomain(url) {
  return parse(url.href).domain;
}

export async function getPath(url) {
  //https://stackoverflow.com/questions/6257463/how-to-get-the-url-without-any-parameters-in-javascript
  return `${url.protocol}//${url.host}${url.pathname}`;
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

export async function getCurrentTabUrl() {
  let currentTab = await getCurrentTab();
  console.log(currentTab);
  return new URL(currentTab?.url ?? "");
}

export async function getUrlPart(part, url = undefined) {
  if (url === undefined) url = await getCurrentTabUrl();
  switch (part) {
    case "global":
      return "!global!";
    case "domain":
      return getDomain(url);
    case "origin":
      return url.origin;
    case "page":
      return getPath(url);

    //TODO remove this is only for compatibility reasons
    default:
      return url.origin;
  }
}
