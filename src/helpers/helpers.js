import { colors } from "@/constants/settings";

export function refreshCurrentPage() {
  //https://stackoverflow.com/questions/32570100/how-to-reload-current-tab-from-within-a-chrome-extension-popup-html
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
  });
}

export function getLevelColor(level) {
  return colors[level];
}

export function getStatusCodeColor(statusCode) {
  if (!statusCode) return "muted";
  if (statusCode >= 400) return "danger";
  if (statusCode < 200) return "info";
  if (statusCode < 300) return "success";
}
