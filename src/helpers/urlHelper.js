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

export function getPath(url) {
  //https://stackoverflow.com/questions/6257463/how-to-get-the-url-without-any-parameters-in-javascript
  return `${url.protocol}//${url.host}${url.pathname}`;
}

export function getUrlParts(url) {
  return {
    [levels.global]: "!global!",
    [levels.domain]: getDomain(url),
    [levels.origin]: url.origin,
    [levels.page]: getPath(url),
  };
}
export async function getCurrentTabUrl() {
  let currentTab = await getCurrentTab();

  return new URL(currentTab?.url ?? "");
}

export async function getCurrentUrlParts() {
  //if url is provided will use it instead of current tab one
  let url = await getCurrentTabUrl();

  return getUrlParts(url);
}
