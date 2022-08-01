import { levels } from "@/constants/settings";
import { getCurrentTab } from "@/providers/chromeApiProvider";
import { parse } from "tldts";
/**
 * gets domain from URL object based on tldts
 * @param {URL} url needs to be url object
 * @returns
 */
export function getDomain(url) {
  return parse(url.href).domain;
}

export function logEverything(url) {
  console.log("Url info", parse(url));
}

export async function getPath(url) {
  //https://stackoverflow.com/questions/6257463/how-to-get-the-url-without-any-parameters-in-javascript
  return `${url.protocol}//${url.host}${url.pathname}`;
}

export async function getCurrentTabUrl() {
  let currentTab = await getCurrentTab();
  return new URL(currentTab?.url ?? "");
}

export function getUrlPart(part, url) {
  switch (part) {
    case levels.global:
      return "!global!";
    case levels.domain:
      return getDomain(url);
    case levels.origin:
      return url.origin;
    case levels.page:
      return getPath(url);

    //TODO remove this is only for compatibility reasons
    default:
      return url.origin;
  }
}

export async function getUrlPartCurrent(part, url) {
  url = url ?? (await getCurrentTabUrl());
  return getUrlPart(part, url);
}
